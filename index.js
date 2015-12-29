'use strict';

var now = require("right-now");
var extend = require("extend");

var defaultGetter = function(object, property) {
   return object[property];
};

var defaultSetter = function(object, property, value) {
   object[property] = value;
};

var linearEasing = function(t) {
   return t;
};

var defaultOptions = {
   object: null, // must provide
   name: "anonymous",
   duration: 1000,
   props: {},
   cancelable: true,
   getter: defaultGetter,
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

   this.animationStartValues = {};
   for (var key in this.props) {
      var propVal = this.props[key], getter;
      if (typeof propVal !== "object" || propVal === null || Array.isArray(propVal)) {
         this.props[key] = {
            value: this.props[key]
         };
         getter = this.getter;
      }
      else {
         getter = propVal.getter || this.getter;
      }

      this.animationStartValues[key] = getter(this.object, key);
   }
}

Animation.prototype = {
   update: function(timeNow) {
      timeNow = timeNow || now();
      var t = (timeNow - this.startTime) / this.duration;
      if (t > 1)
         t = 1;

      var obj = this.object;
      for (var key in this.props) {
         var spec = this.props[key],
             value = spec.value, 
             setter = spec.setter || this.setter,
             easing = spec.easing|| this.easing,
             teased = easing(t),
             startValue;
         if (Array.isArray(value)) {
            // Specified step values
            var nValues = value.length;
            var index = Math.floor(teased * nValues);
            if (index >= nValues)
               index = nValues-1;
            setter(obj, key, value[index]);
         }
         else if (typeof value === "function") 
         {
            startValue = this.animationStartValues[key];
            setter(obj, key, value(teased, startValue));
         }
         else if (Number.isFinite(value))
         {
            startValue = this.animationStartValues[key];
            var newValue = startValue + teased * (value - startValue);
            setter(obj, key, newValue);
         }
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