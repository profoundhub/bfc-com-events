window.is_iframe = false;
window.is_loaded = false;
var showClassicMedia = 0;

$(document).on('ready', _sponseasyLoad);
var templatesHTML = {};
var sectionViews = {};
var idForm = 0;
var userId = 0;
var mproposalId = 0;
var currencyD 	= '$';
var currency 	= '';

function removeDuplicate(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found, x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x].key === newArr[y].key) {
                found = true;
                break;
            }
        }
        if (!found) {
            newArr.push(origArr[x]);
        }
    }
    return newArr;
}

function _sponseasyLoad(){
	var proposalId = getUrlParameters('id', "", true);
	var previewMode = getUrlParameters('preview', "", true) !== false;
	var url = '/api/proposals/' + proposalId;

	console.log("PROPOSAL ID = "+proposalId);
	$('[jt-section-view]').addClass('hidden');
    $('[jt-view="coverage_tv"]').parent().prev().hide();
	var apiURL = url;
	if(previewMode){
		apiURL += '?preview=true';
		$('head').append('<meta http-equiv="cache-control" content="max-age=0" /><meta http-equiv="cache-control" content="no-cache" /><meta http-equiv="expires" content="0" /><meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" /><meta http-equiv="pragma" content="no-cache" />');
		
	}

	loadTemplateViews();

	$.getJSON(apiURL, function(data){

		idForm = data.form_id;

		$('[jt-view="name"]').text(data.name);
		$('meta[name="og:title"]').attr('content',data.name);
		$('.hero-event-type').text(data.category);
		/*$('.slogan p').each(function(){
			if($(this).text()==""){
				$(this).hide();
			}
		});*/
		console.log(data);

		

		var arrquest = [];
		
		for(var i = 0; i < data.templateData.length; ++i){
			var answer = data.templateData[i];
			if(answer.key=="currency"){
				loadTemplateElement(answer.key, answer.data.data);
			}
			
		}

		for(var i = 0; i < data.data.length; ++i){
			if($.inArray(data.data[i].key, arrquest)==-1){
				var answer = data.data[i];
				loadElement(answer.key, answer.data.dataValid);
			}
			arrquest.push(data.data[i].key);
		}
		
		for(var i = 0; i < data.templateData.length; ++i){
			var answer = data.templateData[i];
			loadTemplateElement(answer.key, answer.data.data);
		}
		
		console.log('load_form_contact => '+previewMode);
		if(!previewMode){
			var alive_url = url + '/alive';
			setInterval(function(){
				$.ajax(alive_url);
			}, 15000);

			load_form_contact(url + '/contact');
		}
		
		setInterval(function(){
				if($('div[jt-view="my_media_website"]').css('display')=="none" && $('div[jt-view="my_media_social"]').css('display')=="none" && $('div.element[jt-section-view="coverage_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').hasClass('hidden') && $('div.element[jt-section-view="non_medias"]').parent().parent().find('.panel').hasClass('hidden')){
					$('div[jt-section-view="medias"]').addClass('hidden');
					$('#menu-medias').addClass('hidden');
				}/*else{
					$('div[jt-section-view="medias"]').removeClass('hidden');
					$('#menu-medias').removeClass('hidden');
				}*/
		}, 1000);
		
		

		userId = data.user;//$('#profile > form').attr('id').replace("edit_user_","");
		mproposalId  = data.data[0].proposal_id;
		

		load_control_slide();
		// hide_contact_packages();
		window.is_loaded = true;
		initBox();
		initHideMenu();
		initCheckMarketing();
		
		// initHideMenu();

	}).done(function(){
		//$('.sponsorship-needed > h3').text('SPONSORSHIP OPPORTUNITIES');
		//$('div[jt-section-view="offers"] h2').text('Event Packages');
		//$('div[jt-section-view="offers"] .nav h3').text('Event Packages');
		//$('div[jt-view="sponsor"] h3').removeClass('text-uppercase');
		
		if(proposalId=="the-spartan-nomad-world-tour-presse"){
			$('<style>.nav .backtotop::after {right: 0;width: 108px;}.nav .backtotop{width:135px;}.table-finance .table::after{width:0px}.team .one-speaker .member .above .twitter-link .twitter {background-color: #3b5999;background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2NHB4Ig0KCSBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9IkJhY2tncm91bmRfeEEwX0ltYWdlXzFfIiBkaXNwbGF5PSJub25lIj4NCgkNCgkJPGltYWdlIGRpc3BsYXk9ImlubGluZSIgb3ZlcmZsb3c9InZpc2libGUiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgaWQ9IkJhY2tncm91bmRfeEEwX0ltYWdlIiB4bGluazpocmVmPSJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LC85ai80QUFRU2taSlJnQUJBZ0VBU0FCSUFBRC83QUFSUkhWamEza0FBUUFFQUFBQUhnQUEvKzRBSVVGa2IySmxBR1RBQUFBQUFRTUENCkVBTUNBd1lBQUFGMEFBQUJmd0FBQWFELzJ3Q0VBQkFMQ3dzTUN4QU1EQkFYRHcwUEZ4c1VFQkFVR3g4WEZ4Y1hGeDhlRnhvYUdob1gNCkhoNGpKU2NsSXg0dkx6TXpMeTlBUUVCQVFFQkFRRUJBUUVCQVFFQUJFUThQRVJNUkZSSVNGUlFSRkJFVUdoUVdGaFFhSmhvYUhCb2ENCkpqQWpIaDRlSGlNd0t5NG5KeWN1S3pVMU1EQTFOVUJBUDBCQVFFQkFRRUJBUUVCQVFQL0NBQkVJQUVBQVFBTUJJZ0FDRVFFREVRSC8NCnhBQmVBQUVCQUFBQUFBQUFBQUFBQUFBQUFBQUFCd0VCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQkFCQVFBQUFBQUFBQUFBQUFBQUFBQUENClFHQVJBUUFBQUFBQUFBQUFBQUFBQUFBQUFHQVNBUUFBQUFBQUFBQUFBQUFBQUFBQUFFRC8yZ0FNQXdFQUFoRURFUUFBQUtBQUFBQUENCkFBQUFBQUFBQUFELzJnQUlBUUlBQVFVQUIvL2FBQWdCQXdBQkJRQUgvOW9BQ0FFQkFBRUZBSUQvMmdBSUFRSUNCajhBQi8vYUFBZ0INCkF3SUdQd0FILzlvQUNBRUJBUVkvQUFILzJRPT0iPg0KCTwvaW1hZ2U+DQo8L2c+DQo8ZyBpZD0iZmFjZWJvb2tfMl8iIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgICAgIj4NCgk8ZyBpZD0iZmFjZWJvb2tfMV8iPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjZmZmIiBkPSJNMzYuOTYzLDIyLjA0OGMwLjA5Mi0zLjM0NS0wLjUyNS04LjAwMywwLjUxNS05LjU5Mw0KCQkJCWMxLjkwMi0yLjkxMSw5LjQ5Ni0yLjE1NCw5LjQ5Ni0yLjE1NHMwLTYuNjEyLDAtMTAuMzAzYy0xMS45ODIsMC0xNS45MDMtMC41MDEtMjAuMDE1LDMuNjc1DQoJCQkJYy0zLjY1OCwzLjcxNS0zLjc3MSwxMS4wMTEtNC4wNzIsMTguMzc1aC01Ljg3MlYzMi4xMmg1LjkzOGMtMC4wMDIsMTAuNTA0LDAuMDAzLDIyLjAxNiwwLDMxLjg4NGM0LjQ2MiwwLDEzLjk1NCwwLDEzLjk1NCwwDQoJCQkJdi0zMi4wMWMwLDAsNS4xNzMsMCw4LjA0MiwwYzAuNjI2LTMuMzg1LDEuMjM2LTYuMDM2LDIuMDg4LTkuOTQ3SDM2Ljk2M3oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K");background-position: center center;background-repeat: no-repeat;background-size: 28px auto;border-radius: 30px;}.team .one-speaker .member .above .github-link .github {background-color: #437196;background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2NHB4Ig0KCSBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9Imluc3RhZ3JhbV8xXyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiPg0KCTxnIGlkPSJpbnN0YWdyYW0iPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjZmZmIiBkPSJNNTYsMEg4QzMuNTgyLDAsMCwzLjU4MiwwLDh2NDhjMCw0LjQxOCwzLjU4Miw4LDgsOGg0OGM0LjQxOCwwLDgtMy41ODIsOC04VjgNCgkJCQlDNjQsMy41ODIsNjAuNDE4LDAsNTYsMHogTTE5LjY3MywzMC42NzNjMC4wMTMtMC4xMjcsMC4wNC0wLjI0OSwwLjA1Ny0wLjM3NGMwLjA0Mi0wLjMxLDAuMDg4LTAuNjE4LDAuMTUzLTAuOTINCgkJCQljMC4wMjktMC4xMzYsMC4wNjktMC4yNjcsMC4xMDMtMC40MDFjMC4wNzItMC4yODYsMC4xNDctMC41NzEsMC4yMzgtMC44NDljMC4wNDQtMC4xMzIsMC4wOTUtMC4yNTksMC4xNDItMC4zODkNCgkJCQljMC4xLTAuMjcyLDAuMjA0LTAuNTQxLDAuMzIyLTAuODA0YzAuMDItMC4wNDUsMC4wMzQtMC4wOTIsMC4wNTUtMC4xMzdoMC4wMTFjMS45NjgtNC4yNDcsNi4yNTctNy4yLDExLjI0Ni03LjINCgkJCQljNC45ODksMCw5LjI3OCwyLjk1MywxMS4yNDYsNy4yaDAuMDExYzAuMDIxLDAuMDQ1LDAuMDM1LDAuMDkyLDAuMDU1LDAuMTM3YzAuMTE4LDAuMjYzLDAuMjIyLDAuNTMyLDAuMzIyLDAuODA0DQoJCQkJYzAuMDQ4LDAuMTMsMC4wOTksMC4yNTcsMC4xNDIsMC4zODljMC4wOTEsMC4yNzgsMC4xNjYsMC41NjIsMC4yMzgsMC44NDljMC4wMzQsMC4xMzQsMC4wNzQsMC4yNjUsMC4xMDMsMC40MDENCgkJCQljMC4wNjUsMC4zMDIsMC4xMSwwLjYxLDAuMTUzLDAuOTJjMC4wMTcsMC4xMjUsMC4wNDMsMC4yNDcsMC4wNTcsMC4zNzRDNDQuMzczLDMxLjEwOSw0NC40LDMxLjU1MSw0NC40LDMyDQoJCQkJYzAsNi44NDktNS41NTIsMTIuNC0xMi40LDEyLjRjLTYuODQ4LDAtMTIuNC01LjU1Mi0xMi40LTEyLjRDMTkuNiwzMS41NTEsMTkuNjI3LDMxLjEwOSwxOS42NzMsMzAuNjczeiBNNTYuOCw1My42DQoJCQkJYzAsMS43NjctMS40MzMsMy4yLTMuMiwzLjJIMTAuNGMtMS43NjcsMC0zLjItMS40MzMtMy4yLTMuMlYyNi44aDUuODk5QzEyLjY0NCwyOC40NTYsMTIuNCwzMC4yLDEyLjQsMzINCgkJCQljMCwxMC44MjUsOC43NzUsMTkuNiwxOS42LDE5LjZjMTAuODI1LDAsMTkuNi04Ljc3NSwxOS42LTE5LjZjMC0xLjgtMC4yNDQtMy41NDQtMC42OTktNS4ySDU2LjhWNTMuNnogTTU2LjgsMTYuOA0KCQkJCWMwLDEuNzY3LTEuNDMzLDMuMi0zLjIsMy4yaC02LjRjLTEuNzY3LDAtMy4yLTEuNDMzLTMuMi0zLjJ2LTYuNGMwLTEuNzY3LDEuNDMzLTMuMiwzLjItMy4yaDYuNGMxLjc2NywwLDMuMiwxLjQzMiwzLjIsMy4yVjE2LjgNCgkJCQl6Ii8+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==");background-position: center center;background-repeat: no-repeat;background-size: 28px auto;border-radius: 30px;}</style>').appendTo('head');
			$('#contact input[placeholder="Name"]').attr('placeholder',"Nom");
			$('#contact input[placeholder="Email"]').attr('placeholder',"Email");
			$('#contact input[placeholder="Company"]').attr('placeholder',"Société");
			$('#contact input[placeholder="Position"]').attr('placeholder',"Poste");
			$('#contact input[placeholder="Website"]').attr('placeholder',"Site Internet");
			$('#contact input[placeholder="Phone number"]').attr('placeholder',"Téléphone");
			
			$('.contact-footer button').html("ENVOYER");
			
			$('#contact textarea').attr('placeholder',"Dites-nous en plus sur vous");
			$('#contact form .tac').eq(0).html($('#contact form .tac').eq(0).html().replace("CONTACT US","Contactez-nous").replace("Tell us about your needs. We'll get back to you as soon as possible.","Dites-nous en plus à propos de vos besoins. Nous reviendrons vers vous le plus tôt possible."));
			$('#contact form .tac').eq(1).html($('#contact form .tac').eq(1).html().replace("About you","A propos de vous").replace("About you","A propos de vous"));
			$('#contact form .tac').eq(2).html($('#contact form .tac').eq(2).html().replace("Tell us more","Dites-nous en plus").replace("Tell us more","Dites-nous en plus"));
			$('#contact form .tac').eq(3).html($('#contact form .tac').eq(3).html().replace("Packages Offers","Nos offres").replace("Packages Offers","Nos offres"));
			$('#contact form h4').html("Cliquez sur le pack qui vous interesse.");
			$('.button-contact').html($('.button-contact').html().replace("Sponsor us","Contactez-nous"));
			$('.footer-contact').html($('.footer-contact').html().replace("Sponsor us","Contactez-nous"));
			$('.backtotop').html($('.backtotop').html().replace("back to top","Revenir au début").replace("back to top","Revenir au début"));
			$('div[jt-template-view="event_description"] h4').html("En quelques mots");
			$('div[jt-section-view="key_numbers"] h5').html("Chiffres clés");
			$('div[jt-section-view="attendees_number"] h5').html("Audience attendue");
			$('div[jt-section-view="attendees_gender"] h5').html("Sexe de l'audience");
		}
		if(proposalId=="the-spartan-nomad-world-tour" || proposalId=="the-spartan-nomad-world-tour-with-bebop"){
			
			$('div[jt-template-view="event_description"] h4').html("En quelques mots");
			$('div[jt-template-view="sponsorship_needed"] h3').html("Opportunités");
			$('th[jt-template-view="event_scope"] p').html("C'est un événement global");
			$('td[jt-template-view="attendee_number"] p').html("participants attendus");
			
			$('.sponsorship-needed-package td').eq(0).html($('.sponsorship-needed-package td').eq(0).html().replace("Media","Sponsoring").replace("sponsorship","médiatique"));
			$('.sponsorship-needed-package td').eq(1).html($('.sponsorship-needed-package td').eq(1).html().replace("Financial","Sponsoring").replace("sponsors","financier"));
			$('.sponsorship-needed-package td').eq(3).html($('.sponsorship-needed-package td').eq(3).html().replace("In-Kind","Sponsoring").replace("sponsors","en nature"));
			$('div[jt-section-view="key_numbers"] h5').html("Chiffres clés");
			$('div[jt-section-view="attendees_number"] h5').html("Audience attendue");
			$('div[jt-section-view="attendees_gender"] h5').html("Sexe de l'audience");
			$('.table-finance h3').eq(0).html("Dépenses");
			$('.table-finance > .head .coll8').eq(1).hide();
			$('.table-finance > .head .coll8').eq(0).css('width','100%');
			$('.table-finance > .end .table .t5').eq(1).hide();
			$('.table-finance > .end .table .t5').eq(0).css('width','100%');
			$('.table-finance > .table .t5').eq(1).hide();
			$('.table-finance > .table .t5').eq(0).css('width','100%');
			$('li[jt-section-view="packages_s1"]').html("Packs");
			$('li[jt-section-view="packages_s2"]').html("Offres additionelles");
			$('.button-contact').html($('.button-contact').html().replace("Sponsor us","Contactez-nous"));
			$('.footer-contact').html($('.footer-contact').html().replace("Sponsor us","Contactez-nous"));
			$('.backtotop').html($('.backtotop').html().replace("back to top","Revenir au début").replace("back to top","Revenir au début"));
			
			$('#number_packs').html($('#number_packs').html().replace("PACKAGES AVAILABLE","PACKS DISPONIBLES"));
			$('.pack .button').html("Choisir ce pack");
			$('.wrap-pack .information .disptxt').html("disponible(s)");
			
			$('#contact input[placeholder="Name"]').attr('placeholder',"Nom");
			$('#contact input[placeholder="Email"]').attr('placeholder',"Email");
			$('#contact input[placeholder="Company"]').attr('placeholder',"Société");
			$('#contact input[placeholder="Position"]').attr('placeholder',"Poste");
			$('#contact input[placeholder="Website"]').attr('placeholder',"Site Internet");
			$('#contact input[placeholder="Phone number"]').attr('placeholder',"Téléphone");
			
			$('.contact-footer button').html("ENVOYER");
			
			$('#contact textarea').attr('placeholder',"Dites-nous en plus sur vous");
			$('#contact form .tac').eq(0).html($('#contact form .tac').eq(0).html().replace("CONTACT US","Contactez-nous").replace("Tell us about your needs. We'll get back to you as soon as possible.","Dites-nous en plus à propos de vos besoins. Nous reviendrons vers vous le plus tôt possible."));
			$('#contact form .tac').eq(1).html($('#contact form .tac').eq(1).html().replace("About you","A propos de vous").replace("About you","A propos de vous"));
			$('#contact form .tac').eq(2).html($('#contact form .tac').eq(2).html().replace("Tell us more","Dites-nous en plus").replace("Tell us more","Dites-nous en plus"));
			$('#contact form .tac').eq(3).html($('#contact form .tac').eq(3).html().replace("Packages Offers","Nos offres").replace("Packages Offers","Nos offres"));
			$('#contact form h4').html("Cliquez sur le pack qui vous interesse.");
			
			$('<style>.nav .backtotop::after {right: 0;width: 108px;}.nav .backtotop{width:135px;}.table-finance .table::after{width:0px}.team .one-speaker .member .above .twitter-link .twitter {background-color: #3b5999;background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2NHB4Ig0KCSBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9IkJhY2tncm91bmRfeEEwX0ltYWdlXzFfIiBkaXNwbGF5PSJub25lIj4NCgkNCgkJPGltYWdlIGRpc3BsYXk9ImlubGluZSIgb3ZlcmZsb3c9InZpc2libGUiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgaWQ9IkJhY2tncm91bmRfeEEwX0ltYWdlIiB4bGluazpocmVmPSJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LC85ai80QUFRU2taSlJnQUJBZ0VBU0FCSUFBRC83QUFSUkhWamEza0FBUUFFQUFBQUhnQUEvKzRBSVVGa2IySmxBR1RBQUFBQUFRTUENCkVBTUNBd1lBQUFGMEFBQUJmd0FBQWFELzJ3Q0VBQkFMQ3dzTUN4QU1EQkFYRHcwUEZ4c1VFQkFVR3g4WEZ4Y1hGeDhlRnhvYUdob1gNCkhoNGpKU2NsSXg0dkx6TXpMeTlBUUVCQVFFQkFRRUJBUUVCQVFFQUJFUThQRVJNUkZSSVNGUlFSRkJFVUdoUVdGaFFhSmhvYUhCb2ENCkpqQWpIaDRlSGlNd0t5NG5KeWN1S3pVMU1EQTFOVUJBUDBCQVFFQkFRRUJBUUVCQVFQL0NBQkVJQUVBQVFBTUJJZ0FDRVFFREVRSC8NCnhBQmVBQUVCQUFBQUFBQUFBQUFBQUFBQUFBQUFCd0VCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQkFCQVFBQUFBQUFBQUFBQUFBQUFBQUENClFHQVJBUUFBQUFBQUFBQUFBQUFBQUFBQUFHQVNBUUFBQUFBQUFBQUFBQUFBQUFBQUFFRC8yZ0FNQXdFQUFoRURFUUFBQUtBQUFBQUENCkFBQUFBQUFBQUFELzJnQUlBUUlBQVFVQUIvL2FBQWdCQXdBQkJRQUgvOW9BQ0FFQkFBRUZBSUQvMmdBSUFRSUNCajhBQi8vYUFBZ0INCkF3SUdQd0FILzlvQUNBRUJBUVkvQUFILzJRPT0iPg0KCTwvaW1hZ2U+DQo8L2c+DQo8ZyBpZD0iZmFjZWJvb2tfMl8iIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgICAgIj4NCgk8ZyBpZD0iZmFjZWJvb2tfMV8iPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjZmZmIiBkPSJNMzYuOTYzLDIyLjA0OGMwLjA5Mi0zLjM0NS0wLjUyNS04LjAwMywwLjUxNS05LjU5Mw0KCQkJCWMxLjkwMi0yLjkxMSw5LjQ5Ni0yLjE1NCw5LjQ5Ni0yLjE1NHMwLTYuNjEyLDAtMTAuMzAzYy0xMS45ODIsMC0xNS45MDMtMC41MDEtMjAuMDE1LDMuNjc1DQoJCQkJYy0zLjY1OCwzLjcxNS0zLjc3MSwxMS4wMTEtNC4wNzIsMTguMzc1aC01Ljg3MlYzMi4xMmg1LjkzOGMtMC4wMDIsMTAuNTA0LDAuMDAzLDIyLjAxNiwwLDMxLjg4NGM0LjQ2MiwwLDEzLjk1NCwwLDEzLjk1NCwwDQoJCQkJdi0zMi4wMWMwLDAsNS4xNzMsMCw4LjA0MiwwYzAuNjI2LTMuMzg1LDEuMjM2LTYuMDM2LDIuMDg4LTkuOTQ3SDM2Ljk2M3oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K");background-position: center center;background-repeat: no-repeat;background-size: 28px auto;border-radius: 30px;}.team .one-speaker .member .above .github-link .github {background-color: #437196;background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2NHB4Ig0KCSBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9Imluc3RhZ3JhbV8xXyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiPg0KCTxnIGlkPSJpbnN0YWdyYW0iPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjZmZmIiBkPSJNNTYsMEg4QzMuNTgyLDAsMCwzLjU4MiwwLDh2NDhjMCw0LjQxOCwzLjU4Miw4LDgsOGg0OGM0LjQxOCwwLDgtMy41ODIsOC04VjgNCgkJCQlDNjQsMy41ODIsNjAuNDE4LDAsNTYsMHogTTE5LjY3MywzMC42NzNjMC4wMTMtMC4xMjcsMC4wNC0wLjI0OSwwLjA1Ny0wLjM3NGMwLjA0Mi0wLjMxLDAuMDg4LTAuNjE4LDAuMTUzLTAuOTINCgkJCQljMC4wMjktMC4xMzYsMC4wNjktMC4yNjcsMC4xMDMtMC40MDFjMC4wNzItMC4yODYsMC4xNDctMC41NzEsMC4yMzgtMC44NDljMC4wNDQtMC4xMzIsMC4wOTUtMC4yNTksMC4xNDItMC4zODkNCgkJCQljMC4xLTAuMjcyLDAuMjA0LTAuNTQxLDAuMzIyLTAuODA0YzAuMDItMC4wNDUsMC4wMzQtMC4wOTIsMC4wNTUtMC4xMzdoMC4wMTFjMS45NjgtNC4yNDcsNi4yNTctNy4yLDExLjI0Ni03LjINCgkJCQljNC45ODksMCw5LjI3OCwyLjk1MywxMS4yNDYsNy4yaDAuMDExYzAuMDIxLDAuMDQ1LDAuMDM1LDAuMDkyLDAuMDU1LDAuMTM3YzAuMTE4LDAuMjYzLDAuMjIyLDAuNTMyLDAuMzIyLDAuODA0DQoJCQkJYzAuMDQ4LDAuMTMsMC4wOTksMC4yNTcsMC4xNDIsMC4zODljMC4wOTEsMC4yNzgsMC4xNjYsMC41NjIsMC4yMzgsMC44NDljMC4wMzQsMC4xMzQsMC4wNzQsMC4yNjUsMC4xMDMsMC40MDENCgkJCQljMC4wNjUsMC4zMDIsMC4xMSwwLjYxLDAuMTUzLDAuOTJjMC4wMTcsMC4xMjUsMC4wNDMsMC4yNDcsMC4wNTcsMC4zNzRDNDQuMzczLDMxLjEwOSw0NC40LDMxLjU1MSw0NC40LDMyDQoJCQkJYzAsNi44NDktNS41NTIsMTIuNC0xMi40LDEyLjRjLTYuODQ4LDAtMTIuNC01LjU1Mi0xMi40LTEyLjRDMTkuNiwzMS41NTEsMTkuNjI3LDMxLjEwOSwxOS42NzMsMzAuNjczeiBNNTYuOCw1My42DQoJCQkJYzAsMS43NjctMS40MzMsMy4yLTMuMiwzLjJIMTAuNGMtMS43NjcsMC0zLjItMS40MzMtMy4yLTMuMlYyNi44aDUuODk5QzEyLjY0NCwyOC40NTYsMTIuNCwzMC4yLDEyLjQsMzINCgkJCQljMCwxMC44MjUsOC43NzUsMTkuNiwxOS42LDE5LjZjMTAuODI1LDAsMTkuNi04Ljc3NSwxOS42LTE5LjZjMC0xLjgtMC4yNDQtMy41NDQtMC42OTktNS4ySDU2LjhWNTMuNnogTTU2LjgsMTYuOA0KCQkJCWMwLDEuNzY3LTEuNDMzLDMuMi0zLjIsMy4yaC02LjRjLTEuNzY3LDAtMy4yLTEuNDMzLTMuMi0zLjJ2LTYuNGMwLTEuNzY3LDEuNDMzLTMuMiwzLjItMy4yaDYuNGMxLjc2NywwLDMuMiwxLjQzMiwzLjIsMy4yVjE2LjgNCgkJCQl6Ii8+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==");background-position: center center;background-repeat: no-repeat;background-size: 28px auto;border-radius: 30px;}</style>').appendTo('head');
			
}
		
		if(proposalId=="leadership-challenges-1"){
			$('div[jt-section-view="attendees_gender"]').hide();
		}	
		
		
		if(proposalId=="round-the-world-with-lily" || proposalId=="around-the-world-with-lily"){
			$('div[jt-section-view="project"] .nav h3').text('OUR PROJECT');
			$('#menu-project a').text('OUR PROJECT');
			$('div[jt-section-view="tell-us-more"] h2').text('ABOUT OUR TRIP');
			$('div[jt-section-view="about_us"] h2').text('ABOUT US');
			$('div[jt-section-view="offers"] .nav h3').text('OPPORTUNITIES');
			$('#menu-offers a').text('OPPORTUNITIES');
			$('div[jt-section-view="offers"] h2').text('OPPORTUNITIES');
			$('.footer-contact h3').html('<span class="icn-contact"></span><span>Join us</span>');
			$('.menu .button-contact .t-cell').html('Join us<span class="icn-contact"></span>');
			$('#map-canvas').hide();
			$('.date_place p[jt-attr="place"]').parent().parent().hide();
			$('div[jt-section-view="audience"] .nav').hide();
			$('div[jt-section-view="audience"] .wrap-white').hide();
			$('div[jt-section-view="audience"] .divider40').hide();
			$('#menu-audience').hide();
		}
		
		if(proposalId=="we-won-t-hibernate-a-winter-story-to-inspire-action-meg"){
			$('td[jt-template-view="attendee_number"] p').text('followers are expected');
			$('div[jt-section-view="attendees_gender"] h5').text('FOLLOWER GENDER');	
		}
		
		if(proposalId=="beyoulovelife-presents-welcome-to-byllboard-launch-weekend"){
			$('div[jt-section-view="offers"] .nav h3').text('Sponsorship Opportunity');
			$('#menu-offers a').text('Sponsorship Opportunity');
			$('div[jt-section-view="offers"] h2').text('Sponsorship Opportunity');
			$('.hero-image .slogan h1').css('color','#000000');
			$('div[jt-section-view="audience"] .nav').hide();
			$('div[jt-section-view="audience"] .wrap-white').hide();
			$('div[jt-section-view="audience"] .divider40').hide();
			$('#menu-audience').hide();
		}
		
		if(proposalId=="gridiron-dreams-football-academy"){
			$('div[jt-section-view="speaker"] .nav').find('h3').text('Featured Guests');
			$('div[jt-section-view="speaker"]').find('h2').text('Featured Guests');
			$('#menu-speaker a').html('Featured Guests');
			
			$('div[jt-section-view="sponsor"] .nav').find('h3').text('Recent Sponsors');
			$('#menu-sponsor a').html('Recent Sponsors');
		}

		if(proposalId=="wet-fest-electronic-dance-music-cruise-2"){
			$('div[jt-section-view="speaker"] .nav').find('h3').text('Performers');
			$('div[jt-section-view="speaker"]').find('h2').text('Performers');
			$('#menu-speaker a').html('Performers');
		}

		if(proposalId=="sponsor-a-youth-campaign" || proposalId=="a-garden-party-0"){
			$('div[jt-section-view="project"] h3').text('THE PROGAM');
			$('div[jt-section-view="audience"] h3').text('PARTICIPANTS');
			$('div[jt-section-view="offers"] h3').text('SPONSORSHIPS');
			$('div[jt-section-view="offers"] h2').text('SPONSORSHIPS');
			$('div[jt-section-view="tell-us-more"] h2').text('ABOUT THE PROGAM');
			$('div[jt-section-view="attendees_number"] h5').text('EXPECTED PARTICIPATION');
			$('div[jt-section-view="attendees_number"] th[jt-template-view="event_scope"] p').text("It's a local program");
			$('div[jt-section-view="attendees_number"] td[jt-template-view="attendee_number"] p').text("participants");
			$('div[jt-section-view="attendees_gender"] h5').text('Participant Gender');
		}
		if(proposalId=="little-black-dress-dinner-party"){
			$('div[jt-section-view="speaker"] .nav').find('h3').text('Honorees');
			$('div[jt-section-view="speaker"]').find('h2').text('Honorees');
			$('#menu-speaker a').html('Honorees');
		}
		if(proposalId=="little-black-dress-group-0"){
			$('#map-canvas').hide();
			$('.date_place p[jt-attr="place"]').parent().parent().hide();
			$('div[jt-section-view="tell-us-more"] h2').text('About the Group & About the Event');
			$('div[jt-section-view="audience"] h2').text('Member Demographics');
			$('div[jt-section-view="attendees_number"] h5').text('Member Recruitment');
			$('div[jt-section-view="attendees_number"] td[jt-template-view="attendee_number"] p').text("members are wanted");
			$('div[jt-section-view="attendees_gender"] h5').text('Member Gender');
			$('.footer-contact h3').html('<span class="icn-contact"></span><span>Join us</span>');
			$('.menu .button-contact .t-cell').html('Join us<span class="icn-contact"></span>');
		}
		
		if(proposalId=="shri-outlook-2016"){
			$('div[jt-section-view="sponsor"] .nav').find('h3').text('Sponsors/Supporting Partners');
		}
		if(proposalId=="small-world-music-festival-2015-1"){
			$('div[jt-section-view="speaker"] .nav').find('h3').text('Artists');
			$('div[jt-section-view="speaker"]').find('h2').text('Artists');
			$('.hero-image h1').html("");
			$('#menu-speaker a').html('Artists');
		}
		if(proposalId=="a-street-af-fair-east-meets-west" || proposalId=="a-street-af-fair-east-meets-west-0"){
			$('div[jt-section-view="sponsor"] .nav').find('h3').text('Past Sponsors');
			$('li[jt-section-view="non_medias"]').text('Collateral');
			$('#menu-sponsor a').html('Past Sponsors');
		}
		
		if(proposalId=="los-angeles-soul-music-festival-1"){
			$('div[jt-section-view="speaker"] .nav').find('h3').text('Performers');
			$('div[jt-section-view="speaker"]').find('h2').text('Performers');
			$('li[jt-section-view="packages_s2"]').text('Additional Options');
			$('#menu-speaker a').html('Performers');
		}
		
		if(proposalId=="laugh-boston"){
			$('div[jt-section-view="key_numbers"]').find('h5').text('Key Infos');
			$('div[jt-section-view="tell-us-more"]').find('h2').text('About the venue');
			$('div[jt-section-view="audience"]').hide();
			$('.date_place p[jt-attr="end"]').parent().parent().hide();
		}
		
		if(proposalId=="green-visions-2016-0" || proposalId=="green-visions-2016"){
			$('div[jt-section-view="audience"]').find('h2').text('PARTICIPANT DEMOGRAPHICS');
		}
		
		console.log(idForm);
		display_form_id_video(idForm);

		console.log("-----HREF------");
		$('.description-details a').each(function(e){
			var href = $(this).attr('href');
			//console.log(e+"=>"+href+"=>"+href.indexOf("http"));
			if(href && href.indexOf("http")==-1 && href.indexOf("#")==-1){
				 $(this).attr('href',"http://"+href);
			}
		});
		
		if(currencyD == '$' || currencyD == '£'){
			$('span.currency').text('');
			$('span.currencyD').text(currencyD);
		}else{
			$('span.currency').text(currency);
			$('span.currencyD').text('');
		}
		
		if($('p[jt-attr="end"]').text()==$('p[jt-attr="start"]').text() && $('p[jt-attr="end"]').text()==""){
			$('p[jt-attr="end"]').parent().parent().hide();
		}
		
		
		
		if($('p[jt-attr="end"]').text()==$('p[jt-attr="start"]').text() || $('p[jt-attr="end"]').text()==""){
			$('p[jt-attr="end"]').parent().hide();
		}
		
		$.ajax({
			url: '/ajax/check.php',
			type: 'GET',
			data: 'user_id='+userId+'&proposal_id='+mproposalId,
			success : function(data){
				var json = eval(data);
				
				var abonnement = json[0].abonnement;
				var user = json[0].user;
				var protectdeck = json[0].protectdeck;
				
				if(!previewMode){
					loadProtectDeck(protectdeck);
				}
				
				
				var time = (new Date().getTime())/1000;

				if(abonnement && abonnement.id && abonnement.id>0 && abonnement.enddate>time){
				
				}else{
					$('[jt-section-view="about_us"]').addClass("hidden");
					$('[jt-section-view="medias"]').addClass("hidden");
					$('[jt-section-view="speaker"]').addClass("hidden");
					$('[jt-section-view="team"]').addClass("hidden");
					$('[jt-section-view="finances"]').addClass("hidden");
					$('[jt-section-view="sponsor"]').addClass("hidden");
					$('[jt-section-view="annexes"]').addClass("hidden");
				}
			}
		});
	});

}
function loadProtectDeck(data){
	if(data && data.key!=""){
		$('#protectdeck').show();
		
		$("#codecheck2").on('click',function(){
			$.ajax({
				url: '/ajax/check.php',
				type: 'GET',
				data: 'user_id='+userId+'&proposal_id='+mproposalId+'&code='+$("#codecheck").val(),
				success : function(data){
					var json = eval(data);
					var access = json[0].access;
					if(access.status=="OK"){
						$('#protectdeck').fadeOut();
						setTimeout(function(){
							$('#protectdeck').remove();
						}, 1000);
					}
				}
			});
		});
	}
}
function initCheckMarketing(){
	if($('div[jt-view="my_media_social"]').css('display')=="none" && $('div[jt-view="my_media_website"]').css('display')=="none"){
		$('div[jt-section-view="my_medias"]').addClass('hidden').hide();
	}
	if($('div[jt-section-view="medias"]').find('.element').size()==$('div[jt-section-view="medias"]').find('.element.hidden').size()){
		$('div[jt-section-view="medias"]').addClass("hidden");
		$('li[jt-section-view="medias"]').addClass("hidden");
	}else{
		$('div[jt-section-view="medias"]').removeClass("hidden");
		$('li[jt-section-view="medias"]').removeClass("hidden");
	}
}
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function loadTemplateViews(){
	$('[jt-template-view]').each(function(index, element){
		var view = $(element);
		var key = view.attr('jt-template-view');

		if(templatesHTML[key]){
			if(typeof(templatesHTML[key]) == "string"){
				var oldView = templatesHTML[key];
				templatesHTML[key] = {
					0: oldView
				};
			}

			var numberViews = count_object_property(templatesHTML[key]);
			templatesHTML[key][numberViews] = view[0].outerHTML;
		}
		else{
			templatesHTML[key] = view[0].outerHTML;
		}

		view.remove();
	});
}

