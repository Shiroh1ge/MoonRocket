const playersRepo = require('../repository/players.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;
const SocketRooms = require('../constants/socket-events').SocketRooms;

const getOrCreatePlayer = async (userId) => {
    try {
        let player = await playersRepo.getPlayer({userId});

        if (!player) {
            player = playersRepo.createPlayer({userId});
        }

        return player;
    } catch (error) {
        console.error('Error getting player: ', error);
        throw(error);
    }
};

module.exports = (io) => {
    io.on('connection', async (socket) => {
        socket.emit(SocketEvents.playerConnected, {id: socket.id});

        socket.on(SocketEvents.getPlayer, async (data) => {
            const player = await getOrCreatePlayer(data.userId);
            socket.emit(SocketEvents.getPlayer, player);
        });

        socket.on(SocketEvents.joinRoom, (room) => {
            socket.join(room);
        });
    });

};
