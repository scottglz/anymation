# anymation

> Simple stand-alone animation / tweening library. Currently works in node or in browsers w/ [browserify](http://browserify.org/).

## Basic use

```javascript
var Animation = require("anymation");

var objectToAnimate = {
   x: 40
};

var animation = new Animation({
   object: objectToAnimate,
   duration: 3000, // 3 seconds
   props: {
      x: 500
   }
};

// Your render loop is up to you

function render() {
   animation.update();
   // Draw / update what you need to based on objectToAnimate's properties
   // ...
   
   requestAnimationFrame(render);
}

render();
```

## API

### Animation(options)

Constructor for an Animation. Calling it with the new operator is optional. The animation starts immediately.

* options: An object specifying options:
  * object (object, required) - The object whose properties are going to get changed by the animation.
  * duration (number, optional, default=1000) -  Duration for animation, in milliseconds
  * props (object, optional) - Specification of what to actually animate. See below.
  * onComplete (function, optional) -Function called when the animation completes
  * onCancel (function, optional) - Function called when the animation is canceled

#### Props object

... to be continued