function loadElement(key, data){
	var containerView = $('[jt-view="' + key +'"]');
	containerView.html('');
	//console.log("Key load: " + key);
	if(containerView.length == 1){
		var templateHTML = templatesHTML[key];

		if(!templateHTML){
			console.log("No template view for: " + key);
			return;
		}

		if(!refreshSectionView(containerView, key, data)){
			//console.log("refreshSectionView : " + key);
			if(!containerView.is(":visible")){
				showElement($('body'), true);
			} 
			return;
		} 

		try{

			if(containerView.attr('jt-attr') == 'custom'){
				eval("load_" + key + "(containerView, templateHTML, data);");
			}
			else{
				var templates = classic_load(containerView, templateHTML, data);
				eval("load_" + key + "(containerView, templates, data);");
			}
			//console.log("Element find for: " + key);	
			if(window.is_loaded){
				showElement(containerView);	
			}

		}catch(e){
			console.log(key+" => Element find for: " + e.message);
		}
	}
	else {
		console.log("No element: " + key);
	}
	
		
	if(typeof isdisplay_form_id_video != 'undefined'){	
		display_form_id_video(idForm);
	}
}

function loadTemplateElement(key, data){
	try{
		var templates = $('[jt-template="' + key + '"]');
		eval("load_template_" + key + "(templates, data);");
	}catch(e){
		console.log(e.message);
	}
}

