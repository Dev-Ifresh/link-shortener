const mongoose = require("mongoose");
const User = require("./user")

const urlSchema = new mongoose.Schema({

longurl: {
    type: String,
    required: true
},
shorturl: {
    type: String,
    required: true
},
customUrl: {
    type: String,
    unique: true,
    default: "_"
},
owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
},
analytics:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analytics',
},
createdAt: {
    type: Date,
},
});

const UrlModel = mongoose.model('Url', urlSchema)

module.exports = UrlModel