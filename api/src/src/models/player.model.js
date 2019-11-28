module.exports = function (sequelize, DataTypes) {
    const Player = sequelize.define('Player',
        {
            id: {type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false},
            userId: {type: DataTypes.STRING},
        },
        {
            freezeTableName: true
        }
    );

    Player.associate = models => {
        Player.belongsTo(models.Movement, {foreignKey: 'movementId'});
    };

    return Player;
};
