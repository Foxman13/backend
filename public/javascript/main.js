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
        var chartOutput = new SubscriptionOutput();
        chart.addSubscriptionOutput(chartOutput);

        var output = $(this).attr('data-id');
        subcriberlist.push(output);


        var subcriberobject = {
            name: $(this).attr('data-id'),
            notifications: $(this).attr('data-id')
        };
        subcriberlist.push(subcriberobject);
        console.log(subcriberlist);
        
       

    })


    $('.add-button').click(function () {

        $('.campaign-item').show();

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

        var tempName = new Date().getTime() + "__GOAL";
        var goal = {
            goal_count: 20,
            source: $(this).attr('data-id'),
            inputs: [{ name: 'hashtag', value: '#hashtagvalue' }],
            name: new Date().getTime() + "__GOAL",
            continuous_messaging: true
        }





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



})

