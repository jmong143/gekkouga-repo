var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var tokenizer = require("../util/jwt-tokenizer");


var AuthenticationController = require('../controllers/AuthenticationController');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                User.findOne({$or: [{"username" : username}, {"email" : req.body.email}]}, function(err, user) {
                    if (err){
                        console.log('Error in SignUp: '+ err);
                        return done(err);
                    }
                    if (user) {
												console.log("------------------------?" + user);
                        return done(null, false, req.flash('message','User Already Exists'));
                    }else {
                        var newUser = new User();
                      	newUser.username = username;
                        newUser.password = createHash(password);
												newUser.objectId = AuthenticationController.makeObjectId();
												newUser.admin = false;
												newUser.address = req.body.address;
												newUser.fullname = req.body.fullname;
												newUser.email = req.body.email;
												newUser.emailVerified = false;
												newUser.birthdate.iso = req.body.birthdate;
												newUser.contact = req.body.contact;
												newUser.avatar = null;
												newUser.coverPhoto = null;
												newUser.userType = "user";
												newUser.createdAt = new Date();
												newUser.updatedAt = new Date();
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+ err);
																//res.send("ERROR" + err);
																return done(null, "Error in Saving User");
																//throw err;
                            }
														console.log('User Registration succesful');
														//res.send("Success" + newUser);
														var email = req.body.email;
														var newObjectId = newUser.objectId;
														 AuthenticationController.sendMailVerify(email, newObjectId)
													//	sendMail(email, newObjectId);
														return done(null, newUser);
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        })
    );

    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}
