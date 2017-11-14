function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function get_hostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
    if(!m){
    	m = url.match(/^https:\/\/[^/]+/);
    }
    return m ? m[0] : null;
}
function getImageAjax(obj,url){
	return '/ajax/img.php?w='+(obj.width()*2)+'&p='+get_hostname(window.location.href)+url;
}
function load_template_logo(templates, data){
	for(var i = 0; i < templates.length; ++i){
		var template = templates.eq(i);
		var templateData = data[i];

		var html = '';
		if(templateData && templateData.file!='' && templateData.file.url){
			html = $('<img>').attr('src', getImageAjax(template ,templateData.file.url));
		}

		template.html(html);
	}
}

// WARNING degeu
function load_template_header(templates, data){
	var html = '';
	var imagesSize = count_object_property(data);

	/*if(imagesSize == 0){
		html = '<img src="image/background/header.jpg" />';
	}
	else if(imagesSize == 1){
		html = '<div class="cut width-max"><img /></div>';
	}
	else if(imagesSize == 2){
		html = '<div class="cut"><img /></div><div class="cut"><img /></div>';
	}
	else if(imagesSize == 3){
		html = '<div class="cut"><img /></div><div class="cut"><div class="cut"><img /></div><div class="cut"><img /></div></div>';
	}
	else if(imagesSize == 4){
		html = '<div class="cut"><div class="cut"><img /></div><div class="cut"><img /></div></div><div class="cut"><div class="cut"><img /></div><div class="cut"><img /></div></div>';
	}
	else if(imagesSize == 5){
		html = '<div class="cut"><img /></div><div class="cut"><div class="cut"><div class="cut"><img /></div><div class="cut"><img /></div></div><div class="cut"><div class="cut"><img /></div><div class="cut"><img /></div></div></div>';
	}*/

	html = '<div class="cut width-max"><img /></div>';

	html = $(html);
	for(var i in data){
		// html.find('img').eq(i).attr('src', data[i].file.url);
		html.find('img').eq(i).parent('.cut').css('background','url('+getImageAjax(templates,data[i].file.url)+')');
		if(data[i].overlay && data[i].overlay==1){
			templates.addClass('photo-brightness');
		}else{
			templates.removeClass('photo-brightness');
		}
	}

	templates.html(html);

	resizeheaderimg();
}

function resizeheaderimg(){
	var wwidth=$('.hero-image').width();
	var wheight=$('.hero-image').height();
	if(wwidth>=wheight){
		$('.hero-image .image-large img').addClass('big-height').removeClass('big-width');
	}else{
		$('.hero-image .image-large img').removeClass('big-height').addClass('big-width');
	}
}
$(window).resize(resizeheaderimg);

function load_template_video_url(templates, data){
	var template = templates.eq(0);

	$('[jt-template="header"]').removeClass('hidden');
	template.addClass('hidden');
	$('.video-large.hidden').parent().find('.slogan').show();

	for(var i in data){
		var templateData = data[i];

		if(templateData && templateData.value && templateData.value!=""){
		
			var tmpValue = templateData.value.split('#');
			var mvalue = tmpValue[0]+(tmpValue[0].indexOf("?")>-1 ? "&" : "?")+"enablejsapi=1";
			if(tmpValue[1]){
				if(tmpValue[1]=="1"){
					mvalue = mvalue+"&autoplay=1&loop=1";
				}
			}
			
			$('[jt-template="header"]').addClass('hidden');
			template.removeClass('hidden');

			mvalue = mvalue+"&origin=https://www.sponseasy.com";
			template.find('iframe').attr('src',mvalue);
			// templateData.value+'?1'

			setTimeout(function(){
				$('.video-large-overlay').fadeOut(300);
				$('.video-large').not('.hidden').parent().find('.slogan').fadeOut(300);
			},5000);
		}
	}
}

