module.exports = function (sequelize, DataTypes) {
    const Movement = sequelize.define('Movement',
        {
            amount: {type: DataTypes.STRING},
        },
        {
            freezeTableName: true
        }
    );

    Movement.associate = models => {
        Movement.belongsTo(models.Player, {foreignKey: 'playerId'});
    };

    return Movement;
};
