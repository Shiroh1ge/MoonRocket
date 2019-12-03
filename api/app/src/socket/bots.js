const playersRepo = require('../repository/players.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;
const SocketRooms = require('../constants/socket-events').SocketRooms;
const io_client = require('socket.io-client');
const metaSettings = require('../config/config').metaSettings;
const Rx = require('rxjs');
const {takeUntil, repeatWhen} = require('rxjs/operators');

const botUserIds = [
    'K0SIKFYDyR1Twe3BAAAD',
    'wQG-klFOFJHeJIADAAAC',
    'SdV3u0dfmXMj3w2lAAAA',
    'SdV3u0bakovaXMj3w2lAAAA'
];
const DEFAULT_BOT_BALANCE = 1000;
const BOT_BET_INTERVAL = 8 * 1000;
const stop$ = new Rx.Subject();
const restart$ = new Rx.Subject();

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
    const botPlayers = await Promise.all(
        botUserIds.map(userId => playersRepo.getOrCreatePlayer({userId}, {balance: DEFAULT_BOT_BALANCE}))
    );

    // We wait for the sockets to connect before using them
    const connectedBotSockets = await getBotSockets();

    const botsBetInterval$ = Rx.interval(BOT_BET_INTERVAL)
        .pipe(
            takeUntil(stop$),
            repeatWhen(() => restart$)
        )
        .subscribe(async (value) => {
            console.log('Sending bot events...');
                connectedBotSockets.forEach((socket, i) => {
                    socket.emit(SocketEvents.bet, {
                        playerId: botPlayers[i].id,
                        userId: botPlayers[i].userId,
                        amount: getRandomNum(),
                        altitude: getRandomNum()
                    });
                });

            }
        );

};
