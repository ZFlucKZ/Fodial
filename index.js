const express = require('express');
const port = 8000;

const app = express();

app.listen(port, function(err){
  if(err){
    console.log("Error on Setting up the Server")
    return;
  }

  console.log("Server is running on port 8000");
  return;
})