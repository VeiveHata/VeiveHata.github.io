window.onload = function () {

	let scrolled;
	let timer;

	document.getElementById("top").onclick = function () {
		scrolled = window.pageYOffset;
		scrollTop();
	}

	function scrollTop() {
		if (scrolled > 0) {
			window.scrollTo(0, scrolled);
			scrolled -= 200;
			timer = setTimeout(scrollTop, 50);
		} else {
			clearTimeout(timer);
			window.scrollTo(0,0);
		}
	}
}