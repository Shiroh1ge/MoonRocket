const playersRepo = require('../repository/players.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;
const SocketRooms = require('../constants/socket-events').SocketRooms;
const io_client = require('socket.io-client');
const metaSettings = require('../config/config').metaSettings;

const botUserIds = ['K0SIKFYDyR1Twe3BAAAD', 'wQG-klFOFJHeJIADAAAC', 'SdV3u0dfmXMj3w2lAAAA'];
const DEFAULT_BOT_BALANCE = 1000;

const getOrCreatePlayer = async (userId) => {
    try {
        let player = await playersRepo.getPlayer({userId});

        if (!player) {
            player = playersRepo.createPlayer({userId, balance: DEFAULT_BOT_BALANCE});
        }

        return player;
    } catch (error) {
        console.error('Error getting player: ', error);
        throw(error);
    }
};

getBotSockets = async () => {
    return await Promise.all(
        botUserIds.map(() => {
                return new Promise((resolve, reject) => {
                    const socket = io_client(metaSettings.apiRoot);

                    socket.on('connect', () => {
                        return resolve(socket);
                    });

                    socket.on('connect_failed', () => {
                        return reject(socket);
                    });
                });

            }
        ));
};

getRandomNum = () => {
    const min = 1;
    const max = 100;
    // return 20

    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = async (io) => {
    try {
        const botPlayers = await Promise.all(botUserIds.map(userId => getOrCreatePlayer(userId)));

        // We wait for the sockets to connect before using them
        const connectedBotSockets = await getBotSockets();

        connectedBotSockets.forEach((socket, i) => {
            socket.emit(SocketEvents.bet, {
                playerId: botPlayers[i].id,
                userId: botPlayers[i].userId,
                amount: getRandomNum(),
                altitude: getRandomNum()
            });
        });
    } catch (error) {
        console.error('Error : ', error);
        throw(error);
    }

};
