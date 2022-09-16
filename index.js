const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');

//* Flash Message *//
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//* used for session cookie *//
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');

app.use(
  sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css',
  })
);

//* Recieve data from browser *//
app.use(express.urlencoded());

//* Cookie *//
app.use(cookieParser());

//* Set up express Layouts *//
app.use(expressLayouts);

//* Static Files *//
app.use(express.static('./assets'));

//* make the uploads path available to the browser *//
app.use('/uploads', express.static(__dirname + '/uploads'));

//* extract style and scripts from sub pages into the layout *//
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//* Set up view engine *//
app.set('view engine', 'ejs');
app.set('views', './views');

//* Session *//
app.use(
  session({
    name: 'Fodial',
    //TODO change the secret before deployment in production mode
    secret: 'blahhhhhhhhhhh',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: 'mongodb://localhost/fodial_app',
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

//* flash
app.use(flash());
app.use(customMware.setFlash);

//* Set up express Router *//
app.use('/', require('./routes'));

//* Set up express Server *//
app.listen(port, function (err) {
  if (err) {
    console.log('Error on Setting up the Server');
    return;
  }

  console.log('Server is running on port 8000');
  return;
});
