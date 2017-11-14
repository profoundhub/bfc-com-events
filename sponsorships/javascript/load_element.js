var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;

var hideClassicMedia = 0;
var hideMedia = 0;
var mansoryIsInit = false;
var keyNumberIsInit = false;

$(window).on("load", function() {
    if (pixelRatio > 1) {
	    $('img.retina').each(function() {
	        $(this).attr('src', $(this).attr('src').replace(".","@2x."));
	    });
    }
});

function printNumber(value){
	var numericValue = Number(value);
	if(isNaN(numericValue)){
		return value;
	}

	if(numericValue < 10000){
		return value;
	}
	else if(numericValue < 1000000){
		return Math.round(value / 1000) + '<span class="small">K</span>';
	}
	else if(numericValue < 10000000){
		return Math.round(value / 1000000) + '<span class="small">M</span>';
	}
	else{
		return Math.round(value / 10000000) + '<span class="small">B</span>';
	}
}


// NEW VERSION 
// function truncNb(Nb, ind) {
//   var _nb = Nb * (Math.pow(10,ind));
//   _nb = Math.floor(_nb);
//   _nb = _nb / (Math.pow(10,ind));
//   return _nb;
// }
// // convert a big number to k,M,G
// function printNumber(val) {
//   var _str = "";
//   if (val >= 1e9)        { _str = truncNb((val/1e9), 1) + ' G';
//   } else if (val >= 1e6) { _str = truncNb((val/1e6), 1) + ' M';
//   } else if (val >= 1e3) { _str = truncNb((val/1e3), 1) + ' k';
//   } else { _str = parseInt(val);
//   }
//   return _str;
// }

function load_event_description(){
}

function load_date_place(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		var mapView = template.find('#map-canvas');
		var center = new google.maps.LatLng(
				templateData.place_lat,
				templateData.place_lng
			);

		var map = new google.maps.Map(mapView[0], {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 15,
			disableDoubleClickZoom: true,
			draggable: false,
			scrollwheel: false,
			center: center
		});

		new google.maps.Marker({
			map: map,
			position: center
	    });

		google.maps.event.trigger(map, 'resize');
		
		if($('p[jt-attr="end"]').text()==$('p[jt-attr="start"]').text() && $('p[jt-attr="end"]').text()==""){
			$('p[jt-attr="end"]').parent().parent().hide();
		}
		
		
		if($('p[jt-attr="end"]').text()==$('p[jt-attr="start"]').text() || $('p[jt-attr="end"]').text()==""){
			$('p[jt-attr="end"]').parent().hide();
		}
		
		template.find('.isEventOnline').hide();
		if(templateData.online=="1"){
			var eventUrlOnline = templateData.onlineurl;
			if(eventUrlOnline.indexOf("http://")==-1){
				eventUrlOnline = "http://"+eventUrlOnline;
			}
			template.find('.isEventOnline').show();
			template.find('.isEventOnline').find("a").attr('href',eventUrlOnline);
		}
		
		if(templateData.name==""){
			$('h6[jt-attr="name"]').parent().parent().hide();
			$('#map-canvas').hide();
		}
		
	}
}

function load_sponsorship_needed(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		var datas = [];
		for(var j in templateData.values){
			datas.push(templateData.values[j] );
		}
		var $sponsorship = $('.sponsorship-needed .sponsorship-needed-packages .sponsorship-needed-package td');
		for(keyArray in datas){
			stringMedia = datas[keyArray];
			switch(stringMedia){
				case "In media":
					$sponsorship.eq(0).addClass('open');
					break;
				case "In kind":
					$sponsorship.eq(3).addClass('open');
					break;
				case "Venue":
					$sponsorship.eq(4).addClass('open');
					break;
				case "Labor":
					$sponsorship.eq(5).addClass('open');
					break;
				case "Food":
					$sponsorship.eq(2).addClass('open');
					break;
				case "Great speakers":
					$sponsorship.eq(6).addClass('open');
					break;
				case "Financial":
					$sponsorship.eq(1).addClass('open');
					if(templateData.start || templateData.end){
						var amountText = '';

						if(templateData.start == 0 && templateData.end == 0){

						}
						else if(templateData.end == 0){
							amountText = '(+ ' + currencyD + formatPrice(new String(templateData.start),currencyD) + currency +')';
						}
						else{
							amountText = '(' + currencyD + formatPrice(new String(templateData.start),currencyD) + currency +' - ' + currencyD + formatPrice(new String(templateData.end),currencyD) + currency +')';
						}

						$sponsorship.find('.cash').text(amountText);
					}
					$sponsorship.find('.sigle').html(currencyD + currency);
					break;
				default:
					console.log('new kind of media');
					break;
			}
		}
		if(datas.length>0){
			for( var iter = 0; iter < datas.length-1; iter++){
				$('.sponsorship-needed .sponsorship-needed-packages .sponsorship-needed-package td.open').eq(iter).addClass('border');
			}
		}
	}
}

function load_attendee_number(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		var amountText = '';

		console.log("load_attendee_number : "+templateData.start);
		if(templateData.start == 0){
			amountText = 'less than ' + templateData.end;
		}
		else if(templateData.end == 0){
			amountText = 'more than ' + templateData.start;
		}else if(templateData.start == "123456789"){
			amountText = templateData.end;
		}
		else{
			amountText = templateData.start + ' - ' + templateData.end;
		}

		template.find('.big').text(amountText);

	}
}

function load_target_audience(containerView, templatesHTML, data){
	data = data[0];

	for(var i in data){
		var templateData = data[i];
		var template = null;
		var numberProperties = count_object_property(templateData.values);
		var graphId = null;

		if(numberProperties <= 4){
			var r = load_target_audience_template_1($(templatesHTML[0]), templateData.values, i);
			template = r[0];
			graphId = r[1];
		}else if(numberProperties <= 6){
			template = load_target_audience_template_2($(templatesHTML[1]), templateData.values);
		}else if(numberProperties <= 8){
			template = load_target_audience_template_3($(templatesHTML[2]), templateData.values);
		}else{
			template = load_target_audience_template_4($(templatesHTML[3]), templateData.values);
		}

		template.find('[jt-attr="name"]').first().text(templateData.name);
		containerView.append(template);

		if(numberProperties <= 4){
			var values = []
			for(var j in templateData.values){
				values.push(templateData.values[j]);
			}

			createPieChart(graphId, values);
		}else if(numberProperties <= 6){
			reloadGraphTypesMin();
		}else if(numberProperties <= 8){
			reloadGraphTypesMed();
		}else{
			reloadGraphTypesMax();
		}
	}
}

