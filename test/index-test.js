'use strict';

var test = require("tape");
var Animation = require("..");

test("Animation requires object", function(t) {
   t.plan(1);
   t.throws(function() { 
      var animation = new Animation({});
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
      v: 0
   };
   var animation = new Animation({
      object: obj,
      props: {
         v: 1
      },
      duration: 100
   });
   setTimeout(function() {
      animation.update();
      t.ok(obj.v >= .5 && obj.v <= 1, "updated appropriately");
   }, 50);

});

test("Continuous Numeric values", function(t) {
   t.plan(4);
   var obj = {
      x: 100
   }
   var animation = new Animation({
      object: obj,
      duration: 100,
      props: {
         x: -400
      },
      onDone: function(obj2) {
         t.equals(obj2, obj, "onDone() called with animated obj param");
      }
   });

   var startTime = animation.startTime;
   t.ok(startTime > 0, "startTime > 0");

   animation.update(startTime + 50); // Half the duration

   t.deepEquals(obj, {
      x: -150
   }, "x updated correctly");

   animation.update(startTime + 105); // More than the full duration

   t.equals(obj.x, -400, "x finished correctly");
});

test("Array values", function(t) {
   t.plan(6);
   var obj = {
      name: "one"
   };

   var animation = new Animation({
      object: obj,
      duration: 3,
      props: {
         name: ["one", "two", "three"]
      }
   });

   var startTime = animation.startTime;
   animation.update(startTime);
   t.equals(obj.name, "one");
   animation.update(startTime + .99);
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
      duration: 100,
      props: {
         value: function(t) {
            return '<' + t + '>';
         }
      }
   });
   var startTime = animation.startTime;
   animation.update(startTime + 50);
   t.equals(obj.value, "<0.5>");

});

