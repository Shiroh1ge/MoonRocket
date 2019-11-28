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
 * Creates a movement if it does not exist.
 * @param {object} query
 * @returns {Promise.<*>}
 */
const findOrCreateMovement = async (query) => {
    const movement = await Movement.findOrCreate({where: query});

    return movement;
};

/**
 * Creates a movement and saves it in the database.
 * @param {object} movementData
 * @returns {Promise.<*>}
 */
const createMovement = async (movementData) => {
    const movement = await Movement.create(movementData);

    return movement;
};


module.exports = {
    getMovement,
    createMovement,
    findOrCreateMovement
};
