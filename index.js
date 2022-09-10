const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

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

//* Set up express Server *//
app.listen(port, function (err) {
  if (err) {
    console.log('Error on Setting up the Server');
    return;
  }

  console.log('Server is running on port 8000');
  return;
});
