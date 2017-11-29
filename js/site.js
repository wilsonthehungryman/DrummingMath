var canvas;
var ctx;
var canvasWidth;
var canvasHeight;

const NOTES_PER_BAR = 8;

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
    width:0,
    height:0,
    fontSize:0,
    accentSize:0,
    lineSpacing:0,

    starts:{
      // space:0,
      stem:0,
      accent:0,
      lines:0,
      sticking:0,
      line:null,
      visibleLine:0
    },
    ends:{
      // space:0,
      stem:0,
      accent:0,
      lines:0,
      sticking:0,
      line:null
    },
    boxs:{
      // space:0,
      stem:0,
      accent:0,
      lines:0,
      sticking:0,
      line:null
    },
    barNotes:0,
    // spacePadding:true,
    sticking:true,
    accent:true,
    numberOfLines:5,
    actualLineLocation:null

    // calc:function() {
    //   // for symmetry
    //   if(this.barNotes % 2 === 0){
    //     this.barNotes++;
    //   }
    //   this.starts.accent = 0;
    //   this.ends.accent = (this.accent) ? this.accentSize : 0;
    //
    //   this.starts.stem = this.ends.accent;
    //   this.ends.stem = this.starts.stem + this.lineSpacing;
    //
    //   this.starts.lines = this.ends.stem;
    //   this.ends.lines = this.starts.lines + this.barNotes * this.lineSpacing;
    //
    //   this.starts.sticking = this.ends.lines;
    //   this.ends.sticking = this.starts.sticking + this.fontSize;
    //   this.height = this.ends.sticking;
    //   this.starts.line = (i) => {
    //     // middle is 0 (ie, 2,1,0,-1,-2)
    //     i = (i - this.barNotes) * -1;
    //     return this.starts.lines + this.lineSpacing * i;
    //   };
    //
    //   this.ends.line = (i) => {
    //     // middle is 0 (ie, 2,1,0,-1,-2)
    //     i = (i - this.barNotes) * -1;
    //     return this.starts.lines + this.lineSpacing * (i + 1);
    //   };
    //   this.total = this.spaces * this.lineSpacing + this.lines * this.lineSpacing;
    //   if(this.accent){
    //     this.total += this.fontSize;
    //     this.accentBox = function(x, y){ return { left:x, top:y + this.accentStart, right:x + this.width, bottom:y + this.accentStart + scale.bar.fontSize }; }
    //   }else{
    //     this.accentBox = function(){ return null; };
    //   }
    //   if(this.sticking){
    //     this.total += this.fontSize;
    //   }
    //}
  },

  note: {
    //calc
    width:0,
    height:0,
    //accentStart:0,
    //stickingStart:0,
    //accentBox:function(x, y){ return { left:x, top:y + this.accentStart, right:x + this.width, bottom:y + this.accentStart + scale.bar.fontSize }; },
    //stickingBox:function(x, y){ return { left:x, top:y + this.stickingStart, right:x + this.width, bottom:y + this.stickingStart + scale.bar.fontSize }; }
  }

};

var sticking = {
  R:1,
  L:2,
  N:0,
  None:0
}

function absoluteAccentBox(x, y){
  var box = { left:x, top:y + scale.bar.starts, right:x+scale.note.width, bottom:y};
  if(scale.bar.accent === true){
    box.bottom = y + scale.bar.accentSize;
  }
  return box;
}

function absoluteStemBox(x, y){
  var box = { left:x, top:y, right:x+scale.note.width, bottom:y};
}

// function Bar(){
//   return {
//     notes: new Array(NOTES_PER_BAR)
//   };
// }

function Note(){
  return {
    accent:false,
    position:0,
    sticking:sticking.none
  };
}

var bars;

