import * as amqp from 'amqplib';
import config from '@/config';
import logger from '@/utils/logger';
import { UserEvent } from '@/types/user.types';

class MessageQueueService {
  private static instance: MessageQueueService;
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): MessageQueueService {
    if (!MessageQueueService.instance) {
      MessageQueueService.instance = new MessageQueueService();
    }
    return MessageQueueService.instance;
  }

  public async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(config.rabbitmq.url);
      this.channel = await this.connection.createChannel();
      
      this.isConnected = true;
      logger.info('Connected to RabbitMQ');

      // Setup exchanges and queues
      await this.setupExchangesAndQueues();

      // Handle connection events
      this.connection.on('error', (err) => {
        logger.error('RabbitMQ connection error:', err);
        this.isConnected = false;
      });

      this.connection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
        this.isConnected = false;
      });

    } catch (error) {
      logger.error('Failed to connect to RabbitMQ:', error);
      this.isConnected = false;
      throw error;
    }
  }

  private async setupExchangesAndQueues(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    // Declare exchange for user events
    await this.channel.assertExchange(
      config.rabbitmq.exchanges.userEvents,
      'topic',
      { durable: true }
    );

    // Declare queue for user notifications
    await this.channel.assertQueue(
      config.rabbitmq.queues.userNotifications,
      { durable: true }
    );

    // Bind queue to exchange
    await this.channel.bindQueue(
      config.rabbitmq.queues.userNotifications,
      config.rabbitmq.exchanges.userEvents,
      'user.*'
    );

    logger.info('RabbitMQ exchanges and queues setup completed');
  }

  public async publishUserEvent(event: UserEvent): Promise<void> {
    if (!this.isConnected || !this.channel) {
      logger.warn('RabbitMQ not connected, skipping event publication');
      return;
    }

    try {
      const routingKey = this.getRoutingKey(event.type);
      const message = Buffer.from(JSON.stringify(event));

      const published = this.channel.publish(
        config.rabbitmq.exchanges.userEvents,
        routingKey,
        message,
        {
          persistent: true,
          timestamp: Date.now(),
          messageId: `${event.type}_${Date.now()}`,
        }
      );

      if (published) {
        logger.info(`Published user event: ${event.type}`, { event });
      } else {
        logger.warn(`Failed to publish user event: ${event.type}`);
      }
    } catch (error) {
      logger.error('Error publishing user event:', error);
    }
  }

  private getRoutingKey(eventType: string): string {
    switch (eventType) {
      case 'USER_CREATED':
        return 'user.created';
      case 'USER_UPDATED':
        return 'user.updated';
      case 'USER_DELETED':
        return 'user.deleted';
      default:
        return 'user.unknown';
    }
  }

  public async consumeMessages(
    queueName: string,
    callback: (message: any) => Promise<void>
  ): Promise<void> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ not connected');
    }

    await this.channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          this.channel!.ack(msg);
        } catch (error) {
          logger.error('Error processing message:', error);
          this.channel!.nack(msg, false, false); // Dead letter the message
        }
      }
    });

    logger.info(`Started consuming messages from queue: ${queueName}`);
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.isConnected = false;
      logger.info('Disconnected from RabbitMQ');
    } catch (error) {
      logger.error('Error disconnecting from RabbitMQ:', error);
    }
  }

  public isConnectionActive(): boolean {
    return this.isConnected;
  }
}

export default MessageQueueService.getInstance();