function load_target_audience_template_1(template, data, index){
	var colors = ['color-one', 'color-two', 'color-content', 'color-three'];
	var currentColor = 0;

	var subtemplateContainer = template.find('ul');
	var subtemplateHTML = template.find('[jt-subtemplate-view]')[0].outerHTML;
	template.find('[jt-subtemplate-view]').remove();

	for(var i in data){
		var subtemplateData = data[i];
		var subtemplate = $(subtemplateHTML);

		subtemplate.find('[jt-attr="name"]').last().text(subtemplateData.name);
		subtemplate.find('[jt-attr="percent"]').text(subtemplateData.percent + '%');

		subtemplate.addClass(colors[currentColor]);
		currentColor = (currentColor + 1) % colors.length;

		subtemplateContainer.append(subtemplate);
	}

	var graphId = 'target_audience_' + index;
	template.find('.donut-graph').attr('id', graphId);

	return [template, graphId];
}

function load_target_audience_template_2(template, data){
	var colors = ['color-two', 'color-content', 'color-one', 'color-three'];
	var currentColor = 0;

	var subtemplateContainer = template.find('.types-min');
	var subtemplateHTML = template.find('[jt-subtemplate-view]')[0].outerHTML;
	template.find('[jt-subtemplate-view]').remove();

	for(var i in data){
		var subtemplateData = data[i];
		var subtemplate = $(subtemplateHTML);

		subtemplate.find('[jt-attr="name"]').last().text(' ' + subtemplateData.name);
		subtemplate.find('[jt-attr="percent"]').text(subtemplateData.percent + '%');
		subtemplate.find('.done').attr('alt-value', subtemplateData.percent);

		subtemplate.addClass(colors[currentColor]);
		currentColor = (currentColor + 1) % colors.length;

		subtemplateContainer.append(subtemplate);
	}

	return template;
}

function load_target_audience_template_3(template, data){
	var colors = ['color-two', 'color-content', 'color-one', 'color-three'];
	var currentColor = 0;

	var subtemplateContainer = template.find('.types-med');
	var subtemplateHTML = template.find('[jt-subtemplate-view]')[0].outerHTML;
	template.find('[jt-subtemplate-view]').remove();

	for(var i in data){
		var subtemplateData = data[i];
		var subtemplate = $(subtemplateHTML);

		subtemplate.find('[jt-attr="name"]').last().text(subtemplateData.name);
		subtemplate.find('[jt-attr="percent"]').text(subtemplateData.percent + '%');
		subtemplate.find('.done').attr('alt-value', subtemplateData.percent);

		subtemplate.addClass(colors[currentColor]);
		currentColor = (currentColor + 1) % colors.length;

		subtemplateContainer.append(subtemplate);
	}

	return template;
}

function load_target_audience_template_4(template, data){
	var colors = ['color-two', 'color-content', 'color-one', 'color-three'];
	var currentColor = 0;

	var subtemplateContainer = template.find('.types-max');
	var subtemplateHTML = template.find('[jt-subtemplate-view]')[0].outerHTML;
	template.find('[jt-subtemplate-view]').remove();

	for(var i in data){
		var subtemplateData = data[i];
		var subtemplate = $(subtemplateHTML);

		subtemplate.find('[jt-attr="name"]').last().text(subtemplateData.name);
		subtemplate.find('[jt-attr="percent"]').text(subtemplateData.percent + '%');

		subtemplate.addClass(colors[currentColor]);
		currentColor = (currentColor + 1) % colors.length;

		subtemplateContainer.append(subtemplate);
	}

	return template;
}
function get_hostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
    if(!m){
    	m = url.match(/^https:\/\/[^/]+/);
    }
    return m ? m[0] : null;
}
function getImageAjax(obj,url){
	var murl = '/ajax/img.php?w='+(obj.width()*2)+'&p='+get_hostname(window.location.href)+'/'+url;
	murl = murl.replace('//', '/');
	return ;
}
function load_event_description_details(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];
		if(templateData.file){
			template.find('img').attr('src', getImageAjax(template.find('img'),templateData.file.url));
		}
	}	
}

function load_target_description(containerView, templates, data){
		
}

function load_event_scope(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		var datas = [];
		for(var j in templateData){
			datas.push(templateData[j].toLowerCase());
		}

		var text = datas[0];

		for(var i = 1; i < datas.length - 1; ++i){
			text += ', ' + datas[i];
		}

		if(datas.length > 1){
			text += ' and ' + datas[datas.length - 1];
		}

		template.find('span').text(text);
	}	
}

function load_attendee_gender(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		template.find('.big').eq(0).text(templateData.value + '%');
		template.find('.big').eq(1).text((100 - Number(templateData.value)) + '%');
	}	
}

function load_key_numbers(containerView, templates, data){
	var colors = ['color-blue', 'color-black', 'color-gray', 'color-gray-light', 'color-red'];
	var colorIndex = 0;

	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		template.find('[jt-attr="value"]').attr('data',templateData.value);
		template.find('[jt-attr="value"]').html(templateData.value);//printNumber(

		template.addClass(colors[colorIndex]);
		colorIndex = (colorIndex + 1) % colors.length;
	}

	
	if(!keyNumberIsInit){
		keyNumberIsInit = true;
		template.parent().parent().append('<div class="margin-end"></div>');
	}
	reloadNumberEffect();
}

function load_team_description(){
}

