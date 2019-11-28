const Player = require('../models').Player;

/**
 * Used to find a player in the database.
 * @param {object} query
 * @param {object} options
 * @returns {Promise.<*>}
 */
const getPlayer = async (query, options = {}) => {
    return await Player.findOne({where: query, ...options});
};

/**
 * Creates a player if it does not exist.
 * @param {object} query
 * @returns {Promise.<*>}
 */
const findOrCreatePlayer = async (query) => {
    const [player, created] = await Player.findOrCreate({where: query});

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

        return player;

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
