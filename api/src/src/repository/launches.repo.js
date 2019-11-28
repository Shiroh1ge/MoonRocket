const Launch = require('../models').Launch;

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

const updateLaunch = async (query, updateData) => {
    try {
        return await Launch.update(updateData, {where: query});
    } catch (error) {
        console.error('Error updating launch: ', error);
        throw(error);
    }
};

/**
 * Creates a launch and saves it in the database.
 * @param {object} launchData
 * @param {string} launchData.userId
 * @returns {Promise.<*>}
 */
const createLaunch = async (launchData) => {
    try {
        const launch = await Launch.create(launchData);

        return launch;

    } catch (error) {
        console.error('Error creating launch: ', error);
        throw(error);
    }

};


module.exports = {
    getLaunch,
    createLaunch,
    updateLaunch
};
