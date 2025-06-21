export default (sequelize, DataTypes) => {
    const TimeSlot = sequelize.define('Slots', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      start_time: DataTypes.DATE, 
      max_bookings: DataTypes.INTEGER,
    });
  
    TimeSlot.associate = models => {
      TimeSlot.belongsTo(models.Event, { foreignKey: 'event_id' });
      TimeSlot.hasMany(models.Booking, { foreignKey: 'slot_id' });
    };
  
    return TimeSlot;
};