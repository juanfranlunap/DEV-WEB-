// Import 
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


app.post('/bmi', function (req, res) {
  const weight = Number(req.body.weight);
  const height = Number(req.body.height);

  const bmi = (weight / (height * height)) * 10000;

  res.send('Your BMI is: ' + bmi.toFixed(2));
});

app.listen(3000, function () {
  console.log('Server running on http://localhost:3000');
});
