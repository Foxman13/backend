var Twit = require('twit')
var oauth = require('oauth');
var express = require('express');
var mongoose = require('mongoose');
var data = require('../data/data');
var schemas = require('../data/mongooseSchemas');
var unirest = require('unirest');
var db = mongoose.connection;
var twitter = new Twit({
    consumer_key: process.env.TwitterConsumerKey,
    consumer_secret: process.env.TwitterConsumerSecret,
    access_token: process.env.TwitterAccessToken,
    access_token_secret: process.env.TwitterAccessTokenSecret
})

module.exports = function () {
    this.isRunning = false;
    this.run = function (goal, campaign_id, subscribers, callback) {
        
        var hashtag = null;
        
        for (var i in goal.inputs) {
        
            if (goal.inputs[i].name == "hashtag") {
            
                hashtag = goal.inputs[i].value;
            
            }
        
        }
        
        if (!hashtag) {
            return callback('Expected the hashtag input field -- Plugin Failed');
        }

        //
        //  filter the twitter public stream by the word 'mango'.
        //
        var stream = twitter.stream('statuses/filter', { track: hashtag })
        
        stream.on('tweet', function (tweet) {
            goal.count++;
            console.log('Goal ' + goal.name + ' count ' + goal.count + ' goal target ' + goal.goal_count);
            goal.save(function (err, data) {
                
                if (err) {
                    console.log(err);
                }
                    
            });
            if (!this.isRunning) {
            
                data.dbConnectAndExecute(function (err) {
                    
                    if (err) {
                        stream.handleDisconnect();
                    }
                    schemas.Campaign.findOne({ _id: campaign_id }, function (err, entity) {
                        
                        for (var i in entity.goals) {
                            if (entity.goals[i].name == goal.name) {
                                
                                entity.goals[i].isRunning = true;
                                entity.save(function (err, data) {
                                    console.error('could not save to database');
                                });
                            }
                        }
                        entity.lastTaskMessage = "Twitter stream is running normally"
                    });
                
                });
            
            }
            this.isRunning = true;
            console.log(tweet);

            for (var c in subscribers) {
                for (z in subscribers[c].notifications) {
                
                    var notification = subscribers[c].notifications[z]
                    
                    //notify subscribers 
                    if (notification.type == "SparkIoDigital") {
                        
                        if (!notification.continuous_messaging && goal.count > goal.goal_count) {
                            unirest.post(notification.endpoint)
                            .send(notification.inputs[0].name + '=' + notification.inputs[0].value)
                            .send(notification.inputs[1].name + '=' + notification.inputs[1].value)
                            .end(function (response) {
                                console.log('sent SparkIODigital!');
                                console.log(response.body);
                            });
                        }
                        

                    }
                    else if (notification.type == "SparkIoProgress") {
                        
                        if (!notification.continuous_messaging && goal.count > goal.goal_count) {
                            unirest.post(notification.endpoint)
                            .send(notification.inputs[0].name + '=' + notification.inputs[0].value)
                            .send(notification.inputs[1].name + '=' + goal.count + ',' + goal.goal_count)
                            .end(function (response) {
                                console.log('sent sparkio notification!');
                                console.log(response.body);
                            });
                        }
                        else if (notification.continuous_messaging){
                            unirest.post(notification.endpoint)
                            .send(notification.inputs[0].name + '=' + notification.inputs[0].value)
                            .send(notification.inputs[1].name + '=' + goal.count + ',' + goal.goal_count)
                            .end(function (response) {
                                console.log('sent sparkio progress! notification!');
                                console.log(response.body);
                            });
                        }
                    }

                    
                }
            }
        }.bind(this))
        stream.on('limit', function (limitMessage) {
            console.log(limitMessage);
        })
        stream.on('disconnect', function (disconnectMessage) {
            
            if (this.isRunning) {
                
                data.dbConnectAndExecute(function (err) {
                    
                    if (err) {
                        stream.handleDisconnect();
                    }
                    schemas.Campaign.findOne({ _id: input.campaign_id }, function (err, entity) {
                        
                        for (var i in input.goals) {
                            if (input.goals[i]._id == goal._id) {
                            
                                input.goals[i].isRunning = false;
                                input.goals[i].isRunning.lastTaskMessage = "Twitter stream has stopped - " + err;
                            }
                        }
                        
                    });
                
                });
            
            }

            this.isRunning = false;
            stream = twitter.stream('statuses/filter', { track: hashtag })
        });
        
        stream.on('error', function (err) {
            
            //try to connect again
            stream = twitter.stream('statuses/filter', { track: hashtag })
        });
    }

}