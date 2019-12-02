'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '../../config/db.json')[env];
const db = {};


let sequelize = new Sequelize(config.database, config.username, config.password, config);


fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;

module.exports.connectDb = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('DB Connection has been established successfully.');

        await db.sequelize.sync({force: false});
        console.log('DB Models successfully synced');
    } catch (error) {
        console.error('Error : ', error);
        throw(error);
    }
};
