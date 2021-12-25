// jshint esversion: 11

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

let projectData = {};

app.use(express.static("website"));

app.listen(3000, () => {
  console.log("server started on port: 3000");
});

// Receiving The Data From The app.js File & Save It Into The Object projectData
app.post("/postWeatherData", (req, res) => {
  projectData.temp = req.body.temp;
  projectData.description = req.body.description;
  projectData.city = req.body.place.city;
  projectData.country = req.body.place.country;
  projectData.feeling = req.body.feelVal;
  projectData.date = req.body.date;
  projectData.icon = req.body.icon;
  res.end();
});

// Send The Data To The Client Side/app.js
app.get("/getWeatherData", (req, res) => {
  res.send(projectData);
});
