$(document).ready(function(){
	



	$('.input-list li').click(function(evt){
		// add a new item to the middle
		console.log("these have been fired");
		evt.stopPropagation();


	})

	$('.add-button').click(function(){

		$('.campaign-item').show();

	})

	$('.submit').click(function(){

		var val = $('#CampaignDescription').val();
		console.log(val);
	})

	$('.results-list li').click(function(evt){
		if($(this).hasClass('selected'))
		{
			$(this).removeClass('selected')
		}else{

			$(this).addClass('selected')
		}
	})
})