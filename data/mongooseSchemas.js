var nconf = require('nconf');
var mongoose = require('mongoose');

nconf.argv().env();
var connectionString = process.env.MongodbConnectionString;
mongoose.connect(connectionString);

mongoose.connection.on('error', function (err) {
    console.log('Error! - ' + err);
});

////////////
//Represents an on/off notification implenmentation 
////////////
var notificationSchema = mongoose.Schema({
    
});

///////
//Represents a subscription to a campaign
var subscriptionSchema = mongoose.Schema({
    notifications: [notificationSchema]
});



////////////
//Represents a data source plugin implementation
////////////
var sourceSchema = mongoose.Schema({
    //the api that the client will call to increment
    api: String
});

///////////////////////////
//Represents relationship between campaign and data source
var goalSchema = mongoose.Schema({
    name: String,
    source: { type: mongoose.Schema.ObjectId, ref: 'Source' },
    count: Number,
});

////
//Highest-level entity
var campaignSchema = mongoose.Schema({
    name: String,
    goals: [goalSchema],
    subscribers: [subscriptionSchema]
});




//THESE REPRESENT THE MONGODB COLLECTIONS. THESE ENTITIES ARE INDPENDENT
var Campaign = mongoose.model('Campaign', campaignSchema)
var Source = mongoose.model('DoorBell', sourceSchema);
var Notification = mongoose.model('DoorBell', sourceSchema);

exports.Campaign = Campaign;
exports.Source = Source;
exports.Notification = Notification;