function classic_load(containerView, templateHTML, data){
	var templates = [];

	for(var i in data){
		var templateData = data[i];
		var templateView = $(templateHTML);
		templates.push(templateView);
		containerView.append(templateView);

		for(var attr in templateData){
			var attrData = templateData[attr];
			/*if(attr=="start" || attr=="end"){
				var astr = attrData.split("/");
				var sl = astr[1]+"/"+astr[0]+"/"+astr[2];
				templateView.find('[jt-attr="' + attr + '"]').html(sl);
			}else */
			
			if(typeof(attrData) == "string" || typeof(attrData) == "number"){
				if(typeof(attrData) == "string"){
					attrData = attrData.replace(/&nbsp;/g,' ');
				}
				templateView.find('[jt-attr="' + attr + '"]').html(attrData);
			}
			else{
				for(var j in attrData){
					if(typeof(attrData[j]) == "string"){
						attrData[j] = attrData[j].replace(/&nbsp;/g,' ');
					}
					templateView.find('[jt-attr="' + attr + '.' + j + '"]').html(attrData[j]);
				}
			}
		}
	}

	return templates;
}

function refreshSectionView(containerView, key, data){
   
    console.log("In RefresView "+key+" => "+data);
    
    
	var sectionView = containerView.parents('[jt-section-view]');
	var sectionName = sectionView.attr('jt-section-view');
	var isVisible = (data && count_object_property(data) > 0);

	console.log("In RefresView "+key );
	console.log(data);
	console.log(" => "+isVisible);

	if(!isVisible){
		if(key=="my_media_social" || key=="my_media_website" || key=="coverage_media_online"){
			$('[jt-view="'+key+'"]').hide();
			$('[jt-view="'+key+'"]').prev().hide();
		}
		
		if(key=="coverage_press" || key=="coverage_radio" || key=="coverage_tv"){
			if($('div[jt-view="coverage_radio"]').text()=="" && $('div[jt-view="coverage_press"]').text()=="" && $('div[jt-view="coverage_tv"]').text()==""){
				$('[jt-view="coverage_tv"]').parent().prev().hide();
			}else{
				$('[jt-view="coverage_tv"]').parent().prev().show();
			}
		}

		if(key=="coverage_press" || key=="coverage_radio" || key=="coverage_tv"){
			$('[jt-view="'+key+'"]').hide();
		}
    }else{
    	if(key=="my_media_social" || key=="my_media_website"  || key=="coverage_media_online"){
			$('[jt-view="'+key+'"]').show();
			$('[jt-view="'+key+'"]').prev().show();
			initCheckMarketing();
		}
		if(key=="coverage_press" || key=="coverage_radio" || key=="coverage_tv"){
			$('[jt-view="coverage_tv"]').parent().prev().show();
			initCheckMarketing();
		}
    }

	
	
	
	var parentSectionName = registerSection(sectionView, sectionName);
	registerElementForSection(sectionName, 'inputs', key);
	setStateForSection(sectionName, 'inputs', key, isVisible);
	refreshVisibilityForSection(sectionName, parentSectionName);

	return isVisible;
}

