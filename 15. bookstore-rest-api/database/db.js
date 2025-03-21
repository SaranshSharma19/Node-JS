const mongoose = require('mongoose')

const connectToDB = async() => {
    try{
        await mongoose.connect('********************************************************************')
        console.log('MongoDB Connected Succesfully');
    }catch(err){
        console.error('MongoDB Connection Failed', err)
        process.exit(1)
    }
}

module.exports = connectToDB;
