export default (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Booking.associate = models => {
    Booking.belongsTo(models.TimeSlot, { foreignKey: 'slot_id' });
    Booking.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Booking;
};