const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    facebookId: {
        type: String,
        unique: true
    },
    twitterObj: {},
    email: {
        type: String,
        unique: true
    }
});

UserSchema.plugin(uniqueValidator);

UserSchema.statics.findOrCreateFacebook = function(profile) {
    return User.findOne({
        facebookId: profile.id
    }).then(user => {
        if (user) {
            return user;
        }
        else {
            return new User({
                displayName: profile.displayName,
                facebookId: profile.id,
                email: profile.emails[0].value
            }).save();
        }
    });
};

UserSchema.statics.findOrCreateTwitter = function(profile, user, token, tokenSecret) {
    return User.findOneAndUpdate({
        _id: user._id
    }, {
        twitterObj: {
            twitterId: profile.id,
            twitterToken: token,
            twitterTokenSecret: tokenSecret
        }
    }, {
        returnNewDocument: true
    }).then(user => {
        if (user) {
            return user;
        }
        else {
            return new User({
                displayName: profile.displayName,
                twitterObj: {
                    twitterId: profile.id,
                    twitterToken: token,
                    twitterTokenSecret: tokenSecret
                }
            }).save();
        }
    });
};

UserSchema.methods.getAccounts = async function() {
    let accounts = [];
    accounts.push({
        name: "Twitter",
        authorized: this.twitterObj
    });
    accounts.push({
        name: "Facebook",
        authorized: this.facebookId
    });
    return accounts;
};

UserSchema.methods.getTweets = async function() => {
console.log("twitter middleware");
//if user logged in
if (req.user) {
    console.log("value of req.user", req.user);
    //grab twit tokens
    let twitterObj = req.user.twitterObj;
    if (twitterObj) {
        var Twit = require('twit')

        var T = new Twit({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: twitterObj.twitterToken,
            access_token_secret: twitterObj.twitterTokenSecret,
        });
        T.get('/result_type=recent')
            .then(tweets => {
                console.log("tweets", tweets);
            })
            .then(() => {
                next();
            });
    }
    next();
}
next();
})






const User = mongoose.model("User", UserSchema);

module.exports = User;
