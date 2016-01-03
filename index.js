'use strict';

var now = require("right-now");
var extend = require("extend");

var defaultSetter = function(object, property, value) {
   object[property] = value;
};


var linearEasing = function(x) {
   return x;
};

function updateProp(name, options, t) {
   var obj = options.object,
       setter = options.setter,
       teased = options.easing(t);
   if (options.discreteValues) {
      // step values
      var nValues = options.discreteValues.length;
      var index = Math.floor(teased * nValues);
      if (index >= nValues)
         index = nValues-1;
      setter(obj, name, options.discreteValues[index]);
   }
   else if (options.valueFn) {
      setter(obj, name, options.valueFn(teased));
   }
   else if (options.tween) {
      var start = options.tween[0], end = options.tween[1];
      var newValue = start + teased * (end - start);
      setter(obj, name, newValue);
   }   
}

var defaultOptions = {
   object: null, // must provide
   duration: 1000,
   cancelable: true,
   setter: defaultSetter,
   easing: linearEasing
   //onDone
   //onCancel
};

function Animation(options) {
   if (!(this instanceof Animation))
      return new Animation(options);

   extend(this, defaultOptions, options);
   if (!this.object)
      throw new Error("Animation requires object");
   
   this.startTime = now();
   this.props = Object.create(null);
}

Animation.prototype = {
   addProp: function(name, options) {
      
      var fullOptions = extend({
         object: this.object,
         setter: this.setter,
         easing: this.easing
      }, options);
      
      this.props[name] = fullOptions; 
      return this;
   },

   tween: function(name, from, to) {
      return this.addProp(name, { tween: [from, to] });
   },

   discrete: function(name, array) {
      return this.addProp(name, { discreteValues: array });
   },

   fn: function(name, fn) {
      return this.addProp(name, { valueFn: fn});
   },

   update: function(timeNow) {
      timeNow = timeNow || now();
      var t = (timeNow - this.startTime) / this.duration;
      if (t > 1)
         t = 1;

      var props = this.props;
      for (var key in props) {
         updateProp(key, props[key], t);
      }

      if (t === 1) {
         this.done = true;
         if (this.onDone)
            this.onDone(this.object);
         return false;
      }

      return true;  
   },

   cancel: function() {
      if (this.onCancel) {
         this.onCancel(this.object);
      }
   }
};



module.exports = Animation;