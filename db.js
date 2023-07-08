//Setting up the database
require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../backend/config/config");
const MONGODB_URI = config.MONGODB_URI;


function connectToMongoDB() {

    mongoose.connect(MONGODB_URI,
        {useNewUrlParser: true, useUnifiedTopology: true})
        
        .then(console.log("MongoDb is Connected"))
        .catch((err) => console.log(err));
}
module.exports = { connectToMongoDB }