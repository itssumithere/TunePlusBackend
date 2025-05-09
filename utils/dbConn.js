require("dotenv").config();
const mongoose = require("mongoose")
mongoose.Promise = global.Promise;
let collection = {};

collection.connectDb = async (collectionName, schema) => {
    try {
        mongoose.set("strict", false);
        mongoose.set("strictQuery", false);
        
        // Log connection attempt
        console.log(`Attempting to connect to MongoDB at ${process.env.LOCALDB.split('@')[1] || 'localhost'}`);
        
        const connection = await mongoose.connect(
            process.env.LOCALDB,
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                heartbeatFrequencyMS: 10000,
                retryWrites: true,
                retryReads: true
            }
        );
        
        console.log('MongoDB connection successful');
        return connection.model(collectionName, schema);
    } catch (err) {
        console.error("Database connection error:", err.message);
        let error = new Error("Could not connect to database")
        error.status = 500
        throw error
    }
}

module.exports = collection;