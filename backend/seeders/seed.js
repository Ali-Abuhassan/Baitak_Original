const sequelize = require('../config/database');
const { User, Provider, Category, Service, Booking, Rating, City, Area } = require('../models');
const { seedJordanCities } = require('./cityAreaSeeder');
const bcrypt = require('bcryptjs');
const colors = require('colors');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...'.cyan);

    // Sync database (create tables)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced'.green);

    // Seed cities and areas first
    await seedJordanCities();

    // Get Amman city and area for admin user
    const ammanCity = await City.findOne({ where: { slug: 'amman' } });
    const abdounArea = await Area.findOne({ where: { slug: 'abdoun' } });

    // Create or get Admin User
    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@baitak.com' },
      defaults: {
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1234567890',
        email: 'admin@baitak.com',
        password: 'Admin@123456',
        role: 'admin',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: abdounArea.id,
      },
    });
    if (adminCreated) {
      console.log('✅ Admin user created'.green);
    } else {
      console.log('✅ Admin user already exists'.yellow);
    }

    // Create Categories (ignore duplicates)
    const categoriesData = [
      {
        name: 'Cleaning',
        slug: 'cleaning',
        description: 'Professional home and office cleaning services',
        icon: '🧹',
        suggested_price_range: { min: 25, max: 50, currency: 'USD' },
        is_active: true,
        display_order: 1,
      },
      {
        name: 'Plumbing',
        slug: 'plumbing',
        description: 'Expert plumbing repairs and installations',
        icon: '🔧',
        suggested_price_range: { min: 50, max: 150, currency: 'USD' },
        is_active: true,
        display_order: 2,
      },
      {
        name: 'Electrical',
        slug: 'electrical',
        description: 'Licensed electricians for all electrical needs',
        icon: '⚡',
        suggested_price_range: { min: 60, max: 200, currency: 'USD' },
        is_active: true,
        display_order: 3,
      },
      {
        name: 'Painting',
        slug: 'painting',
        description: 'Interior and exterior painting services',
        icon: '🎨',
        suggested_price_range: { min: 40, max: 100, currency: 'USD' },
        is_active: true,
        display_order: 4,
      },
    ];

    // Create categories or get existing ones
    const categories = [];
    for (const categoryData of categoriesData) {
      const [category, created] = await Category.findOrCreate({
        where: { slug: categoryData.slug },
        defaults: categoryData,
      });
      categories.push(category);
    }
    console.log(`✅ ${categories.length} categories ready`.green);

    // Get additional cities and areas for sample users
    const irbidCity = await City.findOne({ where: { slug: 'irbid' } });
    const zarqaCity = await City.findOne({ where: { slug: 'zarqa' } });
    const aqabaCity = await City.findOne({ where: { slug: 'aqaba' } });
    
    const sweifiehArea = await Area.findOne({ where: { slug: 'sweifieh' } });
    const jabalAmmanArea = await Area.findOne({ where: { slug: 'jabal-amman' } });
    const downtownArea = await Area.findOne({ where: { slug: 'downtown' } });
    const cityCenterArea = await Area.findOne({ where: { slug: 'city-center' } });

    // Create Sample Customers (skip if already exist)
    const customersData = [
      {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567891',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'customer',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: sweifiehArea.id,
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+1234567892',
        email: 'jane.smith@example.com',
        password: 'password123',
        role: 'customer',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: jabalAmmanArea.id,
      },
      {
        first_name: 'Mike',
        last_name: 'Johnson',
        phone: '+1234567893',
        email: 'mike.j@example.com',
        password: 'password123',
        role: 'customer',
        is_verified: true,
        city_id: irbidCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Emily',
        last_name: 'Davis',
        phone: '+1234567898',
        email: 'emily.d@example.com',
        password: 'password123',
        role: 'customer',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: abdounArea.id,
      },
      {
        first_name: 'David',
        last_name: 'Brown',
        phone: '+1234567899',
        email: 'david.b@example.com',
        password: 'password123',
        role: 'customer',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: sweifiehArea.id,
      },
      {
        first_name: 'Lisa',
        last_name: 'Wilson',
        phone: '+1234567800',
        email: 'lisa.w@example.com',
        password: 'password123',
        role: 'customer',
        is_verified: true,
        city_id: irbidCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Robert',
        last_name: 'Taylor',
        phone: '+1234567801',
        email: 'robert.t@example.com',
        password: 'password123',
        role: 'customer',
        is_verified: true,
        city_id: zarqaCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Sara',
        last_name: 'Anderson',
        phone: '+1234567802',
        email: 'sara.a@example.com',
        password: 'password123',
        role: 'customer',
        is_verified: true,
        city_id: aqabaCity.id,
        area_id: downtownArea.id,
      },
    ];

    // Create customers using findOrCreate to avoid duplicates
    const customers = [];
    for (const customerData of customersData) {
      const [customer, created] = await User.findOrCreate({
        where: { email: customerData.email },
        defaults: customerData,
      });
      customers.push(customer);
    }
    console.log(`✅ ${customers.length} customers ready`.green);

    // Create Provider Users
    const providerUsersData = [
      {
        first_name: 'Ahmed',
        last_name: 'Hassan',
        phone: '+1234567894',
        email: 'ahmed.h@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: abdounArea.id,
      },
      {
        first_name: 'Sarah',
        last_name: 'Wilson',
        phone: '+1234567895',
        email: 'sarah.w@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: sweifiehArea.id,
      },
      {
        first_name: 'Michael',
        last_name: 'Chen',
        phone: '+1234567896',
        email: 'michael.c@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: zarqaCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Maria',
        last_name: 'Garcia',
        phone: '+1234567897',
        email: 'maria.g@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: aqabaCity.id,
        area_id: downtownArea.id,
      },
    ];

    // Create provider users using findOrCreate
    const providerUsers = [];
    for (const providerData of providerUsersData) {
      const [provider, created] = await User.findOrCreate({
        where: { email: providerData.email },
        defaults: providerData,
      });
      providerUsers.push(provider);
    }

    // Add 20 more provider users
    const additionalProviderUsersData = [
      {
        first_name: 'Omar',
        last_name: 'Al-Rashid',
        phone: '+1234567803',
        email: 'omar.r@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: sweifiehArea.id,
      },
      {
        first_name: 'Fatima',
        last_name: 'Hassan',
        phone: '+1234567804',
        email: 'fatima.h@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: jabalAmmanArea.id,
      },
      {
        first_name: 'James',
        last_name: 'Miller',
        phone: '+1234567805',
        email: 'james.m@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: irbidCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Aisha',
        last_name: 'Khalil',
        phone: '+1234567806',
        email: 'aisha.k@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: abdounArea.id,
      },
      {
        first_name: 'Thomas',
        last_name: 'White',
        phone: '+1234567807',
        email: 'thomas.w@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: zarqaCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Layla',
        last_name: 'Nasser',
        phone: '+1234567808',
        email: 'layla.n@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: aqabaCity.id,
        area_id: downtownArea.id,
      },
      {
        first_name: 'Daniel',
        last_name: 'Lee',
        phone: '+1234567809',
        email: 'daniel.l@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: sweifiehArea.id,
      },
      {
        first_name: 'Nour',
        last_name: 'Abu-Bakr',
        phone: '+1234567810',
        email: 'nour.ab@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: jabalAmmanArea.id,
      },
      {
        first_name: 'Christopher',
        last_name: 'Garcia',
        phone: '+1234567811',
        email: 'chris.g@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: irbidCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Rania',
        last_name: 'Salem',
        phone: '+1234567812',
        email: 'rania.s@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: abdounArea.id,
      },
      {
        first_name: 'William',
        last_name: 'Thompson',
        phone: '+1234567813',
        email: 'william.t@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: zarqaCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Hala',
        last_name: 'Ibrahim',
        phone: '+1234567814',
        email: 'hala.i@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: aqabaCity.id,
        area_id: downtownArea.id,
      },
      {
        first_name: 'Matthew',
        last_name: 'Martinez',
        phone: '+1234567815',
        email: 'matthew.m@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: sweifiehArea.id,
      },
      {
        first_name: 'Yasmin',
        last_name: 'Omar',
        phone: '+1234567816',
        email: 'yasmin.o@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: jabalAmmanArea.id,
      },
      {
        first_name: 'Andrew',
        last_name: 'Robinson',
        phone: '+1234567817',
        email: 'andrew.r@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: irbidCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Mona',
        last_name: 'Farid',
        phone: '+1234567818',
        email: 'mona.f@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: abdounArea.id,
      },
      {
        first_name: 'Joshua',
        last_name: 'Clark',
        phone: '+1234567819',
        email: 'joshua.c@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: zarqaCity.id,
        area_id: cityCenterArea.id,
      },
      {
        first_name: 'Dina',
        last_name: 'Mahmoud',
        phone: '+1234567820',
        email: 'dina.m@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: aqabaCity.id,
        area_id: downtownArea.id,
      },
      {
        first_name: 'Ryan',
        last_name: 'Rodriguez',
        phone: '+1234567821',
        email: 'ryan.r@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: sweifiehArea.id,
      },
      {
        first_name: 'Lina',
        last_name: 'Zayed',
        phone: '+1234567822',
        email: 'lina.z@example.com',
        password: 'password123',
        role: 'provider',
        is_verified: true,
        city_id: ammanCity.id,
        area_id: jabalAmmanArea.id,
      },
    ];

    // Create additional provider users using findOrCreate
    const additionalProviderUsers = [];
    for (const providerData of additionalProviderUsersData) {
      const [provider, created] = await User.findOrCreate({
        where: { email: providerData.email },
        defaults: providerData,
      });
      additionalProviderUsers.push(provider);
    }

    const allProviderUsers = [...providerUsers, ...additionalProviderUsers];
    console.log(`✅ ${allProviderUsers.length} provider users created`.green);

    // Create Provider Profiles for all 24 providers
    let providers;
    try {
      providers = await Provider.bulkCreate([
      // Original 4 providers
      {
        user_id: providerUsers[0].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Sparkle Clean Services',
        bio: 'Professional cleaning service with 10+ years experience. We use eco-friendly products.',
        hourly_rate: 35,
        experience_years: 10,
        status: 'approved',
        rating_avg: 4.8,
        rating_count: 127,
        languages: ['English', 'Arabic'],
        service_areas: ['abdoun', 'sweifieh', 'jabal-amman'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '08:00', end: '20:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: providerUsers[1].id,
        category_id: categories[1].id, // Plumbing
        business_name: 'Pro Plumbing Solutions',
        bio: 'Licensed plumber specializing in emergency repairs and installations.',
        hourly_rate: 75,
        experience_years: 15,
        status: 'approved',
        rating_avg: 4.9,
        rating_count: 89,
        languages: ['English'],
        service_areas: ['abdoun', 'sweifieh', 'jabal-amman', 'downtown', 'jabal-al-hussein', 'shmeisani', 'jubeiha', 'khalda', 'tlaa-al-ali'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        working_hours: { start: '07:00', end: '19:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: providerUsers[2].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Elite Tutoring Academy',
        bio: 'Math and Science tutor for high school and college students. PhD in Mathematics.',
        hourly_rate: 50,
        experience_years: 8,
        status: 'approved',
        rating_avg: 5.0,
        rating_count: 203,
        languages: ['English', 'Mandarin'],
        service_areas: ['Online', 'city-center', 'new-zarqa'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '09:00', end: '21:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: providerUsers[3].id,
        category_id: categories[3].id, // Painting
        business_name: 'Artistic Touch Painting',
        bio: 'Transform your space with professional painting. Interior and exterior specialist.',
        hourly_rate: 45,
        experience_years: 12,
        status: 'approved',
        rating_avg: 4.7,
        rating_count: 64,
        languages: ['English', 'Spanish'],
        service_areas: ['downtown', 'abdoun', 'sweifieh'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '08:00', end: '18:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      // 20 new providers
      {
        user_id: additionalProviderUsers[0].id,
        category_id: categories[2].id, // Electrical
        business_name: 'Omar\'s Electrical Works',
        bio: 'Certified electrician with 8 years experience. Specializing in residential and commercial electrical work.',
        hourly_rate: 65,
        experience_years: 8,
        status: 'approved',
        rating_avg: 4.6,
        rating_count: 45,
        languages: ['Arabic', 'English'],
        service_areas: ['sweifieh', 'abdoun', 'jabal-amman'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '08:00', end: '18:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[1].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Fatima\'s Garden Design',
        bio: 'Landscape architect creating beautiful outdoor spaces. Expert in garden design and maintenance.',
        hourly_rate: 40,
        experience_years: 6,
        status: 'approved',
        rating_avg: 4.8,
        rating_count: 32,
        languages: ['Arabic', 'English'],
        service_areas: ['jabal-amman', 'abdoun', 'sweifieh'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '07:00', end: '17:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[2].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'James Music Studio',
        bio: 'Professional music instructor teaching piano, guitar, and vocals. 12 years of teaching experience.',
        hourly_rate: 45,
        experience_years: 12,
        status: 'approved',
        rating_avg: 4.9,
        rating_count: 78,
        languages: ['English'],
        service_areas: ['city-center', 'Online'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '10:00', end: '20:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[3].id,
        category_id: categories[3].id, // Painting
        business_name: 'Aisha\'s Carpentry Workshop',
        bio: 'Master carpenter specializing in custom furniture and home renovations. 15 years experience.',
        hourly_rate: 55,
        experience_years: 15,
        status: 'approved',
        rating_avg: 4.7,
        rating_count: 56,
        languages: ['Arabic', 'English'],
        service_areas: ['abdoun', 'sweifieh', 'jabal-amman'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '08:00', end: '17:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[4].id,
        category_id: categories[1].id, // Plumbing
        business_name: 'Thomas Home Repairs',
        bio: 'Handyman services for all home maintenance needs. Quick and reliable repairs.',
        hourly_rate: 35,
        experience_years: 10,
        status: 'approved',
        rating_avg: 4.5,
        rating_count: 42,
        languages: ['English'],
        service_areas: ['city-center', 'new-zarqa'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '08:00', end: '18:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[5].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Layla\'s Language Academy',
        bio: 'Language tutor specializing in English, French, and Arabic. Certified teacher with 7 years experience.',
        hourly_rate: 30,
        experience_years: 7,
        status: 'approved',
        rating_avg: 4.8,
        rating_count: 89,
        languages: ['Arabic', 'English', 'French'],
        service_areas: ['downtown', 'Online'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '09:00', end: '21:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[6].id,
        category_id: categories[2].id, // Electrical
        business_name: 'Daniel\'s Tech Support',
        bio: 'Computer and IT support specialist. Home and office computer repairs and maintenance.',
        hourly_rate: 50,
        experience_years: 9,
        status: 'approved',
        rating_avg: 4.6,
        rating_count: 67,
        languages: ['English'],
        service_areas: ['sweifieh', 'abdoun', 'jabal-amman'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '09:00', end: '19:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[7].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Nour\'s Beauty Studio',
        bio: 'Professional makeup artist and beauty consultant. Specializing in bridal and event makeup.',
        hourly_rate: 60,
        experience_years: 5,
        status: 'approved',
        rating_avg: 4.9,
        rating_count: 34,
        languages: ['Arabic', 'English'],
        service_areas: ['jabal-amman', 'abdoun', 'sweifieh'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '10:00', end: '22:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[8].id,
        category_id: categories[1].id, // Plumbing
        business_name: 'Chris Auto Repair',
        bio: 'Automotive mechanic specializing in engine repair and maintenance. 11 years experience.',
        hourly_rate: 70,
        experience_years: 11,
        status: 'approved',
        rating_avg: 4.7,
        rating_count: 58,
        languages: ['English'],
        service_areas: ['city-center', 'new-zarqa'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '07:00', end: '18:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[9].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Rania\'s Fitness Coaching',
        bio: 'Certified personal trainer and fitness coach. Specializing in weight loss and strength training.',
        hourly_rate: 50,
        experience_years: 6,
        status: 'approved',
        rating_avg: 4.8,
        rating_count: 73,
        languages: ['Arabic', 'English'],
        service_areas: ['abdoun', 'sweifieh', 'jabal-amman'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '06:00', end: '21:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[10].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'William\'s Photography',
        bio: 'Professional photographer specializing in portraits, events, and commercial photography.',
        hourly_rate: 80,
        experience_years: 8,
        status: 'approved',
        rating_avg: 4.9,
        rating_count: 45,
        languages: ['English'],
        service_areas: ['city-center', 'new-zarqa'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '08:00', end: '20:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[11].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Hala\'s Cooking Classes',
        bio: 'Professional chef offering cooking classes and catering services. 10 years culinary experience.',
        hourly_rate: 40,
        experience_years: 10,
        status: 'approved',
        rating_avg: 4.8,
        rating_count: 52,
        languages: ['Arabic', 'English'],
        service_areas: ['downtown', 'Online'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '10:00', end: '20:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[12].id,
        category_id: categories[2].id, // Electrical
        business_name: 'Matthew\'s HVAC Services',
        bio: 'HVAC technician specializing in heating, ventilation, and air conditioning installation and repair.',
        hourly_rate: 75,
        experience_years: 13,
        status: 'approved',
        rating_avg: 4.7,
        rating_count: 61,
        languages: ['English'],
        service_areas: ['sweifieh', 'abdoun', 'jabal-amman'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '08:00', end: '18:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[13].id,
        category_id: categories[3].id, // Painting
        business_name: 'Yasmin\'s Art Studio',
        bio: 'Professional artist offering painting and drawing lessons. Art therapy and creative workshops.',
        hourly_rate: 35,
        experience_years: 9,
        status: 'approved',
        rating_avg: 4.9,
        rating_count: 38,
        languages: ['Arabic', 'English'],
        service_areas: ['jabal-amman', 'abdoun', 'sweifieh'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '10:00', end: '19:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[14].id,
        category_id: categories[3].id, // Painting
        business_name: 'Andrew\'s Moving Services',
        bio: 'Professional moving and relocation services. Careful handling of your belongings.',
        hourly_rate: 45,
        experience_years: 7,
        status: 'approved',
        rating_avg: 4.6,
        rating_count: 29,
        languages: ['English'],
        service_areas: ['city-center', 'new-zarqa'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '08:00', end: '18:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[15].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Mona\'s Pet Care',
        bio: 'Professional pet grooming and care services. Experienced with dogs, cats, and other pets.',
        hourly_rate: 30,
        experience_years: 4,
        status: 'approved',
        rating_avg: 4.8,
        rating_count: 41,
        languages: ['Arabic', 'English'],
        service_areas: ['abdoun', 'sweifieh', 'jabal-amman'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '09:00', end: '17:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[16].id,
        category_id: categories[2].id, // Electrical
        business_name: 'Joshua\'s Security Systems',
        bio: 'Security system installation and maintenance. CCTV, alarms, and access control systems.',
        hourly_rate: 85,
        experience_years: 12,
        status: 'approved',
        rating_avg: 4.7,
        rating_count: 33,
        languages: ['English'],
        service_areas: ['city-center', 'new-zarqa'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '08:00', end: '17:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[17].id,
        category_id: categories[0].id, // Cleaning
        business_name: 'Dina\'s Event Planning',
        bio: 'Professional event planner specializing in weddings, parties, and corporate events.',
        hourly_rate: 60,
        experience_years: 8,
        status: 'approved',
        rating_avg: 4.9,
        rating_count: 47,
        languages: ['Arabic', 'English'],
        service_areas: ['downtown', 'abdoun', 'sweifieh'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        working_hours: { start: '09:00', end: '21:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[18].id,
        category_id: categories[1].id, // Plumbing
        business_name: 'Ryan\'s Pool Services',
        bio: 'Pool cleaning, maintenance, and repair services. Certified pool technician with 6 years experience.',
        hourly_rate: 55,
        experience_years: 6,
        status: 'approved',
        rating_avg: 4.6,
        rating_count: 25,
        languages: ['English'],
        service_areas: ['sweifieh', 'abdoun', 'jabal-amman'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '08:00', end: '17:00' },
        instant_booking: true,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
      {
        user_id: additionalProviderUsers[19].id,
        category_id: categories[3].id, // Painting
        business_name: 'Lina\'s Interior Design',
        bio: 'Interior designer creating beautiful and functional living spaces. 9 years of design experience.',
        hourly_rate: 70,
        experience_years: 9,
        status: 'approved',
        rating_avg: 4.8,
        rating_count: 39,
        languages: ['Arabic', 'English'],
        service_areas: ['jabal-amman', 'abdoun', 'sweifieh'],
        available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        working_hours: { start: '09:00', end: '18:00' },
        instant_booking: false,
        approved_at: new Date(),
        approved_by: adminUser.id,
      },
    ], { ignoreDuplicates: true });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeBulkRecordError') {
        console.log('⚠️  Some providers already exist, fetching existing...'.yellow);
        providers = await Provider.findAll({ where: { user_id: allProviderUsers.map(u => u.id) } });
        // Update existing providers with category_id if missing
        for (let i = 0; i < providers.length && i < allProviderUsers.length; i++) {
          const provider = providers[i];
          // Map provider index to category based on service category
          const categoryMap = [
            categories[0].id, // 0: Cleaning
            categories[1].id, // 1: Plumbing
            categories[0].id, // 2: Cleaning
            categories[3].id, // 3: Painting
            categories[2].id, // 4: Electrical
            categories[0].id, // 5: Cleaning
            categories[0].id, // 6: Cleaning
            categories[3].id, // 7: Painting
            categories[1].id, // 8: Plumbing
            categories[0].id, // 9: Cleaning
            categories[2].id, // 10: Electrical
            categories[0].id, // 11: Cleaning
            categories[1].id, // 12: Plumbing
            categories[0].id, // 13: Cleaning
            categories[0].id, // 14: Cleaning
            categories[0].id, // 15: Cleaning
            categories[2].id, // 16: Electrical
            categories[3].id, // 17: Painting
            categories[3].id, // 18: Painting
            categories[0].id, // 19: Cleaning
            categories[2].id, // 20: Electrical
            categories[0].id, // 21: Cleaning
            categories[1].id, // 22: Plumbing
            categories[3].id, // 23: Painting
          ];
          if (!provider.category_id && categoryMap[i]) {
            await provider.update({ category_id: categoryMap[i] });
          }
        }
      } else {
        throw error;
      }
    }
    console.log(`✅ ${providers.length} provider profiles ready`.green);

    // Create Services for all 24 providers (one service each)
    let services;
    try {
      services = await Service.bulkCreate([
      // Provider 0 - Sparkle Clean Services (Cleaning)
      {
        provider_id: providers[0].id,
        category_id: categories[0].id, // Cleaning
        name: 'Deep House Cleaning',
        slug: 'deep-house-cleaning',
        description: 'Comprehensive cleaning of your entire home including all rooms, kitchen, and bathrooms.',
        base_price: 120,
        price_type: 'fixed',
        duration_hours: 4,
        packages: [
          {
            name: 'Standard',
            price: 120,
            description: 'Basic deep cleaning for homes up to 2000 sq ft',
            features: ['All rooms', 'Kitchen', 'Bathrooms', 'Vacuuming', 'Mopping'],
          },
          {
            name: 'Premium',
            price: 180,
            description: 'Premium deep cleaning with extras',
            features: ['Everything in Standard', 'Window cleaning', 'Appliance cleaning', 'Baseboards'],
          },
        ],
        add_ons: [
          { name: 'Refrigerator Deep Clean', price: 25, description: 'Inside and outside cleaning' },
          { name: 'Oven Deep Clean', price: 30, description: 'Complete oven degreasing' },
        ],
        is_active: true,
        is_featured: true,
      },
      // Provider 1 - Pro Plumbing Solutions (Plumbing)
      {
        provider_id: providers[1].id,
        category_id: categories[1].id, // Plumbing
        name: 'Emergency Plumbing Repair',
        slug: 'emergency-plumbing-repair',
        description: '24/7 emergency plumbing services for urgent repairs.',
        base_price: 100,
        price_type: 'hourly',
        duration_hours: 2,
        packages: [
          {
            name: 'Standard Service',
            price: 100,
            description: 'Regular hours service call',
            features: ['Diagnosis', 'Basic repairs', 'Parts extra'],
          },
          {
            name: 'Emergency Service',
            price: 150,
            description: 'After hours and weekend service',
            features: ['Priority response', 'Diagnosis', 'Basic repairs', 'Parts extra'],
          },
        ],
        is_active: true,
        is_featured: true,
      },
      // Provider 2 - Elite Tutoring Academy (Cleaning Service)
      {
        provider_id: providers[2].id,
        category_id: categories[0].id, // Cleaning
        name: 'Office Cleaning Service',
        slug: 'office-cleaning-service',
        description: 'Professional office cleaning services for businesses. Regular and deep cleaning available.',
        base_price: 80,
        price_type: 'fixed',
        duration_hours: 2,
        packages: [
          {
            name: 'Standard Office Clean',
            price: 80,
            description: 'Basic office cleaning service',
            features: ['Vacuuming', 'Mopping', 'Trash removal', 'Surface cleaning'],
          },
          {
            name: 'Deep Office Clean',
            price: 150,
            description: 'Thorough office deep cleaning',
            features: ['Everything in Standard', 'Window cleaning', 'Bathroom deep clean', 'Carpet cleaning'],
          },
        ],
        is_active: true,
        is_featured: true,
      },
      // Provider 3 - Artistic Touch Painting (Painting)
      {
        provider_id: providers[3].id,
        category_id: categories[3].id, // Painting
        name: 'Interior Room Painting',
        slug: 'interior-room-painting',
        description: 'Professional interior painting service for single rooms or entire homes.',
        base_price: 200,
        price_type: 'fixed',
        duration_hours: 6,
        packages: [
          {
            name: 'Single Room',
            price: 200,
            description: 'Paint one room up to 150 sq ft',
            features: ['Wall preparation', 'Two coats of paint', 'Clean up'],
          },
          {
            name: 'Whole House',
            price: 1500,
            description: 'Paint entire house interior',
            features: ['All rooms', 'Ceiling painting', 'Trim work', 'Color consultation'],
          },
        ],
        add_ons: [
          { name: 'Ceiling Painting', price: 50, description: 'Add ceiling painting to room' },
          { name: 'Accent Wall', price: 75, description: 'Create a feature wall with different color' },
        ],
        is_active: true,
      },
      // Provider 4 - Omar's Electrical Works (Electrical)
      {
        provider_id: providers[4].id,
        category_id: categories[2].id, // Electrical
        name: 'Electrical Panel Upgrade',
        slug: 'electrical-panel-upgrade',
        description: 'Professional electrical panel upgrade and installation services.',
        base_price: 800,
        price_type: 'fixed',
        duration_hours: 6,
        packages: [
          {
            name: 'Standard Upgrade',
            price: 800,
            description: 'Basic electrical panel upgrade',
            features: ['New panel installation', 'Wiring updates', 'Safety inspection'],
          },
          {
            name: 'Smart Panel',
            price: 1200,
            description: 'Smart electrical panel with monitoring',
            features: ['Smart panel', 'Mobile monitoring', 'Energy tracking', 'Warranty'],
          },
        ],
        is_active: true,
      },
      // Provider 5 - Fatima's Cleaning Services (Cleaning)
      {
        provider_id: providers[5].id,
        category_id: categories[0].id, // Cleaning
        name: 'Regular House Cleaning',
        slug: 'regular-house-cleaning',
        description: 'Regular weekly or bi-weekly house cleaning service. Keep your home spotless.',
        base_price: 60,
        price_type: 'fixed',
        duration_hours: 3,
        packages: [
          {
            name: 'Basic Clean',
            price: 60,
            description: 'Standard house cleaning',
            features: ['All rooms', 'Kitchen', 'Bathrooms', 'Vacuuming', 'Dusting'],
          },
          {
            name: 'Premium Clean',
            price: 90,
            description: 'Enhanced house cleaning',
            features: ['Everything in Basic', 'Inside appliances', 'Baseboards', 'Window sills'],
          },
        ],
        is_active: true,
      },
      // Provider 6 - James Cleaning Services (Cleaning)
      {
        provider_id: providers[6].id,
        category_id: categories[0].id, // Cleaning
        name: 'Kitchen Deep Cleaning',
        slug: 'kitchen-deep-cleaning',
        description: 'Thorough deep cleaning of your kitchen including appliances, cabinets, and countertops.',
        base_price: 55,
        price_type: 'fixed',
        duration_hours: 2,
        packages: [
          {
            name: 'Standard Kitchen Clean',
            price: 55,
            description: 'Basic kitchen deep cleaning',
            features: ['Appliance cleaning', 'Countertops', 'Cabinets exterior', 'Sink cleaning'],
          },
          {
            name: 'Complete Kitchen Clean',
            price: 85,
            description: 'Full kitchen deep cleaning',
            features: ['Everything in Standard', 'Inside cabinets', 'Oven cleaning', 'Refrigerator cleaning'],
          },
        ],
        is_active: true,
      },
      // Provider 7 - Aisha's Carpentry Workshop (Carpentry -> Painting)
      {
        provider_id: providers[7].id,
        category_id: categories[3].id, // Painting (mapped from Carpentry)
        name: 'Custom Furniture',
        slug: 'custom-furniture',
        description: 'Handcrafted custom furniture made to your specifications.',
        base_price: 400,
        price_type: 'fixed',
        duration_hours: 20,
        packages: [
          {
            name: 'Simple Piece',
            price: 400,
            description: 'Basic custom furniture piece',
            features: ['Design consultation', 'Material selection', 'Handcrafted construction'],
          },
          {
            name: 'Complex Piece',
            price: 800,
            description: 'Intricate custom furniture',
            features: ['Everything in Simple', 'Detailed design', 'Premium materials', 'Finishing'],
          },
        ],
        is_active: true,
      },
      // Provider 8 - Thomas Home Repairs (Handyman -> Plumbing)
      {
        provider_id: providers[8].id,
        category_id: categories[1].id, // Plumbing
        name: 'General Home Repairs',
        slug: 'general-home-repairs',
        description: 'Comprehensive home repair services for various maintenance needs.',
        base_price: 60,
        price_type: 'hourly',
        duration_hours: 2,
        packages: [
          {
            name: 'Basic Repair',
            price: 60,
            description: 'Standard home repair service',
            features: ['Assessment', 'Repair', 'Testing', 'Clean up'],
          },
          {
            name: 'Multiple Repairs',
            price: 200,
            description: 'Multiple repair items in one visit',
            features: ['Priority service', 'All repairs', 'Warranty', 'Follow-up'],
          },
        ],
        is_active: true,
      },
      // Provider 9 - Layla's Cleaning Services (Cleaning)
      {
        provider_id: providers[9].id,
        category_id: categories[0].id, // Cleaning
        name: 'Bathroom Deep Cleaning',
        slug: 'bathroom-deep-cleaning',
        description: 'Professional bathroom deep cleaning service including tiles, fixtures, and grout.',
        base_price: 45,
        price_type: 'fixed',
        duration_hours: 1.5,
        packages: [
          {
            name: 'Standard Bathroom Clean',
            price: 45,
            description: 'Basic bathroom deep cleaning',
            features: ['Toilet cleaning', 'Shower cleaning', 'Mirror cleaning', 'Floor cleaning'],
          },
          {
            name: 'Premium Bathroom Clean',
            price: 70,
            description: 'Complete bathroom deep cleaning',
            features: ['Everything in Standard', 'Grout cleaning', 'Tile scrubbing', 'Fixture polishing'],
          },
        ],
        is_active: true,
      },
      // Provider 10 - Daniel's Tech Support (IT Services)
      {
        provider_id: providers[10].id,
        category_id: categories[2].id, // Electrical (as tech)
        name: 'Computer Repair',
        slug: 'computer-repair',
        description: 'Professional computer repair and maintenance services.',
        base_price: 80,
        price_type: 'fixed',
        duration_hours: 2,
        packages: [
          {
            name: 'Diagnostic & Repair',
            price: 80,
            description: 'Computer diagnostic and basic repair',
            features: ['Diagnosis', 'Repair', 'Testing', 'Warranty'],
          },
          {
            name: 'Complete Service',
            price: 150,
            description: 'Comprehensive computer service',
            features: ['Everything in Diagnostic', 'Software updates', 'Virus removal', 'Optimization'],
          },
        ],
        is_active: true,
      },
      // Continue with remaining providers...
      // Provider 11 - Nour's Cleaning Services (Cleaning)
      {
        provider_id: providers[11].id,
        category_id: categories[0].id, // Cleaning
        name: 'Post-Construction Cleaning',
        slug: 'post-construction-cleaning',
        description: 'Professional cleaning service after construction or renovation work.',
        base_price: 95,
        price_type: 'fixed',
        duration_hours: 5,
        packages: [
          {
            name: 'Standard Post-Construction',
            price: 95,
            description: 'Basic post-construction cleaning',
            features: ['Debris removal', 'Dust cleaning', 'Surface cleaning', 'Floor cleaning'],
          },
          {
            name: 'Complete Post-Construction',
            price: 150,
            description: 'Thorough post-construction cleaning',
            features: ['Everything in Standard', 'Window cleaning', 'Detailed cleaning', 'Final inspection'],
          },
        ],
        is_active: true,
      },
      // Provider 12 - Chris Auto Repair (Automotive)
      {
        provider_id: providers[12].id,
        category_id: categories[1].id, // Plumbing (as auto)
        name: 'Engine Repair',
        slug: 'engine-repair',
        description: 'Professional engine repair and maintenance services.',
        base_price: 200,
        price_type: 'fixed',
        duration_hours: 4,
        packages: [
          {
            name: 'Basic Engine Service',
            price: 200,
            description: 'Standard engine maintenance',
            features: ['Oil change', 'Filter replacement', 'Fluid check', 'Inspection'],
          },
          {
            name: 'Engine Overhaul',
            price: 800,
            description: 'Complete engine repair service',
            features: ['Everything in Basic', 'Engine rebuild', 'Parts replacement', 'Warranty'],
          },
        ],
        is_active: true,
      },
      // Provider 13 - Rania's Cleaning Services (Cleaning)
      {
        provider_id: providers[13].id,
        category_id: categories[0].id, // Cleaning
        name: 'Window Cleaning Service',
        slug: 'window-cleaning-service',
        description: 'Professional interior and exterior window cleaning service for homes and offices.',
        base_price: 40,
        price_type: 'fixed',
        duration_hours: 2,
        packages: [
          {
            name: 'Standard Window Clean',
            price: 40,
            description: 'Basic window cleaning service',
            features: ['Interior windows', 'Exterior windows', 'Window sills', 'Frame cleaning'],
          },
          {
            name: 'Premium Window Clean',
            price: 65,
            description: 'Complete window cleaning service',
            features: ['Everything in Standard', 'Window tracks', 'Screen cleaning', 'Glass polishing'],
          },
        ],
        is_active: true,
      },
      // Provider 14 - William's Cleaning Services (Cleaning)
      {
        provider_id: providers[14].id,
        category_id: categories[0].id, // Cleaning
        name: 'Move-In/Move-Out Cleaning',
        slug: 'move-in-move-out-cleaning',
        description: 'Comprehensive cleaning service for move-in or move-out situations.',
        base_price: 90,
        price_type: 'fixed',
        duration_hours: 4,
        packages: [
          {
            name: 'Standard Move Clean',
            price: 90,
            description: 'Basic move-in/move-out cleaning',
            features: ['All rooms', 'Kitchen deep clean', 'Bathroom deep clean', 'Vacuuming', 'Mopping'],
          },
          {
            name: 'Premium Move Clean',
            price: 140,
            description: 'Complete move-in/move-out cleaning',
            features: ['Everything in Standard', 'Inside cabinets', 'Inside appliances', 'Window cleaning', 'Baseboards'],
          },
        ],
        is_active: true,
      },
      // Provider 15 - Hala's Cleaning Services (Cleaning)
      {
        provider_id: providers[15].id,
        category_id: categories[0].id, // Cleaning
        name: 'Carpet Cleaning Service',
        slug: 'carpet-cleaning-service',
        description: 'Professional carpet and rug cleaning service using steam cleaning technology.',
        base_price: 75,
        price_type: 'fixed',
        duration_hours: 2.5,
        packages: [
          {
            name: 'Standard Carpet Clean',
            price: 75,
            description: 'Basic carpet cleaning service',
            features: ['Steam cleaning', 'Vacuuming', 'Stain treatment', 'Deodorizing'],
          },
          {
            name: 'Premium Carpet Clean',
            price: 110,
            description: 'Complete carpet cleaning service',
            features: ['Everything in Standard', 'Deep extraction', 'Protection treatment', 'Furniture moving'],
          },
        ],
        is_active: true,
      },
      // Provider 16 - Matthew's HVAC Services (HVAC)
      {
        provider_id: providers[16].id,
        category_id: categories[2].id, // Electrical (as HVAC)
        name: 'AC Installation',
        slug: 'ac-installation',
        description: 'Professional air conditioning installation and setup services.',
        base_price: 800,
        price_type: 'fixed',
        duration_hours: 6,
        packages: [
          {
            name: 'Standard AC Unit',
            price: 800,
            description: 'Standard AC unit installation',
            features: ['Unit installation', 'Ductwork', 'Electrical connection', 'Testing'],
          },
          {
            name: 'High-Efficiency AC',
            price: 1200,
            description: 'High-efficiency AC installation',
            features: ['Everything in Standard', 'Energy efficient unit', 'Smart thermostat', 'Warranty'],
          },
        ],
        is_active: true,
      },
      // Provider 17 - Yasmin's Art Studio (Art)
      {
        provider_id: providers[17].id,
        category_id: categories[3].id, // Painting (as art)
        name: 'Painting Lessons',
        slug: 'painting-lessons',
        description: 'Professional painting instruction for all skill levels.',
        base_price: 35,
        price_type: 'fixed',
        duration_hours: 2,
        packages: [
          {
            name: 'Individual Lesson',
            price: 35,
            description: 'One-on-one painting lesson',
            features: ['Personal instruction', 'Technique guidance', 'Materials included', 'Take home artwork'],
          },
          {
            name: 'Group Workshop',
            price: 25,
            description: 'Group painting workshop',
            features: ['Group instruction', 'Social learning', 'Materials included', 'Fun atmosphere'],
          },
        ],
        is_active: true,
      },
      // Provider 18 - Andrew's Moving Services (Moving -> Painting)
      {
        provider_id: providers[18].id,
        category_id: categories[3].id, // Painting (mapped from Carpentry/Moving)
        name: 'Local Moving',
        slug: 'local-moving',
        description: 'Professional local moving services within the city.',
        base_price: 200,
        price_type: 'fixed',
        duration_hours: 6,
        packages: [
          {
            name: 'Small Move',
            price: 200,
            description: 'Moving service for small apartments',
            features: ['Loading', 'Transportation', 'Unloading', 'Basic protection'],
          },
          {
            name: 'Large Move',
            price: 400,
            description: 'Moving service for large homes',
            features: ['Everything in Small', 'Extra crew', 'Furniture protection', 'Setup assistance'],
          },
        ],
        is_active: true,
      },
      // Provider 19 - Mona's Cleaning Services (Cleaning)
      {
        provider_id: providers[19].id,
        category_id: categories[0].id, // Cleaning
        name: 'Apartment Cleaning Service',
        slug: 'apartment-cleaning-service',
        description: 'Regular and deep cleaning services for apartments and small homes.',
        base_price: 50,
        price_type: 'fixed',
        duration_hours: 2.5,
        packages: [
          {
            name: 'Standard Apartment Clean',
            price: 50,
            description: 'Basic apartment cleaning',
            features: ['All rooms', 'Kitchen', 'Bathroom', 'Vacuuming', 'Dusting'],
          },
          {
            name: 'Deep Apartment Clean',
            price: 80,
            description: 'Thorough apartment cleaning',
            features: ['Everything in Standard', 'Inside appliances', 'Baseboards', 'Window sills'],
          },
        ],
        is_active: true,
      },
      // Provider 20 - Joshua's Security Systems (Security)
      {
        provider_id: providers[20].id,
        category_id: categories[2].id, // Electrical (as security)
        name: 'Security System Installation',
        slug: 'security-system-installation',
        description: 'Professional security system installation and setup services.',
        base_price: 500,
        price_type: 'fixed',
        duration_hours: 6,
        packages: [
          {
            name: 'Basic Security',
            price: 500,
            description: 'Basic security system installation',
            features: ['Door sensors', 'Motion detectors', 'Control panel', 'Monitoring'],
          },
          {
            name: 'Advanced Security',
            price: 1000,
            description: 'Advanced security system',
            features: ['Everything in Basic', 'CCTV cameras', 'Smart features', 'Mobile app'],
          },
        ],
        is_active: true,
      },
      // Provider 21 - Dina's Cleaning Services (Cleaning)
      {
        provider_id: providers[21].id,
        category_id: categories[0].id, // Cleaning
        name: 'Upholstery Cleaning Service',
        slug: 'upholstery-cleaning-service',
        description: 'Professional furniture and upholstery cleaning service for sofas, chairs, and more.',
        base_price: 65,
        price_type: 'fixed',
        duration_hours: 2,
        packages: [
          {
            name: 'Standard Upholstery Clean',
            price: 65,
            description: 'Basic upholstery cleaning',
            features: ['Steam cleaning', 'Stain removal', 'Deodorizing', 'Protection treatment'],
          },
          {
            name: 'Premium Upholstery Clean',
            price: 95,
            description: 'Complete upholstery cleaning',
            features: ['Everything in Standard', 'Deep cleaning', 'Fabric protection', 'Multiple pieces'],
          },
        ],
        is_active: true,
      },
      // Provider 22 - Ryan's Pool Services (Pool Services)
      {
        provider_id: providers[22].id,
        category_id: categories[1].id, // Plumbing (as pool)
        name: 'Pool Cleaning',
        slug: 'pool-cleaning',
        description: 'Professional pool cleaning and maintenance services.',
        base_price: 80,
        price_type: 'fixed',
        duration_hours: 2,
        packages: [
          {
            name: 'Weekly Cleaning',
            price: 80,
            description: 'Weekly pool cleaning service',
            features: ['Skimming', 'Vacuuming', 'Chemical balance', 'Equipment check'],
          },
          {
            name: 'Monthly Deep Clean',
            price: 200,
            description: 'Monthly deep pool cleaning',
            features: ['Everything in Weekly', 'Tile cleaning', 'Filter cleaning', 'Water testing'],
          },
        ],
        is_active: true,
      },
      // Provider 23 - Lina's Interior Design (Interior Design)
      {
        provider_id: providers[23].id,
        category_id: categories[3].id, // Painting (as interior design)
        name: 'Interior Design Consultation',
        slug: 'interior-design-consultation',
        description: 'Professional interior design consultation and space planning services.',
        base_price: 150,
        price_type: 'fixed',
        duration_hours: 2,
        packages: [
          {
            name: 'Basic Consultation',
            price: 150,
            description: 'Basic interior design consultation',
            features: ['Space assessment', 'Design recommendations', 'Color scheme', 'Furniture layout'],
          },
          {
            name: 'Complete Design Package',
            price: 500,
            description: 'Complete interior design package',
            features: ['Everything in Basic', '3D renderings', 'Shopping list', 'Project management'],
          },
        ],
        is_active: true,
      },
    ], { ignoreDuplicates: true });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeBulkRecordError') {
        console.log('⚠️  Some services already exist, fetching existing...'.yellow);
        services = await Service.findAll({ where: { provider_id: providers.map(p => p.id) } });
      } else {
        throw error;
      }
    }
    console.log(`✅ ${services.length} services ready`.green);

    // Generate booking numbers
    const generateBookingNumber = () => {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      return `BK${timestamp}${random}`;
    };

    // Create Sample Bookings for all customers and services
    let bookings;
    try {
      bookings = await Booking.bulkCreate([
      // Original bookings
      {
        booking_number: generateBookingNumber(),
        user_id: customers[0].id,
        provider_id: providers[0].id,
        service_id: services[0].id,
        booking_date: new Date('2024-01-15'),
        booking_time: '09:00:00',
        duration_hours: 4,
        status: 'completed',
        package_selected: 'Standard',
        add_ons_selected: ['Refrigerator Deep Clean'],
        service_address: '123 Main Street, Abdoun, Amman',
        service_city: 'Amman',
        service_area: 'Abdoun',
        base_price: 120,
        add_ons_price: 25,
        total_price: 145,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-01-15'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[1].id,
        provider_id: providers[2].id,
        service_id: services[2].id,
        booking_date: new Date('2024-01-20'),
        booking_time: '15:00:00',
        duration_hours: 1.5,
        status: 'confirmed',
        package_selected: 'Single Session',
        service_address: 'Online',
        service_city: 'Zarqa',
        service_area: 'Online',
        base_price: 50,
        total_price: 50,
        payment_status: 'pending',
        payment_method: 'cash',
        confirmed_at: new Date('2024-01-19'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[0].id,
        provider_id: providers[1].id,
        service_id: services[1].id,
        booking_date: new Date('2024-01-10'),
        booking_time: '14:00:00',
        duration_hours: 2,
        status: 'completed',
        package_selected: 'Standard Service',
        service_address: '456 Oak Avenue, Sweifieh, Amman',
        service_city: 'Amman',
        service_area: 'Sweifieh',
        base_price: 200,
        total_price: 200,
        payment_status: 'paid',
        payment_method: 'cash',
        completed_at: new Date('2024-01-10'),
      },
      // New bookings for additional customers
      {
        booking_number: generateBookingNumber(),
        user_id: customers[3].id, // Emily Davis
        provider_id: providers[4].id, // Omar's Electrical Works
        service_id: services[4].id, // Electrical Panel Upgrade
        booking_date: new Date('2024-01-25'),
        booking_time: '10:00:00',
        duration_hours: 6,
        status: 'completed',
        package_selected: 'Standard Upgrade',
        service_address: '789 Garden Street, Abdoun, Amman',
        service_city: 'Amman',
        service_area: 'Abdoun',
        base_price: 800,
        total_price: 800,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-01-25'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[4].id, // David Brown
        provider_id: providers[5].id, // Fatima's Garden Design
        service_id: services[5].id, // Garden Design & Installation
        booking_date: new Date('2024-01-28'),
        booking_time: '08:00:00',
        duration_hours: 12,
        status: 'confirmed',
        package_selected: 'Small Garden',
        service_address: '321 Park Avenue, Sweifieh, Amman',
        service_city: 'Amman',
        service_area: 'Sweifieh',
        base_price: 500,
        total_price: 500,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-01-27'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[5].id, // Lisa Wilson
        provider_id: providers[6].id, // James Music Studio
        service_id: services[6].id, // Piano Lessons
        booking_date: new Date('2024-01-30'),
        booking_time: '16:00:00',
        duration_hours: 1,
        status: 'completed',
        package_selected: 'Individual Lesson',
        service_address: 'Online',
        service_city: 'Irbid',
        service_area: 'Online',
        base_price: 45,
        total_price: 45,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-01-30'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[6].id, // Robert Taylor
        provider_id: providers[7].id, // Aisha's Carpentry Workshop
        service_id: services[7].id, // Custom Furniture
        booking_date: new Date('2024-02-02'),
        booking_time: '09:00:00',
        duration_hours: 20,
        status: 'in_progress',
        package_selected: 'Simple Piece',
        service_address: '654 Wood Street, City Center, Zarqa',
        service_city: 'Zarqa',
        service_area: 'City Center',
        base_price: 400,
        total_price: 400,
        payment_status: 'paid',
        payment_method: 'cash',
        confirmed_at: new Date('2024-02-01'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[7].id, // Sara Anderson
        provider_id: providers[8].id, // Thomas Home Repairs
        service_id: services[8].id, // General Home Repairs
        booking_date: new Date('2024-02-05'),
        booking_time: '11:00:00',
        duration_hours: 2,
        status: 'completed',
        package_selected: 'Basic Repair',
        service_address: '987 Beach Road, Downtown, Aqaba',
        service_city: 'Aqaba',
        service_area: 'Downtown',
        base_price: 60,
        total_price: 60,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-02-05'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[0].id, // John Doe
        provider_id: providers[9].id, // Layla's Language Academy
        service_id: services[9].id, // English Language Learning
        booking_date: new Date('2024-02-08'),
        booking_time: '14:00:00',
        duration_hours: 1,
        status: 'confirmed',
        package_selected: 'Individual Lesson',
        service_address: 'Online',
        service_city: 'Amman',
        service_area: 'Online',
        base_price: 30,
        total_price: 30,
        payment_status: 'pending',
        payment_method: 'card',
        confirmed_at: new Date('2024-02-07'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[1].id, // Jane Smith
        provider_id: providers[10].id, // Daniel's Tech Support
        service_id: services[10].id, // Computer Repair
        booking_date: new Date('2024-02-10'),
        booking_time: '13:00:00',
        duration_hours: 2,
        status: 'completed',
        package_selected: 'Diagnostic & Repair',
        service_address: '456 Tech Street, Jabal Amman, Amman',
        service_city: 'Amman',
        service_area: 'Jabal Amman',
        base_price: 80,
        total_price: 80,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-02-10'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[3].id, // Emily Davis
        provider_id: providers[11].id, // Nour's Beauty Studio
        service_id: services[11].id, // Bridal Makeup
        booking_date: new Date('2024-02-15'),
        booking_time: '10:00:00',
        duration_hours: 3,
        status: 'confirmed',
        package_selected: 'Bridal Package',
        service_address: '789 Beauty Lane, Abdoun, Amman',
        service_city: 'Amman',
        service_area: 'Abdoun',
        base_price: 150,
        total_price: 150,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-02-14'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[4].id, // David Brown
        provider_id: providers[12].id, // Chris Auto Repair
        service_id: services[12].id, // Engine Repair
        booking_date: new Date('2024-02-18'),
        booking_time: '08:00:00',
        duration_hours: 4,
        status: 'completed',
        package_selected: 'Basic Engine Service',
        service_address: '321 Auto Street, City Center, Zarqa',
        service_city: 'Zarqa',
        service_area: 'City Center',
        base_price: 200,
        total_price: 200,
        payment_status: 'paid',
        payment_method: 'cash',
        completed_at: new Date('2024-02-18'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[5].id, // Lisa Wilson
        provider_id: providers[13].id, // Rania's Fitness Coaching
        service_id: services[13].id, // Personal Training
        booking_date: new Date('2024-02-20'),
        booking_time: '18:00:00',
        duration_hours: 1,
        status: 'completed',
        package_selected: 'Single Session',
        service_address: '654 Fitness Center, City Center, Irbid',
        service_city: 'Irbid',
        service_area: 'City Center',
        base_price: 50,
        total_price: 50,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-02-20'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[6].id, // Robert Taylor
        provider_id: providers[14].id, // William's Photography
        service_id: services[14].id, // Portrait Photography
        booking_date: new Date('2024-02-22'),
        booking_time: '15:00:00',
        duration_hours: 2,
        status: 'confirmed',
        package_selected: 'Basic Portrait',
        service_address: '987 Photo Studio, City Center, Zarqa',
        service_city: 'Zarqa',
        service_area: 'City Center',
        base_price: 200,
        total_price: 200,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-02-21'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[7].id, // Sara Anderson
        provider_id: providers[15].id, // Hala's Cooking Classes
        service_id: services[15].id, // Basic Cooking Classes
        booking_date: new Date('2024-02-25'),
        booking_time: '19:00:00',
        duration_hours: 2,
        status: 'completed',
        package_selected: 'Single Class',
        service_address: 'Online',
        service_city: 'Aqaba',
        service_area: 'Online',
        base_price: 40,
        total_price: 40,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-02-25'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[0].id, // John Doe
        provider_id: providers[16].id, // Matthew's HVAC Services
        service_id: services[16].id, // AC Installation
        booking_date: new Date('2024-02-28'),
        booking_time: '09:00:00',
        duration_hours: 6,
        status: 'in_progress',
        package_selected: 'Standard AC Unit',
        service_address: '123 Cool Street, Sweifieh, Amman',
        service_city: 'Amman',
        service_area: 'Sweifieh',
        base_price: 800,
        total_price: 800,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-02-27'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[1].id, // Jane Smith
        provider_id: providers[17].id, // Yasmin's Art Studio
        service_id: services[17].id, // Painting Lessons
        booking_date: new Date('2024-03-02'),
        booking_time: '16:00:00',
        duration_hours: 2,
        status: 'completed',
        package_selected: 'Individual Lesson',
        service_address: '456 Art Street, Jabal Amman, Amman',
        service_city: 'Amman',
        service_area: 'Jabal Amman',
        base_price: 35,
        total_price: 35,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-03-02'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[3].id, // Emily Davis
        provider_id: providers[18].id, // Andrew's Moving Services
        service_id: services[18].id, // Local Moving
        booking_date: new Date('2024-03-05'),
        booking_time: '08:00:00',
        duration_hours: 6,
        status: 'confirmed',
        package_selected: 'Small Move',
        service_address: '789 New Home, Abdoun, Amman',
        service_city: 'Amman',
        service_area: 'Abdoun',
        base_price: 200,
        total_price: 200,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-03-04'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[4].id, // David Brown
        provider_id: providers[19].id, // Mona's Pet Care
        service_id: services[19].id, // Pet Grooming
        booking_date: new Date('2024-03-08'),
        booking_time: '14:00:00',
        duration_hours: 2,
        status: 'completed',
        package_selected: 'Basic Grooming',
        service_address: '321 Pet Street, Sweifieh, Amman',
        service_city: 'Amman',
        service_area: 'Sweifieh',
        base_price: 50,
        total_price: 50,
        payment_status: 'paid',
        payment_method: 'cash',
        completed_at: new Date('2024-03-08'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[5].id, // Lisa Wilson
        provider_id: providers[20].id, // Joshua's Security Systems
        service_id: services[20].id, // Security System Installation
        booking_date: new Date('2024-03-10'),
        booking_time: '10:00:00',
        duration_hours: 6,
        status: 'confirmed',
        package_selected: 'Basic Security',
        service_address: '654 Security Street, City Center, Irbid',
        service_city: 'Irbid',
        service_area: 'City Center',
        base_price: 500,
        total_price: 500,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-03-09'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[6].id, // Robert Taylor
        provider_id: providers[21].id, // Dina's Event Planning
        service_id: services[21].id, // Wedding Planning
        booking_date: new Date('2024-03-15'),
        booking_time: '11:00:00',
        duration_hours: 40,
        status: 'in_progress',
        package_selected: 'Partial Planning',
        service_address: '987 Wedding Venue, City Center, Zarqa',
        service_city: 'Zarqa',
        service_area: 'City Center',
        base_price: 2000,
        total_price: 2000,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-03-14'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[7].id, // Sara Anderson
        provider_id: providers[22].id, // Ryan's Pool Services
        service_id: services[22].id, // Pool Cleaning
        booking_date: new Date('2024-03-18'),
        booking_time: '09:00:00',
        duration_hours: 2,
        status: 'completed',
        package_selected: 'Weekly Cleaning',
        service_address: '321 Pool Street, Downtown, Aqaba',
        service_city: 'Aqaba',
        service_area: 'Downtown',
        base_price: 80,
        total_price: 80,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-03-18'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[0].id, // John Doe
        provider_id: providers[23].id, // Lina's Interior Design
        service_id: services[23].id, // Interior Design Consultation
        booking_date: new Date('2024-03-20'),
        booking_time: '15:00:00',
        duration_hours: 2,
        status: 'confirmed',
        package_selected: 'Basic Consultation',
        service_address: '123 Design Street, Abdoun, Amman',
        service_city: 'Amman',
        service_area: 'Abdoun',
        base_price: 150,
        total_price: 150,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-03-19'),
      },
      // Additional bookings for variety
      {
        booking_number: generateBookingNumber(),
        user_id: customers[1].id, // Jane Smith
        provider_id: providers[0].id, // Sparkle Clean Services
        service_id: services[0].id, // Deep House Cleaning
        booking_date: new Date('2024-03-22'),
        booking_time: '10:00:00',
        duration_hours: 2.5,
        status: 'completed',
        package_selected: 'Basic',
        service_address: '456 Clean Street, Jabal Amman, Amman',
        service_city: 'Amman',
        service_area: 'Jabal Amman',
        base_price: 80,
        total_price: 80,
        payment_status: 'paid',
        payment_method: 'card',
        completed_at: new Date('2024-03-22'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[3].id, // Emily Davis
        provider_id: providers[2].id, // Elite Tutoring Academy
        service_id: services[2].id, // Math & Science Tutoring
        booking_date: new Date('2024-03-25'),
        booking_time: '17:00:00',
        duration_hours: 2,
        status: 'confirmed',
        package_selected: 'Individual Prep',
        service_address: 'Online',
        service_city: 'Amman',
        service_area: 'Online',
        base_price: 60,
        total_price: 60,
        payment_status: 'pending',
        payment_method: 'card',
        confirmed_at: new Date('2024-03-24'),
      },
      {
        booking_number: generateBookingNumber(),
        user_id: customers[4].id, // David Brown
        provider_id: providers[3].id, // Artistic Touch Painting
        service_id: services[3].id, // Interior Room Painting
        booking_date: new Date('2024-03-28'),
        booking_time: '08:00:00',
        duration_hours: 6,
        status: 'in_progress',
        package_selected: 'Single Room',
        service_address: '321 Paint Street, Sweifieh, Amman',
        service_city: 'Amman',
        service_area: 'Sweifieh',
        base_price: 200,
        total_price: 200,
        payment_status: 'paid',
        payment_method: 'card',
        confirmed_at: new Date('2024-03-27'),
      },
    ], { ignoreDuplicates: true });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeBulkRecordError') {
        console.log('⚠️  Some bookings already exist, skipping...'.yellow);
        bookings = [];
      } else {
        throw error;
      }
    }
    console.log(`✅ ${bookings.length} bookings ready`.green);

    // Create Sample Ratings for completed bookings
    let ratings = [];
    if (bookings.length > 0) {
      try {
        ratings = await Rating.bulkCreate([
      {
        booking_id: bookings[0].id,
        user_id: customers[0].id,
        provider_id: providers[0].id,
        service_id: services[0].id,
        rating: 5,
        review: 'Ahmed and his team did an amazing job! My house has never been cleaner. Very professional and thorough.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[2].id,
        user_id: customers[0].id,
        provider_id: providers[1].id,
        service_id: services[1].id,
        rating: 4,
        review: 'Sarah fixed our plumbing issue quickly. Very professional and knowledgeable.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[3].id,
        user_id: customers[3].id,
        provider_id: providers[4].id,
        service_id: services[4].id,
        rating: 5,
        review: 'Omar did excellent work on our electrical panel upgrade. Very professional and clean work.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[5].id,
        user_id: customers[5].id,
        provider_id: providers[6].id,
        service_id: services[6].id,
        rating: 5,
        review: 'James is an amazing piano teacher! My daughter learned so much in just one lesson.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[7].id,
        user_id: customers[7].id,
        provider_id: providers[8].id,
        service_id: services[8].id,
        rating: 4,
        review: 'Thomas fixed multiple issues around our house efficiently. Great handyman service.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[9].id,
        user_id: customers[1].id,
        provider_id: providers[10].id,
        service_id: services[10].id,
        rating: 5,
        review: 'Daniel fixed my computer quickly and explained everything clearly. Highly recommended!',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[11].id,
        user_id: customers[4].id,
        provider_id: providers[12].id,
        service_id: services[12].id,
        rating: 4,
        review: 'Chris did a great job with my car engine service. Professional and honest pricing.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[12].id,
        user_id: customers[5].id,
        provider_id: providers[13].id,
        service_id: services[13].id,
        rating: 5,
        review: 'Rania is an excellent personal trainer! I saw results after just one session.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[14].id,
        user_id: customers[7].id,
        provider_id: providers[15].id,
        service_id: services[15].id,
        rating: 5,
        review: 'Hala\'s cooking class was fantastic! I learned so many new techniques and recipes.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[16].id,
        user_id: customers[1].id,
        provider_id: providers[17].id,
        service_id: services[17].id,
        rating: 4,
        review: 'Yasmin is a wonderful art teacher. Very patient and encouraging with beginners.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[18].id,
        user_id: customers[4].id,
        provider_id: providers[19].id,
        service_id: services[19].id,
        rating: 5,
        review: 'Mona took great care of my dog. He came back looking and smelling wonderful!',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[20].id,
        user_id: customers[7].id,
        provider_id: providers[22].id,
        service_id: services[22].id,
        rating: 4,
        review: 'Ryan did a thorough job cleaning our pool. Water looks crystal clear now.',
        is_verified_purchase: true,
      },
      {
        booking_id: bookings[22].id,
        user_id: customers[1].id,
        provider_id: providers[0].id,
        service_id: services[0].id,
        rating: 5,
        review: 'Regular cleaning service is excellent. Always on time and very thorough.',
        is_verified_purchase: true,
      },
    ], { ignoreDuplicates: true });
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeBulkRecordError') {
          console.log('⚠️  Some ratings already exist, skipping...'.yellow);
          ratings = [];
        } else {
          throw error;
        }
      }
    }
    console.log(`✅ ${ratings.length} ratings ready`.green);

    console.log('='.repeat(50).green);
    console.log('🎉 Database seeding completed successfully!'.green.bold);
    console.log('='.repeat(50).green);
    console.log('📊 Database Summary:'.cyan);
    console.log(`  👥 Total Users: ${allProviderUsers.length + customers.length + 1} (1 admin, ${customers.length} customers, ${allProviderUsers.length} providers)`.cyan);
    console.log(`  🏢 Total Providers: ${providers.length}`.cyan);
    console.log(`  🛠️  Total Services: ${services.length}`.cyan);
    console.log(`  📅 Total Bookings: ${bookings.length}`.cyan);
    console.log(`  ⭐ Total Ratings: ${ratings.length}`.cyan);
    console.log(`  🏙️  Total Cities: ${await City.count()}`.cyan);
    console.log(`  📍 Total Areas: ${await Area.count()}`.cyan);
    console.log(`  📂 Total Categories: ${categories.length}`.cyan);
    console.log('');
    console.log('🔐 Login Credentials:'.cyan);
    console.log('Admin Login:'.cyan);
    console.log('  Email: admin@baitak.com');
    console.log('  Password: Admin@123456');
    console.log('');
    console.log('Sample Customer Logins:'.cyan);
    console.log('  Email: john.doe@example.com | Password: password123');
    console.log('  Email: jane.smith@example.com | Password: password123');
    console.log('  Email: emily.d@example.com | Password: password123');
    console.log('  Email: david.b@example.com | Password: password123');
    console.log('');
    console.log('Sample Provider Logins:'.cyan);
    console.log('  Email: ahmed.h@example.com | Password: password123');
    console.log('  Email: sarah.w@example.com | Password: password123');
    console.log('  Email: omar.r@example.com | Password: password123');
    console.log('  Email: fatima.h@example.com | Password: password123');
    console.log('  Email: james.m@example.com | Password: password123');
    console.log('');
    console.log('🎯 Service Categories Available:'.cyan);
    categories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.icon} ${cat.name} - ${cat.description}`);
    });
    console.log('='.repeat(50).green);

  } catch (error) {
    console.error('❌ Error seeding database:'.red, error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run seeder if executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
