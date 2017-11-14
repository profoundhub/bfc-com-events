'use_strict'

var animationNumbers = false;

$(document).ready(function(){
	$('.numbers .circle').css({'transform': 'scale(0.2,0.2)', '-ms-transform': 'scale(0.2,0.2)', '-webkit-transform': 'scale(0.2,0.2)'});
});

$(window).scroll(function(){
	if($(window).scrollTop()+$(window).height()-400 > $('.numbers').offset().top && !animationNumbers){
		reloadNumberEffect();
		animationNumbers = true;
	}
});

function reloadNumberEffect(){
	var scaleAnimation = function(){
		$(this).css({ "transform": "scale(1, 1)", "-webkit-transform": "scale(1, 1)", "-moz-transform": "scale(1, 1)", "-ms-transform": "scale(1, 1)" });
	}
	$('.numbers .circle').each(scaleAnimation);
}