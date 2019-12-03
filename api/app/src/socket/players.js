const playersRepo = require('../repository/players.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;
const SocketRooms = require('../constants/socket-events').SocketRooms;

module.exports = (io) => {
    io.on('connection', async (socket) => {
        socket.emit(SocketEvents.playerConnected, {id: socket.id});

        socket.on(SocketEvents.getPlayer, async (data) => {
            const player = await playersRepo.getOrCreatePlayer({userId: data.userId});
            socket.emit(SocketEvents.getPlayer, player);
        });

        socket.on(SocketEvents.joinRoom, (room) => {
            socket.join(room);
        });
    });

};