function load_template_transition_images(templates, data){
	var DEFAULT_URLS = ['image/background/banner-image.png', 'image/background/banner-image2.png'];

	for(var i = 0; i < templates.length; i++){
		var template = templates.eq(i);
		var templateData = data[i];

		if(templateData && templateData.file && templateData.file.url){
			template.attr('src', getImageAjax($('#sp'),templateData.file.url));
		}
		else{
			template.attr('src', DEFAULT_URLS[i]);
		}
		
		if(templateData.overlay && templateData.overlay==1){
			template.parent().addClass('photo-brightness');
		}else{
			template.parent().removeClass('photo-brightness');
		}
		
	}
}
function load_template_transition_videos(templates, data){
	for(var i = 0; i < templates.length; i++){
		var template = templates.eq(i);
		var templateData = data[i];
		

		if(templateData && templateData.value && templateData.value!=""){
			var tmpValue = templateData.value.split('#');
			var mvalue = tmpValue[0]+(tmpValue[0].indexOf("?")>-1 ? "&" : "?")+"enablejsapi=1";
			if(tmpValue[1]){
				if(tmpValue[1]=="1"){
					mvalue = mvalue+"&autoplay=1&loop=1&rel=0";
				}
			}
			template.prev().addClass('hidden');
			template.removeClass('hidden');
			mvalue = mvalue+"&origin=https://www.sponseasy.com";
			template.find('iframe').attr('src',mvalue);
		}else{
			template.prev().removeClass('hidden');
			template.addClass('hidden');
		}
	}
}
function load_template_protect_deck(templates, data){
		if(data && data[0] && data[0].values && data[0].values[0]=="1"){
			/*<input type="text" placeholder="Lastname" /><br/><input type="text" placeholder="firstName" /><br/><input type="text" placeholder="Company" /><br/>
			*/
			var html = '<div id="protectdeck" style="position:fixed;width:100%;height:100%;z-index:9999999;left:0;top:0;display:none;"><div style="background:#000000;opacity:0.98;position:absolute;left:0;top:0;width:100%;height:100%;"></div><table style="position:relative;" cellPadding="0" cellSpacing="0" width="100%" height="100%"><tr><td vAlign="middle" style="text-align:center;"><div style="width: 600px; background: rgb(255, 255, 255) none repeat scroll 0% 0%;margin-top: 20%; padding: 20px;display:inline-block;"><div><label style="text-transform: uppercase; display: inline-block; margin: 0px; font-weight: bold; font-size: 25px;">Enter your code here</label><br><input id="codecheck" value="" style="display: inline-block; margin: 15px 0px; width: 60%; text-align: center; height: 40px; font-size: 30px; line-height: 30px;" type="password"><br><input id="codecheck2" value="Go to the proposal" style="background: #f15743 none repeat scroll 0% 0%; border: medium none; padding: 10px; text-transform: uppercase; color: rgb(255, 255, 255); font-weight: bold;" type="button"></div></div></td></tr></table></div>';
			
			$('body').append(html);
		}else{
			$('#protectdeck').remove();
		}
}
function load_template_brandingss(templates, data){
	console.log("load_template_brandingss");
	console.log(data);
	
	if(data && data[0] && data[0].values && data[0].values[0]=="1"){
		$('.footer').hide();
		$('.dark-footer').hide();
	}else{
		$('.footer').show();
		$('.dark-footer').show();
	}
}

function load_template_knabbreviation(templates, data){
	$('.numbers .number').each(function(){
		if(data && data[0] && data[0].values && data[0].values[0]=="1"){
			$(this).html(printNumber($(this).attr('data')));
		}else{
			$(this).html($(this).attr('data'));
		}
	});
}

function load_template_fabbreviation(templates, data){
	if(data && data[0] && data[0].values && data[0].values[0]=="1"){
		
		var sum = $('[jt-template-subview="income-sum"]').attr('data');
		sum = formatPrice(new String(sum),currencyD)==sum ? formatPrice(new String(sum),currencyD) : printNumber(sum);
		$('[jt-template-subview="income-sum"]').html('TOTAL ' + currencyD + sum + currency);
		sum = $('[jt-template-subview="outcome-sum"]').attr('data');
		sum = formatPrice(new String(sum),currencyD)==sum ? formatPrice(new String(sum),currencyD) : printNumber(sum);
		$('[jt-template-subview="outcome-sum"]').html('TOTAL ' + currencyD + sum + currency);
		
		$('[jt-template-subview="outcome"] .price span').each(function(){
			var amount = $(this).attr("data");
			if(parseInt(amount) || parseFloat(amount)){
				mprice = amount;
				if(!mprice){
					mmprice="-";
				}else{
					mmprice=currencyD + (printNumber(mprice)==mprice?""+formatPrice(amount,currencyD):printNumber(mprice)) + currency;
				}
			}else{
				mmprice = amount;
			}
			$(this).html(mmprice);
		});
		
		$('[jt-template-subview="income"] .price span').each(function(){
			var amount = $(this).attr("data");
			if(parseInt(amount) || parseFloat(amount)){
				mprice = amount;
				if(!mprice){
					mmprice="-";
				}else{
					mmprice=currencyD + (printNumber(mprice)==mprice?""+formatPrice(amount,currencyD):printNumber(mprice)) + currency;
				}
			}else{
				mmprice = amount;
			}
			$(this).html(mmprice);
		});
		
	}else{
		var sum = $('[jt-template-subview="income-sum"]').attr('data');
		sum = formatPrice(new String(sum),currencyD);
		$('[jt-template-subview="income-sum"]').html('TOTAL ' + currencyD + sum + currency);
		sum = $('[jt-template-subview="outcome-sum"]').attr('data');
		sum = formatPrice(new String(sum),currencyD);
		$('[jt-template-subview="outcome-sum"]').html('TOTAL ' + currencyD + sum + currency);
		
		$('[jt-template-subview="outcome"] .price span').each(function(){
			var amount = $(this).attr("data");
			if(parseInt(amount) || parseFloat(amount)){
				mprice = ""+formatPrice(amount,currencyD);
				if(!mprice){
					mmprice="-";
				}else{
					mmprice=currencyD + mprice + currency;
				}
			}else{
				mmprice = amount;
			}
			$(this).html(mmprice);
		});
		
		$('[jt-template-subview="income"] .price span').each(function(){
			var amount = $(this).attr("data");
			if(parseInt(amount) || parseFloat(amount)){
				mprice = ""+formatPrice(amount,currencyD);
				if(!mprice){
					mmprice="-";
				}else{
					mmprice=currencyD + mprice + currency;
				}
			}else{
				mmprice = amount;
			}
			$(this).html(mmprice);
		});
	}
	
	//$('[jt-template-subview="income-sum"]').find('.small').css('margin-right',0);
	//$('[jt-template-subview="outcome-sum"]').find('.small').css('margin-right',0);
}