function load_team(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];
		

		if(!templateData.linkedin && !templateData.twitter && !templateData.email && !templateData.phone){
			template.find('.above').css('opacity',0);
			template.find('.above ul').hide();
		}

		if(templateData.linkedin){
			if(templateData.linkedin.substring(0, 4) == "http"){
				var linkedinlink=templateData.linkedin;
			}else{
				var linkedinlink='http://'+templateData.linkedin;
			}
			template.find('a.linkedin-link').attr('href',linkedinlink);
		}else{
			template.find('.linkedin').css('opacity',0);
		}
		if(templateData.twitter){
			if(templateData.twitter.charAt(0)=='@'){
				var twitterlink='http://www.twitter.com/'+templateData.twitter;
			}else if(templateData.twitter.substring(0, 4) == "http"){
				var twitterlink=templateData.twitter;
			}else{
				var twitterlink='http://www.twitter.com/'+templateData.twitter;
			}
			template.find('a.twitter-link').attr('href',twitterlink);
		}else{
			template.find('.twitter').css('opacity',0);
		}
		if(templateData.email){
			template.find('a.mail-link').attr('href','mailto:'+templateData.email);
		}else{
			template.find('.mail').css('opacity',0);
		}

		if(templateData.file){
			template.find('.team-img-cover').css('background-image', 'url('+getImageAjax(template.find('.team-img-cover'),templateData.file.url)+')');
		}else{
			template.find('.team-img-cover').css('background-image', 'url('+template.find('img').attr('src')+')');
		}


		if(templates.length==1){
			template.addClass('one-member');
			template.find('.under').insertBefore(template.find('.above'));
		}else if(templates.length==2){
			template.addClass('two-member');
		}else if(templates.length==3){
			template.addClass('three-member');
		}else{
			template.addClass('four-member');
		}
	}
	if (containerView != '') {
		containerView.append('<div class="clear"></div>');
	};
}



function initMasonry(){
	//$('#my_media_social').removeAttr("style").show();
	//$('#my_media_social > div').removeAttr("style").show();
	//console.log("INIT MANSOSRY=>"+mansoryIsInit);
	
	var $container = $('#my_media_social');

if(!mansoryIsInit){
		mansoryIsInit = true;
}else{
	$container.masonry( 'destroy' );
}

	console.log('Media width: '+$container.width());
	var nbCols=$container.find('.social-media');
	// initialize
	if(nbCols.hasClass('one-media')){
		$container.masonry({
		  columnWidth: $container.width(),
		  itemSelector: '.social-media',
		});
	}else if(nbCols.hasClass('two-media')){
		$container.masonry({
		  columnWidth: $container.width()/2,
		  itemSelector: '.social-media',
		});
	}else{
		$container.masonry({
			columnWidth: $container.width()/3,
			itemSelector: '.social-media',
		});
	}
	
}

function load_my_media_social(containerView, templates, data){

	var haveItem = 0;
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		if(templates.length==1){template.addClass('one-media');}
		else if(templates.length==2){template.addClass('two-media');}
		else{template.addClass('three-media');}

		template.find('.circle').hide();
		if(templateData.network == 'Facebook'){
			//haveItem++;
			template.addClass('facebook');
			template.find('.circle.facebook').show();
		}
		else if(templateData.network == 'Twitter'){
			//haveItem++;
			template.addClass('twitter');
			template.find('.circle.twitter').show();
		}
		else if(templateData.network == 'Google+'){
			//haveItem++;
			template.addClass('google');
			template.find('.circle.google').show();
		}
		else if(templateData.network == 'Youtube'){
			//haveItem++;
			template.addClass('youtube');
			template.find('.circle.youtube').show();
		}
		else if(templateData.network == 'Instagram'){
			//haveItem++;
			template.addClass('instagram');
			template.find('.circle.instagram').show();
		}
		else if(templateData.network == 'Vimeo'){
			//haveItem++;
			template.addClass('vimeo');
			template.find('.circle.vimeo').show();
		}
		else if(templateData.network == 'Pinterest'){
			//haveItem++;
			template.addClass('pinterest');
			template.find('.circle.pinterest').show();
		}
		else if(templateData.network == 'Linkedin'){
			//haveItem++;
			template.addClass('linkedin');
			template.find('.circle.linkedin').show();
		}
		else if(templateData.network == 'Podcast'){
			//haveItem++;
			template.addClass('podcast');
			template.find('.circle.podcast').show();
		}
		else if(templateData.network == 'Emailing'){
			//haveItem++;
			template.addClass('emailing');
			template.find('.circle.emailing').show();
		}
		else if(templateData.network == 'Periscope'){
			//haveItem++;
			template.addClass('periscope');
			template.find('.circle.periscope').show();
		}
		else if(templateData.network == "What's App"){
			//haveItem++;
			template.addClass('whatsapp');
			template.find('.circle.whatsapp').show();
		}
		else if(templateData.network == 'Facebook Live'){
			//haveItem++;
			template.addClass('facebooklive');
			template.find('.circle.facebooklive').show();
		}
		else if(templateData.network == 'Ticketing Page'){
			//haveItem++;
			template.addClass('ticketing');
			template.find('.circle.ticketing').show();
		}
		else if(templateData.network == 'SnapChat'){
			//haveItem++;
			template.addClass('snapchat');
			template.find('.circle.snapchat').show();
		}else{
			//haveItem++;
			template.addClass('none');
			template.find('.circle.none').show();
			var firstletter=templateData.content.charAt(0);
			template.find('.circle.none .icn-none').html(firstletter);
		}

		template.find('[jt-attr="content"]').append('<a target="_blank"></a>');
		if(templateData.url!="" && templateData.url.substring(0, 4) != "http"){
			var urllink='http://'+templateData.url;
		}else{
			var urllink=templateData.url;
		}
		
		if(template.find('[jt-attr="hashtag"]').text()==""){
			template.find('[jt-attr="hashtag"]').hide();
		}else{
			template.find('[jt-attr="hashtag"]').show();
		}
		
		if(urllink!=""){
			template.find('a').attr('href', urllink).html('<svg class="media_see_more" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g enable-background="new"><g><g><path fill-rule="evenodd" clip-rule="evenodd" d="M44,31.994c0-0.002,0-0.005,0-0.007c0-0.848-0.352-1.613-0.918-2.159 l0.001-0.001l-18-18l-0.008,0.008C24.536,11.318,23.806,11,23,11c-1.657,0-3,1.343-3,3c0,0.91,0.406,1.725,1.046,2.275 l15.718,15.718L20.84,47.917l0.001,0.001C20.321,48.458,20,49.191,20,50c0,1.657,1.343,3,3,3c0.809,0,1.542-0.321,2.082-0.841 l0.001,0.001l18-18l-0.001-0.001C43.648,33.613,44,32.848,44,32C44,31.998,44,31.996,44,31.994z"/></g></g></g></svg>');
			haveItem++;
		}
		
		
		if(!templateData.content){template.addClass('no-content');}
	}
	
	if(haveItem==0){
		$('div[jt-view="my_media_social"]').hide();
		$('div[jt-view="my_media_social"]').prev().hide();
		hideMedia++;
		if($('div[jt-view="my_media_website"]').css('display')=="none" && $('div[jt-view="my_media_social"]').css('display')=="none"){
			$('div[jt-section-view="my_medias"]').hide();
		}
	}
    setTimeout(function(){initMasonry();},500);
       
    if($('div.element[jt-section-view="my_medias"]').hasClass('hidden') && $('div.element[jt-section-view="coverage_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').parent().parent().find('.panel').hasClass('hidden')){
		$('div[jt-section-view="medias"]').addClass('hidden');
	}

}

