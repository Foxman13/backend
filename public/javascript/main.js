$(document).ready(function(){
	var goallist = [];

	$('.input-list li').click(function(evt){
		//add item to goallist
		// add a new item to the middle
		var goaln = $(this).attr('data-id');
		goallist.push(goaln);
		//console.log(goaln);
		evt.stopPropagation();
		console.log(goallist);
	})


	$('.add-button').click(function(){

		$('.campaign-item').show();

	})

	$('#save').click(function(){
		var des = $('#campaigndescription').val();
		var cname = $('#campaignname').val();
		//var goallist;
		//for loop of goals that are selected

		//for loop of subs/notifications

		console.log(val);

		$.ajax({
		  type: "POST",
		  url: '/api/campaign',
		  data: {name: cname, description:des, goals:goallist, },
		  success: function(result){

	  		console.log(result);

		  },
		  error: function(err){
		  	console.log(err);
		  }
		});
	})
})

