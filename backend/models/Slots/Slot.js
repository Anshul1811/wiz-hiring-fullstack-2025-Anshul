export default (sequelize, DataTypes) => {
    const TimeSlot = sequelize.define('Slots', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isFuture(value) {
            if (new Date(value) <= new Date()) {
              throw new Error('Slot time must be in the future');
            }
          },
        },
      },      
      max_bookings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },      
    });
  
     TimeSlot.associate = models => {
      TimeSlot.belongsTo(models.Event, { foreignKey: 'event_id' });
      TimeSlot.hasMany(models.Booking, { foreignKey: 'slot_id' });
    };
  
    return TimeSlot;
};