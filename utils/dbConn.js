require("dotenv").config();
const mongoose = require("mongoose")
mongoose.Promise = global.Promise;
let collection = {};

collection.connectDb = async (collectionName, schema) => {
    try {
        mongoose.set("strict", false);
        mongoose.set("strictQuery", false);
        return (await mongoose.connect(
            process.env.LOCALDB,

            {
                useNewUrlParser: true, useUnifiedTopology: true,
                serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
                socketTimeoutMS: 45000,
            })).model(collectionName, schema)
    } catch (err) {
        // console.log((err));
        let error = new Error("Could not connect to database")
        error.status = 500
        throw error
    }
}


module.exports = collection;