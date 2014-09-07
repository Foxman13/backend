$(document).ready(function(){
	var goallist = [];
	var subcriberlist = [];

	var item = new CampaignChart($('.campaign-chart'));

	$('.input-list li').click(function(evt){
		//add item to goallist
		// add a new item to the middle
		var goaln = $(this).attr('data-id');
		goallist.push(goaln);
		//console.log(goaln);
		evt.stopPropagation();
		console.log(goallist);
	})

	$('.output-list li').click(function(evt){
		var output = $(this).attr('data-id');
		subcriberlist.push(output);
		console.log(subcriberlist);
	})


	$('.add-button').click(function(){

		$('.campaign-item').show();

	})

	$('#save').click(function(){
		var des = $('#campaigndescription').val();
		var cname = $('#campaignname').val();
		//for loop of goals that are selected

		//for loop of subs/notifications

		console.log(val);

		$.ajax({
		  type: "POST",
		  url: '/api/campaign',
		  data: {name: cname, description:des, goals:goallist, subscribers: subcriberlist },
		  success: function(result){

	  		console.log(result);

		  },
		  error: function(err){
		  	console.log(err);
		  }
		});
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

