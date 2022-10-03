# 8BIT-JS
A Simple JavaScript game engine for retro games

<img src="https://user-images.githubusercontent.com/86854740/193573086-e7a7f515-8a6a-4e63-9f54-0da5b0b156f3.gif" style="width:300px">

It Has Costumes(layers) for each sprite, and you can change or move each sprite on the canvas.
Effects can be applied to the canvas (such as Bloom effect).
It even has a particle system

Start By Including it into your HTML File:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    
  
  <script src="path/to/8bit.min.js"></script>
</body>
</html>
```

<h1>Using 8BIT-JS</h1>

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






# Another example
(live demo is [here](https://adrianvla.github.io/8BIT-JS-Example/))
```js



var game = new Game(60);

var c = new Canvas(document.getElementById('canvas'), game);
var bg1 = new Sprite(c, game);
var bg2 = new Sprite(c, game);
var bg3 = new Sprite(c, game);
var bg4 = new Sprite(c, game);
var player = new Sprite(c, game).setScale([64, 64]).canbeScrolled(true).isInFront(true).put(320 / 2 - (64 / 2), 0);
var playercoords = {
    x: 0,
    y: 0
};
var info = [];
var ps;
var oldplcoords = {};
var map = {}; // You could also use an array
onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
}
game.setup(async function () {
    $(document).on('keydown', function (e) {

    });
    c.setCamZ(2);
    for (var i = 0; i < 3; i++) {
        player.ccostume('idle' + String(i + 1), new SpriteSheet(await toImg('/assets/Main/Player/Player-Idle-24x24.png'), 24, 24).get(i));
    }
    new Physics(player);
    bg1.ccostume('a', await toImg('/assets/Main/Backgrounds/parallax-forest-trees-01.png')); //create costume named 'a' for s with '#img' (html selector) for image
    bg1.scostume('a'); //changes to costume named 'a'
    bg1.setZ(1);
    bg2.ccostume('a', await toImg('/assets/Main/Backgrounds/parallax-forest-trees-02.png')); //create costume named 'a' for s with '#img' (html selector) for image
    bg2.setZ(0.5).setAlpha(1);
    bg2.scostume('a'); //changes to costume named 'a'

    bg3.ccostume('a', await toImg('/assets/Main/Backgrounds/parallax-background-mountains.png')); //create costume named 'a' for s with '#img' (html selector) for image
    bg3.scostume('a'); //changes to costume named 'a'
    bg3.setZ(0.3);

    bg4.ccostume('a', await toImg('/assets/Main/Backgrounds/parallax-background-sky.png')); //create costume named 'a' for s with '#img' (html selector) for image
    bg4.scostume('a'); //changes to costume named 'a'
    bg4.setZ(0.1);
    bg1.setInfinite('x');
    bg2.setInfinite('x');
    bg3.setInfinite('x');
    bg4.setInfinite('x');

    //set gameloops
    var proccanv = document.createElement('canvas');
    proccanv.width = 5 * 2;
    proccanv.height = 5 * 2;
    var pcctx = proccanv.getContext('2d');
    pcctx.beginPath();
    this.cnt = [];
    /*
            for (var i = radius; i > 0; i--) {
                var alp = 1 - (i / radius);
                pcctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + String(alp) + ')';
                pcctx.arc(radius, radius, i, 0, 2 * Math.PI);
                pcctx.fill();
            }*/

    pcctx.shadowColor = '#fff';

    pcctx.shadowBlur = 7;
    pcctx.fillStyle = '#fff';
    //pcctx.arc(radius, radius, 1, 0, 2 * Math.PI);

    pcctx.fillRect(5 - 1, 5 - 1, 2, 2);
    //pcctx.fill();
    ps = new Sprite(c, game).createParticleSystem([255, 255, 255], 30, 0.3, null, [0, 0], proccanv).canbeScrolled(false);
    game.gameloop(new GameLoop(async function (t) {

        if (map[38]) { //JUMP
            if (player.getpos().y > 135) { //isintheair

                player.physics.vy = -5;
            }
        }
        if (map[39]) { //RIGHT
            player.physics.vx = 5;
        }
        if (map[37]) { //LEFT
            player.physics.vx = -5;
        }
        if (map[40]) { //DOWN
            //player.physics.vy = -5;
        }
        //player.put(playercoords.x, playercoords.y);
        //player.scostume('idle' + String(Math.floor(t / 7) % 3 + 1));
        player.scostume('idle1');
        playercoords = player.getpos();
        /*
                if (!(oldplcoords.x == playercoords.x && oldplcoords.y == playercoords.y)) {
                    c.scrollTo(-playercoords.x, -playercoords.y + 150, EasingFunctions.easeInOutQuad);
                    oldplcoords = {
                        x: playercoords.x,
                        y: playercoords.y
                    };
                }*/
        if (!(oldplcoords.x == playercoords.x)) {
            c.scrollTo(-playercoords.x + 128, 0, EasingFunctions.easeInOutQuad);
            console.log(1)
            //info[1]='scrollx: '+String(-playercoords.x+128);
            oldplcoords = {
                x: playercoords.x
            };
        }
        document.getElementById('info').innerText = info.join('\n');
        c.ca.getContext('2d').imageSmoothingEnabled = false;
        c.clear('#724882');
        bg4.put(0, -1000);
        bg3.put(0, -200);
        bg2.put(0, -50);
        bg1.put(0, -50);
        bg4.render();
        bg3.render();
        bg2.render();
        bg1.render();
        player.render();
        //ps.render();

        c.postprocess().bloom(0.5, 15, 1, 'source-over'); //add post-processing
        c.postprocess().lighten(0.2, 'lighter'); //add post-processing
        //c.filter(function(a){return a*1.2},function(a){return a*1.2},function(a){return a*1.2});
        //c.postprocess().motionblur(0.5); //add post-processing
/*


        var h = document.createElement('CANVAS');
        h.getContext('2d').imageSmoothingEnabled = false;
        h.width = $('#i')[0].width;
        h.height = $('#i')[0].height;
        h.getContext('2d').drawImage($('#canvas')[0], 0, 0, $('#i')[0].width, $('#i')[0].height);
        var fisheye = new Fisheye($('#i')[0]);
DEBUG=h;
        fisheye.setViewport(h.width, h.height);
        fisheye.setDistortion(0.7,0.7,0.5);

        fisheye.clear();
        fisheye.draw($('#canvas')[0]);*/
        gameLoop();
        $('#i')[0].getContext('2d').imageSmoothingEnabled = false;
        $('#i')[0].getContext('2d').drawImage($('#canvas')[0], 0, 0, $('#i')[0].width, $('#i')[0].height);
















    }));

});

