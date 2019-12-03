const launchesRepo = require('../repository/launches.repo');
const playersRepo = require('../repository/players.repo');
const movementsRepo = require('../repository/movements.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;
const SocketRooms = require('../constants/socket-events').SocketRooms;
const Rx = require('rxjs');
const {takeUntil, repeatWhen} = require('rxjs/operators');
const errors = require('../helpers/errors');
const LAUNCH_CREATION_INTERVAL = 10 * 1000;
const stop$ = new Rx.Subject();
const restart$ = new Rx.Subject();

const playerBetsBuffer = new Map();

/**
 * Checks if bet amount is higher than player balance, if it's higher, returns the maximum player balance.
 * @param betAmount
 * @param playerBalance
 */
const getValidatedBetAmount = (betAmount, playerBalance) => {
    if (betAmount > playerBalance) {
        return playerBalance;
    } else {
        return betAmount;
    }
};

const reInitLaunch = () => {
    restart$.next();
};

module.exports = (io) => {
    io.on('connection', async (socket) => {
        socket.on(SocketEvents.bet, async (data) => {
            // currently we substitute userId with the socket id
            const player = await playersRepo.getPlayer({id: data.playerId});
            const amount = getValidatedBetAmount(data.amount, player.balance);

            if (amount === 0) {
                return;
            }

            const playerBetData = {
                playerId: player.id,
                userId: data.userId,
                amount,
                altitude: data.altitude
            };

            playerBetsBuffer.set(playerBetData.userId, playerBetData);
        });
    });


    const initLaunchCreation = async () => {
        let playerBets = [...playerBetsBuffer.values()];
        playerBetsBuffer.clear();
        stop$.next();

        try {
            console.log('Creating new launch...');
            // throw 'bako';
            const [launch, movements] = await launchesRepo.newLaunchFlow(playerBets);

            const movementPlayerIdMap = movements
                .reduce((result, movement) => {
                    result[movement.playerId] = movement;

                    return result;
                }, {});

            io.to(SocketRooms.launches).emit(SocketEvents.newBets,
                {
                    playerBets
                });

            setTimeout(() => {
                io.to(SocketRooms.launches).emit(SocketEvents.newLaunch,
                    {
                        launch,
                        movementPlayerIdMap
                    });
                reInitLaunch();

            }, 2000);

            return launch;

        } catch (error) {
            io.to(SocketRooms.launches).emit(SocketEvents.error, errors.unsuccessfulLaunch);
            reInitLaunch();
            console.error('Error creating a launch: ', error);
            throw new Error(errors.unsuccessfulLaunch);

        }

    };

    const launchCreationInterval$ = Rx.interval(LAUNCH_CREATION_INTERVAL)
        .pipe(
            takeUntil(stop$),
            repeatWhen(() => restart$)
        )
        .subscribe(async (value) => {
                await initLaunchCreation();
            }
        );
};
