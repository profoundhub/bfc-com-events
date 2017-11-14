/*
	Le dropdown doit avoir un attribut dropdown
	Un selecteur avec la classe dropdown-selector
	Un ul
	A l ouverture la classe dropdown-open est ajoute
	Si li selectionne alors possede la classe dropdown-selected
*/

(function($){
	$.fn.dropdown = function(name, packageNames){

		var container = $('[dropdown="' + name + '"]');
		var listContainer = container.find('ul');
		var dropdownSelector = container.find('.dropdown-selector');
		var dropdownSelectorText = dropdownSelector.text();
		var selectedElements = [];

		function init(){
			reset();
			addListeners();
		}

		function reset(){
			listContainer.html('');
			selectedElements = [];

			refreshInputHidden();
			buildList();
		}

		function buildList(){
			for(var i = 0; i < packageNames.length; ++i){
				var element = $('<li></li>').html(packageNames[i]);
				listContainer.append(element);
			}
		}

		function addListeners(){
			$(document).on('click', function(e){
				if(isOpen() && e.target !== container[0] && !$(e.target).parents().is(container)){
					closeDropdown();
				}
			});
			container.on('reset', function(){
				reset();
			});
			dropdownSelector.on('click', function(e){
				e.preventDefault();
				toggleDropdown();
			});

			listContainer.on('click', 'li', function(e){
				e.preventDefault();
				toggleElement($(this));
			})
		}

		function toggleDropdown(){
			if(isOpen()){
				closeDropdown();
			}
			else{
				openDropdown();
			}
		}

		function isOpen(){
			return container.hasClass('dropdown-open');
		}

		function openDropdown(){
			container.addClass('dropdown-open');
		}

		function closeDropdown(){
			container.removeClass('dropdown-open');
		}

		function toggleElement(element){
			if(element.hasClass('dropdown-selected')){
				removeElement(element);	
			}
			else{
				addElement(element);
			}
		}

		function addElement(element){
			element.addClass('dropdown-selected');
			selectedElements.push(element.text());
			refreshInputHidden();
		}

		function removeElement(element){
			element.removeClass('dropdown-selected');
			var index = selectedElements.indexOf(element.text());
			if(index >= 0){
				selectedElements.splice(index, 1);
			}
			refreshInputHidden();
		}

		function refreshInputHidden(){
			container.find('input').remove();
			dropdownSelector.text('');

			for(var i = 0; i < selectedElements.length; ++i){
				var input = $('<input type="hidden">');
				input.attr('name', name + '[]');
				input.val(selectedElements[i]);
				container.append(input);
			}

			if(selectedElements.length == 0){
				dropdownSelector.text(dropdownSelectorText);
			}
			else{
				dropdownSelector.text(selectedElements.join(', '));
			}
		}

		init();
	};
})(jQuery);
