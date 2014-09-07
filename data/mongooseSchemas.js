var nconf = require('nconf');
var mongoose = require('mongoose');

nconf.argv().env();
var connectionString = process.env.MongodbConnectionString;
mongoose.connect(connectionString);

mongoose.connection.on('error', function (err) {
    console.log('Error! - ' + err);43
});

/////////////////////////
//Describes a type of notification we support
////////////////////////
var notificationTypeSchema = mongoose.Schema({
    //API to long poll the subscription
    type: String,
});

////////////
//Represents an on/off notification implenmentation 
////////////
var notificationSchema = mongoose.Schema({
    //API to long poll the subscription
    inputs: [{
        name: String,
        value: String
    }],
    type: String,
    endpoint: String
});

///////
//Represents a subscription to a campaign
var subscriptionSchema = mongoose.Schema({
    name: String,
    notifications: [notificationSchema]
});



////////////
//Represents a data source plugin implementation
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
    isRunning: Boolean,
    //these are the input values for the source should match Source.inputs
    inputs: [{
        name: String,
        value: String
    }],
    lastTaskMessage : String
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
var Source = mongoose.model('Source', sourceSchema);
var NotificationType = mongoose.model('NotificationType', notificationTypeSchema);
var Notification = mongoose.model('Notification', notificationSchema);
var Subscription = mongoose.model('Subscription', subscriptionSchema);

exports.Campaign = Campaign;
exports.Source = Source;
exports.NotificationType = NotificationType;
exports.Subscription = Subscription;