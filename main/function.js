var fimg = null;
var bimg = null;
var cimg = null;
var dimg = null;
var gimg = null;
var mimg = null;
var rimg = null;
var progWidth = document.getElementById("mybar");
var pixelnum = 0;
var totalpix = null;
var barwidth = null;
var avgColor;

function upload() {
    var f = document.getElementById("fgu");
    fimg = new SimpleImage(f);
    fimg.drawTo(fi);
}
function upload1() {
    var f = document.getElementById("fg");
    fimg = new SimpleImage(f);
    fimg.drawTo(fi);
}
function upload2() {
    var b = document.getElementById("bg");
    bimg = new SimpleImage(b);
    bimg.drawTo(bi);
}

function upload3() {
    var b = document.getElementById("rg");
    rimg = new SimpleImage(b);
    rimg.drawTo(ri);
}

function changeSize() {
    alert("\t\tRestoring Sizes \nEverything under control");
    bimg.setSize(fimg.getWidth(), fimg.getHeight());
    var bgcontext = bi.getContext("2d");
    bgcontext.clearRect(0, 0, fi.width, fi.height);
    bimg.drawTo(bi);
}

function comp() {

    if (fimg == null || !fimg.complete()) {
        alert("Please upload a Foreground image");
    }
    if (bimg == null || !bimg.complete()) {
        alert("Please upload a Background image");
    }
    var wbg = bimg.getWidth();
    var wfg = fimg.getWidth();
    var hbg = bimg.getHeight();
    var hfg = fimg.getHeight();
    if (wbg != wfg || hbg != hfg) {
        alert("sizes are not the same");
        changeSize();
    }
    var c;
    cimg = new SimpleImage(fimg.getWidth(), fimg.getHeight());
    totalpix = (fimg.getHeight() * fimg.getWidth() / 2);
    for (var pix of fimg.values()) {
        var x = pix.getX();
        var y = pix.getY();



        if ((pix.getGreen() > 240) || (pix.getGreen() > (pix.getBlue() + pix.getRed()))) {
            c = bimg.getPixel(x, y);
            cimg.setPixel(x, y, c);
        }
        else {
            cimg.setPixel(x, y, pix);
        }

    }
    cimg.drawTo(composite);

}
function encrypt() {

    if (fimg == null || !fimg.complete()) {
        alert("Please upload a Foreground image");
    }
    if (bimg == null || !bimg.complete()) {
        alert("Please upload a Background image");
    }
    var wbg = bimg.getWidth();
    var wfg = fimg.getWidth();
    var hbg = bimg.getHeight();
    var hfg = fimg.getHeight();
    if (wbg != wfg || hbg != hfg) {
        alert("sizes are not the same");
        changeSize();
    }
    var c;
    var d;
    cimg = fimg;
   // cimg = new SimpleImage(fimg.getWidth(), fimg.getHeight());
    for (var pix of fimg.values()) {
        var x = pix.getX();
        var y = pix.getY();
        var r1 = ((pix.getRed() / 16) * 16);
        var g1 = ((pix.getGreen() / 16) * 16);
        var b1 = ((pix.getBlue() / 16) * 16);
        c = bimg.getPixel(x, y);
        var r2 = (c.getRed() / 16);
        var g2 = (c.getGreen() / 16);
        var b2 = (c.getBlue() / 16);
        d = cimg.getPixel(x, y);
        d.setRed(r1 + r2);
        d.setGreen(g1 + g2);
        d.setBlue(b1 + b2);
    }
    cimg.drawTo(enc);
}
function decrypt() {
    dimg = new SimpleImage(fimg.getWidth(), fimg.getHeight());
    for (var pix of cimg.values()) {
        
        // var r1 = ((pix.getRed() % 16) * 16);
        // var g1 = ((pix.getGreen() % 16) * 16);
        // var b1 = ((pix.getBlue() % 16) * 16);
        // d = dimg.getPixel(x, y);
        pix.setRed((pix.getRed() % 16) * 16);
        pix.setGreen((pix.getGreen() % 16) * 16);
        pix.setBlue((pix.getBlue() % 16) * 16);
    }
    cimg.drawTo(dec);
}
function makegray() {
    gimg = new SimpleImage(fimg.getWidth(), fimg.getHeight());
    for (var pix of fimg.values()) {
        var x = pix.getX();
        var y = pix.getY();
        var g = gimg.getPixel(x, y);
        var grayc = ((pix.getGreen() + pix.getRed() + pix.getBlue()) / 3);
        g.setGreen(grayc);
        g.setRed(grayc);
        g.setBlue(grayc);
    }
    gimg.drawTo(gray);
}
function multi() {
     mimg = fimg;
    for (var pix of fimg.values()) {
        var x = pix.getX();
        var y = pix.getY();
        var m = mimg.getPixel(x, y);
        if (pix.getX() <= fimg.getWidth() / 3) {
            m.setRed(255);
            m.setAlpha(100);
        }
        if ((pix.getX() > fimg.getWidth() / 3) && pix.getX() <= (fimg.getWidth() / 3) * 2) {
            m.setBlue(255);
            m.setAlpha(100);
        }
        if ((pix.getX() > ((fimg.getWidth() / 3) * 2)) && (pix.getX() <= fimg.getWidth())) {
            m.setGreen(255);
            m.setAlpha(100);
        }
    }
    mimg.drawTo(multimg);
}

