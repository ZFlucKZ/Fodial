const express = require('express');
const port = 8000;

const app = express();

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
