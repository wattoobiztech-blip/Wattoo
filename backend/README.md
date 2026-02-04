# Rishta Matrimonial Platform - Backend API

A comprehensive Node.js/Express.js backend API for the Rishta matrimonial platform with MySQL database integration.

## 🚀 Features

- **Authentication System**: JWT-based authentication with refresh tokens
- **User Management**: Complete user registration, login, and profile management
- **Profile System**: Detailed matrimonial profiles with search and matching
- **Subscription Management**: Multiple subscription tiers with payment integration
- **Admin Panel**: Comprehensive admin dashboard with user management
- **Search & Matching**: Advanced profile search with filters
- **File Upload**: Profile photo and gallery image upload
- **Security**: Rate limiting, input validation, and SQL injection protection
- **Database**: MySQL with connection pooling and transactions

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL Database**
   ```sql
   -- Create database
   CREATE DATABASE rishta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   
   -- Create user (optional)
   CREATE USER 'rishta_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON rishta.* TO 'rishta_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=rishta
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ADMIN_JWT_SECRET=admin_secret_key_change_this
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

5. **Run Database Migration**
   ```bash
   npm run migrate
   ```

6. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 Database Schema

The system includes the following main tables:

- **users**: User accounts and authentication
- **profiles**: Detailed matrimonial profiles
- **subscriptions**: Subscription plans and billing
- **payments**: Payment history and transactions
- **interests**: Match requests and responses
- **profile_views**: Profile viewing history
- **admin_users**: Admin accounts and roles
- **admin_comments**: Internal admin notes
- **user_reports**: User reports and moderation
- **activity_logs**: System activity tracking

## 🔐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Refresh JWT token
- `POST /logout` - User logout
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /verify-email/:token` - Verify email address
- `POST /resend-verification` - Resend verification email
- `POST /change-password` - Change password (authenticated)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile

### User Management (`/api/user`)
- `GET /dashboard` - Get user dashboard data
- `GET /stats` - Get user statistics
- `PUT /settings` - Update user settings

### Profile Management (`/api/profile`)
- `GET /` - Get user's profile
- `POST /` - Create/update profile
- `GET /:id` - Get specific profile
- `PUT /photo` - Upload profile photo
- `GET /completion` - Get profile completion status

### Search & Matching (`/api/search`)
- `GET /profiles` - Advanced profile search
- `POST /save` - Save search criteria
- `GET /matches/daily` - Get daily matches
- `POST /matches/interest` - Express interest
- `GET /matches/mutual` - Get mutual matches

### Subscriptions (`/api/subscriptions`)
- `GET /plans` - Get subscription plans
- `POST /subscribe` - Subscribe to plan
- `GET /current` - Get current subscription
- `POST /cancel` - Cancel subscription
- `GET /invoices` - Get invoice history

### Admin Panel (`/api/admin`)
- `POST /login` - Admin login
- `GET /dashboard/metrics` - Dashboard metrics
- `GET /dashboard/charts` - Chart data
- `GET /dashboard/activity` - Recent activity
- `GET /users` - Get all users
- `PUT /users/:id/status` - Update user status
- `GET /profiles/pending` - Pending approvals
- `POST /profiles/:id/approve` - Approve profile
- `GET /subscriptions` - All subscriptions
- `POST /comments` - Add admin comment
- `GET /analytics` - Analytics data

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **User Authentication**: Standard JWT tokens for regular users
2. **Admin Authentication**: Separate JWT tokens for admin users
3. **Refresh Tokens**: Long-lived tokens for token renewal
4. **Token Expiry**: Configurable token expiration times

### Using Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🛡️ Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet.js**: Security headers
- **Password Hashing**: bcrypt with salt rounds
- **Account Locking**: Temporary lockout after failed attempts

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # Database connection
│   │   └── env.js       # Environment configuration
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── profile.controller.js
│   │   ├── search.controller.js
│   │   ├── subscription.controller.js
│   │   └── admin.controller.js
│   ├── models/          # Database models
│   │   ├── user.model.js
│   │   ├── profile.model.js
│   │   ├── subscription.model.js
│   │   └── admin.model.js
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── profile.routes.js
│   │   ├── search.routes.js
│   │   ├── subscription.routes.js
│   │   └── admin.routes.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   └── validation.middleware.js
│   ├── utils/           # Utility functions
│   │   ├── database.js  # Database utilities
│   │   ├── jwt.js       # JWT utilities
│   │   ├── validation.js # Validation helpers
│   │   ├── helpers.js   # General helpers
│   │   └── migrate.js   # Database migration
│   └── app.js           # Express app configuration
├── uploads/             # File upload directory
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── server.js           # Server entry point
```

## 🧪 Testing

### Manual Testing with curl

1. **Register a new user**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "fullName": "Test User",
    "phone": "+1234567890",
    "gender": "male"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

3. **Admin Login**:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for base URL and tokens
3. Test each endpoint with appropriate request bodies
4. Verify response formats and status codes

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**:
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=your-production-db-host
   DB_USER=your-production-db-user
   DB_PASSWORD=your-secure-password
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Database Setup**:
   - Create production database
   - Run migrations: `npm run migrate`
   - Set up database backups

3. **Server Deployment**:
   ```bash
   # Install dependencies
   npm ci --only=production
   
   # Start server
   npm start
   ```

4. **Process Management** (PM2):
   ```bash
   npm install -g pm2
   pm2 start server.js --name "rishta-api"
   pm2 startup
   pm2 save
   ```

## 📝 Default Admin Account

After running the migration, a default admin account is created:

- **Username**: `admin`
- **Email**: `admin@rishta.com`
- **Password**: `admin123`
- **Role**: `super_admin`

**⚠️ Important**: Change the default admin password immediately in production!

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | Database password | `` |
| `DB_NAME` | Database name | `rishta` |
| `JWT_SECRET` | JWT secret key | Required |
| `ADMIN_JWT_SECRET` | Admin JWT secret | Required |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Database Configuration

The database connection uses connection pooling for better performance:

- **Connection Limit**: 10 connections
- **Charset**: utf8mb4 (supports emojis)
- **Timezone**: UTC
- **Reconnect**: Enabled

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**:
   - Change PORT in `.env` file
   - Kill existing process: `lsof -ti:5000 | xargs kill`

3. **JWT Token Errors**:
   - Verify JWT_SECRET is set
   - Check token format in Authorization header
   - Ensure token hasn't expired

4. **File Upload Issues**:
   - Check upload directory permissions
   - Verify file size limits
   - Ensure allowed file types

### Logs

The server provides detailed logging:
- **Development**: Colored console logs with request details
- **Production**: Structured logs suitable for log aggregation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy coding! 🚀**