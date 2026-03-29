const { sequelize } = require('../config/database');
const User = require('../models/User');
const Company = require('../models/Company');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    // Sync all models (creates tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully');

    // Create default admin user
    const adminCompany = await Company.create({
      name: 'Default Company',
      base_currency: 'USD',
    });

    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      company_id: adminCompany.id,
    });

    console.log('✅ Default admin user created:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');

    // Create sample manager
    const managerUser = await User.create({
      email: 'manager@example.com',
      password: 'manager123',
      name: 'Manager User',
      role: 'manager',
      company_id: adminCompany.id,
    });

    console.log('✅ Sample manager user created:');
    console.log('   Email: manager@example.com');
    console.log('   Password: manager123');
    console.log('   Role: manager');

    // Create sample employee
    const employeeUser = await User.create({
      email: 'employee@example.com',
      password: 'employee123',
      name: 'Employee User',
      role: 'employee',
      company_id: adminCompany.id,
    });

    console.log('✅ Sample employee user created:');
    console.log('   Email: employee@example.com');
    console.log('   Password: employee123');
    console.log('   Role: employee');

    console.log('\n🎉 Database initialization complete!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   Manager: manager@example.com / manager123');
    console.log('   Employee: employee@example.com / employee123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();
