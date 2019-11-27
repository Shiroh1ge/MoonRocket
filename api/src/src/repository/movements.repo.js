const Movement = require('../models').Movement;

/**
 * Used to find a user in the database.
 * @param {object} query
 * @param {object} [fields]
 * @param {object} [options]
 * @returns {Promise.<*>}
 */
const getMovement = async (query, fields = {}, options = {}) => {
    return await Movement.findOne({where: query});
};

/**
 * Creates a player if it does not exist.
 * @param {object} query
 * @returns {Promise.<*>}
 */
const findOrCreateMovement = async (query) => {
    const player = await Movement.findOrCreate({where: query});

    return player;
};

/**
 * Creates a player and saves it in the database.
 * @param {object} playerData
 * @returns {Promise.<*>}
 */
const createMovement = async (playerData) => {
    const player = await Movement.create(playerData);

    return player;
};


module.exports = {
    getMovement,
    createMovement,
    findOrCreateMovement
};
