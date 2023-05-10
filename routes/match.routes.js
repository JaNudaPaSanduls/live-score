const router = require('express').Router();
const Match = require('../models/Match');
const Team1 = require('../models/Team1');
const Team2 = require('../models/Team2');
const auth = require('../middleware/auth');

router.post('/new', auth, async (req, res) => {
    try {
        const { team1_name, team2_name, playing, img1, img2, player1, player2, baller } = req.body;
        const match ={ now_playing: playing,
            overs: 0, 
            balls: 0, 
            player1: player1,
            player2: player2,
            player1_score: 0,
            player2_score: 0,
            balling: baller,
            now_player: player1,
            now_playing: playing,
            player1_balls: 0,
            player2_balls: 0,
            balling_wick: 0
        };
        const newMatch = new Match(match);
        await newMatch.save();
        const team1 = {
            name: team1_name,
            score: 0,
            wick: 0,
            session: newMatch._id,
            img: img1
        };
        const team2 = {
            name: team2_name,
            score: 0,
            wick: 0,
            session: newMatch._id,
            img: img2
        };

        const newTeam1 = new Team1(team1);
        await newTeam1.save();
        const newTeam2 = new Team2(team2);
        await newTeam2.save();
        res.status(200).send({ status: 'Match Created', match: newMatch, team1: newTeam1, team2: newTeam2 });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.get('/get/:id', async (req, res) => {
    try {
        const session = req.params.id;
        const match = await Match.findById(session);
        const team1 = await Team1.findOne({ session });
        const team2 = await Team2.findOne({ session });
        res.status(200).send({ status: 'Data fetched', match: match, team1: team1, team2: team2 });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.patch('/wick/:id', auth, async (req, res) => {
    try {
        const session = req.params.id;
        const match = await Match.findById(session);
        const team1 = await Team1.findOne({ session });
        const team2 = await Team2.findOne({ session });
        const wick = team1.wick;
        const wick1 = team2.wick;
        const data = {
            balling_wick: match.balling_wick+1
        }
        await Match.findByIdAndUpdate(session, data);
        const team1_new = {
            wick: wick+1
        };
        const team2_new = {
            wick: wick1+1
        };
        const playing = match.now_playing;
        if (playing == "Team1") {
            const tEam1 = await Team1.findByIdAndUpdate(team1._id, team1_new);
            res.status(200).send({ message: 'Data updated', wick: team1_new.wick });
        } else {
            const tEam2 = await Team2.findByIdAndUpdate(team2._id, team2_new);
            res.status(200).send({ message: 'Data updated', wick: team2_new.wick });
        }
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.patch('/score/:id', auth, async (req, res) => {
    try {
        const { add_score } = req.body;
        const session = req.params.id;
        const match =  await Match.findById(session);
        const balls = match.balls+1;
        if (match.now_player == "player1") {
            const data = {
                balls: match.balls+1,
                player1_balls: match.player1_balls+1,
                player1_score: match.player1_score+add_score
            };
            await Match.findByIdAndUpdate(session, data);
        } else {
            const data = {
                balls: match.balls+1,
                player2_balls: match.player2_balls+1,
                player2_score: match.player2_score+add_score
            };
            await Match.findByIdAndUpdate(session, data);
        }
        const playing = match.now_playing;
        if (playing == "Team1") {
            const team1 = await Team1.findOne({ session });
            const score = team1.score+add_score;
            const team1_new = {
                score: score
            };
            const tEam1 = await Team1.findByIdAndUpdate(team1._id, team1_new);
            res.status(200).send({ message: 'Data updated', score: team1_new.score, balls: balls });
        } else {
            const team2 = await Team2.findOne({ session });
            const score = team2.score+add_score;
            const team2_new = {
                score: score
            };
            const tEam2 = await Team2.findByIdAndUpdate(team2._id, team2_new);
            res.status(200).send({ message: 'Data updated', score: team2_new.score, balls: balls });
        }
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.patch('/playing/:id', auth, async (req, res) => {
    try {
        const session = req.params.id;
        const match = await Match.findById(session);
        if (match.now_playing == "Team1") {
            const data = {
                now_playing: "Team2",
                player1_balls: 0,
                player2_balls: 0,
                balling_wick: 0,
                player2_score: 0,
                player1_score: 0,
                overs: 0,
                balls: 0,
                player1: "Fetching...",
                player2: "Fetching...",
                balling: "Fetching..."
            };
            await Match.findByIdAndUpdate(session, data);
        } else {
            const data = {
                now_playing: "Team1",
                player1_balls: 0,
                player2_balls: 0,
                balling_wick: 0,
                player2_score: 0,
                player1_score: 0,
                overs: 0,
                balls: 0,
                player1: "Fetching...",
                player2: "Fetching...",
                balling: "Fetching..."
            };
            await Match.findByIdAndUpdate(session, data);
        }
        res.status(200).send({ message: 'Data Updated', playing: match.now_playing });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.patch('/player/:id', auth, async (req, res) => {
    try {
        const session = req.params.id;
        const match = await Match.findById(session);
        if (match.now_player == "player1") {
            data = {
                now_player: "player2"
            };
            await Match.findByIdAndUpdate(session, data);
        } else {
            data = {
                now_player: "player1"
            };
            await Match.findByIdAndUpdate(session, data);
        }
        res.status(200).send({ message: 'Data Updated', player: data.now_player });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.patch('/player1/:id', auth, async (req, res) => {
    try {
        const session = req.params.id;
        const { player } = req.body;
        data = {
            player1: player,
            player1_balls: 0,
            player1_score: 0
        }
        await Match.findByIdAndUpdate(session, data);
        res.status(200).send({ message: 'Data Updated', player: player });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.patch('/player2/:id', auth, async (req, res) => {
    try {
        const session = req.params.id;
        const { player } = req.body;
        const data = {
            player2: player,
            player2_balls: 0,
            player2_score: 0
        }
        await Match.findByIdAndUpdate(session, data);
        res.status(200).send({ message: 'Data Updated', player: player });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.patch('/baller/:id', auth, async (req, res) => {
    try {
        const session = req.params.id;
        const { baller } = req.body;
        const data = {
            balling: baller,
            balling_wick: 0
        }
        await Match.findByIdAndUpdate(session, data);
        res.status(200).send({ message: 'Data Updated', balling: baller });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.patch('/overs/:id', auth, async (req, res) => {
    try {
        const session = req.params.id;
        const match = await Match.findById(session);
        const data = {
            overs: match.overs+1
        };
        await Match.findByIdAndUpdate(session, data);
        res.status(200).send({ message: 'Data updated', overs: data.overs });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

module.exports = router;