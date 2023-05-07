const fs = require("fs");
const process = require("process");
const { stdin } = process;
const path = require("path");

let writeText = fs.createWriteStream(path.join(__dirname, "text.txt"));
console.log("Пожалуйста, введите текст!");

stdin.on('data', (buffer) => {
    if (buffer.toString().trim() == 'exit') {
      console.log("До свидания!");
      process.exit();     
    }
    console.log("Пожалуйста, введите текст!");
    writeText.write(buffer);  
});

process.on('SIGINT', () => {
    console.log('До свидания!');
    process.exit(); 
});
  
process.stdin.resume();