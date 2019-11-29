const playersRepo = require('../repository/players.repo');
const SocketEvents = require('../constants/socket-events').SocketEvents;
const Rx = require('rxjs');
const {map, timeInterval, switchMap, filter, skipWhile, takeUntil, repeatWhen, delay, take} = require('rxjs/operators');

const LAUNCH_CREATION_INTERVAL = 1 * 1000;
const stop$ = new Rx.Subject();
const restart$ = new Rx.Subject();
const launchCreationInterval$ = Rx.interval(LAUNCH_CREATION_INTERVAL)
    .pipe(
        map(int => joinedPlayersBuffer)
    );
const joinedPlayersBuffer = new Map();

let betsFrozen = false;

/**
 * Checks if bid amount is higher than player balance, if it's higher, returns the maximum player balance.
 * @param bidAmount
 * @param playerBalance
 */
const getValidatedAmount = (bidAmount, playerBalance) => {
    console.log('bd am', bidAmount);
    console.log('baklans', playerBalance);
    if (bidAmount > playerBalance) {
        return playerBalance;
    } else {
        return bidAmount;
    }
};

module.exports = (io) => {
    io.on('connection', async (socket) => {
        socket.on(SocketEvents.bid, async (data) => {
            // currently we substitute userId with the socket id
            const player = await playersRepo.getPlayer({userId: data.userId});
            const amount = getValidatedAmount(data.amount, player.balance);

            const playerBiddingData = {
                userId: data.userId,
                amount,
                altitude: data.altitude
            };

            if (!betsFrozen) {
                joinedPlayersBuffer.set(playerBiddingData.userId, playerBiddingData);
                const joinedPlayers = [...joinedPlayersBuffer.values()];
                // console.log(joinedPlayers);
            }

        });
    });

    launchCreationInterval$
        .pipe(
            takeUntil(stop$),
            repeatWhen(() => restart$)
        )
        .subscribe(playersBufferMap => {
                console.log('map', playersBufferMap);
                if (joinedPlayersBuffer.size > 0) {
                    // init stuff
                    betsFrozen = true;
                    joinedPlayersBuffer.clear();
                    stop$.next();

                    // How many seconds to wait before starting a new launch
                    const countdownSeconds = 5;
                    const timer$ = Rx.timer(2000, 1000)
                        .pipe(
                            map(value => countdownSeconds - value),
                            take(countdownSeconds)
                        );

                    timer$.subscribe(val => {
                            io.emit(SocketEvents.newLaunchCountdown)
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
