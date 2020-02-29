window.onload = function () {

    var particlesJs = require('particles.js');

    var timer;

    var loadBgAnimation = function () {
    	particlesJS.load('background', 'particlesjs-hexagon-config.json', function() {});
    	// particlesJS.load('background', 'particlesjs-lines-config.json', function() {});
    }

    loadBgAnimation();
    
    window.onresize = function () {
    	clearTimeout(timer);
    	timer = setTimeout(loadBgAnimation, 100);
    }

};