function registerSection(sectionView, sectionName){
	var parentSectionView = sectionView.parents('[jt-section-view]');

	if(parentSectionView.length > 0){
		var parentSectionName = parentSectionView.attr('jt-section-view');
		registerElementForSection(parentSectionName, 'sections', sectionName);

		return parentSectionName;
	}

	return null;
}

function registerElementForSection(sectionName, type, key){
	if(!sectionViews[sectionName]){
		sectionViews[sectionName] = {};
	}
	if(!sectionViews[sectionName][type]){
		sectionViews[sectionName][type] = {};
	}

	sectionViews[sectionName][type][key] = {
		isVisible: false
	};
}

function setStateForSection(sectionName, type, key, isVisible){
	sectionViews[sectionName][type][key].isVisible = isVisible;
}

function refreshVisibilityForSection(sectionName, parentSectionName){
	var sections = $('[jt-section-view="' + sectionName + '"]');

	var sectionVisible = false;
	for(var i in sectionViews[sectionName].inputs){
		if(sectionViews[sectionName].inputs[i].isVisible){
			sectionVisible = true;
			break;
		}
	}
	for(var i in sectionViews[sectionName].sections){
		if(sectionViews[sectionName].sections[i].isVisible){
			sectionVisible = true;
			break;
		}
	}

	if(sectionVisible === true){
		sections.removeClass('hidden');
	}
	else{
		sections.addClass('hidden');
	}

	if(!parentSectionName){
		return;
	}

	var sectionParents = $('[jt-section-view="' + parentSectionName + '"]');
	setStateForSection(parentSectionName, 'sections', sectionName, sectionVisible);

	sectionVisible = false;
	for(var i in sectionViews[parentSectionName].inputs){
		if(sectionViews[parentSectionName].inputs[i].isVisible){
			sectionVisible = true;
			break;
		}
	}
	for(var i in sectionViews[parentSectionName].sections){
		if(sectionViews[parentSectionName].sections[i].isVisible){
			sectionVisible = true;
			break;
		}
	}

	if(sectionVisible){
		sectionParents.removeClass('hidden');
	}
	else{
		sectionParents.addClass('hidden');
	}
}

