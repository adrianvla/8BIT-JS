
class Canvas{
constructor(ca){
this.ctx = ca.getContext('2d');
this.ca = ca;

}
prop(a,b){
    this.ctx.a = b;
}
img(s,a,b){
    var img = document.createElement('IMG');
    img.src=s;
    img.onload = function(){this.ctx.drawImage(img, a, b);};
    
} 
imge(e,a,b){
    this.ctx.drawImage(e, a, b);
}  
dataURL(a,b){
    return thix.ctx.toDataURL(a, b);
}
imgo(e,a,b,callback){
    
    e.onload = function(){



c.imge(e,a,b);
callback();
}
}
ctx(){
    return this.ctx;
}
fr(s,x,y,a,b){
    
this.ctx.beginPath();
this.ctx.strokeStyle = s;
this.ctx.fillRect(x,y,a,b);
this.ctx.stroke();
}
get(x,y){
    
    function GetPixel(context, x, y)
{
    var p = context.getImageData(x, y, 1, 1).data; 
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);  
    return hex;
}
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
return GetPixel(this.ctx,x,y);
}
_8bit(){
    var can = this.ca;
var ctx = this.ctx;
    var imageData = ctx.getImageData(0,0,can.width, can.height);
    var pixels = imageData.data;
    var numPixels = pixels.length;
    
    ctx.clearRect(0, 0, can.width, can.height);
    
    for (var i = 0; i < numPixels; i++) {
        pixels[i*4] = pixels[i*4] - (pixels[i*4] % 32);
        pixels[i*4+1] = pixels[i*4+1] - (pixels[i*4+1] % 32);
        pixels[i*4+2] = pixels[i*4+2] - (pixels[i*4+2] % 32);
    }
    ctx.putImageData(imageData, 0, 0);
}
bloom(scale,alpha){
    var ctx = this.ctx;
    var small = document.createElement('canvas'),
        smallctx = small.getContext('2d');
    var can = this.ca;
    small.width = can.width / scale;
    small.height = can.height / scale;
    
this.ctx.imageSmoothingEnabled = true;
    smallctx.drawImage(this.ca, 0, 0, small.width, small.height);
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(small, 0, 0, can.width, can.height);
}
plasma(b){
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var size = b / 100,
    w = this.ca.width * size,
    h = this.ca.height * size;

// draw the original image at a fraction of the final size
ctx.drawImage(this.ca, 0, 0, w, h);

// turn off image aliasing
ctx.msImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

// enlarge the minimized image to full size    
this.ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
}
filter(rf,gf,bf){
    var can = this.ca;
var ctx = this.ctx;
    var imageData = ctx.getImageData(0,0,can.width, can.height);
    var pixels = imageData.data;
    var numPixels = pixels.length;
    
    ctx.clearRect(0, 0, can.width, can.height);
    
    for (var i = 0; i < numPixels; i++) {
        pixels[i*4] = rf(pixels[i*4]);
        pixels[i*4+1] = gf(pixels[i*4+1]);
        pixels[i*4+2] = bf(pixels[i*4+2]);
    }
    ctx.putImageData(imageData, 0, 0);
}
clear(){
    this.ctx.clearRect(0, 0, this.ca.width, this.ca.height);
this.ctx.imageSmoothingEnabled = false;
}
gete(){
return this.ca;
}
}

class Sprite{
constructor(ca){
this.cost = {};
this.stamps = [];
this.ca = ca;
this.render = function(){
ca.imge(this.img,this.x,this.y);

}
}
move(dx,dy){
    this.x += dx;
    this.y += dy;
    return {x:this.x,y:this.y};
}
put(x,y){
this.x = x;
this.y = y;
}
get(){
    return {x:this.x,y:this.y};
}
ccostume(n,i){
this.cost[n] = i;
}
scostume(n){
    this.img = this.cost[n];
}
stamp(){
    this.render();
}
}
