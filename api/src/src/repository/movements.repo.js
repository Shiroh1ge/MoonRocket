const Movement = require('../models').Movement;
const Player = require('../models').Player;

/**
 * Used to find a user in the database.
 * @param {object} query
 * @param {object} [fields]
 * @param {object} [options]
 * @returns {Promise.<*>}
 */
const getMovement = async (query, fields = {}, options = {}) => {
    return await Movement.findOne({where: query, include: [Player]});
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
    createMovement
};
