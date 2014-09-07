var express = require('express');
var mongoose = require('mongoose');
var data = require('../data/data');
var schemas = require('../data/mongooseSchemas');

var router = express.Router();

/* Retrieve Campaign - GET /api/notification */ 
router.get('/', function (req, res) {
    
    //connect to db
    data.dbConnectAndExecute(function (err) {
        
        if (req.query.notification_id) {
            schemas.Notification.findOne({ _id: req.query.notification_id }, function (err, entity) {
                
                if (err) {
                    
                    return res.send(500, 'DB Error occured ' + err);
            
                }
                
                return res.send(200, entity);
        
            });
        }
        else {
            
            schemas.Notification.find({}, function (err, results) {
                
                if (err) {
                    
                    return res.send(500, 'DB Error occured ' + err);
            
                }
                
                return res.send(200, results);
        
            });
        }
        
        
    });
});

module.exports = router;
