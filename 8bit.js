class Canvas {
    constructor(ca, g) {
        this.ctx = ca.getContext("2d");
        this.ca = ca;
        this.spritelist = [];
        this.game = g;
    }
    prop(a, b) {
        this.ctx.a = b;
    }
    /*
        _RegisterPS(PS) {

            this.pslist[zindex] = sprite;
            return zindex;
        } */
    img(s, a, b) {
        var img = document.createElement("IMG");
        img.src = s;
        img.onload = function () {
            this.ctx.drawImage(img, a, b);
        };
    }
    imge(e, a, b, c, d) {
        if (c) {

            this.ctx.drawImage(e, a, b, c, d);
        } else {

            this.ctx.drawImage(e, a, b);
        }
    }
    dataURL(a, b) {
        return thix.ctx.toDataURL(a, b);
    }
    imgo(e, a, b, callback) {
        e.onload = function () {
            c.imge(e, a, b);
            callback();
        };
    }
    ctx() {
        return this.ctx;
    }
    fr(s, x, y, a, b) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = s;
        this.ctx.fillRect(x, y, a, b);
        this.ctx.stroke();
    }
    get(x, y) {
        function GetPixel(context, x, y) {
            var p = context.getImageData(x, y, 1, 1).data;
            var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            return hex;
        }

        function rgbToHex(r, g, b) {
            if (r > 255 || g > 255 || b > 255) {
                throw "Invalid color component";
            }
            return ((r << 16) | (g << 8) | b).toString(16);
        }
        return GetPixel(this.ctx, x, y);
    }
    _8bit() {
        var can = this.ca;
        var ctx = this.ctx;
        var imageData = ctx.getImageData(0, 0, can.width, can.height);
        var pixels = imageData.data;
        var numPixels = pixels.length;
        ctx.clearRect(0, 0, can.width, can.height);
        for (var i = 0; i < numPixels; i += 1) {
            pixels[i * 4] = pixels[i * 4] - (pixels[i * 4] % 32);
            pixels[i * 4 + 1] = pixels[i * 4 + 1] - (pixels[i * 4 + 1] % 32);
            pixels[i * 4 + 2] = pixels[i * 4 + 2] - (pixels[i * 4 + 2] % 32);
        }
        ctx.putImageData(imageData, 0, 0);
    }
    /*
        bloom(scale, alpha) {
            var ctx = this.ctx;
            var small = document.createElement("canvas"),
                smallctx = small.getContext("2d");
            var can = this.ca;
            small.width = can.width / scale;
            small.height = can.height / scale;
            this.ctx.imageSmoothingEnabled = true;
            smallctx.drawImage(this.ca, 0, 0, small.width, small.height);
            ctx.globalAlpha = alpha;
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(small, 0, 0, can.width, can.height);
        } */
    plasma(b) {
        var canvas = document.createElement("CANVAS");
        var ctx = canvas.getContext("2d");
        var size = b / 100,
            w = this.ca.width * size,
            h = this.ca.height * size;
        ctx.drawImage(this.ca, 0, 0, w, h);
        ctx.msImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
    }
    postprocess() {
        class PortProcess {
            constructor(c) {
                this.ca = c.ca;
            }
            bloom(intensity, radius, quality, operation) {

                var ctx = this.ca.getContext("2d");
                var b = document.createElement("canvas");
                b.width = this.ca.width / quality;
                b.height = this.ca.height / quality;
                var bctx = b.getContext('2d');
                bctx.drawImage(this.ca, 0, 0, b.width, b.height);
                StackBlur.canvasRGB(b, 0, 0, b.width, b.height, radius);
                ctx.globalAlpha = intensity;

                ctx.globalCompositeOperation = operation;
                ctx.drawImage(b, 0, 0, this.ca.width, this.ca.height);

                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = "source-over";
            }
            lighten(alpha, operation) {

                var ctx = this.ca.getContext("2d");
                var b = document.createElement("canvas");
                b.width = this.ca.width;
                b.height = this.ca.height;
                var bctx = b.getContext('2d');
                bctx.drawImage(this.ca, 0, 0, b.width, b.height);
                ctx.globalAlpha = alpha;

                ctx.globalCompositeOperation = operation;
                ctx.drawImage(b, 0, 0, this.ca.width, this.ca.height);

                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = "source-over";
            }
            motionblur(alpha) {

                var ctx = this.ca.getContext("2d");
                var ppctx = $('#postprocess')[0].getContext("2d");
                ctx.globalAlpha = alpha;
                ctx.drawImage($('#postprocess')[0], 0, 0);




                ctx.globalAlpha = 1;
                ppctx.drawImage(this.ca, 0, 0);

            }
        }
        return new PortProcess(this)
    }
    filter(rf, gf, bf) {
        var can = this.ca;
        var ctx = this.ctx;
        var imageData = ctx.getImageData(0, 0, can.width, can.height);
        var pixels = imageData.data;
        var numPixels = pixels.length;
        ctx.clearRect(0, 0, can.width, can.height);
        for (var i = 0; i < numPixels; i += 1) {
            pixels[i * 4] = rf(pixels[i * 4]);
            pixels[i * 4 + 1] = gf(pixels[i * 4 + 1]);
            pixels[i * 4 + 2] = bf(pixels[i * 4 + 2]);
        }
        ctx.putImageData(imageData, 0, 0);
    }
    clear(col) {
        if (col) {

            this.ctx.fillStyle = col;
            this.ctx.fillRect(0, 0, this.ca.width, this.ca.height);
        } else {

            this.ctx.clearRect(0, 0, this.ca.width, this.ca.height);
        }
        this.ctx.imageSmoothingEnabled = false;
    }
    gete() {
        return this.ca;
    }
    getSprites() {
        return this.spritelist;
    }
    scrollTo(x, y, func) {
        if (this.animspeed) {
            clearInterval(this.animint);
        }
        if (!this.scrollingTo) {
            this.scrollingTo = [0, 0];
            this.oldscrollingTo = this.scrollingTo;
        }
        this.currentscroll = [this.scrollingTo[0], this.scrollingTo[1]];
        this.scrollingTo = [x, y];
        this.animspeed = 200;
        var cv = this;
        var tt = 0;

        if (!func) {

            this.spritelist.forEach(function (sprite) {
                sprite._InternMove(x, y);
            });
        } else {
            this.animint = setInterval(function () {
                    tt++;
                    var xx = cv.currentscroll[0] + ((cv.scrollingTo[0] - cv.currentscroll[0]) * func(tt / cv.animspeed));
                    var yy = cv.currentscroll[1] + ((cv.scrollingTo[1] - cv.currentscroll[1]) * func(tt / cv.animspeed));

                    cv.oldscrollingTo = [xx, yy];
                    cv.spritelist.forEach(function (sprite) {
                        sprite._InternMove(xx, yy);
                    });
                    if (tt == cv.animspeed) {
                        clearInterval(cv.animint)
                    }
                },
                1);
        }
        this.oldscrollingTo = this.scrollingTo;
        return this;

    }
    _RegisterSprite(sprite) {
        return this.spritelist.push(sprite);

    }

    _DestroySprite(num) {
        delete this.spritelist[num];
        this.spritelist = this.spritelist.filter(function (a) {
            return a != null
        });
        return true;
    }
    setCamZ(z) {
        this.spritelist.forEach(function (sprite) {
            sprite.zModif = 1 / z;
        });

        this.spritelist = this.spritelist.filter(function (a) {
            return a != null
        });
        return this;

    }
}
class ParticleSystem {
    constructor(sprite, color, count, speed, to, from, tex) {
        var radius = tex.width;
        var proccanv = tex;
        var prcctx = proccanv.getContext('2d');
        this.sprite = sprite;
        this.spritelist = {};
        //this.toto = [to[0], to[1]]; // no pointer
        this.r = radius;
        this.col = color;
        this.count = count;
        this.speed = speed;
        this.to = to;
        this.tonull = to == null;
        this.from = from;
        var sp = this.sprite;

        sprite.ccostume('particlesystem', proccanv);
        sprite.scostume('particlesystem');
        this.texture = proccanv;
        var cv = this;
        cv.deleting = false;

        setTimeout(async function () {
            delete cv.spritelist[Object.keys(cv.spritelist)[0]]
        }, 1000 / speed);
        this.int = setInterval(function () {
                var s = {
                    x: from[0],
                    y: from[1]
                };
                var spr = [s.x, s.y];
                if (cv.tonull) {
                    cv.to = [s.x, s.y]; //unlink
                    to = [s.x, s.y]; //unlink
                }
                var dx = (to[0] - from[0]) / (sp.game.tps / speed);
                var dy = (to[1] - from[0]) / (sp.game.tps / speed);
                var mynum = token();
                cv.spritelist[mynum] = spr;
                //var t = 0;
                cv.spritelist[mynum][2] = -2;
                var thissprite = {};

                thissprite['angle'] = Math.floor(Math.random() * 360);

                var sprint = setInterval(function () {
                        //t++;
                        if (!cv.tonull) {

                            if (cv.spritelist[mynum][2] % 10 == 0) {
                                thissprite['angle'] = Math.floor(Math.random() * 360);
                            }
                            spr[0] = spr[0] + dx;
                            spr[1] = spr[1] + dy;
                            var sprm = angleMove(0, 0, radius / 2, thissprite.angle);

                            spr[0] = spr[0] + sprm.x;
                            spr[1] = spr[1] + sprm.y;
                        } else {
                            var sprm = angleMove(0, 0, speed * 2, thissprite.angle + (Math.random()));

                            spr[0] = spr[0] + sprm.x;
                            spr[1] = spr[1] + sprm.y;
                        }
                        setTimeout(function () {
                            //cv.spritelist[mynum][2] = sp.game.tps / speed;
                            //delete cv.spritelist[mynum];
                            //cv.spritelist.shift();
                            //cv.spritelist.shift();

                            clearInterval(sprint);
                            delete cv.spritelist[mynum];

                            //cv.spritelist[mynum][2] = true;
                        }, 1000 / speed);
                        try {
                            cv.spritelist[mynum][2]++;

                            cv.spritelist[mynum][3] = ((1 / (speed / sp.game.tps)) - cv.spritelist[mynum][2]) / (1 / (speed / sp.game.tps));
                        } catch (E) {}

                    },
                    1000 / sp.game.tps);

            },
            1000 / this.count);
    }
    destroy() {
        clearInterval(this.int);
        return true;
    }
}

