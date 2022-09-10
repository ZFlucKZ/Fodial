const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');

//* used for session cookie *//
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);

//* Recieve data from browser *//
app.use(express.urlencoded());

//* Cookie *//
app.use(cookieParser());

//* Set up express Layouts *//
app.use(expressLayouts);

//* Static Files *//
app.use(express.static('./assets'));

//* extract style and scripts from sub pages into the layout *//
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//* Set up express Router *//
app.use('/', require('./routes'));

//* Set up view engine *//
app.set('view engine', 'ejs');
app.set('views', './views');

//* Session *//
app.use(
  session({
    name: 'Fodial',
    //TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: 'disabled',
      },
      function (err) {
        console.log(err || 'Connect-mongoDB setup OK!');
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//* Set up express Server *//
app.listen(port, function (err) {
  if (err) {
    console.log('Error on Setting up the Server');
    return;
  }

  console.log('Server is running on port 8000');
  return;
});
