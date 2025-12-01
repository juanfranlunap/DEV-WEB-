// ----------------------------------------
//  Setup básico
// ----------------------------------------
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/f1";
mongoose.connect(mongoUrl)
  .then(() => console.log(`Connected to MongoDB: ${mongoUrl}`))
  .catch(err => console.error('Mongo connect error:', err));

// ----------------------------------------
//  SCHEMAS
// ----------------------------------------
const teamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  nationality: String,
  url: String,
});
teamSchema.set("strictQuery", true);

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

// ----------------------------------------
//   Países para selects
// ----------------------------------------
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

// ----------------------------------------
//  MIDDLEWARE: seed DB si está vacía
// ----------------------------------------
async function seedDB(req, res, next) {
  const count = await Driver.countDocuments();
  if (count > 0) return next();

  const filePath = path.join(__dirname, "public/data/f1_2023.csv");
  if (!fs.existsSync(filePath)) return next();

  let rows = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", row => rows.push(row))
    .on("end", async () => {

      // Insertar equipos únicos
      let teamNames = [...new Set(rows.map(r => r.team))];

      let teamDocs = [];
      for (let i = 0; i < teamNames.length; i++) {
        const name = teamNames[i];
        if (!name) continue;

        let existing = await Team.findOne({ name });
        if (existing) {
          teamDocs.push(existing);
          continue;
        }

        const nextId = (await Team.countDocuments()) + 1;
        let t = await Team.create({
          id: nextId,
          name: name,
          nationality: "",
          url: ""
        });
        teamDocs.push(t);
      }

      // Insertar drivers
      for (let r of rows) {
        let team = teamDocs.find(t => t.name === r.team);

        let num = Number(r.num);
        if (isNaN(num)) num = undefined;

        let dob = r.dob ? new Date(r.dob) : undefined;
        if (dob && isNaN(dob.getTime())) dob = undefined;

        let driver = {
          code: r.code,
          forename: r.forename,
          surname: r.surname,
          nationality: r.nationality,
          url: r.url,
          team: team
        };

        if (num !== undefined) driver.num = num;
        if (dob !== undefined) driver.dob = dob;

        await Driver.create(driver);
      }

      console.log("CSV cargado en MongoDB");
      next();
    });
}

// ----------------------------------------
//  RUTA PRINCIPAL (render EJS) — FIX ✔
// ----------------------------------------
app.get("/", seedDB, async (req, res) => {
  const drivers = await Driver.find();
  const teams = await Team.find();

  res.render("index", {
    drivers,
    teams,
    countries,
    editingDriver: null   // ← FIX IMPORTANTE
  });
});

// ----------------------------------------
//  Vista lista — por si usa mismo EJS
// ----------------------------------------
app.get("/drivers", seedDB, async (req, res) => {
  const drivers = await Driver.find();
  const teams = await Team.find();

  res.render("drivers", {
    drivers,
    teams,
    countries,
    editingDriver: null  // ← Por si tu plantilla lo usa
  });
});

// ----------------------------------------
//  Render index con driver a editar ✔
// ----------------------------------------
app.get('/driver/edit/:id', seedDB, async (req, res) => {
  const drivers = await Driver.find();
  const teams = await Team.find();
  const editingDriver = await Driver.findById(req.params.id);

  res.render('index', {
    drivers,
    teams,
    countries,
    editingDriver
  });

});

// ----------------------------------------
//   CRUD
// ----------------------------------------
app.post("/driver", async (req, res) => {
  let team = await Team.findOne({ id: Number(req.body.teamId) });

  await Driver.create({
    num: req.body.num,
    code: req.body.code,
    forename: req.body.forename,
    surname: req.body.surname,
    dob: req.body.dob,
    nationality: req.body.nationality,
    url: req.body.url,
    team
  });

  res.redirect("/");
});

app.post("/driver/edit/:id", async (req, res) => {
  let team = await Team.findOne({ id: Number(req.body.teamId) });

  await Driver.findByIdAndUpdate(req.params.id, {
    num: req.body.num,
    code: req.body.code,
    forename: req.body.forename,
    surname: req.body.surname,
    dob: req.body.dob,
    nationality: req.body.nationality,
    url: req.body.url,
    team
  });

  res.redirect("/");
});

app.get("/driver/delete/:id", async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// ----------------------------------------
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
