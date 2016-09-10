// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../models/user');
var tokenizer = require("../util/jwt-tokenizer");
// load the auth variables
//var configAuth = require('./auth');

module.exports = function(passport) {
/*
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
*/
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        /*
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL*/
        clientID        : "583202521832699",
        clientSecret    : "aa07ae8404e4867fd383a6fb23f2f35e",
        callbackURL     : "http://localhost:2000/ipostmo-auth/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'link', 'photos', 'emails']
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'objectId' : profile.id }, function(err, user) {


                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                  console.log("THIS IS YOUR INFO ID ->" + profile.id);
                  console.log("THIS IS YOUR INFO GIVEN NAME ->" + profile.name.givenName);
                  console.log("THIS IS YOUR INFO FAMILY NAME ->" + profile.name.familyName);
                  console.log("THIS IS YOUR INFO EMAIL ->" + profile.emails[0].value);
                    // if there is no user found with that facebook id, create them
                    var token = tokenizer.sign(user);
                    var newUser = new User();


                    // set all of the facebook information in our user model
                    newUser.objectId    = profile.id; // set the users facebook id
                    newUser.token = token; // we will save the token that facebook provides to the user
                    //newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        console.log(JSON.stringify("USER -->" + newUser));
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

};
