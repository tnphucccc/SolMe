import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
require("dotenv").config();

let app = express();

// config view engine
configViewEngine(app);

// parse request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init web routes
initWebRoutes(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(process.env.PORT);
  console.log(`Server run successfully on port ${PORT}`);
});
