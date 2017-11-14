function load_form_contact(url){
	console.log('load_form_contact => '+url);
	var form = $('form');

	form.attr('action', url).attr('method', 'POST');

	form.on('submit', function(e){
		var itsok = true;
		$('#contact .dropdown[required="required"]').each(function(){
			if($(this).find('li.dropdown-selected').size()==0){
				$(this).find('li').css('border','1px solid red');
				itsok = false;
			}else{
				$(this).find('li').css('border','1px solid rgba(0, 0, 0, 0.15)');
			}
		});
		
		e.preventDefault();
		/*mixpanel.track("receiveLead",{
			"template":"TRUE",
			"email":$('form input[name="contact[email]"]').val()
		});*/
		
		

	    if(itsok){
		    $(".contact-footer button").text("WAITING ...");
		    $.ajax({
				url: $(this).attr('action'),
				type: $(this).attr('method'),
				data: $(this).serialize(),
				success:function(msg){
					setTimeout(function(){
						$(".contact-footer button").text("MESSAGE HAVE BEEN SENT !");
						setTimeout(function(){
							$(".contact-footer button").text("Submit Form");
							$('#contact input[type="text"]').val('');
							$('#contact textarea').val('');
							$('#contact .icn-cross').trigger('click');
							$('#contact .dropdown[required="required"]').each(function(){
								$(this).find('li').css('border','1px solid rgba(0, 0, 0, 0.15)');
							});
						}, 1000);
					}, 500);
					
					
				}
			});
			
	    }
		
	});

}
