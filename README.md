# E-commerce Microservices Platform

## Architecture Overview
```
Client (React) → Kong API Gateway → Microservices
                                  ↓
                               RabbitMQ (Message Queue)
                                  ↓
                            Prometheus & Grafana (Monitoring)
```

## Services
- **user-service**: Authentication & user management
- **product-service**: Product catalog
- **order-service**: Order processing
- **notification-service**: Email/SMS notifications
- **frontend**: React app with Vite, Tailwind, TanStack Query

## Quick Start
```bash
# Start all services
docker-compose up -d

# Development mode
npm run dev:all
```

## Learning References
- [Kong API Gateway](https://docs.konghq.com/gateway/latest/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials)
- [Prometheus Monitoring](https://prometheus.io/docs/introduction/overview/)
- [Grafana Dashboards](https://grafana.com/docs/grafana/latest/)
- [Microservices Patterns](https://microservices.io/patterns/)
