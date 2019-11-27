module.exports = function (sequelize, DataTypes) {
    const Player = sequelize.define("Player",
        {
            username: {type: DataTypes.STRING}
        },
        {
            freezeTableName: true
        }
    );

    return Player;
};
