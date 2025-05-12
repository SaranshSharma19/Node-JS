
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "category title cannot be empty" },
        notNull: { msg: "category title is required" },
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: "https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png",
    }
  }, {
    timestamps: false,
  });

  return Category;
}