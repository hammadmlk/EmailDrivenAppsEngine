(function() {
  function LoaderProxy() {
    return {
      draw: $.noop,
      fill: $.noop,
      frame: $.noop,
      update: $.noop,
      width: null,
      height: null
    };
  }
  
  function Sprite(image, sourceX, sourceY, width, height) {
    sourceX = sourceX || 0;
    sourceY = sourceY || 0;
    width = width || image.width;
    height = height || image.height;
    
    return {
      draw: function(canvas, x, y, newWidth, newHeight, angle) {
        
        angle = angle || 0;
        
        if(angle){
          canvas.save();
          var rotationX = x+newWidth/2;
          var rotationY = y+newHeight/2;
          canvas.translate(rotationX, rotationY); //set new origin
          canvas.rotate(angle); //rotate canvas
          canvas.translate(-rotationX, -rotationY); //set new origin
        }
        
        canvas.drawImage(
                  image,
                  sourceX,
                  sourceY,
                  width,
                  height,
                  x,
                  y,
                  newWidth || width,
                  newHeight || height
          );
        
        if(angle){
          canvas.rotate(-angle);
          canvas.restore();
          return
        }
        
        
      },
      
      fill: function(canvas, x, y, width, height, repeat, color) {
        
        var temp = canvas.fillStyle;
        
        if (typeof color === 'undefined'){
          repeat = repeat || "repeat";
          var pattern = canvas.createPattern(image, repeat);
          canvas.fillStyle = pattern;
        }else{
          canvas.fillStyle = color;
        }
        
        canvas.beginPath();
        canvas.arc(x+width/2,y+height/2,width/2,0,2*Math.PI);
        canvas.fill();
        canvas.strokeStyle = 'grey';
        canvas.stroke(); 
        canvas.fillStyle = temp;
      },
      
      width: width,
      height: height
    };
  };
  
  Sprite.load = function(url, loadedCallback) {
    var img = new Image();
    var proxy = LoaderProxy();
    
    img.onload = function() {
      var tile = Sprite(this);
      
      $.extend(proxy, tile);
      
      if(loadedCallback) {
        loadedCallback(proxy);
      }
    };
    
    img.src = url;
    
    return proxy;
  };
 
  var spriteImagePath = "images/";

  window.Sprite = function(name, callback) {
    return Sprite.load(spriteImagePath + name + ".png", callback);
  };
  window.Sprite.EMPTY = LoaderProxy();
  window.Sprite.load = Sprite.load;
}());
