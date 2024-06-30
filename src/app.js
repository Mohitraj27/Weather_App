const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");

const weatherData = require("../utils/weatherData");
const exp = require("constants");

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/weatherApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const weatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  weatherDescription: String,
  date: { type: Date, default: Date.now },
});

const Weather = mongoose.model("Weather", weatherSchema);

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index", { title: "Weather App" });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send("Address is required");
  }
  weatherData(req.query.address, (error, result) => {
    if (error) {
      return res.send({ error: "City not found" });
    }
    if (!result || !result.main || !result.weather) {
      return res.send({ error: "City not found" });
    }
    const weather = new Weather({
      city: result.name,
      temperature: result.main.temp,
      weatherDescription: result.weather[0].description,
    });
    weather
      .save()
      .then(() => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

app.get("*", (re, res) => {
  res.render("404", { title: "Page Not Found" });
});
app.listen(port, () => {
  console.log("Server is listening on port" + port);
});
