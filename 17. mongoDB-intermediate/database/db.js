const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    }
    catch (err) {
        console.error('MonoDB Connection Failed');
        process.exit(1);
    }
}

module.exports = connectToDB;