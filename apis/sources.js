var express = require('express');
var mongoose = require('mongoose');
var data = require('../data/data');
var schemas = require('../data/mongooseSchemas');

var router = express.Router();

//Note there is not api to change sources

/* Retrieve A single Source by ID or all Sources - GET /api/source */ 
router.get('/', function (req, res) {

    //connect to db
    data.dbConnectAndExecute(function (err) {
        
        if (req.query.source_id) {
            schemas.Source.findOne({ _id: req.query.source_id }, function (err, entity) {
                
                if (err) {
                    
                    return res.send(500, 'DB Error occured ' + err);
            
                }
                
                return res.send(200, entity);
        
            });
        }
        else {
            
            schemas.Source.find({ }, function (err, results) {
                
                if (err) {
                    
                    return res.send(500, 'DB Error occured ' + err);
            
                }
                
                return res.send(200, results);
        
            });
        }
        
        
    });
});

function addSource(source, callback) {
    //connect to db
    data.dbConnectAndExecute(function (err) {

        var sourceEntity = new schemas.Source(source);

        if (err) {

            return callback(err);
        }

        sourceEntity.save(function (err, entity) {

            callback(null, entity);
        });


    });
}


module.exports = router;
