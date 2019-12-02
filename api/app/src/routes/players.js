const express = require('express');
const router = express.Router();
const playersRepo = require('../repository/players.repo');

router.get('/:userId', async (req, res, next) => {
    try {
        const player = playersRepo.findOrCreatePlayer({userId: req.params.userId});
        return res.status(200).json(player);
    } catch (error) {
        res.status(500);
        throw(error);
    }
});

module.exports = router;
