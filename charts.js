// html5, canvas, pie chart, bar chart

window.onload = init;

// GLOBALS
// change rawData numbers and see what happens
// numbers must be >=0
	//var rawData = [250.52, 350.12, 450, 460, 780, 790.11];
	//var rawData = [15, 15, 10, 90, 0, 99.8 ];
	//var rawData = [1.5, 1.25, 1, 2, 2, 2.5 ];
	var rawData = [0.5, 0.25, 0.1, 0.2, 0.2, 0.75 ];
	var angles = []; 
	var bars = [];
	var labels = ["labela1", "labela2", "labela3", "labela4", "labela5", "labela6"];
	var colors = ["#FFDAB9", "#E6E6FA", "#E0FFFF", "#ffffcc", "#ffccff", "#99ffcc"];
	var xAxisMarkers  =  [];	
	const NUMBER_OF_MARKERS = 10;
	
function init() {
	var button1 = document.getElementById("pieChartButton");
	button1.onclick = pieChartHandler;
	var button2 = document.getElementById("barChartButton");
	button2.onclick = barChartHandler;
	drawLabels();
}


/******************** PIE CHART ***********************************/

function calculateAngles() {
	var sum = 0;
	for  (let i = 0; i < rawData.length; i++) {
		sum += rawData[i];
	}
		
	for (let i = 0; i< rawData.length; i++){
		angles[i]=rawData[i]*360/sum;
	}
	console.log(rawData);
	console.log("angles " + angles);
}


function pieChartHandler() {
	console.log("drawing pie chart");	
	calculateAngles();
	var canvas = document.getElementById("pieChartCanvas");
	var context = canvas.getContext("2d");	
	drawPieChart(canvas, context);	
}


function drawPieChart(canvas, context) {
	for (let i = 0; i< angles.length; i++) {
		drawSegment(canvas, context, i);
	}
}

function drawSegment(canvas, context, i) {
	console.log("drawing pie chart segment");	
	//context.save();
	
    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    radius = Math.floor(canvas.width / 2);

    var startingAngle = degreesToRadians(sumTo(angles, i));
    var arcSize = degreesToRadians(angles[i]);
    var endingAngle = startingAngle + arcSize;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, 
                startingAngle, endingAngle, false);
    context.closePath();

    context.fillStyle = colors[i];
    context.fill();

   // context.restore();
   // we first save the context so we can restore it later 
   //(that way, it’s safe to use with other canvas code). 

}


// sums up all elements in array from index 0 to index i
function sumTo(a, i) {
	var sum = 0;
    for (var j = 0; j < i; j++) {
      sum += a[j];
    }
    return sum;
}

function degreesToRadians(degrees) {
	return (degrees * Math.PI)/180;
}


/******************** BAR CHART ***********************************/

// Calculates width of bars in px and sets them in bars global array 
// Each width corresponds to number in rawData global array

// Parameter: canvas width
function calculateBars(width) {	

	var distance = width/NUMBER_OF_MARKERS;
	
	for (let i = 0; i< rawData.length; i++){	
		// distance px is for deltaX, how many px for some other data in rawData[i] 	
		bars[i]=rawData[i]*distance/calculateDeltaX(); 
	}		
	// test
	console.log(rawData);
	console.log("bars " + bars);
}


// Returns number of digits in biggest number in rawData array
function calculateNumberOfDigitsInMax(){
	var max = rawData[0];
	for (let i = 1; i< rawData.length; i++){
		if (rawData[i] > max) {
			max = rawData[i];
		}
	}		
	// number of digits in max 
	let nd = Math.floor(Math.log10(max)) + 1 ; 
	console.log("nd in max =" + nd);	
	return nd;
}


// distance between markers on x axis (0.1 or 1 or 10 or 100 or 1000 or...)
// nd = 0 deltaX = 0.1
// nd = 1 deltaX = 1
// nd = 2 deltaX = 10
// nd = 3 deltaX = 100
// ...
function calculateDeltaX() {
	let nd = calculateNumberOfDigitsInMax();
	let deltaX = Math.pow(10, nd - 1);
	console.log("deltaX = " + deltaX);
	return deltaX;	
}

// drawXAxisMarkers draws vertical lines (markers for x axis)
// calculates and writes markers on x axis (xAxisMarkers)
// Parameters: canvas, context
function drawXAxisMarkers(canvas, context) {		
	let deltaX = calculateDeltaX();		
		
	// NUMBER_OF_MARKERS is 10
	// so distance between markers will be 40 px for 400px canvas width 
	// distance represents number of pixels between x axis markers
	var distance = canvas.width/NUMBER_OF_MARKERS;
	
	for (let x = 0; x < NUMBER_OF_MARKERS; x++) {		
		xAxisMarkers.push((x*deltaX).toFixed(1));  
		//xAxisMarkers.push(x*deltaX); 
	}
	//toFixed (1) Convert a number into a string, keeping only one decimal	
	// This was added because of strange results 
	// x*deltaX = 3*0.1 was not 0.3 but 0.30000000000000004
	
	
	//test
	console.log("xAxisMarkers = " + xAxisMarkers);
	
	for (let i = 0; i < xAxisMarkers.length; i++ ) {
		context.beginPath();
		context.moveTo(i*distance,0);
		context.lineTo(i*distance, canvas.height);
		context.lineWidth = 2;
		context.strokeStyle="#d9d8db";
		context.stroke();
		console.log("x axis marker = " + xAxisMarkers[i]);
		
		context.font="12px Verdana";
		context.strokeStyle = "#000000";
		context.strokeText(xAxisMarkers[i], i*distance, 20);
	}
}

function barChartHandler() {
	console.log("drawing bar chart");		
	var canvas = document.getElementById("barChartCanvas");
	var context = canvas.getContext("2d");	
	calculateBars(canvas.width);	
	
	var barHeight = 30; // wanted bar height
	// if all bars height + one bar height (which is space for x axis and its markers)
	// is bigger than canvas height then calculate new bar height
	// so that all bars are contained within canvas
	if (barHeight*bars.length + barHeight > canvas.height) { 
		barHeight = (canvas.height-barHeight)/bars.length;	
	}
	
	for (let i = 0; i< bars.length; i++) {
		drawBar(canvas, context, i, barHeight);
	}
	drawXAxisMarkers(canvas, context); 		
}

// Parameters: canvas, context, 
// i - index of bar in array bars 
// barHeight - the height of bar in px
// Color for the bar is taken from colors global array
function drawBar(canvas, context, i, barHeight ) {
	var barWidth = bars[i]; 	
	var y = (i+1)*barHeight;		
	context.fillStyle = colors[i];
	context.fillRect(0, y, barWidth, barHeight);	
}

/*********** LEGEND ********************************/
function drawLabels() {
	var table = document.getElementById("labelsTable");
	var tr, td; //  MOZE OVO I LET?
	for (let i = 0; i < labels.length; i++) {
	
		tr = document.createElement("tr");		
		table.appendChild(tr);
		
		td = document.createElement("td");
		td.style.backgroundColor = colors[i];
		tr.appendChild(td);
		
		td = document.createElement("td");	
		td.innerHTML = labels[i];
		tr.appendChild(td);
	}	
}

// var or let?
