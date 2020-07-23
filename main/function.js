var FOREGROUND_IMG = null;
var BACKGROUND_IMG = null;
var COMPOSITE_IMG = null;
var GRAY_IMG = null;
var OVERLAY_IMG = null;
var RAINBOW_IMG = null;
var ENCRYPTED_IMG = null;
var AVG_COLOR;
var AUDIO_INDEX= new Audio('main/smack.mp3');
var AUDIO_OTHERS= new Audio('cash.mp3');

function upload1() {
  var f = document.getElementById("FOREGROUND_INP_ID");
  FOREGROUND_IMG = new SimpleImage(f);
  FOREGROUND_IMG.drawTo(FIRST_CANVAS_ID);
}
function upload2() {
  var b = document.getElementById("BACKGROUND_INP_ID");
  BACKGROUND_IMG = new SimpleImage(b);
  BACKGROUND_IMG.drawTo(SECOND_CANVAS_ID);
}

function changeSize() {
  alert("\t\tRestoring Sizes \nEverything under control");
  BACKGROUND_IMG.setSize(FOREGROUND_IMG.getWidth(), FOREGROUND_IMG.getHeight());
  var secondCanvasContext = SECOND_CANVAS_ID.getContext("2d");
  secondCanvasContext.clearRect(0, 0, FIRST_CANVAS_ID.width, FIRST_CANVAS_ID.height);
  BACKGROUND_IMG.drawTo(SECOND_CANVAS_ID);
}


function isForeGroundImageUploaded() {
  if (FOREGROUND_IMG == null || !FOREGROUND_IMG.complete()) {
    alert("Please upload a Foreground image");
    return false;
  }
  return true;
}

function isBackGroundImageUploaded() {
  if (BACKGROUND_IMG == null || !BACKGROUND_IMG.complete()) {
    alert("Please upload a Background image");
    return false;
  }
  return true;
}



function checkImageSize() {
  var wbg = BACKGROUND_IMG.getWidth();
  var wfg = FOREGROUND_IMG.getWidth();
  var hbg = BACKGROUND_IMG.getHeight();
  var hfg = FOREGROUND_IMG.getHeight();

  if (wbg != wfg || hbg != hfg) {
    alert("sizes are not the same");
    changeSize();
  }
}



function mergeGreenScreen() {

  if (isForeGroundImageUploaded() && isBackGroundImageUploaded()) {
    checkImageSize();
    var c;
    COMPOSITE_IMG = new SimpleImage(FOREGROUND_IMG.getWidth(), FOREGROUND_IMG.getHeight());
    for (var pix of FOREGROUND_IMG.values()) {
      var x = pix.getX();
      var y = pix.getY();

      if ((pix.getGreen() > 240) || (pix.getGreen() > (pix.getBlue() + pix.getRed()))) {
        c = BACKGROUND_IMG.getPixel(x, y);
        COMPOSITE_IMG.setPixel(x, y, c);
      }
      else {
        COMPOSITE_IMG.setPixel(x, y, pix);
      }

    }
    COMPOSITE_IMG.drawTo(COMPOSITE_CANVAS_ID);
  }
}

function clearBits(value) {
  return Math.floor(value / 16) * 16;
}

function chopImage1(image) {
  for (var px of image.values()) {
    px.setRed(clearBits(px.getRed()));
    px.setGreen(clearBits(px.getGreen()));
    px.setBlue(clearBits(px.getBlue()));
  }
  return image;
}

function chopImage2(image) {
  for (var px of image.values()) {
    px.setRed(px.getRed() / 16);
    px.setGreen(px.getGreen() / 16);
    px.setBlue(px.getBlue() / 16);
  }
  return image;

}


function combineImages(start, hide) {
  var answer = new SimpleImage(start.getWidth(), start.getHeight());

  for (var px of answer.values()) {
    var x = px.getX();
    var y = px.getY();

    var sp = start.getPixel(x, y);
    var hp = hide.getPixel(x, y);

    px.setRed(sp.getRed() + hp.getRed());
    px.setGreen(sp.getGreen() + hp.getGreen());
    px.setBlue(sp.getBlue() + hp.getBlue());

  }
  return answer;
}

