process.env.PORT = 3000;
process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');

const io = require('socket.io')(server);
require('./socket/launch')(io);


// always set middleware before routes

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/api/test', (req, res, next) => {
    console.log('Test endpoint hit.');
    return res.status(200).json('Test endpoint hit.');
});

server.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
);
