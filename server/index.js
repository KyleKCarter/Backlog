require('dotenv').config();
const express = require('express');
const cors = require('cors');
const massive = require('massive');
const session = require('express-session');

//imports for google oauth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oath').OAuth2Strategy;

const app = express();

const {
    SERVER_PORT,
    CONNECTION_STRING
} = process.env

//controllers
const games = require('./controllers/gamesController');

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

// ENDPOINTS
//games
app.post('/games/:name', games.get_games)

app.listen(SERVER_PORT, () => console.log(`Running on ${SERVER_PORT}`))