function token() {
    var l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'.split('');
    var m = [];
    for (var i = 0; i < 20; i++) {
        m.push(l[Math.floor(Math.random() * l.length)]);
    }
    return m.join('');
}
class Sprite {
    constructor(ca, game, zindex) {
        this.interncoords = [0, 0];
        this.cost = {};
        this.stamps = [];
        this.ca = ca;
        this.spritelistid = ca._RegisterSprite(this, zindex);
        this.nsc = true;
        this.z = 1;
        this.zModif = 1;
        this.alpha = 1;
        this.scale = [];
        this.put(0, 0);
        this.game = game;
        this.inFront = false;
        this.ps = null;
        this.isps = false;
        this.isInfinite = false;
        this.infiniteSprites = [];
        this.infiniteSpritesother = [];
        this.absx = 0;
        this.absy = 0;
    }
    createPhysics(physx) {
        this.physics = physx;
        return this;
    }
    createParticleSystem(color, count, speed, to, from, tex) { //to = [x,y] direction


        var ps = new ParticleSystem(this, color, count, speed, to, from, tex);
        //console.log(this)
        this.ps = ps;
        this.isps = true;
        return this;
    }
    setInfinite(f) {
        this.isInfinite = f;
        this.infiniteSprites = {};
        this.infiniteSpritesother = {};
        if (f) {
            if (f == 'x') {
                var w = this.scale[0] == undefined ? this.img.width : this.scale[0];
                for (var i = 0; i < Math.floor(this.ca.ca.width / w) + 3; i++) {
                    var parent = this;
                    var thissprite = new Sprite(parent.ca, parent.game).canbeScrolled(false);
                    var thisin = token();
                    parent.infiniteSprites[thisin] = [thissprite];

                }

                for (var i = 0; i < Math.floor(this.ca.ca.width / w) + 3; i++) {
                    var parent = this;
                    var thissprite = new Sprite(parent.ca, parent.game).canbeScrolled(false);
                    var thisin = token();
                    parent.infiniteSpritesother[thisin] = [thissprite];

                }
            }


            if (f == 'y') {

            }

        } else {}

        return this;
    }
    render() {
        if (!this.norender) {
            if (Object.keys(this.cost).length > 0) {


                this.ca.ctx.globalAlpha = this.alpha;

                if (this.inFront) {

                    var z = this.z;
                } else {

                    var z = this.z * this.zModif;
                }
                var w = this.img.width;
                var h = this.img.height;
                if (this.scale.length > 0) {
                    w = this.scale[0];
                    h = this.scale[1];
                }
                if (this.isps) {
                    var cv = this;
                    Object.keys(this.ps.spritelist).forEach(function (key, i) {
                        var spr = cv.ps.spritelist[key];
                        if (spr != undefined) {

                            if (cv.nsc) {
                                cv.ca.imge(cv.ps.texture, (spr[0] + cv.interncoords[0] + cv.x) * z, (spr[1] + cv.interncoords[1] + cv.y) * z, w * spr[3], h * spr[3]);
                            } else {
                                cv.ca.imge(cv.ps.texture, (spr[0] + cv.x) * z, (spr[1] + cv.y) * z, w * spr[3], h * spr[3]);
                            }
                        }
                    });
                } else {
                    if (this.nsc) {
                        this.absx = (this.x + this.interncoords[0]) * z;
                        this.absy = (this.y + this.interncoords[1]) * z;
                        this.ca.imge(this.img, (this.x + this.interncoords[0]) * z, (this.y + this.interncoords[1]) * z, w, h);
                    } else {
                        this.ca.imge(this.img, this.x * z, this.y * z, w, h);
                    }

                    if (this.isInfinite) {
                        var cv = this;
                        var parent = this;

                        Object.keys(this.infiniteSprites).forEach(function (key, i) {
                            var len = Object.keys(cv.infiniteSprites).length;
                            var thisin = key;
                            var xx = parent.absx;
                            var yy = parent.absy;
                            var thissprite = cv.infiniteSprites[key][0];

                            thissprite.put((xx % w) + (w * (1 + Object.keys(parent.infiniteSprites).indexOf(thisin))), yy);
                            thissprite.ccostume('main', parent.img);
                            thissprite.scostume('main');
                            cv.infiniteSprites[key][0].render();
                        });
                        Object.keys(this.infiniteSpritesother).forEach(function (key, i) {
                            var len = Object.keys(cv.infiniteSpritesother).length;
                            var thisin = key;
                            var xx = parent.absx;
                            var yy = parent.absy;
                            var thissprite = cv.infiniteSpritesother[key][0];

                            thissprite.put((xx % w) - (w * (Object.keys(parent.infiniteSpritesother).indexOf(thisin) - 1)), yy);
                            thissprite.ccostume('main', parent.img);
                            thissprite.scostume('main');
                            cv.infiniteSpritesother[key][0].render();
                        });
                    }
                }
                this.ca.ctx.globalAlpha = 1;
                //return this;

            } else {
                //return this;

            }
        }

    }
    _InternMove(x, y) {
        this.interncoords = [x, y];
        return this;

    }
    move(dx, dy) {
        this.put(this.x + dx, this.y + dy);
        return this;

    }
    put(x, y) {
        if (this.isps) {
            this.ps.from[0] = x;
            this.ps.from[1] = y;
        } else {

            this.x = x;
            this.y = y;
        }
        this.norender = x == null;

        return this;

    }
    getpos() {
        var u = {};
        if (this.isps) {
            u.x = this.ps.from[0];
            u.y = this.ps.from[1];
        } else {

            u.x = this.x;
            u.y = this.y;
        }
        return u;
    }
    get() {
        return this;
    }
    ccostume(n, i) {
        this.cost[n] = i;
        return this;

    }
    scostume(n) {
        this.img = this.cost[n];
        return this;

    }
    stamp() {
        this.render();
        return this;

    }
    canbeScrolled(a) {
        this.nsc = a;
        return this;

    }
    setZ(z) {
        this.z = z;
        return this;

    }
    isInFront(a) {
        this.inFront = a;
        return this;

    }
    setAlpha(alpha) {
        this.alpha = alpha;
        return this;
    }
    setScale(scale) {
        this.scale = scale;
        return this;
    }
    destroy() {
        this.ca._DestroySprite(this.spritelistid);
        return true;
    }
}


