# Project Overview: MERN Microservices E-commerce Platform

## 1. Project Goal
Build a production-ready microservices architecture with MERN stack including User Service with TypeScript, Kong API Gateway, RabbitMQ message queue, Prometheus/Grafana monitoring. Step-by-step learning project for e-commerce platform with clean architecture, authentication, event-driven communication, and comprehensive documentation.

## 2. Major Milestones/Phases

*   **Phase 1: Authentication Service (In Progress)**
    *   User registration, login, profile management
    *   JWT authentication with refresh tokens
    *   Role-based access control (RBAC)
    *   MongoDB integration
    *   Input validation and error handling
    *   Basic security middleware
    *   Dockerization
    *   Advanced logging (Winston)
    *   Prometheus metrics integration (basic)

*   **Phase 2: Product Service**
    *   CRUD operations for products
    *   Product categories and search
    *   Inventory management (basic)
    *   Integration with Auth Service (e.g., for admin-only actions)
    *   Event publishing for product changes (e.g., to RabbitMQ)

*   **Phase 3: Order Service**
    *   Order creation and management
    *   Shopping cart functionality
    *   Payment integration (mock or basic)
    *   Event publishing for order events

*   **Phase 4: Notification Service**
    *   Consumes events from other services (e.g., user registered, order placed)
    *   Sends notifications (e.g., email, in-app - mock for now)

*   **Phase 5: API Gateway (Kong)**
    *   Set up Kong as the API gateway
    *   Route requests to appropriate microservices
    *   Implement basic rate limiting and authentication at the gateway level

*   **Phase 6: Message Queue (RabbitMQ)**
    *   Full setup and configuration of RabbitMQ
    *   Ensure robust event-driven communication between services

*   **Phase 7: Monitoring & Observability (Prometheus & Grafana)**
    *   Comprehensive metrics collection from all services
    *   Set up Grafana dashboards for monitoring
    *   Centralized logging solution (e.g., ELK stack or similar - if time permits)

*   **Phase 8: Frontend Application (React)**
    *   Develop a React frontend using Vite and TailwindCSS
    *   Integrate with TanStack Query for data fetching
    *   Implement user authentication flows
    *   Display products, manage cart, and place orders

*   **Phase 9: Production Deployment Setup**
    *   Complete Docker orchestration (e.g., Docker Compose for production, Kubernetes exploration)
    *   CI/CD pipeline setup (basic)
    *   Security hardening

## 3. Core Technologies
*   **Backend:** Node.js, Express.js, TypeScript
*   **Database:** MongoDB (with Mongoose)
*   **Frontend:** React, Vite, TailwindCSS, TanStack Query
*   **API Gateway:** Kong
*   **Message Broker:** RabbitMQ
*   **Monitoring:** Prometheus, Grafana
*   **Containerization:** Docker
