const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

const mongoUrl = "mongodb://127.0.0.1:27017/f1";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// TEAM Schema
const teamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  nationality: String,
  url: String,
});
teamSchema.set("strictQuery", true);

// DRIVER Schema
const driverSchema = new mongoose.Schema({
  num: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
  team: teamSchema,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

let countries = [
  { code: "ENG", label: "England" },
  { code: "SPA", label: "Spain" },
  { code: "GER", label: "Germany" },
  { code: "FRA", label: "France" },
  { code: "MEX", label: "Mexico" },
  { code: "AUS", label: "Australia" },
  { code: "FIN", label: "Finland" },
  { code: "NET", label: "Netherlands" },
  { code: "CAN", label: "Canada" },
  { code: "MON", label: "Monaco" },
  { code: "THA", label: "Thailand" },
  { code: "JAP", label: "Japan" },
  { code: "CHI", label: "China" },
  { code: "USA", label: "USA" },
  { code: "DEN", label: "Denmark" },
];

// ------------------ RUTAS ------------------

// Página inicial (HTML)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

// Obtener todos los drivers
app.get("/drivers", async (req, res) => {
  const drivers = await Driver.find();
  res.render("drivers.ejs", { drivers });
});

// Página para registrar driver
app.get("/register", async (req, res) => {
  res.render("register.ejs", { teams: await Team.find(), countries });
});

// Guardar nuevo driver
app.post("/register", async (req, res) => {
  const team = await Team.findOne({ id: req.body.team });

  const newDriver = new Driver({
    num: req.body.num,
    code: req.body.code,
    forename: req.body.forename,
    surname: req.body.surname,
    dob: req.body.dob,
    nationality: req.body.nationality,
    url: req.body.url,
    team,
  });

  await newDriver.save();
  res.redirect("/drivers");
});

// -------------------------------------------------

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
