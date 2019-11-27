module.exports = function (sequelize, DataTypes) {
    const Player = sequelize.define('Player',
        {
            id: {type: DataTypes.STRING, primaryKey: true}
        },
        {
            freezeTableName: true
        }
    );

    Player.associate = models => {
        Player.hasOne(models.Movement, {foreignKey: 'playerId'});
    };

    return Player;
};
