const { log } = require('console');
const fs = require('fs');
const path = require('path');

const dataFolder = path.join(__dirname, 'data')

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder)
    console.log("Data Folder Created");
}

const filePath = path.join(dataFolder, 'example.txt')

// sync way of creating a file
fs.writeFileSync(filePath, 'Hello From Node Js')
console.log("File Created Successfully")

const readContentFromFile = fs.readFileSync(filePath, 'utf8')
console.log("File Content :", readContentFromFile)


fs.appendFileSync(filePath, "\nThis is a new line added to that file")
const appendContenttoFile = fs.readFileSync(filePath, 'utf8')
console.log("Added Content To File :", appendContenttoFile)

// async way of creating a file

const asyncFilePath = path.join(dataFolder, 'async-example.txt')
fs.writeFile(asyncFilePath, 'Hello, Async node js', (err) => {
    if (err) throw err;
    console.log("Async File creatted successfully")

    fs.readFile(asyncFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        console.log("Async File Content :", data);
    })
    fs.appendFile(asyncFilePath, '\nThis is a new line data', (err, data) => {
        if (err) throw err;
        console.log("Async New Data File Content");
    })
    fs.readFile(asyncFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        console.log("Async File Content 1 :", data);
    })
})
