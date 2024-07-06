import express from 'express';
import mongoose from 'mongoose';
import router from './route/userApi';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/', router);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
