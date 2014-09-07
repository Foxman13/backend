$(document).ready(function () {
    var goallist = [];
    var subcriberlist = [];
	
	var listCharts=[];
	var getCampaigns = function(){
		
		$.get( "/api/campaign", function( data ) {

  			var cloneNode = $($('.results-list li')[0]).clone();
  			var len = data.length;
  			var newHTML = '';
  			//$('.results-list').empty();
  			for(var i=0;i<len;i++){
                

               // $('.results-list').append(cloneNode);
  				

  				//$($(node).find('h3')[0]).text(data[i].name);
  			}

  		


		})
	}
	getCampaigns();

	initializeListItems();

    var chart = new CampaignChart({
        parent: $('.campaign-chart'),
        sourceGoals: [],
        outputs: []
    });

    $('.input-list li').click(function (evt) {
        var chartSourceGoal = new Goal(20, 0, {name: "hashtag", value: "hackdisrupt" }, "&#xe286", "twitter" );
        chart.addSourceGoal(chartSourceGoal);
        //goallist.push(goaln);
        //console.log(goaln);
        evt.stopPropagation();

    })

    $('.output-list li').click(function (evt) {
    	var output = $(this).attr('data-id');
        var glyph = $(this).find("icon").attr('class');
       
        subcriberlist.push(output);

    	 var subcriberobject = {
            name: output,
            notifications: output,
            glyph: glyph
        };
        var chartOutput = new SubscriptionOutput( );
        chartOutput.name = output;
        chartOutput.glyph = glyph;
        chart.addSubscriptionOutput(chartOutput);

   

        
       
        subcriberlist.push(subcriberobject);

        
       

    })


    $('.add-button').click(function () {

        $('.campaign-item').show();

    })

    $('.clickAdvance').click(function () {
        if (chart)
            chart.updateToRandomValues();
    })

    $('#save').click(function () {
        var des = $('#campaigndescription').val();
        var cname = $('#campaignname').val();
        //for loop of goals that are selected

        //for loop of subs/notifications

        //goal name, source, count, 
        //source inputs, name, description
        // sub name, notifications
        //add item to goallist
        // add a new item to the middle


/*
        var tempName = new Date().getTime() + "__GOAL";
        var goal = {
            goal_count: 20,
            source: $(this).attr('data-id'),
            inputs: [{ name: 'hashtag', value: 'hashtagvalue' }],
            name: new Date().getTime() + "__GOAL",
            continuous_messaging: true
        }


*/



        $.ajax({
            type: "POST",
            url: '/api/campaign',
            data: { name: cname, description: des, goals: goallist, subscribers: subcriberlist },
            success: function (result) {

                console.log(result);

            },
            error: function (err) {
                console.log(err);
            }
        });
    })




    $('.results-list li').click(function (evt) {


        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected')
            
            
        } else {

            $(this).addClass('selected')
            
        }
    })


    function initializeListItems()
    {
    	var chartSourceGoal = new Goal(20, 0, {name: "hashtag", value: "hackdisrupt" }, "&#xe286", "twitter" );
    	var chartSourceGoal2 = new Goal(20, 0, {name: "hashtag", value: "hackdisrupt" }, "&#xe286", "twitter" );
        var chartOutput = new SubscriptionOutput( );
        chartOutput.name = 'Rocket';
        chartOutput.glyph = 'glyphicon glyphicon-send';
        
 		 var subchart = new CampaignChart({
        		parent: $($('.results-expanded')[1]),
        		sourceGoals: [chartSourceGoal,chartSourceGoal2],
        		outputs: []
    		});
         subchart.addSubscriptionOutput(chartOutput);
         listCharts.push(subchart);

         listCharts.forEach(function (chart) {
             var randInterval = 1200 * Math.random() + 250;
             setInterval(chart.updateToRandomValues, randInterval);
        })
      
    }


})

