const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/weather", (req, res) => {
  const city = req.body.cityName;
  const apiKey = "8e50f0cddc1e3c9b58a175215e858c03"; 
  const units = "metric"; // para grados Celsius
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  https.get(url, (response) => {
    console.log("Código de estado:", response.statusCode);

    if (response.statusCode !== 200) {
      res.write("<h1>Error: ciudad no encontrada o problema con la API.</h1>");
      res.write('<a href="/">Regresar</a>');
      return res.send();
    }

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write(`<h1>Clima en ${city}</h1>`);
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
  console.log("Server on port 3000");
});
