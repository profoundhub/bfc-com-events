/*script type="text/javascript" src="javascript/template.js?jnfekjn"></script>
	<script type="text/javascript" src="javascript/form_contact.js?chash=1"></script>
	<script type="text/javascript" src="javascript/load_element.js?chash=0"></script>
	<script type="text/javascript" src="javascript/load_template_element.js?chash=1"></script>*/

$(document).ready(function(){
	var js1  = '<script type="text/javascript" src="javascript/template.js?load='+Math.random()+'" ></script>';
	
	var js2  = '<script type="text/javascript" src="javascript/form_contact.js?load='+Math.random()+'" ></script>';
	
	var js3  = '<script type="text/javascript" src="javascript/load_element.js?load='+Math.random()+'" ></script>';
	
	var js4  = '<script type="text/javascript" src="javascript/load_template_element.js?load='+Math.random()+'" ></script>';
	
	/*var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        
    }else{
	    $('body #script').append('<script type="text/javascript" src="javascript/queryloader2.min.js?chash=1"></script>');
    }*/
    
	$('body #script').append(js1);
	$('body #script').append(js2);
	$('body #script').append(js3);
	$('body #script').append(js4);
	
	
	
	var tag = document.createElement('script');
	
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});