const mongoose = require('mongoose');


const connectDatabase = async () => {
    try {

        const mongodb_uri = process.env.MONGODB_URI;
        await mongoose.connect(mongodb_uri);
        console.log('Database connected!')
        
    } catch (error) {
        process.exit(1)
    }
};

module.exports = connectDatabase;