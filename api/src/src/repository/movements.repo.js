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
    return await Movement.findOne({where: query});
};

/**
 * Used to find a list of movements from the database.
 * @param {object} query
 * @param {object} [fields]
 * @param {object} [options]
 * @returns {Promise.<*>}
 */
const getMovements = async (query, fields = {}, options = {}) => {
    return await Movement.findAll({where: query, include: [Player]});
};

/**
 * Creates a movement and saves it in the database.
 * @param {object} movementData
 * @param {string} movementData.gain
 * @returns {Promise.<*>}
 */
const createMovement = async (movementData) => {
    const movement = await Movement.create(movementData);

    return movement;
};

/**
 * Creates multiple movements and saves them in the database.
 * @param {array} movementData
 * @param {string} movementData.gain
 * @param {object} options
 * @returns {Promise.<*>}
 */
const createMovements = async (movementData, options = {}) => {
    const movement = await Movement.bulkCreate(movementData, {...options});

    return movement;
};

/**
 * Updates multiple movements in the database.
 * @param {array} updateData
 * @param {string} updateData.id
 * @param {object} options
 * @returns {Promise.<*>}
 */
const updateMovements = async (updateData, options = {}) => {
    try {
        const idsExist = updateData.every(movement => !!movement.id);

        if (!idsExist) {
            throw new Error('Some of the objects do not have an id field.');
        }

        return await Movement.bulkCreate(updateData, {...options});;
    } catch (error) {
        console.error('Error updating movements: ', error);
        throw(error);
    }
};


module.exports = {
    getMovement,
    createMovement,
    createMovements,
    updateMovements,
    getMovements
};
