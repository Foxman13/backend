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
        $('.add-chart').text("Add an Output");

    })

    $('.output-list li').click(function (evt) {

    	var output = $(this).attr('data-id');
        var glyph = $(this).find("icon").attr('class');
        $('.add-chart').animate({'opacity':0,height:0})
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

        
       
        /*
        var chartOutput = new SubscriptionOutput($(this).attr('data-id'));
        chart.addSubscriptionOutput(chartOutput) 
		*/

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

        $('.campaign-item').hide();
       $("html, body").animate({ scrollTop: 250 }, "slow");
        //for loop of goals that are selected
        var goallist = chart.getGoalList();
        //for loop of subs/notifications
        
        //HACK Start our twitter notification provider
        $.post('http://localhost:3000/api/campaign/goals/start?campaign_id=540b917272c24af80fe8c226');


        //goal name, source, count, 
        //source inputs, name, description
        // sub name, notifications
        //add item to goallist
        // add a new item to the middle



        var des = $('#campaigndescription').val();
        var cname = $('#campaignname').val();
        //for loop of goals that are selected
        var goallist = chart.getGoalList();
        //for loop of subs/notifications
        var subscriptionlist = chart.getOutputList();
        
        //just impl for 1 source
        var output = null;
        if (subscriptionlist[0]) {
            output = subscriptionlist[0].source;
        
        }
        
        if (output != null) {
            
            var type = "";
            var endpoint = "";
            var continuous_messaging = false;
            var inputs = [];
            if (output == 'SMS') {
                type = 'Twilio',
            endpoint = "http://twilio.com/someunimplementedthing",
            continuous_messaging = false
            }
        else if (output == 'Rocket') {
                endpoint = 'https://api.spark.io/v1/devices/53ff6e066667574833512467/cycleRelay'
                type = 'SparkIoDigital',
            continuous_messaging = false,
            inputs = [{
                    name: 'access_token',
                    value: 'b737fdec95ead00a9d445146a3262f3e27798d66'
                },
            {
                    name: 'params',
                    value: 'r1,5000'
                }]
            }
        else if (output == 'Meter') {
                type = 'SparkIoProgress',
            endpoint = 'https://api.spark.io/v1/devices/53ff6f066667574832192167/showProgress',
            continuous_messaging = true,
            inputs = [{
                    name: 'access_token',
                    value: 'b737fdec95ead00a9d445146a3262f3e27798d66'
                },
            { name: 'params', value: 'r1,5000' }
               ]
            }
            
            var subcriberobject = {
                name: output,
                notifications: {
                    type : type,
                    endpoint : endpoint,
                    continuous_messaging : continuous_messaging,
                    inputs: inputs
                }
            };
            subcriberlist.push(subcriberobject);
            console.log(subcriberlist);
            
            
            
            var tempName = new Date().getTime() + "__GOAL";
            var goal = {
                goal_count: 20,
                source: $(this).attr('data-id'),
                inputs: [{ name: 'hashtag', value: '#hashtagvalue' }],
                name: new Date().getTime() + "__GOAL"
            }
            var glist = [];
            for (var z in goallist) {
            
                glist.push({
                    
                    name: goallist[z].name,
                    source: 'Twitter',
                    inputs: goallist[z].inputs,
                    count: goallist[z].count,
                    goal_count: goallist[z].count
                });
            }
            
            goallist.push(goal);


            $.ajax({
                type: "POST",
                url: '/api/campaign',
                data: { name: cname, goals: glist, subscribers: subcriberlist },
                success: function (data) {
                    console.log(data);
                },
                dataType: 'json'
            });
            /**
            $.ajax({
                type: "POST",
                url: '/api/campaign',
                data: { name: cname, goals: goallist, subscribers: subcriberlist },
                success: function (result) {
                    
                    console.log(result);

                },
                error: function (err) {
                    console.log(err);
                }
            });
            **/
        var chartSourceGoal = new Goal(300, 0, {name: "TC Hackathon", value: "hackdisrupt" }, "&#xe286", "twitter" );
        var chartOutput = new SubscriptionOutput( );
        chartOutput.name = 'Rocket';
        chartOutput.glyph = 'glyphicon glyphicon-send';
        var chartOutput2 = new SubscriptionOutput();
        chartOutput2.name = 'Gauge';
        chartOutput2.glyph = 'glyphicon glyphicon-dashboard';
        
   
         
 		 var chart1 = new CampaignChart({
        		parent: $($('.results-expanded')[0]),
        		sourceGoals: [chartSourceGoal],
        		outputs: [],
        		order:'prependTo'
    		});
 		 chart1.addSubscriptionOutput(chartOutput);
 		 chart1.addSubscriptionOutput(chartOutput2);

 		 listCharts.unshift(chart1);
 		
        }
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
    	var chartSourceGoal = new Goal(300, 0, {name: "TC Buzz", value: "techcrunch" }, "&#xe286", "twitter" );
        var chartOutput = new SubscriptionOutput( );
        chartOutput.name = 'Rocket';
        chartOutput.glyph = 'glyphicon glyphicon-send';
        var chartOutput2 = new SubscriptionOutput();
        chartOutput2.name = 'Fire';
        chartOutput2.glyph = 'glyphicon glyphicon-fire';
        
 		 var chart1 = new CampaignChart({
        		parent: $($('.results-expanded')[0]),
        		sourceGoals: [chartSourceGoal],
        		outputs: []
    		});
 		 chart1.addSubscriptionOutput(chartOutput);
 		 chart1.addSubscriptionOutput(chartOutput2);

 		 listCharts.push(chart1);

 		 var chart2SourceGoal = new Goal(6000, 0, { name: "hashtag", value: "NFLSunday" }, "&#xe286", "twitter");
 		 var chart2SourceGoal2 = new Goal(2000, 0, { name: "hashtag", value: "SNF" }, "&#xe286", "twitter");
 		 var chart2Output = new SubscriptionOutput();
 		 chart2Output.name = 'SMS';
 		 chart2Output.glyph = 'glyphicon glyphicon-phone';

 		 var chart2 = new CampaignChart({
 		     parent: $($('.results-expanded')[0]),
 		     sourceGoals: [chart2SourceGoal, chart2SourceGoal2],
 		     outputs: []
 		 });
 		 chart2.addSubscriptionOutput(chart2Output);

 		 listCharts.push(chart2);



 		 var chart3SourceGoal = new Goal(6000, 0, { name: "IOT", value: "IoT" }, "&#xe410", "bing");
 		 var chart3Output = new SubscriptionOutput();
 		 chart3Output.name = 'SMS';
 		 chart3Output.glyph = 'glyphicon glyphicon-phone';

 		 var chart3 = new CampaignChart({
 		     parent: $($('.results-expanded')[1]),
 		     sourceGoals: [chart3SourceGoal],
 		     outputs: []
 		 });
 		 chart3.addSubscriptionOutput(chart3Output);

 		 listCharts.push(chart3);

         listCharts.forEach(function (chart) {
             var randInterval = 1200 * Math.random() + 250;
             setInterval(chart.updateToRandomValues, randInterval);
        })
      
    }


})

