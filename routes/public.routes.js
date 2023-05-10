const router = require('express').Router();

router.get('/', async (req, res) => {
    res.status(200).send("Backend of live score.");
});

module.exports = router;