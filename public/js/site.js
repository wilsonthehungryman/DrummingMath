var canvas;
var ctx;
var canvasWidth;
var canvasHeight;

const notesPerBar = 8;

var scale = {
  // calc
  base:1,// = 10;
  //usr set
  linesPerPage:0,// = 8;
  barsPerLine:0,// = 4;

  canvas: {
    // usr set
    width:0,
    height:0,
    paddingLeft:0,
    paddingTop:0// = 15;
  },

  line: {
    // calc
    width:0,
    height:0,// = 40,
    padding:0
  },

  bar: {
    //calc
    length:0,
    fontSize:0,
    lineSpacing:0,
    topLine:0
  },

  note: {
    //calc
    noteWidth:0
  }

};

$(document).ready(function(){
  console.log('ok');
  change();
});

function change(){
  // grab values
  scale.canvas.height = parseInt($('#canvasHeight')[0].value);
  scale.canvas.width = parseInt($('#canvasWidth')[0].value);

  scale.linesPerPage = parseInt($('#linesPerPage')[0].value);
  scale.barsPerLine = parseInt($('#barsPerLine')[0].value);

  scale.canvas.paddingTop = parseInt($('#paddingTop')[0].value);
  scale.canvas.paddingLeft = parseInt($('#paddingLeft')[0].value);

  scale.bar.lineSpacing = parseInt($('#lineSpacing')[0].value);
  scale.bar.fontSize = parseInt($('#fontSize')[0].value);

  // lineHeight = 30; // or bar line spacing

  init();
}

function init(){
  canvas = $('#canvas')[0];
  // canvas.width = scale.canvas.width;
  // canvas.height = scale.canvas.length;

  scale.line.height = scale.bar.fontSize * 4 + scale.bar.lineSpacing * 14;  //(scale.canvas.height - (2 * scale.canvas.paddingTop)) / scale.linesPerPage;
  scale.bar.topLine = (scale.bar.fontSize * 2) + (scale.bar.lineSpacing * 3);
  scale.line.width  = scale.canvas.width - (2 * scale.canvas.paddingLeft);
  scale.line.padding = ((scale.canvas.height - (2 * scale.canvas.paddingTop)) - (scale.linesPerPage * scale.line.height)) / (scale.linesPerPage -1); //(scale.canvas.height - (scale.linesPerPage * scale.line.height) - scale.line.height) / (scale.linesPerPage - 1);

  ctx = canvas.getContext('2d');
  defaultPaint();
}

function defaultPaint(){
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = '#000000';

  var x = scale.canvas.paddingLeft;
  var y = scale.canvas.paddingTop;
  console.log(  '.....');
  for(var lineCount = 0; lineCount < scale.linesPerPage; lineCount++){
    console.log('outs x: ' + x + " y: " + y);
    drawLine(x, y);
    y = calculateNextStart(y);
  }
}

function drawLine(x, y){
  console.log('ins x: ' + x + " y: " + y);
  var xEnd = x + scale.line.width;
  var yStart = y;
  ctx.beginPath();
  y = y + scale.bar.topLine;
  for(var i = 0; i < 5; i++){
    ctx.moveTo(x, y);
    ctx.lineTo(xEnd, y);
    y += scale.bar.lineSpacing;
    console.log('x: ' + x + " y: " + y);
  }
  ctx.stroke();
  ctx.closePath();
}

function calculateNextStart(y){
  return y + scale.line.height + scale.line.padding;
}
