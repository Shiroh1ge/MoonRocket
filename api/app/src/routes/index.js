const fs = require('fs');
const status = require('http-status');
const masterRouter = require('express').Router();

masterRouter.get('/players/health', (req, res) => {
    return res.sendStatus(status.OK);
});

fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js') {
        const router = require('./' + file);

        if (router) {
            masterRouter.use(router);
        }
    }
});

module.exports = masterRouter;