function count_object_property(object){
	var count = 0;
	for(var i in object){
		count++;
	}

	return count;
}

function inIframe() {
    try {
        return getUrlParameters('preview', "", true); 
        //window.self !== window.top;
    } catch (e) {
        return true;
    }
}


// Use for preview
function showElement(containerView, header) {
	if(typeof header === 'undefined') {
		var targetElement = containerView.parents('[jt-section-view]');
		// A RECODER - DYNAMIQUE 
		if(targetElement.outerHeight() > (containerView.find('[jt-template-view]').outerHeight() + 210)){
			targetElement = containerView.find('[jt-template-view]');
		}
		if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'target_audience'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'non_media'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'key_numbers'){
			targetElement = containerView.find('[jt-template-view]').parent().parent();
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'event_scope'){
			targetElement = $('.map-target');
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'attendee_number'){
			targetElement = $('.map-target');
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'my_media_website'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'coverage_media_online'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'my_media_social'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'non_packages'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'package'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'event_description_details'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'packages'){
			targetElement = $('.offers');
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'appendix'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'team'){
			targetElement = containerView;
		}else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'speaker'){
			targetElement = containerView;
		}else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'sponsor'){
			targetElement = containerView;
		} else if(containerView.find('[jt-template-view]').attr('jt-template-view') == 'target_description'){
			targetElement = containerView;
		}
		
		console.log("showElement : " + containerView.find('[jt-template-view]').attr('jt-template-view'));
		
		showSection(containerView);
	} else {
		targetElement = $('body');
	}

	$('html, body').stop().animate({  
		scrollTop: Math.max(targetElement.offset().top - 200, 0)
	}, 200, function(){
		var highlight = $('.highlight');
		var optop = $('.opaque-top');
		var opbot = $('.opaque-bottom');

		if(inIframe() == true){

			if (highlight.is(':hidden')) {
				highlight.show();
			}

			highlight.css({
				'top'	 	: Math.max(targetElement.offset().top - 20, 0),
				'height' 	: targetElement.outerHeight() + 40
			});
			
			console.log("css:"+targetElement.attr('css')+", outerHeight:"+targetElement.outerHeight()+", height:"+targetElement.height());
			//console.log("css:"+containerView.find("[jt-section-view='key_numbers']").attr('css')+", height:"+containerView.find("[jt-section-view='key_numbers']").outerHeight());
			
			optop.css({
				'height' 	: Math.max(targetElement.offset().top - 20, 0)
			});
			opbot.css({
				'top'	 	: Math.max(targetElement.offset().top - 20, 0) + (targetElement.outerHeight() + 40),
				'height' 	: $(document).height() - (Math.max(targetElement.offset().top - 20, 0) + (targetElement.outerHeight() + 40))
			});
		}
	});  

	
}
function initHideMenu(){
	console.log("initHideMenu=>"+$('div[jt-section-view="medias"] .menu li.hidden').length);
	if(parseInt($('div[jt-section-view="medias"] .menu li.hidden').length)==2){
		$('div[jt-section-view="medias"] .menu').css({'opacity':0,'margin-bottom':-40});
		$('div[jt-section-view="medias"] .super-header-white').hide();
	}else{
		$('div[jt-section-view="medias"] .menu').css({'opacity':1,'margin-bottom':62});
		$('div[jt-section-view="medias"] .super-header-white').show();
	}
	if(parseInt($('div[jt-section-view="offers"] .menu li.hidden').length)==1){
		$('div[jt-section-view="offers"] .menu').css({'opacity':0,'margin-bottom':-40});
		$('div[jt-section-view="offers"] .super-header-white').hide();
	}else{
		$('div[jt-section-view="offers"] .menu').css({'opacity':1,'margin-bottom':62});
		$('div[jt-section-view="offers"] .super-header-white').show();
	}
}

