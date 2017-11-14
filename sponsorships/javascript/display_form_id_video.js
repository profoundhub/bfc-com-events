var isdisplay_form_id_video = true;
function display_form_id_video(id){
	if(id == 15){
		/*$('[jt-section-view="project"] a').each(function(){
			if(!$(this).attr('rel') || $(this).attr('rel')==""){
				$(this).html('The channel');
			}
		});*/
		$('[jt-section-view="project"] .nav h3').html('The channel');
		$('[jt-section-view="project"] [jt-section-view="tell-us-more"] h2').html('About the channel');
		$('[jt-section-view="audience"] h2').html('Viewers demographic');
		$('[jt-section-view="attendees_number"] h5').html('Subscribers expected');
		$('[jt-template-view="attendee_number"] p').html('Subscribers are expected');
		if($('[jt-template-view="event_scope"] p').lenght > 0){
			$('[jt-template-view="event_scope"] p').html($('[jt-template-view="event_scope"] p').html().replace('event','subscribers'));
		}
		$('[jt-section-view="attendees_gender"] .gender h5').html("VIEWER'S GENDER");
		$('[jt-template-view="attendee_gender"] .women p').html('Women viewer');
		$('[jt-template-view="attendee_gender"] .men p').html('Men viewer');
		$('.donut h5').each(function(){
			if($(this).html().indexOf("Attendees'") > -1){
				$(this).html( $(this).html().replace("Attendees'", "Viewer's") );
			}
		});
	}else if(id == 32){
		$('#menu-project a').html('The project');
		$('[jt-section-view="project"] .nav h3').html('The project');
		$('[jt-section-view="attendees_number"] h5').html("Viewer's expected");
		$('[jt-template-view="attendee_number"] p').html("Viewer's are expected");
		if($('[jt-template-view="event_scope"] p').lenght > 0){
			$('[jt-template-view="event_scope"] p').html($('[jt-template-view="event_scope"] p').html().replace('event','subscribers'));
		}
		$('[jt-section-view="attendees_gender"] .gender h5').html("VIEWER'S GENDER");
		$('[jt-template-view="attendee_gender"] .women p').html('Women viewer');
		$('[jt-template-view="attendee_gender"] .men p').html('Men viewer');
		$('.donut h5').each(function(){
			if($(this).html().indexOf("Attendees'") > -1){
				$(this).html( $(this).html().replace("Attendees'", "Viewer's") );
			}
		});
	}else if(id == 34){
		$('[jt-section-view="key_numbers"] h5').hide();
		$('.description-details-img').css({'height':'auto','width':'auto'});
		$('.description-details img').css({'position':'relative','left':'0px','-webkit-transform': 'translate(0px,0px)','-ms-transform': 'translate(0px,0px)', '-o-transform': 'translate(0px,0px)','transform': 'translate(0px,0px)'});
		$('.numbers .number').css('margin-top','0px');
		$('[jt-section-view="tell-us-more"] .margin-end').hide();
		$('[jt-section-view="tell-us-more"] h2').css('margin-bottom','60px');
		$('[jt-attr="website"]').each(function(){
			if($(this).attr('href')=='http://'){
				$(this).hide();
			}
		})
		$('#menu-speaker a').html('PAST SPEAKERS');
		$('[jt-section-view="speaker"] .nav h3').html('PAST SPEAKERS');
		$('[jt-section-view="speaker"] h2').html('PAST SPEAKERS');
		$('[jt-template-view="attendee_number"] p').html('attendees');
		$('.description-details').css({'margin-top':'20px','margin-bottom':'20px'});
		$('.box .element .date_place p').css('color','#FF2A45');
		$('.box .element h6.color-two').css('color','#FF2A45');
		$('.sponsorship-needed h3').css('color','#FF2A45').addClass('sg');
		$('.team .member .under span').css('color','#FF2A45');
		$('.target .map-target table tr th p').css('background','rgba(255,42,69,0.8)');
		$('.box .control .panel ul li.select').css('background-color','#FF2A45');
		$('#number_packs').css('color','#FF2A45');
		$('.box .wrap-pack:nth-child(1) .pack .head').css('background-color','#FF2A45');
		$('.box .wrap-pack:nth-child(1) .pack:hover .head').css('background-color','#ee2841');
		$('.sponsors span').css('color','#FF2A45');
		$('.download a.button.blue').css('background-color','#FF2A45');
		$('#header .menu .button-contact').css('background-color','#FF2A45');
		$('#header .menu ul li.select, #header .menu ul li:hover').css('border-bottom-color','#FF2A45');
		$('.footer-contact').css('background-color','#FF2A45');

		$('.wrap-anthracite').css('background-color','#333');
		$('.box .wrap-pack:nth-child(2) .pack .head').css('background-color','#A81F26');
	}
}