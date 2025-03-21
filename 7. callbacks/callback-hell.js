const fs = require('fs');
fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.log("error reading file ", err)
        return
    };
    const modifyFileData = data.toUpperCase();
    fs.writeFile('output.txt', modifyFileData, (err) => {
        if (err) {
            console.log("error writing file ", err)
            return
        };
        console.log('data written to new file')
        fs.readFile('output.txt', 'utf8', (err, data) => {
            if (err) {
                console.log("error reading file ", err)
                return
            };
            console.log(data)
        });
    })
})