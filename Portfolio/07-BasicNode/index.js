console.log("Hello, world!");

const sw = require('star-wars-quotes')
console.log(sw())

const {randomSuperhero}= require ('superheroes');
const {randomSupervillain}= require ('supervillains');
console.log(randomSupervillain()+" VS "+randomSuperhero())


const fs = require('fs');
const path = require('path'); 
const filePath = path.join(__dirname, 'data', 'input.txt'); 

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File content:', data);
});

