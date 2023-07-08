const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({ 

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    url:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url'
    },
    shorturl:{
        type: String
    },
    clicks:{   
            type: Number,
            default: 0
        },
    country:{
        type: Array,
        default: []
    },
    device:{
        type: Array,
        default: []
    },
    browser:{
        type: Array,
        default: []
    },
    ip:{
        type: Array,
        default:[],
    },
    os:{
        type: Array,
        default: []
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Analytics', analyticsSchema);