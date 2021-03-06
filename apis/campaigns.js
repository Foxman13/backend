﻿var express = require('express');
var mongoose = require('mongoose');
var data = require('../data/data');
var schemas = require('../data/mongooseSchemas');
var TwitterData = require('../datasources/twitterAggregator.js');
var twitterDataSource = new TwitterData();
var router = express.Router();

/* Retrieve Campaign - GET /api/campaign */ 
router.get('/', function (req, res) {
    
    
    
    //connect to db
    data.dbConnectAndExecute(function (err) {
        
        if (req.query.campaign_id) {
            schemas.Campaign.findOne({ _id: req.query.campaign_id }, function (err, entity) {
                
                if (err) {
                    
                    return res.send(500, 'DB Error occured ' + err);
            
                }
                
                return res.send(200, entity);
        
            });
        }
        else {
            
            schemas.Campaign.find({ }, function (err, results) {
                
                if (err) {
                    
                    return res.send(500, 'DB Error occured ' + err);
            
                }
                
                return res.send(200, results);
        
            });
        }
        
        
    });
});

router.use('/subscriptions', function (req, res, next) {

    if (!req.query.campaign_id) {
    
        return res.send(400, { message: 'Must speicfy campaign_id in order to view or modify subscriptions' });
    
    }

    next();
});

router.get('/subscriptions/notifications', function (req, res) {
    
    if (!req.query.subscription_id) {
        return res.send({ message: 'You must provide subscription_id query param to modify notifications on that subscription' });
    }
    //connect to db
    data.dbConnectAndExecute(function (err) {
        if (err) {
            return res.send(500, { message: "could not connect to database" });
        }
        
        schemas.Campaign.find({_id: req.query.subscription_id}, function (err, data) {
            var notifications = [];
            
            if (err) {
                return res.send(500, { message: err });
            
            }
            for (var i in data) {
                notifications.push(data[i]);
            
            }
            return res.send(200, data);
        
        })
        
    });

});

router.post('/goals/start', function (req, res) {

    if (!req.query.campaign_id) {

        return response.send(400, { message: 'must specify subscription_id to add or modify notifications!' });

    }
    data.dbConnectAndExecute(function (err) {
    
        schemas.Campaign.findOne({ _id: req.query.campaign_id }, function (err, entity) {
            
            if (err) {
                
                return res.send(500, { message: 'failed to find subscrption ' + req.query.subscription_id + err });

            }
            
            for (var i in entity.goals) {
                
                if (entity.goals[i].source && entity.goals[i].inputs) {
                    //start the goal
                    twitterDataSource.run(entity.goals[i], req.query.campaign_id, entity.subscribers, function (err) {

                    });
                }
                

            }

            return res.send(200);
        });
    
    
    });

});

//Create a new notification using an available notifciation type
router.post('/subscriptions/notifications', function (req, res) {
    
    if (!req.query.subscription_id) {
    
        return response.send({ message: 'must specify subscription_id to add or modify notifications!' });
    
    }

    //connect to db
    data.dbConnectAndExecute(function (err) {
        if (err) {
            return res.send(500, { message: "could not connect to database" });
        }
        

        schemas.Campaign.findOne({ _id: req.query.campaign_id }, function (err, entity) {

            if (err) {
                    
                return res.send(500, { message: 'failed to find subscrption ' + req.query.subscription_id + err } );
                
            }
                
            for (var i in entity.subscribers) {
                
                if (entity.subscribers[i]._id == req.query.subscription_id) {
                        
                    if (req.query.notification_id) {
                        for (var z in entity.subscribers[i].notifications[z]) {
                        
                            if (req.query.notification_id == entity.subscribers[i].notifications[z]._id) {
                                var notificationToModify = entity.subscribers[i].notifications[z];
                                //just modify the existing notification
                                notificationToModify.inputs = req.body.inputs;
                                notificationToModify.type = req.body.type;
                                notificationToModify.endpoint = req.body.endpoint;

                            }
                        
                        }
                    }
                    var sub = entity.subscribers[i];
                    sub.notifications.push(req.body);
                    
                }

            }

            entity.save(function (err, result) {
                
                if (err) {
                    
                    return res.send(500, err);
                }

                return res.send(200);
                
            });
        });
       
    });

});

router.post('/goals', function (req, res) {

    if(!req.query.campaign_id){
        return res.send(400, {message:'must specify campaign_id to modify goals on that campaign'});
    }
    
    //connect to db
    data.dbConnectAndExecute(function (err) {
        if (err) {
            return res.send(500, { message: "could not connect to database" });
        }

        schemas.Campaign.findOne({ _id: req.query.campaign_id }, function (err, entity) {

            entity.goals.push(req.body);

            entity.save(function (err, data) {
            
                if (err) {
                    return res.send(500, err);
                }
                
                return res.send(200);
            });

        });
    });

});

