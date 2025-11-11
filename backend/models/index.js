const User = require('./user');
const Provider = require('./provider');
const Category = require('./category');
const Service = require('./service');
const Booking = require('./booking');
const Rating = require('./rating');
const OtpVerification = require('./otpVerification');
const City = require('./city');
const Area = require('./area');

// User - Provider (One-to-One)
User.hasOne(Provider, {
  foreignKey: 'user_id',
  as: 'provider_profile',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Provider.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Provider - Category (Many-to-One)
Provider.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Category.hasMany(Provider, {
  foreignKey: 'category_id',
  as: 'providers',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Provider - Service (One-to-Many)
Provider.hasMany(Service, {
  foreignKey: 'provider_id',
  as: 'services',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Service.belongsTo(Provider, {
  foreignKey: 'provider_id',
  as: 'provider',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Category - Service (One-to-Many)
Category.hasMany(Service, {
  foreignKey: 'category_id',
  as: 'services',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Service.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Category self-referencing (Parent-Child)
Category.hasMany(Category, {
  foreignKey: 'parent_id',
  as: 'subcategories',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Category.belongsTo(Category, {
  foreignKey: 'parent_id',
  as: 'parent',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// User - Booking (One-to-Many)
User.hasMany(Booking, {
  foreignKey: 'user_id',
  as: 'bookings',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Booking.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'customer',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Provider - Booking (One-to-Many)
Provider.hasMany(Booking, {
  foreignKey: 'provider_id',
  as: 'bookings',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Booking.belongsTo(Provider, {
  foreignKey: 'provider_id',
  as: 'provider',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Service - Booking (One-to-Many)
Service.hasMany(Booking, {
  foreignKey: 'service_id',
  as: 'bookings',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Booking.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Booking - Rating (One-to-One)
Booking.hasOne(Rating, {
  foreignKey: 'booking_id',
  as: 'rating',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Rating.belongsTo(Booking, {
  foreignKey: 'booking_id',
  as: 'booking',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// User - Rating (One-to-Many)
User.hasMany(Rating, {
  foreignKey: 'user_id',
  as: 'ratings_given',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Rating.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'customer',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Provider - Rating (One-to-Many)
Provider.hasMany(Rating, {
  foreignKey: 'provider_id',
  as: 'ratings_received',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Rating.belongsTo(Provider, {
  foreignKey: 'provider_id',
  as: 'provider',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Service - Rating (One-to-Many)
Service.hasMany(Rating, {
  foreignKey: 'service_id',
  as: 'ratings',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Rating.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// City - Area (One-to-Many)
City.hasMany(Area, {
  foreignKey: 'city_id',
  as: 'areas',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Area.belongsTo(City, {
  foreignKey: 'city_id',
  as: 'city',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// User - City (Many-to-One)
User.belongsTo(City, {
  foreignKey: 'city_id',
  as: 'city',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
City.hasMany(User, {
  foreignKey: 'city_id',
  as: 'users',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

// User - Area (Many-to-One)
User.belongsTo(Area, {
  foreignKey: 'area_id',
  as: 'area',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Area.hasMany(User, {
  foreignKey: 'area_id',
  as: 'users',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

module.exports = {
  User,
  Provider,
  Category,
  Service,
  Booking,
  Rating,
  OtpVerification,
  City,
  Area,
};
