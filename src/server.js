const express = require('express');
const app = express();


const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')

const { url } = require('./config/database.js')

mongoose.connect(url)

require('./config/passport')(passport)
//setting
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs')

//middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'shadjhasjdbjsakd',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes/routes')(app, passport);


//static files
app.use(express.static(path.join(__dirname + '/public')))

app.listen(app.get('port'), console.log('App en el puerto: ', app.get('port')))