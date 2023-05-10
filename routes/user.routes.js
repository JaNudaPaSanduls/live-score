const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Match = require('../models/Match');

router.post('/create', async (req, res) => {
    try {
        const { username, password, data } = req.body;
        let user = await User.findOne({ username });
        if (user) {
            throw new Error('User already exists');
        }

        user = {
            username: username,
            password: password,
            data: data
        };

        const newUser = new User(user);
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.status(200).send({ status: 'User Created', user: newUser, token: token });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.get('/get', auth, async (req, res) => {
    try {
        res.status(200).send({ status: 'User fetched', user: req.user });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password, session } = req.body;
        const match = await Match.findById(session);
        if (!match) {
            throw new Error('Invalid session id');
        }
        const user = await User.findByCredentials(username, password);
        const token = await user.generateAuthToken();
        res.status(200).send({ status: 'Login success', user: user, token: token });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send('Logout successfully');
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
});

module.exports = router;