const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const config = require('./src/config/env');

// Test database connection before starting server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }

    // Start the server
    const PORT = config.PORT;
    
    const server = app.listen(PORT, () => {
      console.log('\n🚀 Rishta Backend Server Started Successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${config.NODE_ENV}`);
      console.log(`📊 Database: ${config.database.name}`);
      console.log(`🔐 JWT Secret: ${config.jwt.secret.substring(0, 10)}...`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n📋 Available API Endpoints:');
      console.log(`   Authentication: http://localhost:${PORT}/api/auth`);
      console.log(`   User Profile:   http://localhost:${PORT}/api/user`);
      console.log(`   Profile Search: http://localhost:${PORT}/api/search`);
      console.log(`   Subscriptions:  http://localhost:${PORT}/api/subscriptions`);
      console.log(`   Admin Panel:    http://localhost:${PORT}/api/admin`);
      console.log('\n💡 Tips:');
      console.log('   - Run database migration: npm run migrate');
      console.log('   - Test with Postman or curl');
      console.log('   - Check logs for any errors');
      console.log('\n✨ Happy coding! ✨\n');
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        
        // Close database connections
        const { pool } = require('./src/config/database');
        pool.end(() => {
          console.log('✅ Database connections closed');
          console.log('👋 Server shutdown complete. Goodbye!');
          process.exit(0);
        });
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();