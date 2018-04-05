let unsortedArray = [],	
	start = document.getElementById('start'),
	container = document.getElementById('container');
	begin = document.getElementById('begin'),
	timer = 0;

function fillNumberArray(number) {

	for (let i = 0; i < number; i++) {
		unsortedArray.push(Math.floor(Math.random()*101))
	}
};

function stateLine(elem, className, value, place) {
	let newArr = document.createElement(elem);
		newArr.innerHTML = `${value}`;
		newArr.setAttribute('class', className);
		place.appendChild(newArr);
}

function sortArrayByMerge (sortIt) {

	if (sortIt.length === 0){ 
		timer -= 2000;
		return "Nothing to sort";
	};	
	if (sortIt.length === 1) {		
		return sortIt;
	};
	
	let center = Math.floor(sortIt.length / 2),
		left = sortIt.slice(0, center),
		right = sortIt.slice(center);

	timer += 2000;
	setTimeout(function() {
		stateLine('span', 'regular', sortIt, container)
	}, timer);

	timer += 2000;
	setTimeout(function() {
		if(left.length === 1 && right.length === 1) {
			let span = document.getElementById('container').getElementsByClassName('regular')[0];
			container.removeChild(span);
			let forDivision = document.createElement('div');
			forDivision.setAttribute('class', 'sortingUnits');
			stateLine('span', 'unit', left, forDivision);
			stateLine('span', 'unit', right, forDivision);
			container.appendChild(forDivision)
		} else if (left.length === 1) {
			let span = document.getElementById('container').getElementsByClassName('regular')[0];
			container.removeChild(span);
			let forDivision = document.createElement('div');
			forDivision.setAttribute('class', 'inSortingProcess');
			stateLine('span', 'green', left, forDivision);
			stateLine('span', 'forSorting', right, forDivision);
			container.appendChild(forDivision)
		} else{
			let span = document.getElementById('container').getElementsByClassName('regular')[0];
			container.removeChild(span);
			let forDivision = document.createElement('div');
			forDivision.setAttribute('class', 'inSortingProcess');
			stateLine('span', 'forSorting', left, forDivision);
			stateLine('span', 'separ', right, forDivision);
			container.appendChild(forDivision)
		}
	}, timer);
	timer += 2000;
	setTimeout(function() {
		if (left.length !==1) stateLine('div', 'yellow', left, container);
		else if (left.length ==1 && right.length !== 1) stateLine('div', 'yellow', right, container);
	}, timer);	

	return merge(sortArrayByMerge(left), sortArrayByMerge(right));
}


function merge (a, b) {

	let commonMerge = [],
		aIndex = 0,
		bIndex = 0;

	timer += 2000;
	setTimeout(function() {
		if (a.length != 1 && b.length != 1) {
			stateLine('span', 'unit', a, container);
			stateLine('span', 'unit', b, container);
		} else if (a.length == 1 && b.length != 1) {
			stateLine('span', 'unit', a, container);
			stateLine('span', 'unit', b, container);
		} else if (a.length != 1 && b.length == 1) {
			stateLine('span', 'unit', a, container);
			stateLine('span', 'unit', b, container);
		}
	}, timer);
	while (aIndex < a.length && bIndex < b.length) {		
		if (a[aIndex] < b[bIndex]) {
			commonMerge.push(a[aIndex]);
			aIndex++;
		} else {
			commonMerge.push(b[bIndex]);
			bIndex++;
		}
	};

	if (aIndex === a.length) {
		commonMerge = commonMerge.concat(b.slice(bIndex));
	} else {		
		commonMerge = commonMerge.concat(a.slice(aIndex));
	}

	if (a.length == 1 && b.length == 1) {
		timer += 2000;
	setTimeout(function() {		
		let unsorted = document.getElementsByClassName('sortingUnits');
		let last = unsorted[unsorted.length - 1];
			container.removeChild(last);
			stateLine('div', 'target', commonMerge, container);
		}, timer);
		timer += 2000;
	setTimeout(function() {
		let unsorted = document.getElementsByClassName('yellow');
		let last = unsorted[unsorted.length - 1];
		container.removeChild(last);
	}, timer);
	timer += 2000;
	setTimeout(function() {
		let target = container.getElementsByClassName('target');
		let oldest = target[target.length - 1];
		container.removeChild(oldest);
		let unsorted = document.getElementsByClassName('inSortingProcess');
		let last = unsorted[unsorted.length - 1].getElementsByClassName('forSorting')[0];
		last.innerHTML = `${commonMerge}`;
		last.setAttribute('class', 'green');
	}, timer);

	timer += 2000;
	setTimeout(function() {
		let last = document.getElementsByClassName('inSortingProcess');

		if (last[last.length - 1].getElementsByClassName('separ').length === 1) {
			let unsorted = document.getElementsByClassName('separ');
			let red = unsorted[unsorted.length - 1];
			red.setAttribute('class', 'forSorting');
		}
	}, timer);

	timer += 2000;
	setTimeout(function() {
		let last = document.getElementsByClassName('inSortingProcess');
		if (last[last.length - 1].getElementsByClassName('forSorting').length === 1) {
			let node = document.getElementsByClassName('forSorting');
			let value = node[node.length - 1].innerText;
			stateLine('div', 'yellow', value, container);
		}
	}, timer);
		
	} else {
		timer += 2000;
		setTimeout(function() {
			stateLine('div', 'target', commonMerge, container);
		}, timer)

		timer += 2000;
		setTimeout(function() {
			let spans = document.getElementsByClassName('unit');
			container.removeChild(spans[0]);
			container.removeChild(spans[0]);
		}, timer)

		timer += 2000;
		setTimeout(function() {
			let sortingGreen = document.getElementsByClassName('inSortingProcess');
			let howManyGreen = sortingGreen[sortingGreen.length - 1].getElementsByClassName('green').length;

			if (howManyGreen === 2) {
				container.removeChild(sortingGreen[sortingGreen.length - 1]);
			}
		}, timer)


		timer += 2000;
		setTimeout(function() {
			let yellow = document.getElementsByClassName('yellow');
			let last = yellow[yellow.length - 1];
			container.removeChild(last);
		}, timer)

		timer += 2000;
		setTimeout(function() {
			let sortingGreen = document.getElementsByClassName('inSortingProcess');
			let howManyGreen = sortingGreen[sortingGreen.length - 1].getElementsByClassName('green').length;

			if (howManyGreen == 1 ) {
				let red = sortingGreen[sortingGreen.length - 1];
				let green = red.getElementsByClassName('forSorting')[0];
				green.setAttribute('class', 'green');
				green.innerHTML = commonMerge;
				let target = document.getElementsByClassName('target');
				container.removeChild(target[target.length -1])
			}
		}, timer)

		timer += 2000;
		setTimeout(function() {
			let last = document.getElementsByClassName('inSortingProcess');

			if (last[last.length - 1].getElementsByClassName('separ').length === 1) {
				let unsorted = document.getElementsByClassName('forSorting');
				let red = unsorted[0];
				let greenF = document.getElementsByClassName('separ')[0];
				red.setAttribute('class', 'green');
				red.innerHTML = commonMerge;
				greenF.setAttribute('class', 'forSorting');
				stateLine('div', 'yellow', greenF.innerText, container);
				container.removeChild(document.getElementsByClassName('target')[document.getElementsByClassName('target').length -1])
			}
		}, timer);
	}	
	return commonMerge;
};


fillNumberArray(10);
begin.innerText = unsortedArray;

start.addEventListener('click', function(){sortArrayByMerge(unsortedArray)});