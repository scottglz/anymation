(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.anymation = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var now = require("right-now");
var extend = require("extend");

var defaultSetter = function(object, property, value) {
   object[property] = value;
};


var linearEasing = function(x) {
   return x;
};

function updateProp(options, t) {
   var obj = options.object,
       setter = options.setter,
       teased = options.easing(t),
       name = options.propName;
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
   this.props = [];
}

Animation.prototype = {
   addProp: function(name, options) {
      
      var fullOptions = extend({
         object: this.object,
         setter: this.setter,
         easing: this.easing
      }, options);
      
      fullOptions.propName = name;
      this.props.push(fullOptions); 
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

      var props = this.props, len = props.length;
      for (var i=0; i < len; i++) {
         updateProp(props[i], t);
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
},{"extend":2,"right-now":3}],2:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],3:[function(require,module,exports){
(function (global){
module.exports =
  global.performance &&
  global.performance.now ? function now() {
    return performance.now()
  } : Date.now || function now() {
    return +new Date
  }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});