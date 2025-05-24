module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define("Item", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: true,
    });

    return Item
}