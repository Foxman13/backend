function CampaignChart(options) {
    var that = this;
    this.parent = options.parent;
    this.sourceGoals = options.sourceGoals ? options.sourceGoals : [];
    this.outputs = options.outputs ? options.outputs : [];
    this.element;

    this.initVisualTree = function () {
        var campaignChartDom = '<div class="superProgress">'
        + '<div class="surface">'
        + '</div>'
        + '</div>'
        + '<div class="outBalls">'
        + '</div>';

        that.element = document.createElement("div");
        that.element.innerHTML = (campaignChartDom);
        that.element.className = "campaignChart";

        this.sourceGoals.forEach(that.pushSourceGoal, true);
        this.outputs.forEach(that.pushSubscriptionOutput, true);
        //appendTo($(that.parent),that.element)
        console.log(that.element);
        console.log($(that.element));
        $(that.element).appendTo($(that.parent));
        //$(that.parent).append(that.element);
    };

    this.pushSourceGoal = function (sourceGoal, update) {
        console.log(sourceGoal)
        sourceGoal.parent = that.element.querySelector(".superProgress .surface");
        var thisBlock = new SourceBlock(sourceGoal);
        thisBlock.show();

        sourceGoal.uielement = thisBlock;

        if (!update)
            that.sourceGoals.push(sourceGoal);
    }

    this.pushSubscriptionOutput = function (subscriptionOutput, update) {
        subscriptionOutput.parent = that.element.querySelector(".outBalls");
        var thisBall = new OutBall(subscriptionOutput);
        subscriptionOutput.uielement = thisBall;

        if (!update)
            that.outputs.push(subscriptionOutput);
    }

    this.updateToRandomValues = function () {
        var done = true;
        that.sourceGoals.forEach(function (sourceGoal) {
            sourceGoal.uielement.setProgress(Math.random() * 0.1);

            done = done && (sourceGoal.uielement.currentProgress >= 1);
        })

        if (done) {
            that.updateBalls();
        }
    }

    this.updateBalls = function () {
        that.outputs.forEach(function (outBall) {
            var timeout = Math.random() * 500;
            setTimeout(function () {
                outBall.uielement.activate();
            }, timeout)

        })
    }

    this.toStaticHTML = function(str){
        if(Window['toStaticHTML'])
        {
            return(toStaticHTML(str));
        }else{
            return(str);
        }

    }

    this.initVisualTree();
}

function SourceBlock(options) {
    var that = this;
    this.glyph = options.glyph ? options.glyph : "";
    this.filterValue = options.filterValue ? options.filterValue : "";
    this.thresholdValue = options.thresholdValue ? options.thresholdValue : "";
    this.parent = options.parent ? options.parent : null;
    this.element = document.createElement("div");
    this.currentProgress = 0;

    this.show = function () {
        setTimeout(function () {
            if (that.element.className.indexOf("on") < 0) {
                that.element.className += " on";
            }
        }, 50)
    }

    this.hide = function () {
        setTimeout(function () {
            that.element.className.replace(" on", "");
        }, 50)
    }

    this.setProgress = function (value) {
        var progress = that.element.querySelector("progress");
        progress.value += value;
        this.currentProgress = progress.value;
    }

     this.toStaticHTML = function(str){
        if(Window['toStaticHTML'])
        {
            return(toStaticHTML(str));
        }else{
            return(str);
        }

    }
    this.initVisualTree = function () {
        var sourceBlockDom = '<progress value="0"></progress>'
        + '<div class="glyph"></div>'
        + '<div class="srcText">'
        + '     <div><span>#</span><span class="editable">' + that.filterValue + '</span></div>'
        + '     <div><span class="editable">' + that.thresholdValue + '</span><span> tweets</span></div>'
        + '  </div>';


        that.element = document.createElement("div");
        that.element.innerHTML = (sourceBlockDom);
        that.element.className = "sourceBlock";

        var editables = that.element.querySelectorAll(".editable");
        editables[0].contentEditable = true;
        editables[1].contentEditable = true;

        that.parent.appendChild(that.element);
        that.show();
    }();
}

function OutBall(options) {
    var that = this;
    this.glyph = options.glyph ? options.glyph : "";
    this.label = options.label ? options.label : "";
    this.parent = options.parent ? options.parent : null;
    this.element = document.createElement("div");

    this.show = function () {
        setTimeout(function () {
            if (that.element.className.indexOf("on") < 0) {
                that.element.className += " on";
            }
        }, 50)
    }

    this.hide = function () {
        setTimeout(function () {
            that.element.className.replace(" on", "");
        }, 50)

    }

    this.activate = function () {
        that.element.className += " active";
    }

    this.deactivate = function () {
        that.element.className.replace(" active", "");
    }
    this.toStaticHTML = function(str){
        if(Window['toStaticHTML'])
        {
            return(toStaticHTML(str));
        }else{
            return(str);
        }

    }

    this.initVisualTree = function () {
        var outBallDom = '<div class="glyph">🐝</div>'
        that.element = document.createElement("div");
        that.element.innerHTML = (outBallDom);
        that.element.className = "ball";

        $(that.parent).append(that.element);
        that.show();
    }();

}


function init() {
    var chartHost = document.querySelector(".chartHost");
    var chart = new CampaignChart({ parent: chartHost, sourceGoals: [], outputs: [] });
    var chart2 = new CampaignChart({ parent: chartHost, sourceGoals: [], outputs: [] });
    var chart3 = new CampaignChart({ parent: chartHost, sourceGoals: [], outputs: [] });
    var chart4 = new CampaignChart({ parent: chartHost, sourceGoals: [], outputs: [] });


    var addButton = document.getElementById("addButton");
    addButton.addEventListener("click", function () {
        chart.pushSourceGoal({
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        });

        chart2.pushSourceGoal({
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        });

        chart3.pushSourceGoal({
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        });

        chart4.pushSourceGoal({
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        });
    });

    var addOutButton = document.getElementById("addOutButton");
    addOutButton.addEventListener("click", function () {
        chart.pushSubscriptionOutput({
            glyph: "/images/rocket.png",
            label: "Rocket"
        });

        chart2.pushSubscriptionOutput({
            glyph: "/images/rocket.png",
            label: "Rocket"
        });

        chart3.pushSubscriptionOutput({
            glyph: "/images/rocket.png",
            label: "Rocket"
        });

        chart4.pushSubscriptionOutput({
            glyph: "/images/rocket.png",
            label: "Rocket"
        });
    });

    var goButton = document.getElementById("goButton");
    goButton.addEventListener("click", function () {
        setInterval(chart.updateToRandomValues, 300);
        setInterval(chart2.updateToRandomValues, 200);
        setInterval(chart3.updateToRandomValues, 400);
        setInterval(chart4.updateToRandomValues, 100);
    });

}
