'use strict';


var test = require("tape");
var Animation = require("..");

test("Animation requires object", function(t) {
   t.plan(1);
   t.throws(function() { 
      new Animation({});
   });
});

test("Cancel", function(t) {
   t.plan(1);
   var obj = {
      z: 10
   };

   var animation = Animation({
      object: obj,
      onCancel: function(obj2) {
         t.equals(obj2, obj, "onCancel called w/ object param.");
      } 
   });

   animation.cancel();
});

test("Update without param uses now()", function(t) {
   t.plan(1);
   var obj = {
      q: 0
   };
   var animation = new Animation({
      object: obj,
      duration: 100
   }).to("q", 1);
   setTimeout(function() {
      animation.update();
      t.ok(obj.q >= 0.5 && obj.q <= 1, "updated appropriately");
   }, 75);

});

test("Continuous Numeric values", function(t) {
   t.plan(4);
   var obj = {
      x: 100
   };
   var animation = new Animation({
      object: obj,
      duration: 100,
      onDone: function(obj2) {
         t.equals(obj2, obj, "onDone() called with animated obj param");
      }
   }).to("x", -400);

   var startTime = animation.startTime;
   t.ok(startTime > 0, "startTime > 0");

   animation.update(startTime + 50); // Half the duration

   t.deepEquals(obj, {
      x: -150
   }, "x updated correctly");

   animation.update(startTime + 105); // More than the full duration

   t.equals(obj.x, -400, "x finished correctly");
});

test("Step values", function(t) {
   t.plan(6);
   var obj = {
      name: "one"
   };

   var animation = new Animation({
      object: obj,
      duration: 3
   }).values("name", ["one", "two", "three"]);

   var startTime = animation.startTime;
   animation.update(startTime);
   t.equals(obj.name, "one");
   animation.update(startTime + 0.99);
   t.equals(obj.name, "one");
   animation.update(startTime + 1);
   t.equals(obj.name, "two");
   animation.update(startTime + 1.99);
   t.equals(obj.name, "two");
   animation.update(startTime + 2);
   t.equals(obj.name, "three");
   animation.update(startTime + 3.5);
   t.equals(obj.name, "three");
});

test("Function values", function(t) {
   t.plan(1);
   var obj = {
      value: "<0>"
   };

   var animation = new Animation({
      object: obj,
      duration: 100
   }).fn("value", function(t) {
      return '<' + t + '>';
   });
   var startTime = animation.startTime;
   animation.update(startTime + 50);
   t.equals(obj.value, "<0.5>");

});

test("Getter & setter", function(t) {
   t.plan(1);
   var obj = {
      x2: 17
   };

   var animation = new Animation({
      object: obj,
      duration: 100,
      getter: function(obj, prop) {
         return obj[prop + "2"];
      },
      setter: function(obj, prop, val) {
         obj[prop + "2"] = val;
      }
   }).to("x", 19);

   var startTime = animation.startTime;
   animation.update(startTime + 50);
   t.equals(obj.x2, 18);
});

test("Easing", function(t) {
   t.plan(2);
   var obj = {
      x: 10
   };

   var animation = new Animation({
      object: obj,
      duration: 100,
      easing: function(t) {
         return t <= .9 ? 2 * t : t;
      }
   }).to("x", 20);

   var startTime = animation.startTime;
   animation.update(startTime + 75);
   t.equals(obj.x, 25); // Yes, easing functions can send things past the range
   animation.update(startTime + 100);
   t.equals(obj.x, 20);
});

test("Transform", function(t) {
   t.plan(1);
   var obj = {
      left: "20px"
   };

   var animation = new Animation({
      object: obj,
      duration: 3000,
      transform: {
         read: function(value) {
            return +(value.replace("px", ""));
         },
         write: function(value) {
            return value + "px";
         }
      }
   }).to("left", "40px");

   var startTime = animation.startTime;
   animation.update(startTime + 1500); 
   t.equals(obj.left, "30px");  


});