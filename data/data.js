var mongoose = require('mongoose');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
// 
//  Ensures connection to MongoDB and then executes callback
// 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
exports.dbConnectAndExecute = function dbConnectAndExecute(callback) {
    var mongoConnectionString = process.env.MongodbConnectionString;
    var db = mongoose.connection;
    //check if we are already connected to the db
    if (db.readyState == 1 || db.readyState == 2) {
        callback();
    } else {
        //we aren't connected to the database
        db.connect(mongoConnectionString);

        db.on('connect', function () {
            callback(null);
        });
        db.on('error', function () {
            callback('Could not connect to database');
        });
        
    }
}