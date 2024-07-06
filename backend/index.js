
const express = require('express');
const { default: mongoose } = require('mongoose');
require('dotenv').config()
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
