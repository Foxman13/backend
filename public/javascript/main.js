$(document).ready(function(){
	
	$('.input-list li').click(function(evt){
		// add a new item to the middle
		console.log("these have been fired");
		evt.stopPropagation();

	})
})