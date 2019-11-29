module.exports = function (sequelize, DataTypes) {
    const Movement = sequelize.define('Movement',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            // how many coins the user has won/lost
            gain: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
        },
        {
            freezeTableName: true
        }
    );

    return Movement;
};