$(document).ready(function(){
  console.log('ok');
  if($('#canvas').length > 0){
    change();
  }
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

  // replace with input
  scale.bar.accentSize = scale.bar.fontSize;

  scale.bar.barNotes = 5 + 4;
  scale.bar.accents = true;
  scale.bar.sticking = true;
  scale.bar.numberOfLines = 5;

  init();
}

function init(){
  canvas = $('#canvas')[0];
  // canvas.width = scale.canvas.width;
  // canvas.height = scale.canvas.length;

  //scale.line.height = scale.bar.fontSize * 2 + scale.bar.lineSpacing * 14;  //(scale.canvas.height - (2 * scale.canvas.paddingTop)) / scale.linesPerPage;
  //scale.bar.topLine = (scale.bar.fontSize) + (scale.bar.lineSpacing * 4);
  //scale.bar.bottomLine = scale.bar.topLine + (scale.bar.lineSpacing * 8);
  scale.line.width  = scale.canvas.width - (2 * scale.canvas.paddingLeft);
  scale.line.padding = ((scale.canvas.height - (2 * scale.canvas.paddingTop)) - (scale.linesPerPage * scale.line.height)) / (scale.linesPerPage -1); //(scale.canvas.height - (scale.linesPerPage * scale.line.height) - scale.line.height) / (scale.linesPerPage - 1);
  scale.bar.width = scale.line.width / scale.barsPerLine;

  scale.note.width = scale.bar.width / NOTES_PER_BAR;
  // scale.note.height = scale.line.height;
  // scale.note.accentStart = scale.bar.lineSpacing;
  // scale.note.stickingStart = (scale.bar.lineSpacing * 14) + scale.bar.fontSize;

  if(scale.bar.barNotes % 2 === 0){
    scale.bar.barNotes++;
  }

  scale.bar.starts.accent = 0;
  scale.bar.ends.accent = (scale.bar.accent) ? scale.bar.accentSize : 0;

  scale.bar.starts.stem = scale.bar.ends.accent;
  scale.bar.ends.stem = scale.bar.starts.stem + scale.bar.lineSpacing;

  scale.bar.starts.lines = scale.bar.ends.stem;
  scale.bar.ends.lines = scale.bar.starts.lines + scale.bar.barNotes * scale.bar.lineSpacing;

  scale.bar.starts.sticking = scale.bar.ends.lines;
  scale.bar.ends.sticking = (scale.bar.sticking) ? scale.bar.starts.sticking + scale.bar.fontSize : scale.bar.starts.sticking;
  scale.bar.height = scale.bar.ends.sticking;
  scale.bar.starts.line = (i) => {
    // middle is 0 (ie, 2,1,0,-1,-2)
    i = (i - (scale.bar.barNotes / 2 - 0.5)) * -1;
    return scale.bar.starts.lines + scale.bar.lineSpacing * i;
  };

  scale.bar.ends.line = (i) => {
    // middle is 0 (ie, 2,1,0,-1,-2)
    i = (i - (scale.bar.barNotes / 2 - 0.5)) * -1;
    return scale.bar.starts.lines + scale.bar.lineSpacing * (i + 1);
  };

  scale.bar.actualLineLocation = (i) => {
    i = (i - (scale.bar.barNotes / 2 - 0.5)) * -1;
    return scale.bar.starts.lines + scale.bar.lineSpacing * i + scale.bar.lineSpacing * 0.5;
  };

  scale.bar.starts.visibleLine = scale.bar.actualLineLocation(scale.bar.numberOfLines * 2 -1 - scale.bar.numberOfLines); //scale.bar.numberOfLines / 2 - 0.5);
  scale.bar.ends.visibleLine = scale.bar.actualLineLocation(1 - scale.bar.numberOfLines);
  var px = scale.bar.fontSize;
  // revise for multiple pages
  bars = [];

  ctx = canvas.getContext('2d');
  ctx.font = "bold " + px + 'px Arial'
  defaultPaint();
}

function generateAccents(){
  paradidlesAccents();
  console.log('Accents generated');
  drawNotes();

}

function paradidlesAccents(){
  var group = 4;
  var accentGroups = generatePermutations(group);

  // function generate(perm){
  //   var notes = [];
  //   for(var i = 0; i < perm.length * 2; i++){
  //     notes[i] = new Note();
  //     notes[i].accent = perm[i];
  //     notes[i].sticking = stickingArray[i];
  //   }
  //   return notes;
  // }


  var generator = {
    stickingArray:[sticking.R,sticking.L,sticking.R,sticking.R,sticking.L,sticking.R,sticking.L,sticking.L],
    generate:function(perm){
      var notes = [];
      //console.log(perm);
      for(var i = 0, j = perm.length; i < perm.length; i++, j++){
        notes[i] = new Note();
        notes[i].accent = perm[i];
        notes[i].sticking = this.stickingArray[i];

        notes[j] = new Note();
        notes[j].accent = perm[i];
        notes[j].sticking = this.stickingArray[j];
      }
      return notes;
    },
    totalNotes:(2 ** group - 1) * 2,
    permutations:accentGroups
  };
  generateNotes(generator);
}
// [group][permutation] = []
function generatePermutations(group){
  var result = [];
  for(var i = 0; i <= group; i++){
    result[i] = [];
  }
  //var group = 4;
  var total = 2 ** group - 1;
  var current = 0;
  while(current <= total){
    var b = (current).toString(2);
    var r = parsePermutationEntry(b, group);
    result[r.numberOfTrue].push(r.result);
    current++;
  }
  return result;
}

function parsePermutationEntry(binaryString, groupSize){
  var count = 0;
  var result = [];
  //var s = binaryString.reverse();
  for(var i = 0; i < groupSize; i++){
    result[i] = false;
    if(i < binaryString.length && binaryString.charAt(binaryString.length -1 - i) === '1'){
      count++;
      result[i] = true;
    }
  }
  return { numberOfTrue:count, result:result };
}

function generateNotes(generator){
  if(generator.permutations ===  null){
    return;
  }

  // var noteCount = 0;
  var notes = [];
  // var permOut = 0;
  // var permInner = -1;
  for(var i = 0; i < generator.permutations.length; i++){
    for(var j = 0; j < generator.permutations[i].length; j++){
      notes = notes.concat(generator.generate(generator.permutations[i][j]));
    }
    // permInner++;
    // if(permInner === generator.permutations[permOut].length){
    //   permInner = 0;
    //   permOut++;
    //   if(permOut === generator.permutations.length){
    //     break;
    //   }
    // }
    // noteCount += notes.length;
  }
  console.log(notes);
  for(var i = 0, b = -1; i < notes.length; i++){
    if(i % NOTES_PER_BAR === 0){
      b++;
      bars[b] = [];
    }
    bars[b].push(notes[i]);
  }
}

function drawNotes(){
  var x = scale.canvas.paddingLeft;
  var y = scale.canvas.paddingTop;
  console.log(bars);
  for(var i = 0; i < bars.length && i < scale.barsPerLine * scale.linesPerPage; ){
    for(var j = 0; j < bars[i].length; j++){
      console.log('Drawing note');
      drawNote(x, y, bars[i][j]);
      x += scale.note.width;
    }
    i++;
    if(i % scale.barsPerLine === 0){
      x = scale.canvas.paddingLeft;
      y = calculateNextStart(y);
    }
  }
}

function drawNote(x, y, note){
  if(note.accent){
    drawAccent(x, y);
  }

  if(note.sticking != sticking.none){
    drawSticking(x, y, note.sticking);
  }
}

function drawAccent(x, y){
  var box = scale.note.accentBox(x, y);
  console.log('accent, b: ');
  console.log(box);
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(box.right, box.top);
  ctx.lineTo(box.left, (box.top + box.bottom) / 2);
  ctx.lineTo(box.right, box.bottom);
  ctx.stroke();
  ctx.closePath();
}

function drawSticking(x, y, stick){
  var box = scale.note.stickingBox(x, y);
  var text = (stick === sticking.R) ? 'R' : 'L';
  console.log('sticking, b: ');
  console.log(box);
  console.log(typeof(box.top));

  ctx.fillStyle = "#000000";
  //ctx.font = "bold 16px Arial";
  ctx.textAlign = 'center';
  ctx.fillText(text, (box.left + box.right )/2, (box.top + box.bottom)/2, scale.note.width);
  console.log(text + ' ' + (box.left + box.right )/2 + ' ' + (box.top + box.bottom)/2 + ' ' + scale.note.width)
}

function defaultPaint(){
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = '#000000';

  var x = scale.canvas.paddingLeft;
  var y = scale.canvas.paddingTop;
  for(var lineCount = 0; lineCount < scale.linesPerPage; lineCount++){
    drawLine(x, y);
    drawBarLines(x, y);
    y = calculateNextStart(y);
  }
}

function drawLine(x, y){
  var xEnd = x + scale.line.width;
  ctx.beginPath();
  y = y + scale.bar.starts.visibleLine;
  for(var i = 0; i < scale.bar.numberOfLines; i++){
    ctx.moveTo(x, y);
    ctx.lineTo(xEnd, y);
    y += scale.bar.lineSpacing * 2;
  }
  console.log('end line y: ' + y);
  ctx.stroke();
  ctx.closePath();
}

function drawBarLines(x, y){
  var yStart = y + scale.bar.starts.visibleLine;
  var yEnd = y + scale.bar.ends.visibleLine;
  console.log('s: ' + yStart + ' e: ' + yEnd);
  ctx.beginPath();
  for(var i = 0; i <= scale.barsPerLine; i++){
    ctx.moveTo(x, yStart);
    ctx.lineTo(x, yEnd);
    x += scale.bar.width;
  }
  ctx.stroke();
  ctx.closePath();
}

function calculateNextStart(y){
  return y + scale.line.height + scale.line.padding;
}

/*
Note guide
scale.line.height = scale.bar.fontSize * 2 + scale.bar.lineSpacing * 14;  //(scale.canvas.height - (2 * scale.canvas.paddingTop)) / scale.linesPerPage;
scale.bar.topLine = (scale.bar.fontSize) + (scale.bar.lineSpacing * 4);
scale.bar.bottomLine = scale.bar.topLine + (scale.bar.lineSpacing * 8);
x = fontSize, y = lineSpacing
space:y
accent:f
hiddenLine:y
hiddenLine:y
hiddenLine:y
line:y
hiddenLine:y
line:y
hiddenLine:y
line:y
hiddenLine:y
line:y
hiddenLine:y
line:y
hiddenLine:y
sticking:f
*/
