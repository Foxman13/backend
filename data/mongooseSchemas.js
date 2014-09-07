var nconf = require('nconf');
var mongoose = require('mongoose');

nconf.argv().env();
var connectionString = process.env.MongodbConnectionString;
mongoose.connect(connectionString);

mongoose.connection.on('error', function (err) {
    console.log('Error! - ' + err);
});

////////////
//Represents an on/off notification implenmentation - OutBall, 
////////////
var notificationSchema = mongoose.Schema({
    //API to long poll the subscription
    type: String,
    longPollEndpoint: String,
    realTimeEndpoint: String
});

///////
//Represents a subscription to a campaign
var subscriptionSchema = mongoose.Schema({
    name: String,
    notifications: [notificationSchema]
});



////////////
//Represents a data source plugin implementation - SourceBlock - filtervalue - thresholdvalue
////////////
var sourceSchema = mongoose.Schema({
    //the api that the client will call to increment
    name: String,
    description: String,
    //these are the input definitions to the data source. For example, Twitter would have hashtag as an input
    inputs: [{
        name: String
    }]
});

///////////////////////////
//Represents relationship between campaign and data source
var goalSchema = mongoose.Schema({
    name: String,
    source: { type: mongoose.Schema.ObjectId, ref: 'source' },
    count: Number,
    //these are the input values for the source should match Source.inputs
    inputs: [{
        name: String,
        value: String
    }]
});

////
//Highest-level entity
var campaignSchema = mongoose.Schema({
    name: String,
    description: String,
    goals: [goalSchema],
    subscribers: [subscriptionSchema]
});




//THESE REPRESENT THE MONGODB COLLECTIONS. THESE ENTITIES ARE INDPENDENT
var Campaign = mongoose.model('Campaign', campaignSchema)
var Source = mongoose.model('Source', sourceSchema);
var Notification = mongoose.model('Notification', sourceSchema);

exports.Campaign = Campaign;
exports.Source = Source;
exports.Notification = Notification;