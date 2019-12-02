const Player = require('../models').Player;

/**
 * Used to find a player in the database.
 * @param {object} query
 * @param {object} options
 * @returns {Promise.<*>}
 */
const getPlayer = async (query, options = {}) => {
    try {
        return await Player.findOne({where: query, ...options});
    } catch (error) {
      console.error('Error fetching player: ', error);
      throw(error);
    }
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
 *
 * @param {object} query
 * @param {object} data // ex: {count: 5}
 * @param {array} data
 * @param {object} [options]
 * @returns {Promise<Model<Player>>}
 */
const incrementPlayerField = async (query, data, options = {}) => {
    return Player.increment(data, {where: query, ...options});
};

/**
 * Updates multiple players in the database.
 * @param {array} updateData
 * @param {string} updateData.id
 * @param {array} fields - the fields that need updating
 * @param {object} options
 * @returns {Promise.<*>}
 */
const updatePlayers = async (updateData, options = {}, fields = []) => {
    try {
        const idsExist = updateData.every(player => !!player.id);

        if (!idsExist) {
            throw new Error('Some of the objects do not have an id field.');
        }

        return await Player.bulkCreate(updateData, {...options, updateOnDuplicate: fields});

    } catch (error) {
        console.error('Error updating players: ', error);
        throw(error);
    }


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
    findOrCreatePlayer,
    updatePlayer,
    updatePlayers,
    incrementPlayerField
};
