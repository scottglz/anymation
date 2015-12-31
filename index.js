'use strict';

var now = require("right-now");
var extend = require("extend");

var defaultGetter = function(object, property) {
   return object[property];
};

var defaultSetter = function(object, property, value) {
   object[property] = value;
};

var identity = function(x) {
   return x;
}

var identityTransform = {
   read: identity,
   write: identity
};

var linearEasing = identity;

function updateProp(obj, name, options, t) {
   var value = options.transformedValue, 
       setter = options.setter,
       teased = options.easing(t);
   if (options.values) {
      // step values
      var nValues = options.values.length;
      var index = Math.floor(teased * nValues);
      if (index >= nValues)
         index = nValues-1;
      setter(obj, name, options.values[index]);
   }
   else if (options.valueFn) {
      setter(obj, name, options.valueFn(teased, options.startValue));
   }
   else if (Number.isFinite(value)) {
      var newValue = options.startValue + teased * (value - options.startValue);
      setter(obj, name, options.transform.write(newValue));
   }   
}

var defaultOptions = {
   object: null, // must provide
   name: "anonymous",
   duration: 1000,
   cancelable: true,
   getter: defaultGetter,
   setter: defaultSetter,
   transform: identityTransform,
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
         setter: this.setter,
         easing: this.easing,
         getter: this.getter,
         transform: this.transform
      }, options);
      
      fullOptions.transformedValue = fullOptions.transform.read(fullOptions.value);
      fullOptions.startValue = fullOptions.transform.read(fullOptions.getter(this.object, name));
      this.props[name] = fullOptions; 
      return this;
   },

   to: function(name, value) {
      return this.addProp(name, { value: value });
   },

   values: function(name, array) {
      return this.addProp(name, { values: array });
   },

   fn: function(name, fn) {
      return this.addProp(name, { valueFn: fn});
   },

   update: function(timeNow) {
      timeNow = timeNow || now();
      var t = (timeNow - this.startTime) / this.duration;
      if (t > 1)
         t = 1;

      var obj = this.object, 
          props = this.props;
      for (var key in props) {
         updateProp(obj, key, props[key], t);
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