function angleMove(x, y, r, a) {
    a = a / 180 * Math.PI;
    return {
        x: x + (r * Math.cos(a)),
        y: y + (r * Math.sin(a))
    };
}
EasingFunctions = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t * t,
    // decelerating to zero velocity
    easeOutQuad: t => t * (2 - t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    // accelerating from zero velocity 
    easeInCubic: t => t * t * t,
    // decelerating to zero velocity 
    easeOutCubic: t => (--t) * t * t + 1,
    // acceleration until halfway, then deceleration 
    easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // accelerating from zero velocity 
    easeInQuart: t => t * t * t * t,
    // decelerating to zero velocity 
    easeOutQuart: t => 1 - (--t) * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    // accelerating from zero velocity
    easeInQuint: t => t * t * t * t * t,
    // decelerating to zero velocity
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    // acceleration until halfway, then deceleration 
    easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}

function toImg(src) {
    return new Promise((resolve) => {

        var i = new Image();
        i.src = src;
        i.onload = function () {
            resolve(i);
        }
    });
}
class Game {
    constructor(tickspersecond) {
        this.tps = tickspersecond;
        this.gameloops = [];
        this.ticks = 0;
        var o = this;
        this.interval = setInterval(function () {
            o.ticks++;
        }, 1000 / this.tps);
    }
    setup(func) {
        this.setupfunc = func;
        func();
        return this;
    }
    gameloop(gamel) {
        gamel.setinterval(h, this);
        var h = this.gameloops.push(gamel);
        return h;
    }
    async destroy() {
        clearInterval(this.interval);
        this.gameloops.forEach(function (gl) {
            gl.destroy();
        });
        this.gameloops = [];
        return true;
    }
}
class GameLoop {
    constructor(func) {
        this.func = func;
        this.active = true;
    }
    setActive(a) {
        this.active = a;
        return this;
    }
    setinterval(h, game) {
        var j = this;
        this.int = setInterval(function () {
            j.func(j.game.ticks);
        }, 1000 / game.tps);
        this.id = h;
        this.game = game;
        return this;
    }
    destroy() {
        clearInterval(this.int);
        delete this.game.gameloops[this.id];
        this.game.gameloops = this.game.gameloops.filter(function (a) {
            return a != null;
        });
        return true;
    }
}
class SpriteSheet {
    constructor(img, spw, sph) {
        this.img = img;
        this.spw = spw;
        this.sph = sph;
        this.row = img.width / spw;
        this.col = img.height / sph;
        return this;
    }
    get(num) {
        var canv = document.createElement("CANVAS");
        canv.width = this.spw;
        canv.height = this.sph;
        var ctx = canv.getContext('2d');
        var r = num % this.row;
        var c = Math.floor(num / this.row);
        //console.log(this.img, r * this.spw, c * this.sph, this.img.width, this.img.height)
        ctx.drawImage(this.img, r * this.spw, c * this.sph, this.img.width, this.img.height, 0, 0, this.img.width, this.img.height);
        return canv;
    }
}
class Physics {
    constructor(sprite) {
        this.sprite = sprite;
        sprite.createPhysics(this);
        this.vx = 0;
        this.vy = 0;
        var cv = this;
        this.interval = setInterval(function () {
            var p = cv.sprite.getpos();
            cv.sprite.put(p.x + cv.vx, p.y + cv.vy);

            cv.vx = cv.vx - (cv.vx / 2);
            //cv.vy = cv.vy -(cv.vy/2);
            if (p.y > 140 && cv.vy > 0) {
                if (p.y > 150) {

                    cv.vy = 0;
                } else {

                    //cv.vy = -cv.vy + 2;
                    cv.vy = 0;
                }
            } else {
                if (!(p.y > 145)) {

                    cv.vy = cv.vy + 0.4;
                }
            }
            //info[0] = 'y vel: ' + cv.vy + '\n' + 'y: ' + p.y + '\n' + 'x vel: ' + cv.vx + '\n' + 'x: ' + p.x;
        }, 1000 / cv.sprite.game.tps);
    }

}


window.Canvas = Canvas;
window.ParticleSystem = ParticleSystem;
window.Sprite = Sprite;
window.Game = Game;
window.GameLoop = GameLoop;
window.SpriteSheet = SpriteSheet;
window.Physics = Physics;