$(document).ready(function () {
    var goallist = [];
    var subcriberlist = [];
	
	var getCampaigns = function(){
		
		$.get( "/api/campaign", function( data ) {
  			console.log('Data returned',data);

  			//$( ".hello" ).clone().appendTo( ".goodbye" );
  			var len = data.length;
  			var html = $($('.results-list li')[0]).html();
  			console.log(html)
  			var newHtml ='';
  			
  			html = $($(html).find('h3.ctitle').text("FUCK")).html()
  			
  			$('.results-list').empty();
  			for(var i=0;i<len;i++){
  				newHtml +=html;
  			}

  			$($('.results-list')).append(newHtml);

		})
	}
	getCampaigns();

    var chart = new CampaignChart({
        parent: $('.campaign-chart'),
        sourceGoals: [],
        outputs: []
    });

    $('.input-list li').click(function (evt) {
        var chartSourceGoal = new Goal();
        chart.addSourceGoal(chartSourceGoal);
        //goallist.push(goaln);
        //console.log(goaln);
        evt.stopPropagation();

    })

    $('.output-list li').click(function (evt) {
        var chartOutput = new SubscriptionOutput($(this).attr('data-id'));
        chart.addSubscriptionOutput(chartOutput);

        
        
       

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
        }
    })




    $('.results-list li').click(function (evt) {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected')
        } else {

            $(this).addClass('selected')
        }
    })



})

