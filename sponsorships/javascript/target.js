function createPieChart(elementId, chartData){
	var chart = new AmCharts.AmPieChart();
	chart.valueField = "percent";
	chart.titleField = "name";
	chart.innerRadius = 71;
	chart.labelsEnabled = false;
	chart.autoMargins = false;
	chart.marginTop = 0;
	chart.marginBottom = 0;
	chart.marginLeft = 0;
	chart.marginRight = 0;
	chart.pullOutRadius = 0;
	chart.startDuration = 0;
	if($('div[jt-section-view="audience"]').hasClass('boomtown')){
		chart.colors = ["#54636d","#f05a28","#b3d0e4", "#8ca3b3"];
	}else if($('div[jt-section-view="audience"]').hasClass('dot')){
		chart.colors = ["#43413e","#fadf1d","#bfab1e", "#b0afad"];
	}else if($('div[jt-section-view="audience"]').hasClass('649b7d')){
		chart.colors = ["#54636d","#649b7d","#b3d0e4", "#8ca3b3"];
	}else{
		chart.colors = ["#54636d","#3aa9e3","#b3d0e4", "#8ca3b3"];
	}
	
	chart.dataProvider = chartData;
	chart.outlineAlpha = 1;
	chart.outlineColor = "#ffffff";
	chart.outlineThickness = 2;
	chart.write(elementId);

	$("#" + elementId + " svg g").last().remove();
}

function reloadGraphTypesMin(){
	var delay = 0;
	var down = function(){
		$(this).delay(delay).animate({ 'width': $(this).attr('alt-value') + '%' }, 400);
		delay += 400;
	}
	$('.types-min .type .gauge .done').css({ 'width': 0 }).each(down);
}

function reloadGraphTypesMed(){
	var delay = 0;
	var down = function(){
		$(this).delay(delay).animate({ 'width': $(this).attr('alt-value') + '%' }, 400);
		delay += 400;
	}
	$('.types-med .type .gauge .done').css({ 'width': 0 }).each(down);
}

function reloadGraphTypesMax(){
	var delay = 0;
	var showDescription = function(){
		$(this).delay(delay).animate({ 'opacity': 1 }, 400);
		delay += 400;
	}
	$('.types-max .type .description').css({ 'opacity': 0 }).each(showDescription);
}

// var animationTarget = false;

// $(document).ready(function(){
// 	$('.donut .show-data ul li').css('opacity', '0');
// 	$('.types-max .type .description').css('opacity','0');
// });

// $(window).scroll(function(){
// 	if ($(window).scrollTop()+$(window).height()-400 > $('.target').offset().top && !animationTarget){

// 		typesMin();
// 		typesMed();
// 		typesMax();
// 		dataDonut();
// 		dataGender();

// 		animationTarget = true;
// 	}
// });
// function dataDonut(){
// 	$('.target .donut .donut-graph').animate({'opacity':'1'},400);
// 	var delay=0;
// 	var showDataDonut=function(){
// 		$(this).delay(delay).animate({'opacity': '1'},400)
// 		delay+=400;
// 	}
// 	$('.donut .show-data ul li').each(showDataDonut);
// }
// function dataGender(){
// 	$('.target .gender .sexe-attendee .big span').each(function(){
// 		$(this).increment(0,$(this).attr('alt-value'));
// 	});
// }

// $.fn.increment = function (from, to, duration, easing, complete) {
//     var params = $.speed(duration, easing, complete);
//     return this.each(function(){
//         var self = this;
//         params.step = function(now) {
//             self.innerText = now << 0;
//         };

//         $({number: from}).animate({number: to}, params);
//     });
// };