function load_template_pabbreviation(templates, data){
	if(data && data[0] && data[0].values && data[0].values[0]=="1"){
		$('.pack span[jt-attr="amount"]').each(function(){
			var amount = $(this).attr("data");
			if(parseInt(amount) || parseFloat(amount)){
				mprice = amount;
				if(!mprice){
					mmprice="-";
				}else{
					mmprice=currencyD + (printNumber(mprice)==mprice?""+formatPrice(amount,currencyD):printNumber(mprice)) + currency;
				}
			}else{
				mmprice = amount;
			}
			$(this).html(mmprice);
		});
	}else{
		$('.pack span[jt-attr="amount"]').each(function(){
			var amount = $(this).attr("data");
			if(parseInt(amount) || parseFloat(amount)){
				mprice = ""+formatPrice(amount,currencyD);
				if(!mprice){
					mmprice="-";
				}else{
					mmprice=currencyD + mprice + currency;
				}
			}else{
				mmprice = amount;
			}
			$(this).html(mmprice);
		});
	}
}

function load_template_transition_texts(templates, data){ 
	console.log("LOAD load_template_transition_texts");
	templates = $('[jt-template="transition_texts"]');
	var i=0; 
	for(i=0 ;i<templates.length;i++){
		var templateData = data[i];
		console.log("LOAD load_template_transition_texts data => "+i+" => "+templateData.value);
        if(templateData==undefined || templateData.value==""){
			templates.eq(i).hide();
		}else{
			templates.eq(i).show();
		}
		
		if(templateData){
			templates.eq(i).text(templateData.value);
		}
		
	}
}

function load_template_color(templates, data){
	var color=data[0].value;
	var colorR=hexToRgb(color).r;
	var colorG=hexToRgb(color).g;
	var colorB=hexToRgb(color).b;
	var colorRgba='rgba('+colorR+','+colorG+','+colorB+',0.8)';

	$('.nav').css('background', color);
	$('#content .super:nth-child(1) .nav').css('background', colorRgba);
	$('.nav h3').css('color', '#fff');
}

function load_template_font(templates, data){
	console.log("Police:" + data[0].value);
}

function load_control_slide(){
	$('.super .panel').each(function(){
		if($(this).parents(".box").find('.menu ul li').not('.hidden').length > 1){
			$(this).parents(".box").find('.menu ul li').each(function(index){
				if($(this).hasClass('hidden')){
					$(this).parents(".box").find('.control .panel ul li').eq(index).addClass('hidden');
				}
			});
		}else{
			$(this).parents(".box").find('.panel').addClass('hidden');
		}
	});
}

