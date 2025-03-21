const mongoose = require('mongoose')

const connectToDB = async() => {
    try{
        await mongoose.connect('mongodb+srv://saranshsharma1919:saranshsharma1919@cluster0.rv1w7.mongodb.net/bookstore')
        console.log('MongoDB Connected Succesfully');
    }catch(err){
        console.error('MongoDB Connection Failed', err)
        process.exit(1)
    }
}

module.exports = connectToDB;