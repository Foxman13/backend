var express = require('express');
var mongoose = require('mongoose');
var data = require('../data/data');
var schemas = require('../data/mongooseSchemas');

var router = express.Router();

/* Retrieve Campaign - GET /api/campaign */ 
router.get('/', function (req, res) {
    
    if (!req.query.campaign_id) {
        return res.send(400, { message: 'Must specify campaign_id query parameter' });
    }
    //connect to db
    data.dbConnectAndExecute(function (err) {

        schemas.Campaign.findOne({ _id: req.query.campaign_id }, function (err, entity) {
        
            if (err) {
            
                return res.send(500, 'DB Error occured ' + err);
            
            }

            return res.send(200, entity);
        
        });
        
        
    });
});


/* Create or modify campaign - POST /api/campaign */
router.post('/', function (req, res) {
    
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
                
                if (doorbell == null) {
                    return res.send(400, { message: 'campaign with id ' + req.body.id + ' does not exist!' });
                }
                
                //update the entity with the specified fields in the body.
                
                //THIS WILL ERASE IF YOU SET ANYTHING TO NULL!!
                entity.name = req.body.name;
                entity.goals = req.body.goals;
                entity.subscribers = req.body.subscribers;

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
