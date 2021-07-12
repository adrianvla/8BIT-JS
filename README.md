# SpriteJS
A Simple JavaScript Sprite Library

It Has Costumes(layers) for each sprite, and yuo can change or move each sprite on the canvas.
Effects can be applied to the canvas (such as Bloom effect)

Get Started By creating a new canvas, and a sprite

```js
var c = new Canvas(your_canvas_element);
var s = new Sprite(c); //on which canvas do I want this sprite on?
```
Then you can make transformations with this sprite

```js
s.put(0,0); //moves the sprite to {x:0,y:0} coordinates
s.ccostume('a',image_element_or_virtual_image); //creates a costume with the name 'a' for sprite s with image_element_or_virtual_image as image
s.scostume('a'); //makes the sprite to switch costume to the costume named 'a'
```

Now the rendering part

```js
c.clear(); //clear the canvas
s.render(); //render the sprite
c.bloom(50,1); //add post-processing
```

With This Library, you can make an image follow your cursor:

```js

var c = new Canvas(document.getElementById('cc')); //new canvas
var s = new Sprite(c); //new sprite on c

s.put(0,0); //move s to x:0 y:0
s.ccostume('a',document.getElementById('img')); //create costume named 'a' for s with '#img' (html selector) for image
s.scostume('a'); //changes to costume named 'a'
setInterval(function(){
  s.put(mouse.x,mouse.y); //move s to mouse position
  c.clear(); //clear the canvas
  s.render(); //render the sprite
  c.bloom(50,1); //add post-processing
},10);

var mouse = {}; //mouse coords object

(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mouse.x = (event.pageX - $(c.gete()).offset().left)+ $(window).scrollLeft();
        mouse.y = (event.pageY - $(c.gete()).offset().top) + $(window).scrollTop();
        mouse.x = mouse.x / (2.56*2);
        mouse.y = mouse.y /(2.12*2);
    }
})(); //mouse coords tracking system
```
