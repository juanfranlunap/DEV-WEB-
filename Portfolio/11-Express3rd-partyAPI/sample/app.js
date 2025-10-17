const express = require("express");
const https = require("https");
const http = require("http"); 
const bodyParser = require("body-parser");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  var url = "http://placekitten.com/g/300/300";
  http.get(url, (response) => { 
    console.log(response.statusCode);
    response.on("data", (data) => {
      res.write(data);
      res.send();
    });
  });
});

app.get("/dictionary", (req, res) => {
  var url = "https://api.toys/api/check_dictionary";
  const form_data = new FormData();
  form_data.append("text", "marry");
  const options = {
    method: "POST",
    headers: form_data.getHeaders(),
  };

  var soapRequest = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      response
        .on("data", (data) => {
          var jsonResp = JSON.parse(data);
          console.log(jsonResp);
          res.send("Success");
        })
        .on("error", (e) => {
          res.send(`Error ${e.message}`);
        });
    } else {
      res.send("Error");
    }
  });
  form_data.pipe(soapRequest);
});

app.get("/temp", (req, res) => {
  var url = "https://api.toys/api/check_dictionary";
  const form_data = new FormData();
  form_data.append("text", "marry");

  axios
    .post(url, form_data, { headers: form_data.getHeaders() })
    .then((response) => {
      var data = response.data;
      console.log(data);
      if (!data.hasOwnProperty("error")) {
        console.log("no error");
        res.send("Success");
      } else {
        console.log("Fail");
        res.send("Fail");
      }
    })
    .catch((err) => {
      console.log(err.code + ": " + err.message);
      console.log(err.stack);
      res.send("Fail error");
    });
});

app.post("/weather", (req, res) => {
  const cityName = req.body.cityName;
  const apiKey = "8e50f0cddc1e3c9b58a175215e858c03";
  const units = "metric";// para celcius
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`;

  https.get(url, (response) => {
    console.log("Status code:", response.statusCode);

    if (response.statusCode !== 200) {
      res.write("<h1>Error: Busqueda no encontrada o problema con la API.</h1>");
      res.write('<a href="/">Regresar</a>');
      return res.send();
    }

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write(`<h1>Clima en ${cityName}</h1>`);
      res.write(`<h2>${desc}</h2>`);
      res.write(`<h3>Temperatura: ${temp} °C</h3>`);
      res.write(`<img src="${imageURL}" alt="icono del clima">`);
      res.write('<br><a href="/">Regresar</a>');
      res.send();
    });
  }).on("error", (err) => {
    console.error("Error de conexión:", err.message);
    res.write("<h1>Error al conectar con el servicio.</h1>");
    res.write('<a href="/">Regresar</a>');
    res.send();
  });
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
