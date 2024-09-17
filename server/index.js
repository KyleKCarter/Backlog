require('dotenv').config();
const express = require('express');
const cors = require('cors');
const massive = require('massive');
const session = require('express-session');

//imports for google oauth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oath').OAuth2Strategy;

//nodemailer
// const nodemailer = require('nodemailer')
// const creds = require('../emailconfig')

const app = express();

const {
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET,
    SESSION_COOKIE_KEY
} = process.env

//controllers
const auth_controller = require('./controllers/authentication/authController');
const email = require('./controllers/authentication/mailer');
const games = require('./controllers/gamesController');

//middleware
const checkForUser = require('./middleware/auth_middleware');

//massive
massive(CONNECTION_STRING)
    .then(database => {
        app.set('database', database);
        console.log("Database Connected")
    })
    .catch(error => console.log(error));

    app.use(express.json());
    app.use(cors());

//session
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            keys: [SESSION_COOKIE_KEY]
        }
    })
)

//middleware implementation
app.use(express.json());
app.use(checkForUser);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
})
app.use(express.static(`${__dirname}/../build`))

//Auth Implementation
app.post('/auth/user/register', auth_controller.register);
app.post('/auth/user/login', auth_controller.login);
app.post('/auth/user/logout', auth_controller.logout);
app.get('/auth/user', function(req, res) {
    if(req.session.user) {
        res.status(200).json({user: req.session.user, isLoggedIn: true});
    } else {
        res.status(404).json({isLoggedIn: false});
    }
})

//Nodemailer implementation
app.post('/send', email.sendRegisterEmail);
// app.post('/send', (req, res) => {
//         const { name, email } = req.body;
        
//         //create reusable transporter object using the default SMTP transport
//         let transporter = nodemailer.createTransport({
//             service: "gmail",
//             host: 'smtp.gmail.com',
//             port: 587,
//             auth: {
//                 user: creds.USER,
//                 password: creds.PASSWORD
//             },
//             tls: {
//                 rejectUnauthorized: false
//             }
//         });
    
//         //setup email data with unicode symbols
//         let mailOptions = {
//             from: creds.USER, //sender address
//             to: email, //list of receivers
//             subject: 'Welcome to Backlog',
//             text: `Hi ${name}! You'vre all signed up and ready to start browsing.`
//         };
    
//         //send mail with defined transport object
//         transporter.sendMail(mailOptions, (error, data) => {
//             if (error) {
//                 console.log('Error occured with nodemailer')
//                 res.status(500).json('An error occured with nodemailer')
//             } else {
//                 console.log('Email sent')
//                 res.status(200).json('An email was sent')
//             }
//         });
//     }
// )

// ENDPOINTS
//games
app.post('/games/:name', games.get_games)

app.listen(SERVER_PORT, () => console.log(`Running on ${SERVER_PORT}`))