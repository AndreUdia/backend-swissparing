const express = require('express');

const Player = require('../models/player');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const player = await Player.create(req.body);
        return res.send({ player });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/player', router);