const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.body.headers.Authorization;
        console.log(token)
        const decode = jwt.verify(token, "dncmu");
        const user = await User.findOne({ _id: decode._id, "tokens.token": token });
        if (!user) {
            throw new Error('Please Authenticate');
        }
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ message: err.message  });
        console.log(err);
    }
};

module.exports = auth;