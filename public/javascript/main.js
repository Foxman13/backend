$(document).ready(function(){
	
	$('.input-list li').click(function(evt){
		// add a new item to the middle
		console.log("these have been fired");
		evt.stopPropagation();

	})

	$('#submit-campaign').click(function(evt){
		//add a new Campaign...Need to connect this to the backend somehow...
//		$.post("/", function( data ) {

		console.log($('#campaigndescription').val());
//	    })
//		console.log("submit clicked");
//		evt.stopPropagation();
	})

	$.get("/api/campaign", function( data ) {
	  console.log(data);
	});
})
