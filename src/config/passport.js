const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user.js');

module.exports = (passport) => {    
    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) =>{
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({'local.email': email}, (err, user) => {
            if(err) return done(err);
            if(user) {
                return done(null, false, req.flash('signupMessage', 'el email ya existe'))

            }else{
                var newUser = new User();
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password)
                newUser.save()
                        .then((err) =>  done(null, newUser));
            }
        })
    }
    ))

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({'local.email': email}, (err, user) => {
            if(err) return done(err);
            if(!user) {
                return done(null, false, req.flash('signupMessage', 'EL usuario no existe'))

            }

            if(!user.validatePassword(password)){
                return done(null, false, req.flash('logiMEssage', 'wrong password'))
            }
            return  done(null, user);
        })
    }
    ))
};