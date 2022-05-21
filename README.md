# 8BIT-JS
A Simple JavaScript Sprite Library

It Has Costumes(layers) for each sprite, and yuo can change or move each sprite on the canvas.
Effects can be applied to the canvas (such as Bloom effect)

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


# credits

using Stackblur @copyright (c) 2010 Mario Klingemann
using Fisheye.js Copyright (c) 2015 Eric Leong