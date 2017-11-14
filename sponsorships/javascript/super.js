if (!$.support.transition)
	$.fn.transition = $.fn.animate;

var inset = [];

$(window).load(function(){
	scrollingMenu();
	scrollingNav();
	$(window.is_loaded).on('change',function(){

	})
});

$(window).scroll(function(){
	$('.super').each(function(index,obj){

		if( ( $('.super').eq(index).offset().top + $('.super').eq(index).height())  < ($(window).scrollTop()+85+contact)){
			if(inset[index]){
				// colBottomSuperNav(index);
				inset[index] = false;
			}
		}
		else if(!inset[index] && $('.super').eq(index).offset().top < $(window).scrollTop()+93+contact && $('.super').eq(index).offset().top+$('.super').eq(index).height() > $(window).scrollTop()+93+contact ){
			// lockSuperNav(index);
			inset[index] = true;
			$('#header .menu ul li.select').removeClass('select');
			$('#header .menu ul li').eq(index).addClass('select');
		}
		else if( inset[index] && $('.super').eq(index).offset().top > $(window).scrollTop()+93+contact ){
			// colTopSuperNav(index);
			inset[index] = false;
		}

	});
});

var scrollingMenu = function(){
    var speed     = 1000;
    $('#header .menu ul li a[href^="#"]').on('click',function(){
        id = $(this).parent().index();
        divSuper = $('#content .super').eq(id);
		goTo(divSuper);
        return(false);
           void(0);
    });
    function goTo(ancre){
        navBar = 78;
        if($(window).width()<768){
        	$('html,body').animate({scrollTop:$(ancre).offset().top},speed,'swing');
        	$('#header').removeClass('open');
        }else{
        	$('html,body').animate({scrollTop:$(ancre).offset().top-navBar-contact},speed,'swing');
        }
    }
};
var stop=0;
var scrollingNav = function(){
    var speed     = 1000;
    $('.super .nav .backtotop').on('click',function(){
    	if(stop==0){
    		stop=1;
    		$('html,body').animate({scrollTop:0},speed,'swing', function(){
    			setTimeout(function(){
    				stop=0;
    			},2000)
    		});
    	} 
    });
    $('.logo').on('click',function(){
    	if(stop==0){
    		stop=1;
    		$('html,body').animate({scrollTop:0},speed,'swing', function(){
    			setTimeout(function(){
    				stop=0;
    			},2000)
    		});
    	} 
    });
};

$('a.seeprice').on('click', function(event){
	event.preventDefault();
	$('.sslightbox.pricing, .bglightbox').addClass('show').show();
});

$('.pricing a#close-lightbox').on('click', function(){
	$('.sslightbox.pricing, .bglightbox').removeClass('show').hide();
});

$('a.goabout').on('click', function(event){
	event.preventDefault();
	$('.about').addClass('show')
});
$('.about .crossclose').on('click', function(){
	$('.about').removeClass('show')
})

$('body').on('click','.show-benefit-description',function(){
	$(this).next().toggleClass('open');
})
