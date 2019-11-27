const Player = require('../models').Player;
const Movement = require('../models').Movement;

/**
 * Used to find a user in the database.
 * @param {object} query
 * @param {object} [fields]
 * @param {object} [options]
 * @returns {Promise.<*>}
 */
const getPlayer = async (query, fields = {}, options = {}) => {
    return await Player.findOne({where: query, include: [Movement]});
};

/**
 * Creates a player if it does not exist.
 * @param {object} query
 * @returns {Promise.<*>}
 */
const findOrCreatePlayer = async (query) => {
    const player = await Player.findOrCreate({where: query, include: [Movement]});

    return player;
};

/**
 * Creates a player and saves it in the database.
 * @param {object} playerData
 * @returns {Promise.<*>}
 */
const createPlayer = async (playerData) => {
    const player = await Player.create(playerData);

    return player;
};


module.exports = {
    getPlayer,
    createPlayer,
    findOrCreatePlayer
};
