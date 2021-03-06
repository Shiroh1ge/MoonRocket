module.exports = function (sequelize, DataTypes) {
    const Player = sequelize.define('Player',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            userId: {type: DataTypes.STRING, unique: true, allowNull: false},
            balance: {
                type: DataTypes.INTEGER,
                defaultValue: 10,
                validate: {
                    min: 0
                }
            }
        },
        {
            tableName: 'players'
        }
    );

    Player.associate = models => {
        Player.hasMany(models.Movement, {foreignKey: 'playerId'});
    };

    return Player;
};
