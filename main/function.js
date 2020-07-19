var fimg = null;
var bimg = null;
var cimg = null;
var dimg = null;
var gimg = null;
var mimg = null;
var progWidth = document.getElementById("mybar");
var pixelnum = 0;
var totalpix = null;
var barwidth = null;

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
    cimg = new SimpleImage(fimg.getWidth(), fimg.getHeight());
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
    var d;
    dimg = new SimpleImage(fimg.getWidth(), fimg.getHeight());
    for (var pix of cimg.values()) {
        var x = pix.getX();
        var y = pix.getY();
        var r1 = ((pix.getRed() % 16) * 16);
        var g1 = ((pix.getGreen() % 16) * 16);
        var b1 = ((pix.getBlue() % 16) * 16);
        d = dimg.getPixel(x, y);
        d.setRed(r1);
        d.setGreen(g1);
        d.setBlue(b1);
    }
    dimg.drawTo(dec);
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
function clrm() {
    Clear(fi);
    Clear(multimg);
}
function Clear(canvas) {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}
