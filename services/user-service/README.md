# User Service

A TypeScript-based microservice for user authentication and management using Node.js, Express, MongoDB, and RabbitMQ.

## Features

- **User Registration & Authentication** - JWT-based auth with refresh tokens
- **Role-based Access Control** - Customer, Admin, Super Admin roles
- **Password Security** - Bcrypt hashing with strong password validation
- **Event-Driven Architecture** - RabbitMQ integration for user events
- **Monitoring** - Prometheus metrics integration
- **Clean Architecture** - Separation of concerns with controllers, services, models
- **Type Safety** - Full TypeScript implementation
- **Input Validation** - Joi schema validation
- **Error Handling** - Centralized error handling with proper HTTP status codes
- **Logging** - Winston logger with file and console output
- **Rate Limiting** - Express rate limiting for API protection
- **Security** - Helmet, CORS, and other security middleware

## API Endpoints

### Public Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/refresh-token` - Refresh access token

### Protected Endpoints (Authentication Required)
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Admin Endpoints (Admin/Super Admin Only)
- `GET /api/users` - List all users (with pagination, filtering)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user (Super Admin only)

### System Endpoints
- `GET /` - Service health check
- `GET /metrics` - Prometheus metrics
- `GET /api/health` - Detailed health check

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Environment
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/userdb

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRE=30d

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin123@localhost:5672

# Redis
REDIS_URL=redis://localhost:6379

# Service Discovery
SERVICE_NAME=user-service
SERVICE_HOST=localhost
SERVICE_PORT=3001

# Monitoring
METRICS_PORT=9090
```

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
npm run lint:fix
```

## Docker

```bash
# Build Docker image
docker build -t user-service .

# Run with Docker Compose (from project root)
docker-compose up user-service
```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Database models
├── middleware/      # Express middleware
├── routes/          # API routes
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── config/         # Configuration files
```

## Key Technologies

- **Node.js & Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **RabbitMQ** - Message queue for events
- **Prometheus** - Metrics collection
- **Winston** - Logging
- **Joi** - Input validation
- **Helmet** - Security middleware

## Event Publishing

The service publishes these events to RabbitMQ:

- `USER_CREATED` - When a new user registers
- `USER_UPDATED` - When user profile is updated
- `USER_DELETED` - When user is deleted

Events are published to the `user.events` exchange with appropriate routing keys.

## Monitoring

Prometheus metrics are available at `/metrics` endpoint:

- HTTP request duration and count
- Error rates by endpoint
- Active connections
- Database connection status
- Custom business metrics

## Security Features

- Password strength validation
- JWT token expiration
- Refresh token rotation
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- Input sanitization
- Role-based authorization

## Error Handling

The service provides consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Testing

Run tests with:

```bash
npm test
npm run test:watch
```

## Documentation References

- **Authentication**: JWT tokens with refresh mechanism
- **MongoDB**: Using Mongoose ODM with validation
- **RabbitMQ**: Event-driven communication between services
- **Prometheus**: Application monitoring and metrics
- **Clean Architecture**: Separation of concerns and dependency inversion
