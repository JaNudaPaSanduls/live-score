const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    balls: {
        type: Number,
        required: true
    },
    overs: {
        type: Number,
        required: true
    },
    player1: {
        type: String,
        required: true
    },
    player2: {
        type: String,
        required: true
    },
    player1_score: {
        type: Number,
        required: true
    },
    player2_score: {
        type: Number,
        required: true
    },
    balling: {
        type: String,
        required: true
    },
    now_player: {
        type: String,
        required: true
    },
    now_playing: {
        type: String,
        required: true
    },
    player1_balls: {
        type: Number,
        required: true
    },
    player2_balls: {
        type: Number,
        required: true
    },
    balling_wick: {
        type: Number,
        required: true
    }
});

const Match = mongoose.model('match', MatchSchema);
module.exports = Match;