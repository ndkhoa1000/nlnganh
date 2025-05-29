import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger';

class MetricsService {
  private static instance: MetricsService;
  private register: client.Registry;
  private httpRequestDuration: client.Histogram<string>;
  private httpRequestTotal: client.Counter<string>;
  private httpRequestErrors: client.Counter<string>;
  private activeConnections: client.Gauge<string>;
  private databaseConnections: client.Gauge<string>;

  private constructor() {
    this.register = new client.Registry();
    
    // Default metrics (CPU, memory, etc.)
    client.collectDefaultMetrics({ register: this.register });

    // Custom metrics
    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    });

    this.httpRequestTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });

    this.httpRequestErrors = new client.Counter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'status'],
    });

    this.activeConnections = new client.Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
    });

    this.databaseConnections = new client.Gauge({
      name: 'database_connections',
      help: 'Number of database connections',
    });

    // Register custom metrics
    this.register.registerMetric(this.httpRequestDuration);
    this.register.registerMetric(this.httpRequestTotal);
    this.register.registerMetric(this.httpRequestErrors);
    this.register.registerMetric(this.activeConnections);
    this.register.registerMetric(this.databaseConnections);
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  public getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  public trackHttpRequest() {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route?.path || req.path;
        const method = req.method;
        const status = res.statusCode.toString();

        // Track duration
        this.httpRequestDuration
          .labels(method, route, status)
          .observe(duration);

        // Track total requests
        this.httpRequestTotal
          .labels(method, route, status)
          .inc();

        // Track errors (4xx and 5xx)
        if (res.statusCode >= 400) {
          this.httpRequestErrors
            .labels(method, route, status)
            .inc();
        }
      });

      next();
    };
  }

  public incrementActiveConnections(): void {
    this.activeConnections.inc();
  }

  public decrementActiveConnections(): void {
    this.activeConnections.dec();
  }

  public setDatabaseConnections(count: number): void {
    this.databaseConnections.set(count);
  }

  public createCustomCounter(name: string, help: string, labels: string[] = []): client.Counter<string> {
    const counter = new client.Counter({
      name,
      help,
      labelNames: labels,
    });
    
    this.register.registerMetric(counter);
    return counter;
  }

  public createCustomGauge(name: string, help: string, labels: string[] = []): client.Gauge<string> {
    const gauge = new client.Gauge({
      name,
      help,
      labelNames: labels,
    });
    
    this.register.registerMetric(gauge);
    return gauge;
  }

  public createCustomHistogram(
    name: string, 
    help: string, 
    labels: string[] = [],
    buckets?: number[]
  ): client.Histogram<string> {
    const histogram = new client.Histogram({
      name,
      help,
      labelNames: labels,
      buckets: buckets || [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    });
    
    this.register.registerMetric(histogram);
    return histogram;
  }
}

export default MetricsService.getInstance();
