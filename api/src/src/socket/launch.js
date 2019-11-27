const Rx = require('rxjs');
const obs = new Rx.Observable();
const joinedPlayersBuffer = [];
const playersRepo = require('../repository/players.repo');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A new socket has connected: ', socket.id);

        io.emit('connected', {id: socket.id});
    });

    io.on('joinLaunch', (data => {
        const playerBiddingData = {
            userId: data.userId,
            amount: data.amount
        };

        joinedPlayersBuffer.push(playerBiddingData);
    }));

};
