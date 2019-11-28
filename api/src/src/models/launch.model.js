module.exports = function (sequelize, DataTypes) {
    const Launch = sequelize.define('Launch',
        {
            id: {type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false},
            userId: {type: DataTypes.STRING},
            altitude: {type: DataTypes.INTEGER, defaultValue: 0},
            totalBidAmount: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false}
        },
        {
            freezeTableName: true
        }
    );

    Launch.associate = models => {
        Launch.hasMany(models.Movement, {foreignKey: 'launchId'});
    };

    return Launch;
};