function load_my_media_website(containerView, templates, data){
	var haveItem = 0;

	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];
		
		if(templateData.name!=""){
			haveItem++;
			var firstletter=templateData.name[0].charAt(0);
			template.find('[jt-attr="content"]').append('<a target="_blank"></a>');
			if(templateData.url.substring(0, 4) != "http"){
				var urllink='http://'+templateData.url;
			}else{
				var urllink=templateData.url;
			}
			template.find('a').attr('href', urllink).html('<svg class="media_see_more" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g enable-background="new"><g><g><path fill-rule="evenodd" clip-rule="evenodd" d="M44,31.994c0-0.002,0-0.005,0-0.007c0-0.848-0.352-1.613-0.918-2.159 l0.001-0.001l-18-18l-0.008,0.008C24.536,11.318,23.806,11,23,11c-1.657,0-3,1.343-3,3c0,0.91,0.406,1.725,1.046,2.275 l15.718,15.718L20.84,47.917l0.001,0.001C20.321,48.458,20,49.191,20,50c0,1.657,1.343,3,3,3c0.809,0,1.542-0.321,2.082-0.841 l0.001,0.001l18-18l-0.001-0.001C43.648,33.613,44,32.848,44,32C44,31.998,44,31.996,44,31.994z"/></g></g></g></svg>');
			template.find('.circle .normal').text(firstletter);
			template.find('.circle .hover').text(firstletter);
			template.find('[jt-attr="name"]').html('<a href="'+urllink+'" target="blank">'+templateData.name+'</a>');

			var j=i+1;
			if(j%2==0 && j%4!=0){template.addClass('color-two');}
			else if(j%3==0){template.addClass('color-three');}
			else if(j%4==0){template.addClass('color-four');}
			else{template.addClass('color-one');}

			if(!templateData.content){template.addClass('no-content');}
		}else{
			template.hide();
		}
	}
	if(haveItem==0){
		$('div[jt-view="my_media_website"]').prev().hide();
		containerView.hide();
		hideMedia++;
		//alert(hideMedia);
		if($('div[jt-view="my_media_website"]').css('display')=="none" && $('div[jt-view="my_media_social"]').css('display')=="none"){
			$('div[jt-section-view="my_medias"]').hide();
		}
	}
	if($('div.element[jt-section-view="my_medias"]').hasClass('hidden') && $('div.element[jt-section-view="coverage_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').parent().parent().find('.panel').hasClass('hidden')){
		$('div[jt-section-view="medias"]').addClass('hidden');
	}
}

function load_coverage_media_online(containerView, templates, data){
	var color = ['coverage-one', 'coverage-content', 'coverage-three', 'coverage-two'];
	var colorIndex = 0;
	var isHidden = 0;

	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		if(templateData.name!=""){
			template.find('[jt-attr="content"]').append('<a target="_blank"></a>');
			if(templateData.url.substring(0, 4) != "http"){
				var urllink='http://'+templateData.url;
			}else{
				var urllink=templateData.url;
			}
			template.find('a').attr('href', urllink).html('<svg class="media_see_more" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g enable-background="new"><g><g><path fill-rule="evenodd" clip-rule="evenodd" d="M44,31.994c0-0.002,0-0.005,0-0.007c0-0.848-0.352-1.613-0.918-2.159 l0.001-0.001l-18-18l-0.008,0.008C24.536,11.318,23.806,11,23,11c-1.657,0-3,1.343-3,3c0,0.91,0.406,1.725,1.046,2.275 l15.718,15.718L20.84,47.917l0.001,0.001C20.321,48.458,20,49.191,20,50c0,1.657,1.343,3,3,3c0.809,0,1.542-0.321,2.082-0.841 l0.001,0.001l18-18l-0.001-0.001C43.648,33.613,44,32.848,44,32C44,31.998,44,31.996,44,31.994z"/></g></g></g></svg>');
			template.find('.icn').text(templateData.name[0].toUpperCase());
			template.find('.circle').addClass(color[colorIndex]);
			template.find('[jt-attr="name"]').html('<a href="'+urllink+'" target="blank">'+templateData.name+'</a>');

			colorIndex = (colorIndex + 1) % color.length;

			var j=i+1;
			if(j%2==0 && j%4!=0){template.addClass('color-two');}
			else if(j%3==0){template.addClass('color-three');}
			else if(j%4==0){template.addClass('color-four');}
			else{template.addClass('color-one');}
			
			if(!templateData.content){template.addClass('no-content');}
			
		}else{
			template.hide();
			isHidden++; 
		}
	}
	if(isHidden == templates.length){
		$("[jt-section-view='coverage_medias']").hide().addClass('hidden');
	}else{
		$("[jt-section-view='coverage_medias']").show().removeClass('hidden');
	}
	
	if($('div.element[jt-section-view="my_medias"]').hasClass('hidden') && $('div.element[jt-section-view="coverage_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').parent().parent().find('.panel').hasClass('hidden')){
		$('div[jt-section-view="medias"]').addClass('hidden');
	}
	
	//initBox();
}

function load_coverage_tv(containerView, templates, data){
	var haveItem = false;
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];
		//if(templateData.tags[i] && !templateData.tags[i].equals("")){
			haveItem = true;
			var tagsHTML = '';
			for(var i = 0; i < templateData.tags.length; ++i){
				tagsHTML += $('<div></div>').text(templateData.tags[i])[0].outerHTML;
			}
			template.find('.tag').html(tagsHTML);
		//}
	}
	if(!haveItem){
		containerView.hide();
		hideClassicMedia++;
		/*console.log("hideClassicMedia=>"+hideClassicMedia);
		if($('div[jt-view="coverage_radio"]').text()=="" && $('div[jt-view="coverage_press"]').text()=="" && $('div[jt-view="coverage_tv"]').text()==""){
			$('div[jt-view="coverage_tv]').parent().prev().hide();	
		}*/
	}
	if($('div.element[jt-section-view="my_medias"]').hasClass('hidden') && $('div.element[jt-section-view="coverage_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').parent().parent().find('.panel').hasClass('hidden')){
		$('div[jt-section-view="medias"]').addClass('hidden');
	}
}

