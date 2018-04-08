const uri = 'http://www.nbrb.by/API/';
const calendarTo = $('#to');
const calendarFrom = $('#from');

//valid date
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1; //January is 0!
let yyyy = today.getFullYear();
 	if(dd<10){
    	dd='0'+dd
   	} 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy + '-' + mm + '-' + dd;

calendarTo.attr("value", today);
calendarTo.attr("max", today);
calendarFrom.attr("max", today);

let selectCurrency,
	fromDate,
	toDate,
	allCurrency;


//canvasStyle
const canvas = document.getElementById("canvas");
let w = canvas.width,
	h = canvas.height;

let schedule = canvas.getContext("2d");
	schedule.lineWidth = 2;

let point = 1,
	gap = 10,
	zeroX = w - gap - schedule.lineWidth,
	zeroY = h - gap - schedule.lineWidth,
	colorOne = 'orange',
	colorTwo = 'darkcyan';

let	prevY = 0,
	days = 0,
	prevRate = 0,
	minrate = 0,
	step = (w - gap - schedule.lineWidth - 10),
	maxCurrensyRate = 1,
	currencyStep = (h - gap - schedule.lineWidth - 40);


$(document).ready(function() {
	selectCurrency = +$('#currency').val();
	toDate = $('#to').val();
	ratetoday();    
});

$('#currency').on('change', setValue);
$('#from').on('change', setFromDate);
$('#to').on('change', setToDate);
$('#get').on('click', getCurrency);

function setValue() {
	selectCurrency =  +$('#currency').val();
	ratetoday();
};

function setFromDate() {
	fromDate = $('#from').val();
};

function setToDate() {
	toDate = $('#to').val();
};

function getCurrency() {
	if (toDate < fromDate || toDate == fromDate || fromDate === undefined) {
		$('#calendarError').css('display', 'block');
		setTimeout(function() {
			$('#calendarError').css('display', 'none');
		}, 2000)
	} else {
		$.getJSON(uri + 'ExRates/Rates/Dynamics/' + selectCurrency, { 'startDate': fromDate, 'endDate': toDate })
    	    .done(function (data) {               	
	    	    	emptyForNewCurrency();
	    	    	//emptyForSecondCurrency();
	    	    	$.each(data, (key, item) => {
						let full = item.Cur_OfficialRate * 10000 + '';
						let newC = full.split('.')[0];
	
						if (minrate === 0 ) minrate = +newC.slice(0, 2);
	
						if (+newC.slice(0, 2) < minrate) minrate = +newC.slice(0, 2);
	    	        })
	
    	    	$.each(data, (key, item) => {
    	    		days = data.length;
    	    		if (getPropCurrancy(item.Cur_OfficialRate) > maxCurrensyRate) maxCurrensyRate = getPropCurrancy(item.Cur_OfficialRate);
    	        })
    	        $.each(data, (key, item) => drawShedule(key, item))
    	    }).fail(function (err) {
    	        alert('ошибка');
    	});
	}

	
}

function ratetoday() {
    $.getJSON(uri + 'ExRates/Rates/' + selectCurrency, { 'ParamMode': 0 })
        .done(function (data) {
            $('#rateToday').text(`It is ${data.Cur_OfficialRate} BN for ${data.Cur_Scale} ${data.Cur_Abbreviation} today`);
            //$('#rateToday').text(`It is ${JSON.stringify(data)} for today`);
        }).fail(function (err) {
            alert('ошибка');
    });
};


function emptyForNewCurrency() {
	schedule.clearRect(0, 0, w, h);
	drawArrows();
	prevY = 0;
	prevRate = 0;	
	maxCurrensyRate = 1;
	minrate = 0;
};

function emptyForSecondCurrency() {	
	prevY = 0;
	maxCurrensyRate = 0;
	colorOne = 'darkcyan';
};

//draw on canvas

function drawArrows() {
	schedule.strokeStyle = "black";

	line(gap, h, gap, 0);
	line(gap, 0, gap / 2, 7);
	line(gap, 0, gap * 1.5, 7);

	line(0, h - gap, w, h -gap);
	line(w, h - gap, w - gap / 2, h - gap * 1.5);
	line(w, h - gap, w - gap / 2, h - gap / 2);
}

function line (x, y, x1, y1) {
	schedule.beginPath();
	schedule.moveTo(x, y);
	schedule.lineTo(x1, y1);
	schedule.stroke();
}

drawArrows();

function getPropCurrancy(currency) {
	let full = currency * 10000 + '';
	newC = full.split('.')[0];

	if (newC.slice(0, 2) > minrate) {
		return +newC.slice(-3) + (newC.slice(0, 2) - minrate)*1000;
	} else {
		return +newC.slice(-3);
	}
}

function drawShedule(key, item) {
	let b,
		yStep = currencyStep/ maxCurrensyRate;
	let curr = getPropCurrancy(item.Cur_OfficialRate);

	if(key === 0) {
		b = 1;
		prevY = curr
	} else {b = key};

    schedulePoint(step / days  * (key + 1), curr * yStep, "black");
    scheduleLine(step / days * b, prevY * yStep, step / days * (key + 1), curr * yStep, colorOne);
    prevY =  curr;
}

function schedulePoint (x, y, color) {
	schedule.fillStyle = color;

	schedule.beginPath();
	schedule.arc(gap + x, h - gap - y, point, 0, Math.PI * 2);
	schedule.fill();
}

function scheduleLine (moveFromX, moveFromY, moveToX, moveToY, color) {
	schedule.strokeStyle = color;

	schedule.beginPath();
	schedule.moveTo(gap + moveFromX, h - gap - moveFromY);
	schedule.lineTo(gap + moveToX, h - gap - moveToY);
	schedule.stroke();
}