// Process show and hide on slider
// WARNING petit bug ne met pas a jour le menu du slider
function showSection(containerView) {
	var sectionView = containerView.parents('[jt-section-view]');
	var sectionName = sectionView.attr('jt-section-view');	

	if(!sectionView.hasClass('element')) {
		return;
	}

	sectionView.parent().children('.element').not('[jt-section-view="packages_s1"]').not('[jt-section-view="packages_s2"]').hide();
	sectionView.show();
}


// function refreshSectionView(containerView, key, data){
// 	var sectionView = containerView.parents('[jt-section-view]');
// 	var sectionName = sectionView.attr('jt-section-view');
// 	sectionView = $('[jt-section-view="' + sectionName + '"]');

// 	if(!sectionViews[sectionName]){
// 		sectionViews[sectionName] = {
// 			inputs: {},
// 			sections: {}
// 		};
// 	}
// 	if(!sectionViews[sectionName].inputs[key]){
// 		sectionViews[sectionName].inputs[key] = {};
// 	}

// 	if(data && count_object_property(data) > 0){
// 		sectionViews[sectionName].inputs[key].isVisible = true;
// 	}
// 	else{
// 		sectionViews[sectionName].inputs[key].isVisible = false;
// 	}

// 	var sectionVisible = false;
// 	for(var i in sectionViews[sectionName].inputs){
// 		if(sectionViews[sectionName].inputs[i].isVisible){
// 			sectionVisible = true;
// 			break;
// 		}
// 	}	