function load_coverage_radio(containerView, templates, data){
	var haveItem = false;
	for(var i = 0; i < templates.length; ++i){
		//haveItem = true;
		var template = templates[i];
		var templateData = data[i];
		//if(templateData.tags[i] && !templateData.tags[i].equals("")){
			haveItem = true;
			var tagsHTML = '';
			for(var i = 0; i < templateData.tags.length; ++i){
				tagsHTML += $('<div></div>').text(templateData.tags[i])[0].outerHTML;
			}
			template.find('.tag').html(tagsHTML);
		//}
	}
	if(!haveItem){
		containerView.hide();
		hideClassicMedia++;
		/*if($('div[jt-view="coverage_radio"]').text()=="" && $('div[jt-view="coverage_press"]').text()=="" && $('div[jt-view="coverage_tv"]').text()==""){
			$('div[jt-view="coverage_radio]').parent().prev().hide();	
		}*/
	}
	if($('div.element[jt-section-view="my_medias"]').hasClass('hidden') && $('div.element[jt-section-view="coverage_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').parent().parent().find('.panel').hasClass('hidden')){
		$('div[jt-section-view="medias"]').addClass('hidden');
	}
}

function load_coverage_press(containerView, templates, data){
	var haveItem = false;
	for(var i = 0; i < templates.length; ++i){
		//haveItem = true;
		var template = templates[i];
		var templateData = data[i];
		//if(templateData.tags[i] && !templateData.tags[i].equals("")){
			haveItem = true;
			var tagsHTML = '';
			for(var i = 0; i < templateData.tags.length; ++i){
				tagsHTML += $('<div></div>').text(templateData.tags[i])[0].outerHTML;
			}
			template.find('.tag').html(tagsHTML);
		//}
	}
	if(!haveItem){
		containerView.hide();
		hideClassicMedia++;
		/*console.log("hideClassicMedia=>"+hideClassicMedia);
		if($('div[jt-view="coverage_radio"]').text()=="" && $('div[jt-view="coverage_press"]').text()=="" && $('div[jt-view="coverage_tv"]').text()==""){
			$('div[jt-view="coverage_press]').parent().prev().hide();	
		}*/
	}
	
	if($('div.element[jt-section-view="my_medias"]').hasClass('hidden') && $('div.element[jt-section-view="coverage_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').parent().parent().find('.panel').hasClass('hidden')){
		$('div[jt-section-view="medias"]').addClass('hidden');
	}
}

function load_non_media(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		if(templateData.name == 'Bags'){
			template.find('.non-medias').addClass('bags');
		}else if(templateData.name == 'Conference Badges'){
			template.find('.non-medias').addClass('badges');
		}else if(templateData.name == 'On site Banners'){
			template.find('.non-medias').addClass('banners');
		}else if(templateData.name == 'Banners'){
			template.find('.non-medias').addClass('banners2');
		}else if(templateData.name == 'Marketing materials'){
			template.find('.non-medias').addClass('marketing');
		}else if(templateData.name == 'Post'){
			template.find('.non-medias').addClass('post');
		}else if(templateData.name == 'Flyers'){
			template.find('.non-medias').addClass('flyers');
		}
	}
	if($('div.element[jt-section-view="my_medias"]').hasClass('hidden') && $('div.element[jt-section-view="coverage_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').parent().parent().find('.panel').hasClass('hidden')){
		$('div[jt-section-view="medias"]').addClass('hidden');
	}
}

function load_non_packages(containerView, templates, data){
	var packageNames = [];
	for(var i in data){
		if(data[i].name!=""){
			
			var mprice = ""+formatPrice(data[i].amount,currencyD);
			if(!mprice){
				var mmprice="-";
			}else{
				var mmprice=currencyD + mprice + currency;
			}
			templates[i].find('[jt-attr="amount"]').html(mmprice);
			packageNames.push(data[i].name+" <span>"+mmprice+"</span>");
		}

		templates[i].find('[jt-attr="name"]').append('<span class="show-benefit-description color-content">Show more</span><span class="benefit-description color-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dapibus elementum libero, ac hendrerit orci vehicula nec. Morbi a luctus orci, ac maximus ipsum.</span><a class="show-pack-appendix" href="image/background/Transition3.jpg" data-lightbox="Transition3"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 26.5 27.8" enable-background="new 0 0 26.5 27.8" xml:space="preserve"><path fill="#738693" d="M23.2,6.8c0.5-0.8,1.6-1.1,2.4-0.6c0.8,0.5,1.1,1.6,0.6,2.4L18,23c-2.7,4.6-8.5,6.2-13.1,3.5 S-1.4,18,1.3,13.4L7,3.5c1.9-3.3,6.2-4.5,9.6-2.6c3.3,1.9,4.5,6.2,2.6,9.6l-5.7,9.9c-1.2,2.1-3.9,2.8-6,1.6c-2.1-1.2-2.8-3.9-1.6-6 l5.7-9.9C12,5.3,13.1,5,13.9,5.5C14.8,6,15,7,14.6,7.9l-5.7,9.9c-0.2,0.4-0.1,1,0.3,1.2c0.4,0.2,1,0.1,1.2-0.3l5.7-9.9 c1-1.7,0.4-3.8-1.3-4.8C13.1,3,11,3.6,10,5.3l-5.7,9.9c-1.7,2.9-0.7,6.7,2.2,8.4c2.9,1.7,6.7,0.7,8.4-2.2L23.2,6.8z"/></svg></a>');
		
		if(data[i].description){
			templates[i].find('.benefit-description').text(data[i].description);
		}else{
			templates[i].find('.benefit-description').remove();
			templates[i].find('.show-benefit-description').remove();
		}
		if(data[i].appendix){
			templates[i].find('.show-pack-appendix').attr('href',data[i].appendix.url);
		}else{
			templates[i].find('.show-pack-appendix').remove();
		}
		
	}


	$.fn.dropdown('contact[non_packages]', packageNames);

		console.log('PACKAGE NAMMMMMMEEEEEEEE============='+packageNames);
	if(packageNames.length==0){
		$("[jt-section-view='packages_s2']").hide().addClass('hidden');
		$('#contact .additional').hide();
		$('#contact .separator').hide();
		//initBox();
	}else{
		$("[jt-section-view='packages_s2']").show().removeClass('hidden');
		$('#contact .additional').show();
		$('#contact .separator').show();
	}
	
}
function formatPrice(amount,curr){
		var separator = ",";
		if(curr=="€"){
			separator = ".";
		}
		
		if(amount!=undefined && amount.length>3){
			amount = amount.replace(".","");
			amount = amount.replace(",","");
			var newamount = "";
			var cpt = 0;
			var z = 0;
			for(var i=(amount.length-1);i>=0;i--){
				cpt++;
				z++;
				if(cpt==3 && z<amount.length){
					newamount = separator+amount[i]+newamount;
					cpt=0;
				}else{
					newamount =  amount[i]+newamount;
				}	
			}
			amount = newamount;
		}
		return amount;
	}
	function isInt(n){
	    return Number(n) === n && n % 1 === 0;
	}
	
	function isFloat(n){
	    return Number(n) === n && n % 1 !== 0;
	}
