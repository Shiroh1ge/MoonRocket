const Player = require('../models').Player;
const Movement = require('../models').Movement;
const MovementsRepo = require('../repository/movements.repo');

/**
 * Used to find a player in the database.
 * @param {object} query
 * @param {object} options
 * @returns {Promise.<*>}
 */
const getPlayer = async (query, options = {}) => {
    return await Player.findOne({where: query, include: [Movement], ...options});
};

/**
 * Creates a player if it does not exist.
 * @param {object} query
 * @returns {Promise.<*>}
 */
const findOrCreatePlayer = async (query) => {
    const [player, created] = await Player.findOrCreate({where: query, include: [Movement]});

    return player;
};

const updatePlayer = async (query, updateData) => {
    return Player.update(updateData, {where: query});
};

/**
 * Creates a player and saves it in the database.
 * @param {object} playerData
 * @param {string} playerData.userId
 * @returns {Promise.<*>}
 */
const createPlayer = async (playerData) => {
    try {
        const player = await Player.create(playerData);
        const movement = await MovementsRepo.createMovement({playerId: player.id});
        await updatePlayer({id: player.id}, {movementId: movement.id});
        const updatedPlayer = await getPlayer({id: player.id});

        return updatedPlayer;

    } catch (error) {
        console.error('Error creating player: ', error);
        throw(error);
    }

};


module.exports = {
    getPlayer,
    createPlayer,
    findOrCreatePlayer
};
