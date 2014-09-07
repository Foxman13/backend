$(document).ready(function(){
	var goallist = [];
	var subcriberlist = [];
	var getCampaigns = function(){
		console.log("here we go")
		$.ajax({
		  type: "GET",
		  url: '/api/campaign',
		  success: function(result){

	  		console.log("success");

		  },
		  error: function(err){
		  	console.log("OMG ERROR");
		  }
		});

	}

	getCampaigns();
	var chart = new CampaignChart({ parent: $('.campaign-chart'), sourceGoals: [{
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        }], outputs: [{
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        }] });
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


	var getCampaigns = function(){
		
		$.get( "/api/campaign", function( data ) {
  			console.log("data")
		})
	}
})

