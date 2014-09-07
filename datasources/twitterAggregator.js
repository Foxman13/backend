var Twit = require('twit')
var oauth = require('oauth');
var express = require('express');
var router = express.Router();

var twitter = new Twit({
    consumer_key: process.env.TwitterConsumerKey,
    consumer_secret: process.env.TwitterConsumerSecret,
    access_token: process.env.TwitterAccessToken,
    access_token_secret: process.env.TwitterAccessTokenSecret
})

function consumer() {
    if (process.env.Location === "Development") {
        return new oauth.OAuth(
        "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
        _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://dxdisrupt-dev.azurewebsites.net/", "HMAC-SHA1");
    }
    else if (process.env.Location === "Production") {
        function consumer() {
            return new oauth.OAuth(
        "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
        _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://dxdisrupt-dev.azurewebsites.net/", "HMAC-SHA1");
        }
    }
    else if (process.env.Location === "Local") {
    
        function consumer() {
            return new oauth.OAuth(
        "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
        _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://badgestar.com/sessions/callback", "HMAC-SHA1");
            }
    
    }
}

router.use('/auth', function (req, res) {
    
    consumer().getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
        if (error) {
            res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
        } else {
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
        }
    });

});

router.use('/auth/callback', function (req, res) {
    
    res.render(index, { title: 'Express' });
});

module.exports = router;
module.exports.run = function (input, callback) {
    
    if (!input.hashtag) {
    
        new oauth.OAuth(
        "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
        _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://badgestar.com/sessions/callback", "HMAC-SHA1");   
    
    }
    
    twitter.get('search/tweets', { q: '# since:2011-11-11', count: 100 }, function (err, data, response) {
        console.log(data)
    })        

}