var DEBUG;
var filterStrength = 20;
var frameTime = 0,
    lastLoop = new Date,
    thisLoop;

function gameLoop() {
    // ...
    var thisFrameTime = (thisLoop = new Date) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

// Report the fps only every second, to only lightly affect measurements
setInterval(function () {
    info[0] = (1000 / frameTime).toFixed(1) + " fps";
}, 1000);
var mouse = {}; //mouse coords object

(function () {
    $("#i")[0].onmousemove = handleMouseMove;

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
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        mouse.x = (event.pageX - $(c.gete()).offset().left) + $(window).scrollLeft();
        mouse.y = (event.pageY - $(c.gete()).offset().top) + $(window).scrollTop();
        mouse.x = mouse.x;
        mouse.y = mouse.y;
    }
})(); //mouse coords tracking system
```


# Documentation

## Canvas(Dom_canvas_element,game)

### .img(src,x,y)
draws the image with src "src" and on the coords [x,y]

### .imge(src,x,y,potentialWidth,potentialHeight)
draws the image with src "src" and on the coords [x,y] with optional Width and Height

### .dataURL(type,encoderOptions)
more docs at https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL

### .imgo(Image_object, x,y,callback)
On load of Image_object (that should be declared as new Image()), the image will be drawn at x,y position on the canvas and the callback will be called

### .ctx()
returns the 2d context of the canvas

### .fr(style,x,y,width,height)
basic fillrect

### .get(x,y)
get the hex color value at x,y

### .plasma(Intensity)
cool graphical effect

### .postprocess()
####    .bloom(intensity, radius, quality, operation)
operation is the context globalCompositeOperation like blend mode

####    .lighten (alpha, operation)
same as bloom

####    .motionblur(alpha)
explains everything

### .filter(red_function, green_function, blue_function)
filters every pixel of the canvas using red, green, and blue functions that should return a value between 0 and 255

### .clear(color)
color is optional for color of the clear. Functions a little bit like .fr(color,0,0,canvas_width,canvas_height)

### .gete()
returns the DOM canvas element of the canvas

### .getSprites()
returns all of the sprites that are on the canvas

### .scrollTo(x,y,easing_function)
scrolls to x,y, with an easing function that inputs and outputs integers between 0 and 1

### .setCamZ(z_index)
sets the z-index of the camera


## ParticleSystem(sprite, color, count, speed, to, from, texture)
texture is an Image like texture = new Image()

### .destroy()
destroys the particle system

## Sprite(Canvas, Game, z_index)

### .createPhysics(physx)
doesn't do anything

### .createParticleSystem(color, count, speed, to, from, texture)
Creates a particle system on sprite, sprite is now a particle system

### .setInfinite(isInfinite)
If true, enables infinite scrolling

### .render()
renders the sprite on the canvas

### .move(dx,dy)
moves by dx,dy <- those are relative values

### .put(x,y)
moves to x,y

### .getpos()
returns the position of the sprite

### .get()
returns the sprite

### .ccostume(costume_name,new_costume)
Like in scratch, changes the costume with the name costume_name to new_costume that's an image

### .scostume(costume_name)
changes the costume to costume_name of the sprite

### .stamp()
renders the sprite, same as render()

### .canbeScrolled(Q)
If Q is true, the sprite will be able to be scrolled. If Q is false, the sprite will have like position:absolute

### .setZ(z_index)
sets the z index of the sprite

### .isInFront(yes_or_no)
Is in front of every other sprite

### .setAlpha(alpha)
sets the opacity of the sprite

### .setScale(scale)
sets the scale of the sprite
### .destroy()
destroys the sprite


## Game(updates_per_second)

### .setup(function)
runs the setup function once, used to load everything

### .gameloop(Game_Loop)
attaches a new game loop to the game

### .destroy()
destroys the game

## GameLoop(function)
To be attached to Game, this will run at the games updates_per_second

### .setActive(boolean)
Will run or no

### .setinterval(id,game)
will add an interval to the game, not recommended to use

### .destroy()
destroys the gameloop

## SpriteSheet(Image,single_sprite_width,single_sprite_height)

### .get(num)
will give you an image at the num position. Num is the sprite number. Counting from left to right, top to bottom.

## Physics(sprite)
not recommended



# credits

using Stackblur @copyright (c) 2010 Mario Klingemann
using Fisheye.js Copyright (c) 2015 Eric Leong
using the Background images and font that I've downloaded from Itch.io, I don't remember the names of the creators. If you are the creator and wish to claim your credit here, please write this in issues. Thank you! :)

# License

### By using, adapting, downloading this in any shape or form, you agree to [CC By Sa](https://creativecommons.org/licenses/by-sa/4.0/). This work is licensed under this license (except for Fisheye.js and Stackblur whose copyrights are reserved to their respectful owners)


