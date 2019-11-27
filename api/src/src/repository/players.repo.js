const Player = require('../models').Player;

/**
 * Used to find a user in the database.
 * @param {object} query
 * @param {object} [fields]
 * @param {object} [options]
 * @returns {Promise.<*>}
 */
const getPlayer = async (query, fields = {}, options = {}) => {
    return await Player.findOne({where: query});
};

/**
 * Creates a player and saves it in the database.
 * @param {object} playerData
 * @returns {Promise.<*>}
 */
const newPlayer = async (playerData) => {
    const player = await Player.create(playerData);

    return player;
};

newPlayer({id: '1234'})

module.exports = {
    getPlayer,
    newPlayer
};