router.get('/goals', function (req, res) {
    
    if (!req.query.campaign_id) {
        return res.send(400, { message: 'must specify campaign_id to modify goals on that campaign' });
    }
    
    //connect to db
    data.dbConnectAndExecute(function (err) {
        if (err) {
            return res.send(500, { message: "could not connect to database" });
        }
        
        schemas.Campaign.findOne({ _id: req.query.campaign_id }, function (err, result) {
            
            if (err) {
            
            
                return res.send(500, err);
            }
            
            return res.send(200, result.goals);

        });
    });

});

//Get all or a specific subscription given the name
router.get('/subscriptions', function (req, res) {
    
    //connect to db
    data.dbConnectAndExecute(function (err) {
        if (err) {
            return res.send(500, { message: "could not connect to database" });
        }
        schemas.Campaign.findOne({ _id: req.query.campaign_id }, function (err, entity) {
                
            if (err) {
                    
                return res.send(500, { message: 'DB Error occured ' + err });
            
            }
                
            //return a specific subscription
            if (req.query.subscription_name) {
                var subscription = null;
                for (var i in entity.subscribers) {
                        
                    if (entity.subscribers[i].name == req.query.subscription_name) {
                        subscription = entity.subscribers[i];
                            
                        
                    }
                        
                    if (!subscription) {
                            
                        res.send(400, { message: 'No subscription by the name ' + req.query.subscription_name + " exists!" });
                    }
                        
                    res.send(200, subscription);
                }
            }
            else {
                return res.send(200, entity.subscribers);
            }
                

        
        });

        
    });
});

//Add or modify a subscription POST - /api/campaign/subscriptions
router.post('/subscriptions', function (req, res) {

    
    //connect to db
    data.dbConnectAndExecute(function (err) {
            if (err) {
                return res.send(500, {message:"could not connect to database"});
            }
        
            
            //an id was specified check if it exists
            schemas.Campaign.findOne({ _id: req.query.campaign_id }, function (err, entity) {
                if (err) {
                    return res.send(500, { message: 'could not get Campaign ' + req.body.id + ' ' + err });
                }
                
                if (entity == null) {
                    return res.send(400, { message: 'campaign with id ' + req.body.id + ' does not exist!' });
                }
                //requested to modify existing campaign
                if (req.query.subscription_id) {
                    var subscription = null;
                    for (var i in entity.subscribers) {
                    
                        if (entity.subscribers[i]._id == req.query.subscription_id) {
                            //we found a matching sub
                            subscription = entity.subscribers[i];

                        }

                    }

                    if(!subscription){
                        return res.send(400, {message:'Could not find a subscription with the id ' + req.query.subscription_id});
                    }

                    subscription.name = req.body.name;
                    subscription.subscribers = req.body.subscribers;

                    entity.save(function (err, result) {
                        if (err) {
                           return res.send(500, { message: 'could not save to database' });
                        }

                        return res.send(200);
                    });
                    
                }
                else {
                
                    for (var i in entity.subscribers) {
                        if (entity.subscribers[i].name === req.body.name) {
                            return res.send(400, { message: 'A subscriber record with the name ' + req.body.name + ' already exists, if you meant to modify this subscription, call this api with the subscription_id query parameter' });
                        }
                    }
                    var notifications = [];
                    for (var i in req.body.notifications) {
                        notifications.push({
                            "$ref": "notifications",
                            "$id": req.body.notifications[i],
                            "$db": "OnOff"
                        })                        

                    }
                    var newSubscription = {
                        name: req.body.name,
                        notifications: notifications
                    };
                    entity.subscribers.push(newSubscription);
                    entity.save(function(err,entity){

                        if(err){
                            return req.send(500, {message: 'Could not save subscription to the database ' + e});
                        }

                        return req.send(200);
                    });
                }

            });
        
        
        
        
    });


});

/* Create or modify campaign - POST /api/campaign */
router.post('/', function (req, res) {
    
    if (typeof req.body == String) {
        req.body = JSON.parse(req.body);
    }
    if (!req.body.name && !req.body.id) {
        return res.send(400, { message: 'To create a campaign, send a body with at least the name field or id field' }); 
    }
    //connect to db
    data.dbConnectAndExecute(function (err) {
        
        //requested to modify existing campaign
        if (req.body.id) {
            
            //an id was specified check if it exists
            schemas.Campaign.findOne({ _id: req.query.id}, function (err, entity) {
                if (err) {
                    return res.send(500, { message: 'could not get Campaign ' + req.body.id + ' ' + err});
                }
                
                if (entity == null) {
                    return res.send(400, { message: 'campaign with id ' + req.body.id + ' does not exist!' });
                }
                
                //update the entity with the specified fields in the body.
                
                //THIS WILL ERASE IF YOU SET ANYTHING TO NULL!!
                entity.name = req.body.name;

            });
        }
        else {
            var campaignEntity = new schemas.Campaign(req.body);

            //record in database
            campaignEntity.save(function (err, entity) {
                
                
                if (err) {
                    
                    //couldn't save to db
                    return res.send(500, { message: 'could not create enitity in database ' + e });
                }

                return res.send(200, entity);
        
            });
        }
        
        
        
    });
});

module.exports = router;
