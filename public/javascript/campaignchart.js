function CampaignChart(options) {
    var that = this;
    this.parent = options.parent;
    this.sourceGoals = options.sourceGoals ? options.sourceGoals : [];
    this.outputs = options.outputs ? options.outputs : [];
    this.element;

    this.getGoalList = function () {
        return this.sourceGoals;
    }

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

        this.sourceGoals.forEach(that.addSourceGoal, true);
        this.outputs.forEach(that.pushSubscriptionOutput, true);
        $(that.element).appendTo($(that.parent));
    };

    this.addSourceGoal = function (sourceGoal, update) {
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

            sourceGoal.uielement.setProgress(sourceGoal.uielement.getProgress() + Math.random() * 0.1);
            done = done && (sourceGoal.uielement.getProgress() >= 1);
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

    this.toStaticHTML = function (str) {
        if (Window['toStaticHTML']) {
            return (toStaticHTML(str));
        } else {
            return (str);
        }

    }

    this.initVisualTree();
}

function SourceBlock(goal) {
    var that = this;
    this.goal = goal ? goal : new Goal();
    this.glyph = goal.source ? goal.source : "/images/twitter.png";
    this.parent = goal.parent ? goal.parent : null;
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

    this.setProgress = function (value) {
        var progress = that.element.querySelector("progress");
        progress.value = value;
        this.goal.current_goal_count = value;
    }

    this.getProgress = function () {
        var progress = that.element.querySelector("progress");
        return progress.value;
    }


    this.toStaticHTML = function (str) {
        if (Window['toStaticHTML']) {
            return (toStaticHTML(str));
        } else {
            return (str);
        }

    }
    this.initVisualTree = function () {
        var sourceBlockDom = '<progress value="' + that.goal.current_goal_count + '"></progress>'
        + '<div class="glyph">' + that.goal.source + '</div>'
        + '<div class="srcText">'
        + '     <div><span>Goal: </span><span class="editable">' + that.goal.inputs.name + '</span></div>'
        + '     <div><span>#</span><span class="editable">' + that.goal.inputs.value + '</span></div>'
        + '     <div><span class="editable">' + that.goal + '</span><span> tweets</span></div>'
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
    this.toStaticHTML = function (str) {
        if (Window['toStaticHTML']) {
            return (toStaticHTML(str));
        } else {
            return (str);
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


function Goal(goal_count, current_goal_count, inputs, source, name, continuous_messaging) {
    this.goal_count = goal_count ? goal_count : 100;
    this.current_goal_count = current_goal_count ? current_goal_count : 0;
    this.inputs = inputs ? inputs : { name: "hashtag", value: "#threshold" };
    this.source = source ? source : "";
    this.name = name ? name : new Date().getTime() + "__GOAL";
    this.continuous_messaging = continuous_messaging ? continuous_messaging : true;
}

function init() {
    var chartHost = document.querySelector(".chartHost");
    var chart = new CampaignChart({ parent: chartHost, sourceGoals: [], outputs: [] });
    var chart2 = new CampaignChart({ parent: chartHost, sourceGoals: [], outputs: [] });
    var chart3 = new CampaignChart({ parent: chartHost, sourceGoals: [], outputs: [] });
    var chart4 = new CampaignChart({ parent: chartHost, sourceGoals: [], outputs: [] });


    var addButton = document.getElementById("addButton");
    addButton.addEventListener("click", function () {
        chart.addSourceGoal({
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        });

        chart2.addSourceGoal({
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        });

        chart3.addSourceGoal({
            glyph: "/images/twitter.png",
            filterValue: "HackDisrupt",
            thresholdValue: "2500"
        });

        chart4.addSourceGoal({
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