// 	if(sectionVisible){
// 		sectionView.show();
// 	}
// 	else{
// 		sectionView.hide();
// 	}

// 	return sectionVisible;
// }

function getUrlParameters(parameter, staticURL, decode){
   /*
    Function: getUrlParameters
    Description: Get the value of URL parameters either from 
                 current URL or static URL
    Author: Tirumal
    URL: www.code-tricks.com
   */
   console.log("WINDOW LOCATION  OK=> "+window.location.href);
   var currLocation = (staticURL.length)? staticURL : window.location.search;
   console.log("currLocation => "+currLocation);
   if(!currLocation){
	   currLocation = window.location.href;
	   var pathToTcheck = currLocation.split("/");
	   console.log("currLocation parameter=> "+parameter);
	   console.log("currLocation pathToTcheck=> "+pathToTcheck[4]);
	   if(parameter=="id" && pathToTcheck[4]!="1"){
		   return pathToTcheck[4];
	   }else if(parameter=="preview"  && pathToTcheck[5] && pathToTcheck[5].indexOf("preview")>-1){
		   return true;
	   }else{
		   return false;
	   }
   }
   var parArr = currLocation.split("?")[1].split("&");
   var returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;
        }
   }
   
   if(!returnBool) return false;  
}

$(document).ready(function () {
	var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    //alert(msie);
    /*if (msie > -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        $('#qLtempOverlay').hide();
        $('#lloader').hide();
    }else{
    	$("body").queryLoader2({
		    barColor: "#f25743",
		    backgroundColor: "#fff",
		    percentage: true,
		    barHeight: 3,
		    minimumTime: 200,
		    fadeOutTime: 500,
		    onComplete: function(){
				$('#lloader').fadeOut(500);
			}
		});
    }*/
    //$('#qLtempOverlay').hide();
    //$('#lloader').hide();
});

// $(window).load(function(){
// 	$('head title').html('Battleford Corp - '+$('.slogan h1').text());
// });
