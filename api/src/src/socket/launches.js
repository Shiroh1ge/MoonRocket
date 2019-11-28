const Rx = require('rxjs');
const obs = new Rx.Observable();
const playersRepo = require('../repository/players.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;

const joinedPlayersBuffer = new Map();

module.exports = (io) => {
    io.on('connection', async (socket) => {

        socket.on(SocketEvents.bid, (data => {
            const playerBiddingData = {
                userId: data.userId,
                amount: data.amount,
                altitude: data.altitude
            };

            joinedPlayersBuffer.set(playerBiddingData.userId, playerBiddingData);
            const joinedPlayers = [...joinedPlayersBuffer.values()];
        }));


    });

};
