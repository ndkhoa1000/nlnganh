# Auth Service - Task Breakdown

This document outlines the tasks for building the Authentication Service.

## Phase 1: Auth Service Development

### **Task 1: Project Foundation Setup (Completed)**
*   [x] Create project structure and folders
*   [x] Initialize npm package.json
*   [x] Set up TypeScript configuration
*   [x] Create basic environment configuration (`.env`, `.env.example`)

### **Task 2: Basic Express Server (Completed)**
*   [x] Install core dependencies (express, typescript, mongoose, cors, dotenv, bcrypt, jsonwebtoken)
*   [x] Create basic Express app (`app.ts`, `index.ts`)
*   [x] Set up middleware (CORS, body parser - `express.json()`)
*   [x] Create health check endpoint (`/health`)
*   [x] Test server startup

### **Task 3: Core Infrastructure (In Progress)**
*   [x] Database Connection (`src/config/database.ts`)
*   [x] Centralized Configuration Management (`src/config/app.config.ts`, `src/utils/get-env.ts`)
*   [x] HTTP Status Code Constants (`src/config/http.config.ts`)
*   [x] Custom Error Handling System (`src/utils/appError.ts`, `src/middleware/errorHandler.ts`, `src/middleware/asyncHandler.ts`, `src/enums/error-code.enums.ts`)
*   [ ] **Task 3.8: Advanced Logging System (Winston)**
    *   [ ] Install Winston
    *   [ ] Configure logger (levels, transports - console, file)
    *   [ ] Create logger utility
    *   [ ] Replace `console.log/error` with Winston logger
    *   [ ] Implement request logging middleware (Morgan or custom with Winston)

### **Task 4: User Model & Types**
*   [ ] Define TypeScript interfaces for User (`src/types/user.types.ts` or similar)
*   [ ] Create Mongoose User schema (`src/models/User.model.ts`)
*   [ ] Add validation rules to schema
*   [ ] Add password hashing methods (pre-save hook)
*   [ ] Add JWT generation methods to user model (instance methods)

### **Task 5: Authentication Logic & Controllers**
*   [ ] **User Registration**
    *   [ ] Create `auth.controller.ts` with `register` function
    *   [ ] Input validation (e.g., using Joi or Zod, or manual checks)
    *   [ ] Check if user already exists
    *   [ ] Hash password
    *   [ ] Save user to database
    *   [ ] Generate JWT (access and refresh tokens)
    *   [ ] Send response (user data without password, tokens)
*   [ ] **User Login**
    *   [ ] Add `login` function to `auth.controller.ts`
    *   [ ] Input validation
    *   [ ] Find user by email
    *   [ ] Compare password
    *   [ ] Generate JWT (access and refresh tokens)
    *   [ ] Send response
*   [ ] **Refresh Token**
    *   [ ] Add `refreshToken` function to `auth.controller.ts`
    *   [ ] Validate refresh token
    *   [ ] Generate new access token
    *   [ ] Send response
*   [ ] **Get User Profile (Protected)**
    *   [ ] Create `user.controller.ts` with `getMe` function
    *   [ ] Protect route with authentication middleware
    *   [ ] Send user profile data

### **Task 6: Routing & Middleware**
*   [ ] Create authentication middleware (`src/middleware/auth.middleware.ts`)
    *   [ ] Verify JWT access token
    *   [ ] Attach user to request object
*   [ ] Create validation middleware (optional, if using Joi/Zod)
*   [ ] Set up API routes (`src/routes/auth.routes.ts`, `src/routes/user.routes.ts`)
*   [ ] Integrate routes into `app.ts`

### **Task 7: Security Enhancements**
*   [ ] Implement Helmet for security headers
*   [ ] Implement rate limiting (e.g., `express-rate-limit`)
*   [ ] Review CORS configuration for production

### **Task 8: Testing (Basic)**
*   [ ] Set up Jest or Mocha/Chai for testing
*   [ ] Write basic unit tests for utility functions
*   [ ] Write basic integration tests for auth endpoints (register, login)

### **Task 9: Dockerization**
*   [ ] Create `Dockerfile` for the auth-service
*   [ ] Add auth-service to a project-level `docker-compose.yml`
*   [ ] Ensure MongoDB can be run via Docker Compose
*   [ ] Test containerized deployment locally

### **Task 10: Prometheus Metrics (Basic)**
*   [ ] Install Prometheus client (`prom-client`)
*   [ ] Add basic metrics (e.g., HTTP request counter, error counter)
*   [ ] Expose a `/metrics` endpoint
