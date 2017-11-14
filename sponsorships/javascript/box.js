if (!$.support.transition)
	$.fn.transition = $.fn.animate;


$(window).load(function(){

    //initBox();

	$('.box .menu ul li').on('click', function(){

		currentIndex = $(this).parent().find('.select').index();
		newIndex = $(this).index();

		if (currentIndex == newIndex ) return ;

		transitionElement(currentIndex, newIndex, $(this));
	});

	$('.box .arrowslider-left').on('click', function(){

		currentIndex = $(this).parents('.box').find('.menu ul li').not('.hidden').index($(this).parents('.box').find('.menu ul li.select'));

		if (currentIndex-1 < 0) return;

		truePosition = $(this).parents('.box').find('.menu ul li.select').index();

		/*if (truePosition != currentIndex) {
			newPosition = truePosition - 2 ;
		}else{
			newPosition = truePosition - 1 ;
		}*/
		newPosition = $(this).parents('.box').find('.menu ul li').index($(this).parents('.box').find('.menu ul li').not('.hidden').eq(currentIndex-1));

		transitionElement(truePosition, newPosition, $(this));
	});
	$('.box .arrowslider-right').on('click', function(){

		currentIndex = $(this).parents('.box').find('.menu ul li').not('.hidden').index($(this).parents('.box').find('.menu ul li.select'));
		maxItem =  $(this).parents(".box").find('.menu ul li').not('.hidden').length;

		if (currentIndex+1 >= maxItem) return;

		truePosition = $(this).parents('.box').find('.menu ul li.select').index();
		if ( $(this).parents('.box').find('.menu ul li').eq(truePosition+1).hasClass('hidden')) {
			newPosition = truePosition + 2 ;
		}else{
			newPosition = truePosition + 1 ;
		}

		transitionElement(truePosition,newPosition, $(this));

	});

});

$(window).resize(function(){
	 //initBox();
});

function transitionElement(currentIndex , newIndex, obj){

	box = obj.parents(".box");

	box.find('.menu ul li').eq(currentIndex).removeClass('select color-one').addClass('color-content');
	box.find('.menu ul li').eq(newIndex).addClass('select color-one').removeClass('color-content');

	box.find('.control .panel ul li').eq(currentIndex).removeClass('select');
	box.find('.control .panel ul li').eq(newIndex).addClass('select');

	currentElement = box.find('.element').eq(currentIndex);
	newElement = box.find('.element').eq(newIndex);

	currentElement.css('position','absolute');
	currentElement.css('top',box.find('.menu').outerHeight()+62);
	newElement.css('position','absolute');
	newElement.css('top',box.find('.menu').outerHeight()+62);

	newElement.transition({x:500,opacity:0},0);

	newElement.css('display','block');

	newElement.transition({x:0,opacity:1},500,function(){
		$(this).css('position','relative');
		$(this).css('top','0');
	});

	currentElement.transition({x:1000,opacity:0},500,function(){
		$(this).css('display','none');
		$(this).css('position','relative');
		$(this).css('top','0');
		$('.box').css('width','auto');
	});

	initMasonry();

	box.find('.elements').transition({ 'height':newElement.height()},250);

}

function initBox(){
	$('.box').each(function(){
			$(this).find('.menu ul li').removeClass('select');
			$(this).find('.menu ul li').not('.hidden').eq(0).addClass('select');
			$(this).find('.element').hide();
			$(this).find('.element').not('.hidden').eq(0).show();

	});
}