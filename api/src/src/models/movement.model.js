module.exports = function (sequelize, DataTypes) {
    const Movement = sequelize.define('Movement',
        {
            id: {type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false},
            amount: {type: DataTypes.INTEGER, defaultValue: 100},
        },
        {
            freezeTableName: true
        }
    );

    // Movement.associate = models => {
    //     Movement.belongsTo(models.Player, {foreignKey: 'countryCode', targetKey: 'isoCode', constraints: false});
    // };

    return Movement;
};
