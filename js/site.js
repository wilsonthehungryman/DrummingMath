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
    sticking:true,
    accent:true,
    numberOfLines:5,
    actualLineLocation:null
  },

  note: {
    //calc
    width:0,
    height:0,
  }

};

var sticking = {
  R:1,
  L:2,
  N:0,
  None:0
}

function absoluteAccentBox(x, y){
  return { left:x, top:y + scale.bar.starts.accent, right:x+scale.note.width, bottom:y + scale.bar.ends.accent};
}

function absoluteAccentBoxAdjusted(x, y){
  var box = absoluteAccentBox(x, y);
  var width = box.right - box.left;
  var height = box.bottom - box.top;
  var subtract = width * 0.30;
  box.right = box.right - subtract;
  box.left = box.left + subtract;
  box.top = box.top + (height * 0.15);
  return box;
}

function absoluteStemBox(x, y){
  return { left:x, top:y + scale.bar.starts.stem, right:x+scale.note.width, bottom:y + scale.bar.ends.stem};
}

function absoluteStickingBox(x, y){
  return { left:x, top:y + scale.bar.starts.sticking, right:x+scale.note.width, bottom:y + scale.bar.ends.sticking};
}

function absoluteNoteBox(x, y, i){
  return { left:x, top:y + scale.bar.starts.line(i), right:x+scale.note.width, bottom:y + scale.bar.ends.line(i)};
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
  bars = [];
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

  scale.line.width  = scale.canvas.width - (2 * scale.canvas.paddingLeft);
  scale.line.padding = ((scale.canvas.height - (2 * scale.canvas.paddingTop)) - (scale.linesPerPage * scale.line.height)) / (scale.linesPerPage -1); //(scale.canvas.height - (scale.linesPerPage * scale.line.height) - scale.line.height) / (scale.linesPerPage - 1);
  scale.bar.width = scale.line.width / scale.barsPerLine;

  scale.note.width = scale.bar.width / NOTES_PER_BAR;

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

  ctx = canvas.getContext('2d');
  ctx.font = "bold " + px + 'px Arial'
  defaultPaint();
  if(bars.length > 0){
    drawNotes();
  }
}

function generateAccents(){
  paradidlesAccents();
  console.log('Accents generated');
  drawNotes();
}

function paradidlesAccents(){
  var group = 4;
  var accentGroups = generatePermutations(group);

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

function generatePermutations(group){
  var result = [];
  for(var i = 0; i <= group; i++){
    result[i] = [];
  }
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

  var notes = [];
  for(var i = 0; i < generator.permutations.length; i++){
    for(var j = 0; j < generator.permutations[i].length; j++){
      notes = notes.concat(generator.generate(generator.permutations[i][j]));
    }
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

  for(var i = 0; i < bars.length && i < scale.barsPerLine * scale.linesPerPage; ){
    for(var j = 0; j < bars[i].length; j++){
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

  var box = absoluteNoteBox(x, y, note.position);
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  //ctx.moveTo(box.left, box.right);
  var xCenter = (box.left + box.right)/2;
  var yCenter = (box.top + box.bottom)/2;
  var radius = (box.right - box.left)/2 * 0.60;
  ctx.arc(xCenter, yCenter, radius, 0, 2*Math.PI);
  ctx.fill();
  ctx.moveTo(xCenter + radius/2, yCenter);
  var stemBox = absoluteStemBox(x, y);
  var yMiddle = (stemBox.top + stemBox.bottom) / 2;
  ctx.lineTo(xCenter + radius/2, yMiddle)
  ctx.stroke();
  ctx.closePath();

}

function drawAccent(x, y){
  var box = absoluteAccentBoxAdjusted(x, y);
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(box.right, box.top);
  ctx.lineTo(box.left, (box.top + box.bottom) / 2);
  ctx.lineTo(box.right, box.bottom);
  ctx.stroke();
  ctx.closePath();
}

function drawSticking(x, y, stick){
  var box = absoluteStickingBox(x, y);
  var text = (stick === sticking.R) ? 'R' : 'L';

  ctx.fillStyle = "#000000";
  //ctx.font = "bold 16px Arial";
  ctx.textAlign = 'center';
  ctx.fillText(text, (box.left + box.right )/2, (box.top + box.bottom)/2, scale.note.width);
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
  ctx.stroke();
  ctx.closePath();
}

function drawBarLines(x, y){
  var yStart = y + scale.bar.starts.visibleLine;
  var yEnd = y + scale.bar.ends.visibleLine;
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