function encrypt() {

  if (isForeGroundImageUploaded() && isBackGroundImageUploaded()) {
    checkImageSize();

    FOREGROUND_IMG = chopImage1(FOREGROUND_IMG);
    BACKGROUND_IMG = chopImage2(BACKGROUND_IMG);
    ENCRYPTED_IMG = combineImages(FOREGROUND_IMG, BACKGROUND_IMG);

    ENCRYPTED_IMG.drawTo(ENCRYPT_CANVAS_ID);
  }
}


function extractBits(value) {
  return (value % 16) * 16;
}

function extractHiddenImage(image) {
  for (var px of image.values()) {
    px.setRed(extractBits(px.getRed()));
    px.setGreen(extractBits(px.getGreen()));
    px.setBlue(extractBits(px.getBlue()));
  }
  return image;
}

function decrypt() {
  if (isForeGroundImageUploaded() && isBackGroundImageUploaded()) {
    if (ENCRYPTED_IMG != null) {
      var extractedImg = extractHiddenImage(ENCRYPTED_IMG);
      extractedImg.drawTo(DECRYPT_CANVAS_ID);
    }
    else {
      alert("Please Crypt the Image before Decrypting");
    }

  }
}

function makegray() {
  if (isForeGroundImageUploaded()) {
    GRAY_IMG = new SimpleImage(FOREGROUND_IMG.getWidth(), FOREGROUND_IMG.getHeight());
    for (var pix of FOREGROUND_IMG.values()) {
      var x = pix.getX();
      var y = pix.getY();
      var g = GRAY_IMG.getPixel(x, y);
      var grayc = ((pix.getGreen() + pix.getRed() + pix.getBlue()) / 3);
      g.setGreen(grayc);
      g.setRed(grayc);
      g.setBlue(grayc);
    }
    GRAY_IMG.drawTo(GRAY_CANVAS_ID);
  }
}
function doOverlay() {
  if (isForeGroundImageUploaded()) {
    OVERLAY_IMG = FOREGROUND_IMG;
    for (var pix of FOREGROUND_IMG.values()) {
      var x = pix.getX();
      var y = pix.getY();
      var m = OVERLAY_IMG.getPixel(x, y);
      if (pix.getX() <= FOREGROUND_IMG.getWidth() / 3) {
        m.setRed(255);
        m.setAlpha(100);
      }
      if ((pix.getX() > FOREGROUND_IMG.getWidth() / 3) && pix.getX() <= (FOREGROUND_IMG.getWidth() / 3) * 2) {
        m.setBlue(255);
        m.setAlpha(100);
      }
      if ((pix.getX() > ((FOREGROUND_IMG.getWidth() / 3) * 2)) && (pix.getX() <= FOREGROUND_IMG.getWidth())) {
        m.setGreen(255);
        m.setAlpha(100);
      }
    }
    OVERLAY_IMG.drawTo(OVERLAY_CANVAS_ID);
  }
}

