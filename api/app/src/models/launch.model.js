module.exports = function (sequelize, DataTypes) {
    const Launch = sequelize.define('Launch',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            altitude: {type: DataTypes.INTEGER, allowNull: false},
            participantsCount: {type: DataTypes.INTEGER},
            totalBetAmount: {type: DataTypes.INTEGER},
            // how much the users lost total
            totalLostAmount: {type: DataTypes.INTEGER},
            // how much the users won total
            totalWonAmount: {type: DataTypes.INTEGER}
        },
        {
            tableName: 'launches'
        }
    );

    Launch.associate = models => {
        Launch.hasMany(models.Movement, {foreignKey: 'launchId'});
    };

    return Launch;
};
