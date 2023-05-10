const mongoose = require('mongoose');

const Team1Schema = mongoose.Schema({
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

const Team1 = mongoose.model('team1', Team1Schema);
module.exports = Team1;