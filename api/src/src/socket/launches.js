const launchesRepo = require('../repository/launches.repo');
const playersRepo = require('../repository/players.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;
const Rx = require('rxjs');
const {map, timeInterval, switchMap, filter, skipWhile, takeUntil, repeatWhen, delay, take} = require('rxjs/operators');

const LAUNCH_CREATION_INTERVAL = 2 * 1000;
const stop$ = new Rx.Subject();
const restart$ = new Rx.Subject();

const joinedPlayersBuffer = new Map();

let betsFrozen = false;

/**
 * Checks if bet amount is higher than player balance, if it's higher, returns the maximum player balance.
 * @param betAmount
 * @param playerBalance
 */
const getValidatedAmount = (betAmount, playerBalance) => {
    console.log('bd am', betAmount);
    console.log('baklans', playerBalance);
    if (betAmount > playerBalance) {
        return playerBalance;
    } else {
        return betAmount;
    }
};

const initLaunchCreation = async () => {
    betsFrozen = true;
    stop$.next();
    console.log('init launch', joinedPlayersBuffer);
    const launch = await launchesRepo.createLaunch({

    })

    joinedPlayersBuffer.clear();
};

module.exports = (io) => {
    io.on('connection', async (socket) => {
        socket.on(SocketEvents.bet, async (data) => {
            // currently we substitute userId with the socket id
            const player = await playersRepo.getPlayer({id: data.playerId});
            const amount = getValidatedAmount(data.amount, player.balance);

            const playerBetData = {
                playerId: player.id,
                userId: data.userId,
                amount,
                altitude: data.altitude
            };

            joinedPlayersBuffer.set(playerBetData.userId, playerBetData);

        });
    });

    const launchCreationInterval$ = Rx.interval(LAUNCH_CREATION_INTERVAL)
        .pipe(
            map(int => joinedPlayersBuffer),
            takeUntil(stop$),
            repeatWhen(() => restart$)
        )
        .subscribe(async (playersBufferMap) => {
                console.log('map', playersBufferMap);
                if (joinedPlayersBuffer.size > 0) {
                    // init stuff
                    await initLaunchCreation();

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
                            console.log('after complete timer, val', complete);
                            betsFrozen = false;
                            restart$.next();
                        }
                    );
                }

            }
        );
};
