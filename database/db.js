require('dotenv').config();
const mongoose = require('mongoose');
const { userSchema } = require('./schema');

const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// fucntion to test connection mongodb
async function connectDB() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(`${dbUrl}/${dbName}`, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.log("MongoDB connection error ", err);
        process.exit(1);
    }
}

async function closeDB() {
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
        
    } catch (err) {
        console.log("MongoDB connection failed");
        process.exit(1);
    }
}

module.exports={
    connectDB, 
    closeDB
}
