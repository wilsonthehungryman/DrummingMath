'use strict';

// ------------ (global) Objects ------------------

// the canvas dom object
var canvas;
var canvasHeight;
var canvasWidth;
// the canvas drawing context
var ctx;
// the bars array (Which contains notes)
var bars;

// will be changed later (time signatures)
const NOTES_PER_BAR = 8;

// This object contains math and values for drawing on the canvas,
// it's the structure that controls the layout
// It's called scale because the entire structure scales/descales based on input (see init)
var scale = {
    //usr set
    linesPerPage:0,// = 8;
    barsPerLine:0,// = 4;

    canvas: {
        // usr set
        width:0,
        height:0,
        paddingLeft:0,
        paddingTop:0,
        // derived
        pageHeight:0
    },

    line: {
        // calc
        width:0,
        height:0,
        padding:0
    },

    bar: {
        //calc
        // actually the same as line.
        width:0,
        height:0,
        // usr set
        fontSize:0,
        accentSize:0,
        lineSpacing:0,

        starts:{
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

// enum structure
var sticking = {
    R:1,
    L:2,
    N:0,
    None:0
}



// represents a note, will likely be exapanded upon
function Note(){
    return {
        accent:false,
        position:0,
        sticking:sticking.none
    };
}

// ----------- Setup/calibration --------------------

// kick off
$(document).ready(function(){
    console.log('ok');
    if($('#disclaimer').length === 0){
        rewriteLinks();
    }
    let url = document.URL;
    if(url.includes('index')){
        return;
    }else if(url.includes('accents')){
        setActiveMenuItem('menuAccent');
        setActiveFormTab('formAccent');
    } else {
        setActiveMenuItem('menuBlankManuscript');
        setActiveFormTab('formPage');
    }
    canvas = $('#canvas')[0];
    canvasHeight = $('#canvasHeight')[0];
    canvasWidth = $('#canvasWidth')[0];
    bars = [];
    // only do stuff if there is a canvas
    if($('#canvas').length > 0){
        change();
    }
});

function setActiveMenuItem(id){
    $('#' + id).addClass('active');
}

function setActiveFormTab(id){
    $('#' + id).addClass('active show');
}

function hideDisclaimer(){
    $('#disclaimer')[0].style.display = 'none';
    rewriteLinks();
}

function rewriteLinks(){
    $('.navbar-link').each(function() {
        console.log(this.href);
        this.href = this.href.replace(/\?d=\d$/, '');
        console.log("a:" + this.href);
    });
}

function zoom(val){
    let diff = (val === 'plus') ? 100 : -100;
    canvasWidth.value = scale.canvas.width + diff;
    canvasHeight.value = calcCanvasHeight(scale.canvas.width + diff);
    change();
}

// Change captures all the values from the form.
// when a form value is changed, this is called
function change(){
    // grab values
    scale.canvas.height = parseInt(canvasHeight.value);
    scale.canvas.pageHeight = scale.canvas.height;
    scale.canvas.width = parseInt(canvasWidth.value);

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

// init is where a lot of the magic happens
// Responsible for calculating all the vals the require a calculation
// ex. the line width is the width of the page minus left and right padding
function init(){
    // canvas resize
    canvas.width = scale.canvas.width;
    canvas.height = scale.canvas.height;

    // line width
    scale.line.width    = scale.canvas.width - (2 * scale.canvas.paddingLeft); // ex
    // padding BETWEEN (not above, below, left or right) lines ie bottom of line1 to top of line2
    scale.line.padding = ((scale.canvas.height - (2 * scale.canvas.paddingTop)) - (scale.linesPerPage * scale.line.height)) / scale.linesPerPage; //(scale.canvas.height - (scale.linesPerPage * scale.line.height) - scale.line.height) / (scale.linesPerPage - 1);
    scale.bar.width = scale.line.width / scale.barsPerLine;

    // change (time signatures)
    scale.note.width = scale.bar.width / NOTES_PER_BAR;

    // The way the lines are indexed (2,1,0,-1,-2) this needs to be odd
    if(scale.bar.barNotes % 2 === 0){
        scale.bar.barNotes++;
    }

    // where do the accents start and end? vertically
    scale.bar.starts.accent = 0;
    scale.bar.ends.accent = (scale.bar.accent) ? scale.bar.accentSize : 0;

    // where do the stems start and end? vertically
    scale.bar.starts.stem = scale.bar.ends.accent;
    scale.bar.ends.stem = scale.bar.starts.stem + scale.bar.lineSpacing;

    // where do the lines start and end? vertically
    scale.bar.starts.lines = scale.bar.ends.stem;
    scale.bar.ends.lines = scale.bar.starts.lines + scale.bar.barNotes * scale.bar.lineSpacing;

    // where does the sticking start and end? vertically
    scale.bar.starts.sticking = scale.bar.ends.lines;
    scale.bar.ends.sticking = (scale.bar.sticking) ? scale.bar.starts.sticking + scale.bar.fontSize : scale.bar.starts.sticking;

    // the bar height is the same as where the sticking ends
    scale.bar.height = scale.bar.ends.sticking;

    // this function will return the starting value of a specified line
    scale.bar.starts.line = (i) => {
        // middle is 0 (ie, 2,1,0,-1,-2)
        i = (i - (scale.bar.barNotes / 2 - 0.5)) * -1;
        return scale.bar.starts.lines + scale.bar.lineSpacing * i;
    };

    // this function will return the starting value of a specified line
    scale.bar.ends.line = (i) => {
        // middle is 0 (ie, 2,1,0,-1,-2)
        i = (i - (scale.bar.barNotes / 2 - 0.5)) * -1;
        return scale.bar.starts.lines + scale.bar.lineSpacing * (i + 1);
    };

    // The actual bar line should be in the middle of the vertical space,
    // not on the upper or lower bounds
    // this function calculates that
    scale.bar.actualLineLocation = (i) => {
        i = (i - (scale.bar.barNotes / 2 - 0.5)) * -1;
        return scale.bar.starts.lines + scale.bar.lineSpacing * i + scale.bar.lineSpacing * 0.5;
    };

    // visible lines are used when drawing the bar lines (don't draw spaces)
    scale.bar.starts.visibleLine = scale.bar.actualLineLocation(scale.bar.numberOfLines * 2 -1 - scale.bar.numberOfLines); //scale.bar.numberOfLines / 2 - 0.5);
    scale.bar.ends.visibleLine = scale.bar.actualLineLocation(1 - scale.bar.numberOfLines);

    // the canvas drawing context
    ctx = canvas.getContext('2d');

    // possibly needs to be changed
    // figures out the size to draw stickings
    var px = scale.bar.fontSize;
    ctx.font = "bold " + px + 'px Arial'

    // draw!
    paintPages();
    if(bars.length > 0){
        drawNotes();
    }
}

// returns a box in which to draw accents
function absoluteAccentBox(x, y){
    return { left:x, top:y + scale.bar.starts.accent, right:x+scale.note.width, bottom:y + scale.bar.ends.accent};
}

// returns a box in which to draw accents
// adjusted to draw a smaller accent (will be properly scaled later)
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

// returns a box in which to draw the stems of notes
function absoluteStemBox(x, y){
    return { left:x, top:y + scale.bar.starts.stem, right:x+scale.note.width, bottom:y + scale.bar.ends.stem};
}

// returns a box in which to draw the sticking for a note
function absoluteStickingBox(x, y){
    return { left:x, top:y + scale.bar.starts.sticking, right:x+scale.note.width, bottom:y + scale.bar.ends.sticking};
}

// returns a box in which to draw a notehead
// takes a note index to return right location (0 == middle)
function absoluteNoteBox(x, y, i){
    return { left:x, top:y + scale.bar.starts.line(i), right:x+scale.note.width, bottom:y + scale.bar.ends.line(i)};
}

// ------------------ Accent generation ----------------------

function generateAccentsClick(){
    console.log('fired');
    generateAccents($('#rudimentSelect')[0].value);
}

// Will generate accents for a rudiment, will be expanded to take any sticking
function generateAccents(rudiment){
    bars = [];
    let generator;

    // create a generator based on the rudiment
    switch(rudiment){
        case 'paradidle':
            generator = createGenerator(4, [sticking.R,sticking.L,sticking.R,sticking.R,sticking.L,sticking.R,sticking.L,sticking.L]);
            break;
        case 'double':
            generator = createGenerator(4, [sticking.R,sticking.R,sticking.L,sticking.L,sticking.R,sticking.R,sticking.L,sticking.L]);
            break;
        case 'doubleParadidle':
            generator = createGenerator(6, [sticking.R,sticking.L,sticking.R,sticking.L,sticking.R,sticking.R,sticking.L,sticking.R,sticking.L,sticking.R,sticking.L,sticking.L]);
            break;
        default:
            console.log('default');
            return;
    }

    // generate the actual notes
    generateNotes(generator);
    drawNotes();
}

// Generator generator, it generates generation, uses generation to generate help in generation
// generates combinations, then returns a (note)generator object
function createGenerator(group, stickingArray){
    // calc accents groups, may be revised to be pregenerated (combinations are relativly static)
    var accentGroups = generateCombinations(group);
    // return the object
    return {
        stickingArray:stickingArray,
        // the payload, will be called to create a new set of notes
        generate:function(perm){
            let notes = [];
            totalNotes:(2 ** group - 1);
            for(var i = 0, j = perm.length; i < perm.length; i++, j++){
                notes[i] = new Note();
                notes[i].accent = perm[i];
                notes[i].sticking = this.stickingArray[i];
            }
            if(this.stickingArray.length > perm.length){
                for(var i = 0; i < perm.length; i++){
                    let j = i + perm.length;
                    notes[j] = new Note();
                    notes[j].accent = perm[i];
                    notes[j].sticking = this.stickingArray[j];
                }
                this.totalNotes = this.totalNotes * 2;
            }
            return notes;
        },
        // the source to iterate through
        combinations:accentGroups
    };
}

// generates the combinations for a group, uses binary
function generateCombinations(group){
    var result = [];
    // set up sub groups
    for(var i = 0; i <= group; i++){
        result[i] = [];
    }
    let total = 2 ** group - 1;
    // the binary number
    let current = 0;
    while(current <= total){
        // to binary
        let b = (current).toString(2);
        // parse the binary
        let r = parsePermutationEntry(b, group);
        // add the combination to the right group
        result[r.numberOfTrue].push(r.result);
        // next number
        current++;
    }
    return result;
}

// this will parse a binary string
// returns a combination of trues and falses
function parsePermutationEntry(binaryString, groupSize){
    let count = 0;
    let result = [];
    for(var i = 0; i < groupSize; i++){
        result[i] = false;
        // check length (may be shorter than the groupsize)
        // if a 1, mark as true
        if(i < binaryString.length && binaryString.charAt(binaryString.length -1 - i) === '1'){
            count++;
            result[i] = true;
        }
    }
    return { numberOfTrue:count, result:result };
}

// Generates the actual notes and pushes them into bar(s)
function generateNotes(generator){
    if(generator.combinations === null){
        return;
    }

    let notes = [];
    // generate all the notes
    for(var i = 0; i < generator.combinations.length; i++){
        for(var j = 0; j < generator.combinations[i].length; j++){
            notes = notes.concat(generator.generate(generator.combinations[i][j]));
        }
    }

    // push the notes into their respective bar
    for(var i = 0, b = -1; i < notes.length; i++){
        if(i % NOTES_PER_BAR === 0){
            b++;
            bars[b] = [];
        }
        bars[b].push(notes[i]);
    }
}

// ----------------- Note painting ----------------

// this iterate through the notes and draw each one
function drawNotes(){
    // reapaint the pages (there are now more less total pages)
    paintPages();

    // start position
    var x = scale.canvas.paddingLeft;
    var y = scale.canvas.paddingTop;

    // i for bar
    for(var i = 0; i < bars.length;){
        // j for note inside bar
        for(var j = 0; j < bars[i].length; j++){
            drawNote(x, y, bars[i][j]);
            x += scale.note.width;
        }
        i++;
        // if this is the end of the line, reset x
        if(i % scale.barsPerLine === 0){
            x = scale.canvas.paddingLeft;
            // if this is also the end of the page, move to the next page
            if(i % (scale.barsPerLine * scale.linesPerPage) === 0){
                y = i / (scale.barsPerLine * scale.linesPerPage) * scale.canvas.pageHeight + scale.canvas.paddingTop; //calculateNextStart(y, true);
            } else{
                // otherwise just calculate the start of the next line
                y = calculateNextStart(y);
            }
        }
    }
}

// Draw a single note
function drawNote(x, y, note){
    ctx.fillStyle = '#000000'; // black
    // draw the accent if it has one
    if(note.accent){
        drawAccent(x, y);
    }

    // draw the sticking if it has one
    if(note.sticking != sticking.none){
        drawSticking(x, y, note.sticking);
    }

    // revise for multiple noteheads on a note
    // the actual note head box
    let box = absoluteNoteBox(x, y, note.position);
    ctx.beginPath();
    // find center
    let xCenter = (box.left + box.right)/2;
    let yCenter = (box.top + box.bottom)/2;
    // revise (user input?)
    // calc radius
    let radius = (box.right - box.left)/2 * 0.60;
    // draw the actual head
    ctx.arc(xCenter, yCenter, radius, 0, 2*Math.PI);
    ctx.fill();
    // draw the up stem
    ctx.moveTo(xCenter + radius/2, yCenter);
    let stemBox = absoluteStemBox(x, y);
    let yMiddle = (stemBox.top + stemBox.bottom) / 2;
    ctx.lineTo(xCenter + radius/2, yMiddle)
    ctx.stroke();
    ctx.closePath();
}

// draws an accent
function drawAccent(x, y){
    let box = absoluteAccentBoxAdjusted(x, y);
    ctx.beginPath();
    ctx.moveTo(box.right, box.top);
    ctx.lineTo(box.left, (box.top + box.bottom) / 2);
    ctx.lineTo(box.right, box.bottom);
    ctx.stroke();
    ctx.closePath();
}

// draws a sticking
function drawSticking(x, y, stick){
    let box = absoluteStickingBox(x, y);
    let text = (stick === sticking.R) ? 'R' : 'L';

    ctx.textAlign = 'center';
    ctx.fillText(text, (box.left + box.right )/2, (box.top + box.bottom)/2, scale.note.width);
}

// -------------- Background/manuscript paint --------------------

// paint the 'background', the actual manuscript
function paintPages(){
    // figure out the number of pages
    let pages = 1;
    while(bars.length > scale.barsPerLine * scale.linesPerPage * pages){
        pages++;
    }
    canvas.height = scale.canvas.pageHeight * pages;
    let y = 0;
    while(pages > 0){
        // paint the actual page
        paintPage(0, y);
        y += scale.canvas.pageHeight;
        // paint a page line
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(scale.canvas.width, y);
        ctx.stroke();
        ctx.closePath();
        pages--;
    }
}

// paint an actual page
function paintPage(x, y){
    // paint white background
    ctx.fillStyle = '#FFFFFF'; // white
    ctx.fillRect(x, y, scale.canvas.width, scale.canvas.pageHeight);
    ctx.fillStyle = '#000000'; //black

    x += scale.canvas.paddingLeft;
    y += scale.canvas.paddingTop;
    // draw each line
    for(var lineCount = 0; lineCount < scale.linesPerPage; lineCount++){
        drawLine(x, y);
        drawBarLines(x, y);
        y = calculateNextStart(y);
    }
}

// this draws the horizontal lines (no bar lines)
function drawLine(x, y){
    let xEnd = x + scale.line.width;
    ctx.beginPath();
    // We only want to print visible lines
    y += scale.bar.starts.visibleLine;
    // loops through drawing a line each time
    for(var i = 0; i < scale.bar.numberOfLines; i++){
        ctx.moveTo(x, y);
        ctx.lineTo(xEnd, y);
        y += scale.bar.lineSpacing * 2;
    }
    ctx.stroke();
    ctx.closePath();
}

// this draws the vertical bar lines
function drawBarLines(x, y){
    let yStart = y + scale.bar.starts.visibleLine;
    let yEnd = y + scale.bar.ends.visibleLine;
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

function calcCanvasHeight(width){
    // sqr root of 2
    let r = 1.4142135623730950488016887242097;
    return width * r;
}
