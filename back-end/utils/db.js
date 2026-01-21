const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongoDB connected");
    } catch (error) {
        console.log(error);
    }
};

module.exports = { connectDatabase };0  