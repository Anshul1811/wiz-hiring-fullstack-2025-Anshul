export default (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
    });
  
    Booking.associate = models => {
    Booking.belongsTo(models.TimeSlot, { foreignKey: 'slot_id' });
    };
  
    return Booking;
};  