function load_template_currency(templates, data){
	var data_currency = data[0].value.split('#');
	data_currency = $.trim(data_currency[0]);
	if(data_currency == '$' || data_currency == '£'){
		currency = '';
		currencyD = data_currency;
	}else{
		currencyD = '';
		currency = data_currency;
	}
}
function load_template_autoplay_video(templates, data){
	 /*if(data && data[0] && data[0].values && data[0].values[0]=="1"){
	 	$('#video-large-iframe').attr('src',$('#video-large-iframe').attr('src')+'&autoplay=1');
	 }else{
	 	$('#video-large-iframe').attr('src',$('#video-large-iframe').attr('src').replace("&autoplay=1",""));
	 }*/
}
function load_template_mutevideos(templates, data){

}
function load_template_rel_video(templates, data){
	 if(data && data[0] && data[0].values && data[0].values[0]=="1"){
	 	$('#video-large-iframe').attr('src',$('#video-large-iframe').attr('src').replace('enablejsapi=1','enablejsapi=1&rel=0'));
	 }else{
	 	$('#video-large-iframe').attr('src',$('#video-large-iframe').attr('src').replace("&rel=0",""));
	 }
}
function load_template_color_btchoosethispackage(templates, data){
	 if(data && data[0] && data[0].value && data[0].value!=""){
	 	var color=data[0].value;
		var colorR=hexToRgb(color).r;
		var colorG=hexToRgb(color).g;
		var colorB=hexToRgb(color).b;
		var colorRgba='rgba('+colorR+','+colorG+','+colorB+',0.8)';
	
		$('.box .wrap-pack .pack a.button').css('background-color', color);
	 }
}

function load_template_choosethispackage_wordings(templates, data){
	 if(data && data[0] && data[0].value && data[0].value!=""){
	 	$('.box .wrap-pack .pack a.button').text(data[0].value);
	 }else{
	 	$('.box .wrap-pack .pack a.button').text('Choose this package');
	 }
}

function load_template_color_btsponsorus(templates, data){
	 console.log("SECTION color_btsponsorus");
	 console.log(data);
	 console.log(data[0].value);
	 if(data && data[0] && data[0].value && data[0].value!=""){
	 	var color=data[0].value;
		var colorR=hexToRgb(color).r;
		var colorG=hexToRgb(color).g;
		var colorB=hexToRgb(color).b;
		var colorRgba='rgba('+colorR+','+colorG+','+colorB+',0.8)';
	
		$('.footer-contact').css('background', color);
		$('.button-contact').css('background-color', color);
	 }
}

function load_template_color_proposaltitle(templates, data){
	 if(data && data[0] && data[0].value && data[0].value!=""){
	 	var color=data[0].value;
		var colorR=hexToRgb(color).r;
		var colorG=hexToRgb(color).g;
		var colorB=hexToRgb(color).b;
		var colorRgba='rgba('+colorR+','+colorG+','+colorB+',0.8)';
	
		$('.hero-image .slogan h1').css('color', color);
	 }else{
	 	$('.hero-image .slogan h1').css('color', 'white');
	 }
}

function load_template_hideproposal_title(templates, data){
	 console.log("SECTION hideproposal_title");
	 console.log(data);
	 console.log(data[0].values[0]);
	 if(data && data[0] && data[0].values && data[0].values[0]=="1"){
	 	$('h1[jt-view="name"]').hide();
	 }else{
	 	$('h1[jt-view="name"]').show();
	 }
}

function load_template_hidetheevent(templates, data){
	 if(data && data[0] && data[0].values && data[0].values[0]=="1"){
	 	$('.menu li[jt-section-view="project"]').addClass("hidden");
	 	$('[jt-section-view="project"] > div').not('.banner-image').addClass("hidden");
	 }else{
	 	$('.menu li[jt-section-view="project"]').removeClass("hidden");
	 	$('[jt-section-view="project"] > div').not('.banner-image').removeClass("hidden");
	 }
}
function load_template_hideattendees(templates, data){
	 if(data && data[0] && data[0].values && data[0].values[0]=="1"){
	 	$('div[jt-section-view="attendees_gender"]').hide();
	 }else{
	 	$('div[jt-section-view="attendees_gender"]').show();
	 }
}
function load_template_hideexpected(templates, data){
	 if(data && data[0] && data[0].values && data[0].values[0]=="1"){
	 	$('div[jt-section-view="attendees_number"]').hide();
	 }else{
	 	$('div[jt-section-view="attendees_number"]').show();
	 }
}