function makeRainBow()
{
   // rimg = new SimpleImage(rimg.getWidth(), rimg.getHeight());
  var rectHeight =  rimg.getHeight();
  var rectSegment = parseInt(rectHeight) / 7;
  var Y;
  var X;
  for (pixel of rimg.values()) {
    X = pixel.getX();
    Y = pixel.getY();
//      rimg.setPixel(X, Y, pixel);
    avgColor = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (Y >= 6 * parseInt(rectSegment)) {
      doRed();
    } else if (Y >= (5 * parseInt(rectSegment))) {
      doOrange();
    } else if (Y >= (4 * parseInt(rectSegment))) {
      doYellow();
    } else if (Y >= (3 * parseInt(rectSegment))) {
      doGreen();
    } else if (Y >= (2 * parseInt(rectSegment))) {
      doBlue();
    } else if (Y >= parseInt(rectSegment)) {
      doIndigo();
    } else {
      doViolet();
    }
  }
  rimg.drawTo(rainBow);
}

function doViolet() {
    if (avgColor < 128) {
      red = Math.round(1.6 * avgColor);
      green = 0;
      blue = Math.round(1.6 * avgColor);
    } else {
      red = Math.round(0.4 * avgColor + 153 );
      green = Math.round(2 * avgColor - 255);
      blue = Math.round(0.4 * avgColor + 153 );
    }
    pixel.setRed(red);
    pixel.setGreen(green);
    pixel.setBlue(blue);
  }
  
  function doIndigo() {
    if (avgColor < 128) {
      red = Math.round(.8 * avgColor);
      green = 0;
      blue = Math.round(2 * avgColor);
    } else {
      red = Math.round(1.2 * avgColor - 51);
      green = Math.round(2*avgColor - 255);
      blue = 255;
    }
    pixel.setRed(red);
    pixel.setGreen(green);
    pixel.setBlue(blue);
  }
  
  function doBlue() {
   if (avgColor < 128) {
      red = 0;
      green = 0;
      blue = Math.round(2*avgColor);
    } else {
      red = Math.round(2*avgColor-255);
      green =Math.round(2*avgColor-255);
      blue = 255;
    }
    pixel.setRed(red);
    pixel.setGreen(green);
    pixel.setBlue(blue);
  }
  function doGreen() {
    if (avgColor < 128) {
      red = 0;
      green = Math.round(2*avgColor);
      blue = 0;
    } else {
      red = Math.round(2*avgColor-255);
      green = 255;
      blue = Math.round(2*avgColor-255);
    }
    pixel.setRed(red);
    pixel.setGreen(green);
    pixel.setBlue(blue);
  }
  
  function doYellow() {
    if (avgColor < 128) {
      red = Math.round(2 * avgColor);
      green = Math.round(2 * avgColor);
      blue = 0;
    } else {
      red = 255;
      green = 255;
      blue = Math.round(2 * avgColor - 255);
    }
    pixel.setRed(red);
    pixel.setGreen(green);
    pixel.setBlue(blue);
  }
  
  function doOrange() {
     if (avgColor < 128) {
      red = Math.round(2 * avgColor);
      green = Math.round(.8 * avgColor);
      blue = 0;
    } else {
      red = 255;
      green = Math.round(1.2 * avgColor - 51);
      blue =  Math.round(2 * avgColor - 255);
    }
    pixel.setRed(red);
    pixel.setGreen(green);
    pixel.setBlue(blue);
  }
  
  function doRed() {
    if (avgColor < 128) {
      red = Math.round(2*avgColor);
      green = 0;
      blue = 0;
    } else {
      red = 255;
      green = Math.round(2*avgColor-255);
      blue = Math.round(2*avgColor-255);
    }
    pixel.setRed(red);
    pixel.setGreen(green);
    pixel.setBlue(blue);
  }



function clr() {
    Clear(fi);
    Clear(bi);
    Clear(composite);
}
function clrs() {
    Clear(fi);
    Clear(bi);
    Clear(enc);
    Clear(dec);
}
function clrg() {
    Clear(fi);
    Clear(gray);
}

function clrR() {
    Clear(ri);
    Clear(rainBow);
}

function clrm() {
    Clear(fi);
    Clear(multimg);
}
function Clear(canvas) {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}
