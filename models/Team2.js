const mongoose = require('mongoose');

const Team2Schema = mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    wick: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    session: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
});

const Team2 = mongoose.model('team2', Team2Schema);
module.exports = Team2;