const express = require('express');
const router = express.Router();

router.get('/:userId', async (req, res, next) => {
    try {
        return res.status(200).json({});
    } catch (error) {
        res.status(500);
        throw(error);
    }

});

module.exports = router;
