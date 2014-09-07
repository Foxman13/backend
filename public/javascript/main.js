$(document).ready(function(){
	var goallist = [];
	var subcriberlist = [];

	
	var getCampaigns = function(){
		
		$.get( "/api/campaign", function( data ) {
  			var cloneNode = $($('.results-list li')[0]).clone();
  			var len = data.length;
  			var newHTML = '';
  			$('.results-list').empty();
  			for(var i=0;i<len;i++){
                

                $('.results-list').append(cloneNode);
  				

  				//$($(node).find('h3')[0]).text(data[i].name);
  			}
		})
	}
	getCampaigns();



	var chart = new CampaignChart({ parent: $('.campaign-chart'), sourceGoals: [
       ], outputs: [{}, {}]
	});

	$('.input-list li').click(function(evt){
		

		chart.pushSourceGoal({
            glyph: "/images/twitter.png",
            filterValue: "NameGoal",
            thresholdValue: "2500",
            source:$(this).attr('data-id')
        });

		//goallist.push(goaln);
		//console.log(goaln);
		evt.stopPropagation();
		
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
		//add item to goallist
		// add a new item to the middle

        var tempName = new Date().getTime()+"__GOAL";
		var goal={
			goal_count:20,
			source:$(this).attr('data-id'),
			inputs:[{name:'hashtag',value:'#hashtagvalue'}],
			name:new Date().getTime()+"__GOAL",
			continuous_messaging:true
		}

		
		

        
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

