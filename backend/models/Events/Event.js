export default (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
    });
  
    Event.associate = models => {
      Event.belongsTo(models.User, { foreignKey: 'user_id' });
      Event.hasMany(models.TimeSlot, { foreignKey: 'event_id' });
    };
  
    return Event;
};  