process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

const port = process.env.PORT || 3000;
const masterRouter = require('./src/routes/index');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const connectDb = require('./src/models/index').connectDb;

const io = require('socket.io')(server);
require('./src/socket/launches')(io);
require('./src/socket/players')(io);


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api', masterRouter);

connectDb().then(() => {
    server.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
});
