var canvas;
var ctx;
var canvasWidth;
var canvasHeight;

var const notesPerBar = 8;

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
    padding:0;
  },

  bar: {
    //calc
    length:0,
    fontSize:0,
    lineSpacing:0
  },

  note: {
    //calc
    noteWidth:0
  }

};

$(document).ready(function(){
  console.log('ok');
  change();
  defaultPaint();
});

function change(){
  // grab values
  scale.canvas.height = $('#canvasHeight').value;
  scale.canvas.width = $('#canvasWidth').value;

  scale.linesPerPage = $('#linesPerPage').value;
  scale.barsPerLine = $('#barsPerLine').value;

  scale.canvas.paddingTop = $('#paddingTop').value;
  scale.canvas.paddingLeft = $('#paddingLeft').value;

  scale.bar.lineSpacing = $('#lineSpacing').value;
  scale.bar.fontSize = $('#fontSize').value;

  // lineHeight = 30; // or bar line spacing

  init();
}

function init(){
  canvas = $('#canvas')[0];
  canvas.width = scale.canvas.width;
  canvas.height = scale.canvas.length;


  scale.line.height = scale.bar.fontSize * 4 + scale.bar.lineSpacing * 14;  //(scale.canvas.height - (2 * scale.canvas.paddingTop)) / scale.linesPerPage;
  scale.line.width  = scale.canvas.width - (2 * scale.canvas.paddingLeft);
  scale.line.padding = (scale.canvas.height - (scale.linesPerPage * scale.line.height) - scale.line.height) / (scale.linesPerPage - 1);

  lineWidth = canvasWidth - paddingLeft * 2;
  paddingTop = (canvasHeight - (linesPerPage * lineHeight)) / (linesPerPage + 1);
  //paddingTop = (canvasHeight / (linesPerPage + 1)) - lineHeight;
  barSpacing = lineWidth / barsPerLine;
  noteWidth = barSpacing / 8;

  ctx = canvas.getContext('2d');
  defaultPaint();
}


function defaultPaint(){
  var x = scale.canvas.paddingLeft;
  var y = scale.canvas.paddingTop;
  for(var barCount = 0; barCount < scale.linesPerPage * scale.barsPerLine; barCount++){
    
  }
}