function load_packages(containerView, templateHTML, data){
	var features_description =  data[0].features_description;
	var features_appendix =  data[0].features_appendix;
	var features =  data[0].features;
	data = data[0].packages;
	var templateView = $(templateHTML);
	var featureHTML = templateView.find('[jt-template-subview="feature"]')[0].outerHTML;
	templateView.find('[jt-template-subview="feature"]').remove();
	var templates = classic_load(containerView, templateView[0].outerHTML, data);
	var benefitcounter=0;

	console.log(features);
	console.log(features_description);
	console.log(features_appendix);

	function createFeature(features,features_description,features_appendix,templateData,j){
		var featureView = $(featureHTML);
		featureView.find('div').last().text(templateData.values[j]);
		var str = templateData.values[j];
		for(var y=0;y<Object.keys(features).length;y++){
			if(features[y]==str){
				j = y;
			}
		}
		
		if(features_description){
			if(features_description[j] && features_description[j]!=""){
				featureView.find('.benefit-description').text(features_description[j]);
			}else{
				featureView.find('.benefit-description').text("");
				//featureView.find('.show-benefit-description').remove();
			}
		}else{
			featureView.find('.benefit-description').text("");
			//featureView.find('.show-benefit-description').remove();
		}
		featureView.find('.show-pack-lightbox').attr('data-img',"");
		if(features_appendix){
			if(features_appendix[j]){
				featureView.find('.show-pack-lightbox').attr('data-img',features_appendix[j].url);
			}else{
				if(!features_description || !features_description[j] || (features_description[j] && features_description[j]=="")){
					featureView.find('.show-pack-lightbox').remove();
				}
			}
		}else{
			if(!features_description || !features_description[j] || (features_description[j] && features_description[j]=="")){
				featureView.find('.show-pack-lightbox').remove();
			}
		}
		
		return featureView;
	}
	
	var packageNames = [];
	
	var mlength = 0;
	for(var i in data){
		var templateData = data[i];
		for(var j in templateData.values){
			templates[i].find('[jt-template-subview="features"]').append(createFeature(features,features_description,features_appendix,templateData,j));
		}
		console.log(currencyD +"=>"+data[i].amount+"=>"+currency);
		var mprice = "";
		var mmprice = "";
		if(parseInt(data[i].amount) || parseFloat(data[i].amount)){
			mprice = ""+formatPrice(data[i].amount,currencyD);
			if(!mprice){
				mmprice="-";
			}else{
				mmprice=currencyD + mprice + currency;
			}
		}else{
			mmprice = data[i].amount;
		}
		templates[i].find('[jt-attr="amount"]').attr('data',data[i].amount);
		templates[i].find('[jt-attr="amount"]').html(mmprice);
		packageNames.push(data[i].name+" <span>"+mmprice+"</span>");

		if(data[i].description){
			templates[i].find('.description-tooltip-container').show();
			templates[i].find('.description-tooltip-content').html(data[i].description);
		}

		if(data[i].total){
			templates[i].find('[jt-attr="total"]').prepend(' / ');
		}

		templates[i].attr('id','pack-'+i);

		var li=templates[i].find('li');
		var benefitcounter=0;
		li.each(function(){
			$(this).addClass('benefit-'+benefitcounter);
			benefitcounter++;
		})
		
		if(benefitcounter==0){
			templates[i].hide();
		}else{
			templates[i].show();
			mlength++;
		}
	}

	$('#number_packs .number').text(mlength);

	if(mlength==1){
		$('.wrap-pack').addClass('one-pack');
	}else if(mlength==2){
		$('.wrap-pack').addClass('two-packs');
	}else if(mlength==5 || mlength%3==0){
		$('.wrap-pack').addClass('three-packs');
	}
	
	$.fn.dropdown('contact[packages]', packageNames);

	$('.show-pack-lightbox').click(function(){
		var lightboxoverlay=$('.packages-lightbox-overlay');
		var lightbox=$('.packages-lightbox');
		var benefit=$(this).parent();
		var pack=$(this).parent().parent().parent().parent();
		var packid=pack.attr('id');

		$('.wrap-pack').removeClass('opened');
		$('.wrap-pack ul li').removeClass('opened');

		lightboxoverlay.fadeIn(300);
		lightbox.fadeIn(300);
		pack.addClass('opened');
		benefit.addClass('opened');
		if(packid=='pack-0'){lightbox.removeClass('color-two').addClass('color-one');}
		else if(packid=='pack-1'){lightbox.removeClass('color-one').addClass('color-two');}
		else{lightbox.removeClass('color-two color-one');}

		var packtitle=pack.find('h3').html();
		var packprice=pack.find('span[jt-attr="amount"]').html();

		lightbox.find('.pl-pack-title').html(packtitle);
		lightbox.find('.pl-pack-price').html(packprice);

		var benefitimg=benefit.find('.show-pack-lightbox').attr('data-img');
		var benefittitle=benefit.find('div:nth-child(2)').html();
		var benefitdescription=benefit.find('.benefit-description').html();
		var nbbenefit=pack.find('li').length;
		var currentbenefit=parseInt(pack.find('ul li').index(benefit))+1;
		if(benefitimg){
			lightbox.find('.pl-image img').attr('src',getImageAjax(lightbox.find('.pl-image img'),benefitimg));
		}
		if(!benefitimg){lightbox.find('.pl-image').hide();}else{lightbox.find('.pl-image').show();}
		lightbox.find('.pl-benefit-title').html(benefittitle);
		lightbox.find('.pl-benefit-description').html(benefitdescription);
		lightbox.find('.pl-nb-benefit').html(currentbenefit+' / '+nbbenefit);

		$('.pl-next-pack').click(function(){
			var currentpack=$('.wrap-pack.opened').attr('id').split('-')[1];
			var nbpack=$('.wrap-pack').length;
			var nextpack=parseInt(currentpack)+1;

			if(nextpack>=nbpack){nextpack=0;}

			$('.wrap-pack').removeClass('opened');
			$('.wrap-pack ul li').removeClass('opened');
			if(nextpack=='0'){lightbox.removeClass('color-two').addClass('color-one');}
			else if(nextpack=='1'){lightbox.removeClass('color-one').addClass('color-two');}
			else{lightbox.removeClass('color-two color-one');}

			var pack=$('#pack-'+nextpack);
			var benefit=pack.find('.benefit-0');
			pack.addClass('opened');
			benefit.addClass('opened');

			var packtitle=pack.find('h3').html();
			var packprice=pack.find('span[jt-attr="amount"]').html();

			lightbox.find('.pl-pack-title').html(packtitle);
			lightbox.find('.pl-pack-price').html(packprice);

			var benefitimg=benefit.find('.show-pack-lightbox').attr('data-img');
			var benefittitle=benefit.find('div:nth-child(2)').html();
			var benefitdescription=benefit.find('.benefit-description').html();
			var nbbenefit=pack.find('li').length;

			lightbox.find('.pl-image img').attr('src',getImageAjax(lightbox.find('.pl-image img'),benefitimg));
			if(!benefitimg){lightbox.find('.pl-image').hide();}else{lightbox.find('.pl-image').show();}
			lightbox.find('.pl-benefit-title').html(benefittitle);
			lightbox.find('.pl-benefit-description').html(benefitdescription);
			lightbox.find('.pl-nb-benefit').html('1 / '+nbbenefit);
		})

		$('.pl-prev-pack').click(function(){
			var currentpack=$('.wrap-pack.opened').attr('id').split('-')[1];
			var nbpack=parseInt($('.wrap-pack').length)-1;
			var nextpack=parseInt(currentpack)-1;

			if(nextpack<0){nextpack=nbpack;}

			$('.wrap-pack').removeClass('opened');
			$('.wrap-pack ul li').removeClass('opened');
			if(nextpack=='0'){lightbox.removeClass('color-two').addClass('color-one');}
			else if(nextpack=='1'){lightbox.removeClass('color-one').addClass('color-two');}
			else{lightbox.removeClass('color-two color-one');}

			var pack=$('#pack-'+nextpack);
			var benefit=pack.find('.benefit-0');
			pack.addClass('opened');
			benefit.addClass('opened');

			var packtitle=pack.find('h3').html();
			var packprice=pack.find('span[jt-attr="amount"]').html();

			lightbox.find('.pl-pack-title').html(packtitle);
			lightbox.find('.pl-pack-price').html(packprice);

			var benefitimg=benefit.find('.show-pack-lightbox').attr('data-img');
			var benefittitle=benefit.find('div:nth-child(2)').html();
			var benefitdescription=benefit.find('.benefit-description').html();
			var nbbenefit=pack.find('li').length;

			lightbox.find('.pl-image img').attr('src',getImageAjax(lightbox.find('.pl-image img'),benefitimg));
			if(!benefitimg){lightbox.find('.pl-image').hide();}else{lightbox.find('.pl-image').show();}
			lightbox.find('.pl-benefit-title').html(benefittitle);
			lightbox.find('.pl-benefit-description').html(benefitdescription);
			lightbox.find('.pl-nb-benefit').html('1 / '+nbbenefit);
		})

		$('.pl-next-benefit').click(function(){
			var currentpack=$('.wrap-pack.opened');
			var currentbenefit=currentpack.find('ul li.opened');
			var currentbenefit=parseInt(currentpack.find('ul li').index(currentbenefit))+1;
			var nextbenefitnb=currentbenefit+1;
			var nbbenefit=currentpack.find('ul li').length;

			if(nextbenefitnb>nbbenefit){nextbenefitnb=1;}
			nextbenefit=currentpack.find('ul li:nth-child('+nextbenefitnb+')');

			currentpack.find('ul li.opened').removeClass('opened');
			nextbenefit.addClass('opened');

			var benefitimg=nextbenefit.find('.show-pack-lightbox').attr('data-img');
			var benefittitle=nextbenefit.find('div:nth-child(2)').html();
			var benefitdescription=nextbenefit.find('.benefit-description').html();

			lightbox.find('.pl-image img').attr('src',getImageAjax(lightbox.find('.pl-image img'),benefitimg));
			if(!benefitimg){lightbox.find('.pl-image').hide();}else{lightbox.find('.pl-image').show();}
			lightbox.find('.pl-benefit-title').html(benefittitle);
			lightbox.find('.pl-benefit-description').html(benefitdescription);
			lightbox.find('.pl-nb-benefit').html(nextbenefitnb+' / '+nbbenefit);
		})

		$('.pl-prev-benefit').click(function(){
			var currentpack=$('.wrap-pack.opened');
			console.log(currentpack);
			var currentbenefit=currentpack.find('ul li.opened');
			var currentbenefit=parseInt(currentpack.find('ul li').index(currentbenefit))-1;
			var nextbenefitnb=currentbenefit+1;
			var nbbenefit=currentpack.find('ul li').length;

			if(nextbenefitnb<=0){nextbenefitnb=nbbenefit;}
			nextbenefit=currentpack.find('ul li:nth-child('+nextbenefitnb+')');

			currentpack.find('ul li.opened').removeClass('opened');
			nextbenefit.addClass('opened');

			var benefitimg=nextbenefit.find('.show-pack-lightbox').attr('data-img');
			var benefittitle=nextbenefit.find('div:nth-child(2)').html();
			var benefitdescription=nextbenefit.find('.benefit-description').html();

			lightbox.find('.pl-image img').attr('src',getImageAjax(lightbox.find('.pl-image img'),benefitimg));
			console.log(benefitimg);
			if(!benefitimg){lightbox.find('.pl-image').hide();}else{lightbox.find('.pl-image').show();}
			lightbox.find('.pl-benefit-title').html(benefittitle);
			lightbox.find('.pl-benefit-description').html(benefitdescription);
			lightbox.find('.pl-nb-benefit').html(nextbenefitnb+' / '+nbbenefit);
		})

		$('.pl-close').click(function(){
			$('.packages-lightbox-overlay').fadeOut(300);
			$('.packages-lightbox').fadeOut(300);
			$('.wrap-pack').removeClass('opened');
			$('.wrap-pack ul li').removeClass('opened');
		})
	})
}

