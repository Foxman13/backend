function CampaignChart(options) {
    var that = this;
    this.parent = options.parent;
    this.sourceGoals = options.sourceGoals ? options.sourceGoals : [];
    this.outputs = options.outputs ? options.outputs : [];
    this.element;

    this.getGoalList = function () {
        return this.sourceGoals;
    }

    this.getOutputList = function () {
        return this.outputs;
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
        this.outputs.forEach(that.addSubscriptionOutput, true);
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

    this.addSubscriptionOutput = function (subscriptionOutput, update) {
        subscriptionOutput.parent = that.element.querySelector(".outBalls");
        var thisBall = new OutBall(subscriptionOutput);
        subscriptionOutput.uielement = thisBall;

        if (!update)
            that.outputs.push(subscriptionOutput);
    }

    this.updateToRandomValues = function (speed) {
        var done = true;
        that.sourceGoals.forEach(function (sourceGoal) {

            sourceGoal.uielement.setProgress(sourceGoal.uielement.getProgress() + Math.random() * 0.02);
            done = done && (sourceGoal.uielement.getProgress() >= 1);
        })

        if (done) {
            that.updateBalls();
        }
    }

    this.updateBalls = function () {
        that.outputs.forEach(function (output) {
            var timeout = Math.random() * 500;
            setTimeout(function () {
                output.uielement.activate();
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
        + '     <div class="goal-txt"><span class="heavy">Goal: </span><span class="editable">' + that.goal.inputs.name + '</span></div>'
        + '     <div class="goal-threshold"><span>#</span><span class="editable">' + that.goal.inputs.value + '</span></div>'
        + '     <div class="item-count"><span class="editable">' + that.goal.goal_count + '</span><span> tweets</span></div>'
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

function OutBall(subscriptionOutput) {
    var that = this;
    console.log(subscriptionOutput)
    this.subscriptionOutput = subscriptionOutput ? subscriptionOutput : new SubscriptionOutput();
    this.parent = subscriptionOutput.parent ? subscriptionOutput.parent : null;
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
        
        var outBallDom = '<div><icon class="' + that.subscriptionOutput.glyph + '"/></div>'
        that.element = document.createElement("div");
        that.element.innerHTML = (outBallDom);
        that.element.className = "ball";

        $(that.parent).append(that.element);
        that.show();
    }();

}

function SubscriptionOutput(source, name, goal_met, continuous_messaging) {
    this.source = source ? source : "source";
    this.name = name ? name : "name";
    this.goal_met = goal_met ? goal_met : false;
}

function Goal(goal_count, current_goal_count, inputs, source, name, continuous_messaging) {
    this.goal_count = goal_count ? goal_count : 100;
    this.current_goal_count = current_goal_count ? current_goal_count : 0;
    this.inputs = inputs ? inputs : { name: "hashtag", value: "threshold" };
    this.source = source ? source : "";
    this.name = name ? name : new Date().getTime() + "__GOAL";
    this.continuous_messaging = continuous_messaging ? continuous_messaging : true;
}
