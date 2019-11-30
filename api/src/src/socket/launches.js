const launchesRepo = require('../repository/launches.repo');
const playersRepo = require('../repository/players.repo');
const movementsRepo = require('../repository/movements.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;
const SocketRooms = require('../constants/socket-events').SocketRooms;
const Rx = require('rxjs');
const {map, timeInterval, switchMap, filter, skipWhile, takeUntil, repeatWhen, delay, take} = require('rxjs/operators');

const LAUNCH_CREATION_INTERVAL = 10 * 1000;
const stop$ = new Rx.Subject();
const restart$ = new Rx.Subject();

const playerBetsBuffer = new Map();

let betsFrozen = false;

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

module.exports = (io) => {
    io.on('connection', async (socket) => {
        socket.on(SocketEvents.bet, async (data) => {
            // currently we substitute userId with the socket id
            const player = await playersRepo.getPlayer({id: data.playerId});
            const amount = getValidatedBetAmount(data.amount, player.balance);

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
        try {
            stop$.next();

            let playerBets = [...playerBetsBuffer.values()];
            playerBetsBuffer.clear();

            const launch = await launchesRepo.newLaunchFlow(playerBets);

            return [launch, playerBets];

        } catch (error) {
            console.error('Error creating a launch: ', error);
        }

    };

    const launchCreationInterval$ = Rx.interval(LAUNCH_CREATION_INTERVAL)
        .pipe(
            map(int => playerBetsBuffer),
            takeUntil(stop$),
            repeatWhen(() => restart$)
        )
        .subscribe(async (playersBufferMap) => {
                console.log('playerBetsBufferMap', playersBufferMap);
                let [launch, playerBets] = await initLaunchCreation();
                const movementPlayerIdMap = (await movementsRepo.getMovements({launchId: launch.id}))
                    .reduce((result, movement) => {
                        result[movement.playerId] = movement;

                        return result;
                    }, {});


                playerBets = playerBets.forEach(playerBet => {
                    playerBet.isWinner = movementPlayerIdMap[playerBet.playerId] && movementPlayerIdMap[playerBet.playerId].gain > 0;
                    io.to(SocketRooms.user + playerBet.userId).emit(SocketEvents.newLaunch,
                        {
                            launch: {altitude: launch.altitude, id: launch.id},
                            currentPlayerMovement: movementPlayerIdMap[playerBet.playerId],
                            playerBets
                        });
                });

                // Delay before starting the next launch countdown (show the animation here)
                const nextLaunchDelay = 2000;
                // Countdown before starting the new launch (after animation ending)
                const countdownSeconds = 5;
                const timer$ = Rx.timer(nextLaunchDelay, 1000)
                    .pipe(
                        map(value => countdownSeconds - value),
                        take(countdownSeconds)
                    );

                timer$.subscribe(val => {
                        console.log('countdown before next launch: ', val);
                        io.emit(SocketEvents.newLaunchCountdown, val);
                    },
                    {},
                    complete => {
                        console.log('Launch has completed, restarting...');
                        restart$.next();
                    }
                );

            }
        );
};