function load_finance(containerView, templateHTML, data){
	data = data[0];
	var template = $(templateHTML);
	var cellViewHTML = template.find('[jt-template-subview="cell"]')[0].outerHTML;
	template.find('[jt-template-subview="cell"]').remove();

	function createCell(data){
		var cellView = $(cellViewHTML);
		//console.log("finance=>"+data.name);
		cellView.find('td').first().text(data.name);
		cellView.find('td span').attr('data',data.amount);
		cellView.find('td span').text(currencyD + formatPrice(data.amount,currencyD) + currency);

		return cellView;
	}

	var sum = 0;
	for(var i in data.income){
		sum += parseInt(data.income[i].amount);
		template.find('[jt-template-subview="income"]').append(createCell(data.income[i]));
	}
	template.find('[jt-template-subview="income-sum"]').attr('data',sum);
	template.find('[jt-template-subview="income-sum"]').text('TOTAL ' + currencyD +  formatPrice(new String(sum),currencyD) + currency);

	sum = 0;
	for(var i in data.outcome){
		sum += parseInt(data.outcome[i].amount);
		template.find('[jt-template-subview="outcome"]').append(createCell(data.outcome[i]));
	}
	
	template.find('[jt-template-subview="outcome-sum"]').attr('data',sum);
	template.find('[jt-template-subview="outcome-sum"]').text('TOTAL ' + currencyD +  formatPrice(new String(sum),currencyD) + currency);

	if(data.income.length > data.outcome.length){
		template.find('[jt-template-subview="outcome"]').append('<td></td><td></td>');
	} else if (data.income.length < data.outcome.length){
		template.find('[jt-template-subview="income"]').append('<td></td><td></td>');
	}

	containerView.append(template);
}

