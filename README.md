# anymation

Simple stand-alone animation / tweening library for node or browsers.

[![Build Status](https://travis-ci.org/scottglz/anymation.svg?branch=master)](https://travis-ci.org/scottglz/anymation)

### Installation

For node or [browserify](http://browserify.org/),

> npm install browserify

For a manual configuration system, grab dist/anymation.js or dist/anymation-min.js from the git repository. These export the Anymation constructor through a require.js define() if you are using it, otherwise they add the Anymation constructor to the global window object.

### Basic use

```javascript
var Animation = require("anymation");

var objectToAnimate = {
   x: 40
};

var animation = new Animation({
   object: objectToAnimate,
   duration: 3000 // 3 seconds
}.tween("x", 40, 500); // Smoothly interpolate objectToAnimate.x between 40 and 500 over the course of the animation

// Your render loop is up to you

function render() {
   animation.update();
   // Draw / update what you need to based on objectToAnimate's properties
   // ...
   
   requestAnimationFrame(render);
}

render();
```

### Easing functions

Anymation doesn't provide any built-in easing functions except for the trivial linear default. Specifying an easing function from a library like [eases](https://www.npmjs.com/package/eases) is super-easy though.

```javascript
var Animation = require("anymation");
var eases = require("eases");

new Animation({
   object: someObject,
   easing: eases.elasticOut
});
```

### API

#### Animation(options)

Constructor for an Animation. Calling it with the new operator is optional. The animation starts immediately.

* options: An object specifying options:
  * object (object, required) - The object whose properties are going to get changed by the animation.
  * duration (number, optional, default=1000) -  Duration for animation, in milliseconds
  * easing (function, optional, default=linear) - Easing function for the animation. 
  * setter (function, optional) - Function called to change a property value. Signature (object, propertyName, value. The default function sets object[propertyName] = value.
  * onComplete (function, optional) -Function called when the animation completes
  * onCancel (function, optional) - Function called when the animation is canceled

#### Animation.tween(propertyName, from, to) returns this Animation

Smoothly change a numeric property between the start and end values. Shortcut for Animation.addProp(propertyName, { tween: [from, to] }).

* propertyName (string) - Name of the property on the object
* start (number) - Starting value
* end (number) - Ending value

#### Animation.discrete(propertyName, array) returns this Animation

Cycle a property through a specified list of values (of any type) over the course of the animation. Shortcut for Animation.addProp(propertyName, { discreteValues: array }).

* propertyName (string) - Name of the property on the object
* array (array) - Specified values

#### Animation.fn(propertyName, fn) returns this Animation

Animate a property using a callback function returning a value of any type. Shortcut for  Animation.addProp(propertyName, { valueFn: fn});

* propertyName (string) - Name of the property on the object
* fn (function) - a function with signature fn(t_eased) returns value, where t_eased is the eased current time. With linear easing this is 0 at the start of the animation and 1 at the end, increasing linearly in between. In general it is 0 at the start and 1 at the end, with no promises it can't be negative or greater than one in-between (in elastic easing functions for example). The function should return the desired value for the property at the given eased time.

#### Animation.addProp(propertyName, options) returns this Animation

Animates a property during the course of the animation, specifying all options, many of which can override the animation's default options.

* propertyName (string) - Name of the property on the object
* options (object):
  * object (object, optional, default=this.options.object) - The object whose property is to be changed.
  * easing (function, optional, default=this.options.easing) - Easing function for this property. 
  * setter (function, optional, default=this.options.setter) - Function called to change this property value. Signature (object, propertyName, value. The default function sets object[propertyName] = value.
  * tween (array[number], optional) - see Animation.tween()
  * discreteValues (array, optional) - see Animation.discrete()
  * valueFn (function, optional) - see Animation.fn()

#### Animation.update(timeNow) returns boolean

  Updates all animated properties. Generally no need to pass the timeNow parameter. 

  * timeNow (number, optional, default=current system time in milliseconds)

  Returns false if the animation is done (if timeNow >= the animation start time + the animation duration) otherwise true
  
### License

MIT