'use strict';

var now = require("right-now");
var extend = require("extend");

var defaultOptions = {
   object: null, // must provide
   name: "anonymous",
   duration: 1000,
   props: {},
   cancelable: true
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
      if (this.object.hasOwnProperty(key)) {
         this.animationStartValues[key] = this.object[key];
      }
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
         if (obj.hasOwnProperty(key)) {
            var value = this.props[key], startValue;
            if (Array.isArray(value)) {
               // Specified step values
               var nValues = value.length;
               var index = Math.floor(t * nValues);
               if (index >= nValues)
                  index = nValues-1;
               obj[key] = value[index];
            }
            else if (typeof value === "function") 
            {
               startValue = this.animationStartValues[key];
               obj[key] = value(t, startValue);
            }
            else if (Number.isFinite(value))
            {
               startValue = this.animationStartValues[key];
               var newValue = startValue + t*(value - startValue);
               obj[key] = newValue;
            }
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