function makeRainBow() {
  if (isForeGroundImageUploaded()) {
    RAINBOW_IMG = FOREGROUND_IMG;
    var rectHeight = RAINBOW_IMG.getHeight();
    var rectSegment = parseInt(rectHeight) / 7;
    var Y;
    var X;
    for (pixel of RAINBOW_IMG.values()) {
      X = pixel.getX();
      Y = pixel.getY();
      AVG_COLOR = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
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
    RAINBOW_IMG.drawTo(RAINBOW_CANVAS_ID);
  }
}

function doViolet() {
  if (AVG_COLOR < 128) {
    red = Math.round(1.6 * AVG_COLOR);
    green = 0;
    blue = Math.round(1.6 * AVG_COLOR);
  } else {
    red = Math.round(0.4 * AVG_COLOR + 153);
    green = Math.round(2 * AVG_COLOR - 255);
    blue = Math.round(0.4 * AVG_COLOR + 153);
  }
  pixel.setRed(red);
  pixel.setGreen(green);
  pixel.setBlue(blue);
}

function doIndigo() {
  if (AVG_COLOR < 128) {
    red = Math.round(.8 * AVG_COLOR);
    green = 0;
    blue = Math.round(2 * AVG_COLOR);
  } else {
    red = Math.round(1.2 * AVG_COLOR - 51);
    green = Math.round(2 * AVG_COLOR - 255);
    blue = 255;
  }
  pixel.setRed(red);
  pixel.setGreen(green);
  pixel.setBlue(blue);
}

function doBlue() {
  if (AVG_COLOR < 128) {
    red = 0;
    green = 0;
    blue = Math.round(2 * AVG_COLOR);
  } else {
    red = Math.round(2 * AVG_COLOR - 255);
    green = Math.round(2 * AVG_COLOR - 255);
    blue = 255;
  }
  pixel.setRed(red);
  pixel.setGreen(green);
  pixel.setBlue(blue);
}
function doGreen() {
  if (AVG_COLOR < 128) {
    red = 0;
    green = Math.round(2 * AVG_COLOR);
    blue = 0;
  } else {
    red = Math.round(2 * AVG_COLOR - 255);
    green = 255;
    blue = Math.round(2 * AVG_COLOR - 255);
  }
  pixel.setRed(red);
  pixel.setGreen(green);
  pixel.setBlue(blue);
}

function doYellow() {
  if (AVG_COLOR < 128) {
    red = Math.round(2 * AVG_COLOR);
    green = Math.round(2 * AVG_COLOR);
    blue = 0;
  } else {
    red = 255;
    green = 255;
    blue = Math.round(2 * AVG_COLOR - 255);
  }
  pixel.setRed(red);
  pixel.setGreen(green);
  pixel.setBlue(blue);
}

function doOrange() {
  if (AVG_COLOR < 128) {
    red = Math.round(2 * AVG_COLOR);
    green = Math.round(.8 * AVG_COLOR);
    blue = 0;
  } else {
    red = 255;
    green = Math.round(1.2 * AVG_COLOR - 51);
    blue = Math.round(2 * AVG_COLOR - 255);
  }
  pixel.setRed(red);
  pixel.setGreen(green);
  pixel.setBlue(blue);
}

function doRed() {
  if (AVG_COLOR < 128) {
    red = Math.round(2 * AVG_COLOR);
    green = 0;
    blue = 0;
  } else {
    red = 255;
    green = Math.round(2 * AVG_COLOR - 255);
    blue = Math.round(2 * AVG_COLOR - 255);
  }
  pixel.setRed(red);
  pixel.setGreen(green);
  pixel.setBlue(blue);
}

function clearGreenScreen() {
  clearCanvas(FIRST_CANVAS_ID);
  clearCanvas(SECOND_CANVAS_ID);
  clearCanvas(COMPOSITE_CANVAS_ID);
  FOREGROUND_IMG = null;
  BACKGROUND_IMG = null;
  COMPOSITE_IMG = null
}


function clearDecrypt() {
  clearCanvas(SECOND_CANVAS_ID);
  clearCanvas(DECRYPT_CANVAS_ID);
  BACKGROUND_IMG = null;
}
function clearEncrypt() {
  clearCanvas(FIRST_CANVAS_ID);
  clearCanvas(ENCRYPT_CANVAS_ID);
  FOREGROUND_IMG = null;
}
function clearGrayScale() {
  clearCanvas(FIRST_CANVAS_ID);
  clearCanvas(GRAY_CANVAS_ID);
  FOREGROUND_IMG = null;
  GRAY_IMG = null;
}

function clearRainbow() {
  clearCanvas(RAINBOW_CANVAS_ID);
  clearCanvas(FIRST_CANVAS_ID);
  RAINBOW_IMG = null;
  FOREGROUND_IMG = null;
}

function clearOverlay() {
  clearCanvas(FIRST_CANVAS_ID);
  clearCanvas(OVERLAY_CANVAS_ID);
  FOREGROUND_IMG = null;
  OVERLAY_IMG = null
}
function clearCanvas(canvas) {
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function soundIndex()
{
  AUDIO_INDEX.play();
}
function soundOthers()
{
  AUDIO_OTHERS.play();
}