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

### **Task 3: Core Infrastructure (Completed)**
*   [x] Database Connection (`src/config/database.config.ts`)
*   [x] Centralized Configuration Management (`src/config/app.config.ts`, `src/utils/get-env.ts`)
*   [x] HTTP Status Code Constants (`src/config/http.config.ts`)
*   [x] Custom Error Handling System (`src/utils/appError.ts`, `src/middlewares/errorHandler.middleware.ts`, `src/middlewares/asyncHandler.middleware.ts`, `src/enums/error-code.enums.ts`)
*   [x] **Task 3.8: Advanced Logging System (Winston)**
    *   [x] Install Winston
    *   [x] Configure logger (levels, transports - console, file)
    *   [x] Create logger utility
    *   [x] Replace `console.log/error` with Winston logger
    *   [x] Implement request logging middleware (Morgan or custom with Winston)

### **Task 4: User Model & Types (Completed)**
*   [x] Define TypeScript interfaces for User (`src/models/user.model.ts` with UserDocument interface)
*   [x] Create Mongoose User schema (`src/models/user.model.ts`)
*   [x] Add validation rules to schema (Zod validation in `src/validation/`)
*   [x] Add password hashing methods (pre-save hook with bcrypt)
*   [x] Add password comparison methods to user model (instance methods)
*   [x] **Additional:** Account model for OAuth providers (`src/models/account.model.ts`)

### **Task 5: Authentication Logic & Controllers (Completed - Session-based with Passport.js)**
*   [x] **User Registration**
    *   [x] Create `auth.controller.ts` with `register` function
    *   [x] Input validation using Zod (`src/validation/auth.validation.ts`)
    *   [x] Check if user already exists (in service layer)
    *   [x] Hash password (Mongoose pre-save hook)
    *   [x] Save user to database
    *   [x] **Implemented:** Session-based authentication instead of JWT
*   [x] **User Login**
    *   [x] Implement Passport.js Local Strategy (`src/config/passport.config.ts`)
    *   [x] Add login routes with session management
    *   [x] Input validation using Zod
    *   [x] Find user by email and compare password
    *   [x] Create authenticated session
*   [x] **OAuth Integration (Google)**
    *   [x] Configure Google OAuth strategy (`src/config/passport.config.ts`)
    *   [x] Implement Google login callback (`googleLoginCallback` in auth.controller.ts)
    *   [x] Handle account linking/creation for OAuth users
*   [x] **Session Management**
    *   [x] Configure express-session with proper security settings
    *   [x] Session serialization/deserialization with Passport.js
*   [x] **Get User Profile (Protected)**
    *   [x] Create `user.controller.ts` with profile functions
    *   [x] Protect routes with session-based authentication middleware (`isAuthenticated`)

### **Task 6: Routing & Middleware (Completed)**
*   [x] Create authentication middleware (`src/middlewares/isAuthenticated.middleware.ts`)
    *   [x] Verify authenticated session (instead of JWT)
    *   [x] Check user authentication status from session
*   [x] Create validation middleware using Zod (`src/validation/` folder)
    *   [x] Common validation schemas (`src/validation/common.validation.ts`)
    *   [x] Auth-specific validation (`src/validation/auth.validation.ts`)
    *   [x] User-specific validation (`src/validation/user.validation.ts`)
*   [x] Set up API routes
    *   [x] Auth routes (`src/routes/auth.route.ts`)
    *   [x] User routes (`src/routes/user.route.ts`)
*   [x] Integrate routes into main app (`src/index.ts`)
*   [x] **Additional:** Service layer architecture (`src/services/` folder)

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

## Implementation Notes

**Architecture Decision:** This auth-service implementation uses **session-based authentication with Passport.js** instead of JWT tokens as originally planned. This provides:
- Built-in session management with express-session
- Easy integration with OAuth providers (Google OAuth implemented)
- Simplified client-side authentication (no token management needed)
- Automatic session expiry and security features

**Key Technologies Used:**
- **Authentication:** Passport.js with Local + Google OAuth strategies
- **Validation:** Zod for input validation and type safety
- **Sessions:** express-session with secure configuration
- **Database:** MongoDB with Mongoose ODM
- **Password Security:** bcrypt for hashing
- **Architecture:** MVC pattern with service layer

**Current Status:** Core authentication functionality is complete and functional.

---
