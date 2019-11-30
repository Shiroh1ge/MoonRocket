const Launch = require('../models').Launch;
const movementsRepo = require('../repository/movements.repo');
const playersRepo = require('../repository/players.repo');
const sequelize = require('../models').sequelize;

const getLaunchAltitude = () => {
    return 20;
};

/**
 * Calculate how much the user wins for a given betAltitude
 * @param {number} betAltitude
 * @param {number} betAmount
 * @returns {number}
 */
const getWinnerBetAmount = (betAltitude, betAmount) => {
    return betAltitude * betAmount;
};

/**
 * Calculate the gain from a bet. Can be negative
 * @param {number} winningAltitude
 * @param {number} betAmount
 * @param {number} betAltitude
 * @returns {number}
 */
// const calculateBetGain = (winningAltitude, betAltitude, betAmount) => {
//     if (betAmount === 0) {
//         return 0;
//     }
//
//     if (winningAltitude <= betAltitude) {
//         return getWinnerBetAmount(betAltitude, betAmount);
//     }
//
//     if (winningAltitude > betAltitude) {
//         return -betAmount;
//     }
//
// };

/**
 * Calculate betting results for a given altitude
 * @param winningAltitude
 * @param playerBets
 * @param playerBets
 *
 * @returns {object} result
 * @returns {number | *} result.totalBetAmount
 */
const calculateBettingResults = (winningAltitude, playerBets) => {
    let totalBetAmount = 0;
    let totalLostAmount = 0;
    let totalWonAmount = 0;
    const playerIdGainsMap = {};

    playerBets.forEach(playerBet => {
        totalBetAmount += playerBet.amount;

        if (winningAltitude >= playerBet.altitude) {
            const winnerAmount = getWinnerBetAmount(playerBet.altitude, playerBet.amount);
            totalWonAmount += winnerAmount;
            playerIdGainsMap[playerBet.playerId] = winnerAmount;
        }

        if (winningAltitude < playerBet.altitude) {
            totalLostAmount += playerBet.amount;
            playerIdGainsMap[playerBet.playerId] = -playerBet.amount;
        }

    });

    console.log('totalbetamount', totalBetAmount);
    console.log('totalLostAmouint', totalLostAmount);
    console.log('totalWonAmount', totalWonAmount);
    console.log('playerIdGainsMap', playerIdGainsMap);

    return {totalBetAmount, totalLostAmount, totalWonAmount, playerIdGainsMap};
};


/**
 * Used to find a launch in the database.
 * @param {object} query
 * @param {object} options
 * @returns {Promise.<*>}
 */
const getLaunch = async (query, options = {}) => {
    try {
        return await Launch.findOne({where: query, ...options});
    } catch (error) {
        console.error('Error getting launch: ', error);
        throw(error);
    }
};

const updateLaunch = async (query, updateData, options = {}) => {
    try {
        return await Launch.update(updateData, {where: query, ...options});
    } catch (error) {
        console.error('Error updating launch: ', error);
        throw(error);
    }
};

/**
 * Creates a launch and saves it in the database.
 * @param {object} launchData
 * @param {number} launchData.altitude
 * @param {object} [options]
 * @returns {Promise.<*>}
 */
const createLaunch = async (launchData, options = {}) => {
    try {
        const launch = await Launch.create(launchData, {...options});

        return launch;

    } catch (error) {
        console.error('Error creating launch: ', error);
        throw(error);
    }
};

/**
 * Creates a launch and saves it in the database.
 * @param {array} playerBets
 * @returns {Promise.<*>}
 */
const newLaunchFlow = async (playerBets) => {
    try {
        let result = await sequelize.transaction(async (transaction) => {
            const altitude = getLaunchAltitude();

            const {
                totalBetAmount,
                totalLostAmount,
                totalWonAmount,
                playerIdGainsMap
            } = calculateBettingResults(altitude, playerBets);

            const launchData = {
                altitude,
                totalBetAmount,
                totalLostAmount,
                totalWonAmount
            };

            // step 1 - create a launch
            const launch = await createLaunch(launchData, {transaction});

            // step 2 - create movements
            const movementsData = playerBets.map(playerBet => {
                return {
                    gain: playerIdGainsMap[playerBet.playerId],
                    playerId: playerBet.playerId,
                    launchId: launch.id
                };
            });
            const movements = await movementsRepo.createMovements(movementsData, {transaction});

            // step 3 Update players new balance
            const updatedPlayers = await Promise.all(
                playerBets.map(playerBet => {
                    return playersRepo.incrementPlayerField(
                        {
                            id: playerBet.playerId
                        },
                        {
                            balance: playerIdGainsMap[playerBet.playerId]
                        },
                        {transaction}
                    );
                })
            );

            return launch;
        });

        console.log('Result after transaction', result);

        return result;
    } catch (error) {
        console.log('Error finalizing new launch flow: ', error);
    }
};


module.exports = {
    getLaunch,
    createLaunch,
    updateLaunch,
    newLaunchFlow
};
