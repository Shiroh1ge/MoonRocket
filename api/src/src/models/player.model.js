module.exports = function (sequelize, DataTypes) {
    const Player = sequelize.define('Player',
        {
            id: {type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false},
            userId: {type: DataTypes.STRING},
            balance: {type: DataTypes.INTEGER, defaultValue: 10},
        },
        {
            freezeTableName: true
        }
    );

    Player.associate = models => {
        Player.hasMany(models.Movement, {as: 'Movement', foreignKey: 'playerId'});
    };

    return Player;
};
