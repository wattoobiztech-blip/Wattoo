const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDatabase() {
  try {
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4'
    });

    console.log('🗑️  Dropping existing database...');
    await connection.execute(`DROP DATABASE IF EXISTS ${process.env.DB_NAME || 'rishta'}`);
    
    console.log('🆕 Creating fresh database...');
    await connection.execute(`CREATE DATABASE ${process.env.DB_NAME || 'rishta'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    await connection.end();
    console.log('✅ Database reset complete!');
    console.log('💡 Now run: npm run migrate');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  }
}

resetDatabase();