function load_appendix(containerView, templates, data){
	//alert(templates.length);
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		if(data[i].file.url!="" && data[i].file.url!="undefined" && data[i].file.url!=undefined){
			template.find('.preview').show();
			template.find('a').attr('href', data[i].file.url);
			var preview = "";
			if(data[i].file.url.indexOf(".pdf")>-1){
				preview = '<img width="100%" height="auto" style="height:auto;width:100%;display:inline-block" src="/ajax/pdfpreview.php?pdfurl='+data[i].file.url+'" />';
			}else if(data[i].file.url.indexOf(".doc")>-1){
				template.find('.preview').hide();
			}else{
				preview = '<img width="100%" height="auto" style="height:auto;width:100%;display:inline-block" src="'+data[i].file.url+'" />';
			}
			
			template.find('.preview').html(preview);
			template.find('a.button.blue').attr('download', data[i].file.name);
		}else{
			template.find('.preview').parent().hide();
		}
		
	}
}
function load_sponsor(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];
		if(templateData.website.indexOf('://')>0){
			template.find('a').attr('href',templateData.website);
		}else{
			template.find('a').attr('href','http://'+templateData.website);
		}
		
		if(templateData.level == "Do not specify"){
			template.find('span').hide();
		}
		
		if(templateData.file){
			template.find('img').attr('src', getImageAjax(template.find('img'),templateData.file.url));
		}
	}
	if (containerView != '') {
		containerView.append('<div class="clear"></div>');
	};
}
function load_speaker(containerView, templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates[i];
		var templateData = data[i];

		if(!templateData.role || !templateData.company){
			template.find('.under span:nth-child(3)').hide();
		}
		if(!templateData.role){
			template.find('span[jt-attr="role"]').prev().hide();
		}
		if(templateData.linkedin){
			if(templateData.linkedin.substring(0, 4) == "http"){
				var linkedinlink=templateData.linkedin;
			}else{
				var linkedinlink='http://'+templateData.linkedin;
			}
			template.find('a.linkedin-link').attr('href',linkedinlink);
		}else{
			template.find('.linkedin').hide();
		}
		if(templateData.twitter){
			if(templateData.twitter.charAt(0)=='@'){
				var twitterlink='http://www.twitter.com/'+templateData.twitter;
			}else if(templateData.twitter.substring(0, 4) == "http"){
				var twitterlink=templateData.twitter;
			}else{
				var twitterlink='http://www.twitter.com/'+templateData.twitter;
			}
			template.find('a.twitter-link').attr('href',twitterlink);
		}else{
			template.find('.twitter').hide();
		}
		if(templateData.github){
			if(templateData.github.charAt(0)=='@'){
				var githublink='http://www.github.com/'+templateData.github;
			}else if(templateData.github.substring(0, 4) == "http"){
				var githublink=templateData.github;
			}else{
				var githublink='http://www.github.com/'+templateData.github;
			}
			template.find('a.github-link').attr('href',githublink);
		}else{
			template.find('.github').hide();
		}

		if(templateData.twitter && !templateData.linkedin  && !templateData.github || templateData.linkedin && !templateData.twitter && !templateData.github || !templateData.linkedin && !templateData.twitter && templateData.github){
			template.addClass('one-social');
		}
		if (!templateData.linkedin && !templateData.twitter && !templateData.github) {
			template.find('.above').css('opacity',0);
			template.find('.above ul').hide();
		}
		if(templateData.linkedin && templateData.twitter && templateData.github){
			template.addClass('all-social');
		}

		if(!templateData.website){
			template.find('.under a').hide();
		}
		if(templateData.website.substring(0, 4) != "http"){template.find('.under a').attr('href','http://'+templateData.website).html('<span class="speaker-website-tag">Website</span>');}
		else{template.find('.under a').attr('href',templateData.website).html('<span class="speaker-website-tag">Website</span>');}

		if(templateData.file){
			template.find('.team-img-cover').css('background-image', 'url('+ getImageAjax(template.find('.team-img-cover'),templateData.file.url)+')');
		}else{
			template.find('.team-img-cover').css('background-image', 'url('+template.find('img').attr('src')+')');
		}

		if(templates.length==1){
			template.addClass('one-speaker');
			template.find('.under').insertBefore(template.find('.above'));
		}else if(templates.length==2){
			template.addClass('two-speaker');
		}else if(templates.length==3){
			template.addClass('three-speaker');
		}else{
			template.addClass('four-speaker');
		}
	}
	if (containerView != '') {
		containerView.append('<div class="clear"></div>');
	};
}
