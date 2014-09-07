$(document).ready(function(){
	var goallist = [];
	var subcriberlist = [];

	
	var getCampaigns = function(){
		
		$.get( "/api/campaign", function( data ) {
  			console.log("data")
		})
	}
	getCampaigns();



	var chart = new CampaignChart({ parent: $('.campaign-chart'), sourceGoals: [{
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
<<<<<<< HEAD
	}, {
	    glyph: "/images/twitter.png",
	    filterValue: "TechCrunch",
	    thresholdValue: "200"
	}], outputs: [{}, {}]
	});
=======
        }], outputs: [] });


>>>>>>> origin/master
	$('.input-list li').click(function(evt){
		//add item to goallist
		// add a new item to the middle
		var goaln = {
			name: $(this).attr('data-id'),
			source: subcriberlist,
			count: 20};

		goallist.push(goaln);
		//console.log(goaln);
		evt.stopPropagation();
		console.log(goallist);
	})

	$('.output-list li').click(function(evt){

		var output = $(this).attr('data-id');
		subcriberlist.push(output);
		

		var subcriberobject = {
			name: $(this).attr('data-id'), 
			notifications: $(this).attr('data-id')};
		subcriberlist.push(subcriberobject);
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

		//goal name, source, count, 
		//source inputs, name, description
		// sub name, notifications
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