function load_template_hideaudience(templates, data){
	 if(data && data[0] && data[0].values && data[0].values[0]=="1"){
	 	$('.menu li[jt-section-view="audience"]').addClass("hidden");
	 	$('[jt-section-view="audience"] > div').not('.banner-image').addClass("hidden");
	 }else{
	 	$('.menu li[jt-section-view="audience"]').removeClass("hidden");
	 	$('[jt-section-view="audience"] > div').not('.banner-image').removeClass("hidden");
	 }
}
function load_template_hideoffers(templates, data){
	 if(data && data[0] && data[0].values && data[0].values[0]=="1"){
	 	$('.menu li[jt-section-view="offers"]').addClass("hidden");
	 	$('[jt-section-view="offers"] > div').not('.banner-image').addClass("hidden");
	 }else{
	 	$('.menu li[jt-section-view="offers"]').removeClass("hidden");
	 	$('[jt-section-view="offers"] > div').not('.banner-image').removeClass("hidden");
	 }
}
function load_template_titlefont(templates, data){
	 console.log("load_template_titlefont => "+data[0].value);
	 if(data && data[0] && data[0].value && data[0].value!=""){
	 	$('h1,h2,h3,h4,h5').css('font-family',data[0].value);
	 }else{
	 	$('h1,h2,h3,h4,h5').css('font-family','');
	 }
}

function load_template_dateformat(templates, data){
	 if(data && data[0] && data[0].value && data[0].value!="" && data[0].value=="EU Format"){
	 	$('.dateformat').each(function(){
	 		var mdate = $(this).text();
	 		if(!$(this).hasClass('euformat')){
	 			mdate = mdate.split('/');
	 			$(this).text(mdate[1]+'/'+mdate[0]+'/'+mdate[2]);
	 		}
	 		$(this).addClass('euformat');
	 		$(this).removeClass('usformat');
	 	});
	 }else{
	 	$('.dateformat').each(function(){
	 		if($(this).hasClass('euformat')){
	 			var mdate = $(this).text();
	 			//alert(mdate);
	 			mdate = mdate.split('/');
	 			$(this).text(mdate[1]+'/'+mdate[0]+'/'+mdate[2]);
	 		}
	 		$(this).removeClass('euformat');
 			$(this).addClass('usformat');
 			
	 	});
	 
	 }
}

function load_template_sponsorus_wordings(templates, data){
	 console.log("SECTION sponsorus_wordings");
	 console.log(data);
	 console.log(data[0].value);
	 if(data && data[0] && data[0].value && data[0].value!=""){
	 	$('.button-contact > div ').html(data[0].value+'<span class="icn-contact"></span>');
		$('.footer-contact span').not('.icn-contact').html(data[0].value);
	 }else{
	 	$('.button-contact > div ').html('Sponsor Us<span class="icn-contact"></span>');
		$('.footer-contact span').not('.icn-contact').html('Sponsor Us');
	 }
}

function load_template_sectionswording(templates, data){
	 if(data && data[0] && data[0].value && data[0].value!=""){
		 var values = eval("["+data[0].value+"]");
		 values = values[0].data==undefined ? values[0] : values[0].data;
		 $.each(values,function(k,v){
		 	var elt = k.split('-');
		 	if(elt[1]=="h3"){
		 		$('div[jt-section-view="'+elt[0]+'"] .nav h3').text(v);
		 		$('.menu li[jt-section-view="'+elt[0]+'"] a').text(v);
		 		if(!$('.menu li[jt-section-view="'+elt[0]+'"]').hasClass("hidden")){
			 		if(v==""){
			 			$('.menu li[jt-section-view="'+elt[0]+'"]').hide();
			 		}else{
			 			$('.menu li[jt-section-view="'+elt[0]+'"]').show();
			 		}
		 		}
		 		
		 	}
		 	if(elt[1]=="h2"){
		 		$('div[jt-section-view="'+elt[0]+'"] h2').eq(elt[2]).text(v);
		 		if(v==""){
		 			$('div[jt-section-view="'+elt[0]+'"] h2').eq(elt[2]).addClass("nocontent");
		 		}else{
		 			$('div[jt-section-view="'+elt[0]+'"] h2').eq(elt[2]).removeClass("nocontent");
		 		}
		 	}
		 });
	 }
}

function load_template_textswording(templates, data){
	 if(data && data[0] && data[0].value && data[0].value!=""){
		 var values = eval("["+data[0].value+"]");
		 values = values[0];
		 $.each(values,function(k,v){
		 	$('.'+k).text(v);
		 });
	 }
}


function hide_contact_packages(){
	var count = $('#contact .dropdown').length;
	elShow = 0;
	$('#contact .dropdown').each(function(i){
		if(!$(this).find('ul li').length > 0){
			$(this).addClass('hidden');
		}
		elShow = elShow + 1;

		if(i == count-1){
			if(elShow == 2){
				$('#contact .dropdown').eq(1).css('float','right');
			}
		}
	})
}
