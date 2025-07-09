/**
 * WebSocket Connection Manager for PHCityRent
 * Handles connection state, reconnection logic, message queuing, and error handling
 */

export interface WebSocketMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retryCount?: number;
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected: Date | null;
  reconnectAttempts: number;
  connectionId: string | null;
}

export interface WebSocketConfig {
  url?: string;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  maxReconnectDelay: number;
  heartbeatInterval: number;
  messageTimeout: number;
  queueMaxSize: number;
}

export type MessageHandler = (message: WebSocketMessage) => void;
export type ConnectionHandler = (state: ConnectionState) => void;
export type ErrorHandler = (error: Error) => void;

/**
 * Singleton WebSocket Manager with advanced connection management
 */
export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private connectionState: ConnectionState;
  private messageQueue: WebSocketMessage[] = [];
  private pendingMessages: Map<string, WebSocketMessage> = new Map();
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private connectionHandlers: ConnectionHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isOnline: boolean = navigator.onLine;

  private constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      maxReconnectAttempts: 10,
      reconnectDelay: 1000,
      maxReconnectDelay: 30000,
      heartbeatInterval: 30000,
      messageTimeout: 10000,
      queueMaxSize: 100,
      ...config
    };

    this.connectionState = {
      isConnected: false,
      isConnecting: false,
      lastConnected: null,
      reconnectAttempts: 0,
      connectionId: null
    };

    this.setupNetworkListeners();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<WebSocketConfig>): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager(config);
    }
    return WebSocketManager.instance;
  }

  /**
   * Connect to WebSocket server
   */
  public async connect(url?: string): Promise<void> {
    if (this.connectionState.isConnected || this.connectionState.isConnecting) {
      return;
    }

    const wsUrl = url || this.getWebSocketUrl();
    
    return new Promise((resolve, reject) => {
      try {
        this.connectionState.isConnecting = true;
        this.notifyConnectionHandlers();

        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.connectionState = {
            isConnected: true,
            isConnecting: false,
            lastConnected: new Date(),
            reconnectAttempts: 0,
            connectionId: this.generateConnectionId()
          };
          
          this.startHeartbeat();
          this.processMessageQueue();
          this.notifyConnectionHandlers();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.handleDisconnection();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.handleError(new Error('WebSocket connection error'));
          reject(error);
        };

      } catch (error) {
        this.connectionState.isConnecting = false;
        this.notifyConnectionHandlers();
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.connectionState = {
      isConnected: false,
      isConnecting: false,
      lastConnected: this.connectionState.lastConnected,
      reconnectAttempts: 0,
      connectionId: null
    };

    this.notifyConnectionHandlers();
  }

  /**
   * Send message through WebSocket
   */
  public sendMessage(type: string, payload: any): Promise<void> {
    const message: WebSocketMessage = {
      id: this.generateMessageId(),
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0
    };

    return this.sendMessageInternal(message);
  }

  /**
   * Send message with retry logic
   */
  private async sendMessageInternal(message: WebSocketMessage): Promise<void> {
    if (!this.connectionState.isConnected) {
      this.queueMessage(message);
      return;
    }

    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
        this.pendingMessages.set(message.id, message);
        
        // Set timeout for message acknowledgment
        setTimeout(() => {
          if (this.pendingMessages.has(message.id)) {
            this.handleMessageTimeout(message);
          }
        }, this.config.messageTimeout);
      } else {
        this.queueMessage(message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      this.queueMessage(message);
    }
  }

  /**
   * Subscribe to message type
   */
  public subscribe(messageType: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    
    this.messageHandlers.get(messageType)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(messageType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Subscribe to connection state changes
   */
  public onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) {
        this.connectionHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to errors
   */
  public onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) {
        this.errorHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.connectionState.isConnected;
  }

  /**
   * Get message queue size
   */
  public getQueueSize(): number {
    return this.messageQueue.length;
  }

  /**
   * Clear message queue
   */
  public clearQueue(): void {
    this.messageQueue = [];
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Handle acknowledgments
      if (message.type === 'ack' && message.payload?.messageId) {
        this.pendingMessages.delete(message.payload.messageId);
        return;
      }

      // Handle heartbeat responses
      if (message.type === 'pong') {
        return;
      }

      // Notify message handlers
      const handlers = this.messageHandlers.get(message.type) || [];
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('Message handler error:', error);
        }
      });

    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Handle disconnection
   */
  private handleDisconnection(): void {
    this.connectionState.isConnected = false;
    this.connectionState.isConnecting = false;
    this.connectionState.connectionId = null;
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.notifyConnectionHandlers();
    
    // Attempt reconnection if online and within retry limits
    if (this.isOnline && this.connectionState.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.connectionState.reconnectAttempts),
      this.config.maxReconnectDelay
    );

    console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.connectionState.reconnectAttempts + 1})`);

    this.reconnectTimer = setTimeout(() => {
      this.connectionState.reconnectAttempts++;
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.connectionState.isConnected && this.ws) {
        this.sendMessage('ping', { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Queue message for later sending
   */
  private queueMessage(message: WebSocketMessage): void {
    if (this.messageQueue.length >= this.config.queueMaxSize) {
      this.messageQueue.shift(); // Remove oldest message
    }
    
    this.messageQueue.push(message);
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    const messages = [...this.messageQueue];
    this.messageQueue = [];
    
    messages.forEach(message => {
      this.sendMessageInternal(message);
    });
  }

  /**
   * Handle message timeout
   */
  private handleMessageTimeout(message: WebSocketMessage): void {
    this.pendingMessages.delete(message.id);
    
    if ((message.retryCount || 0) < 3) {
      message.retryCount = (message.retryCount || 0) + 1;
      this.queueMessage(message);
    } else {
      console.error('Message failed after retries:', message);
    }
  }

  /**
   * Setup network status listeners
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('Network came online');
      this.isOnline = true;
      if (!this.connectionState.isConnected) {
        this.connect();
      }
    });

    window.addEventListener('offline', () => {
      console.log('Network went offline');
      this.isOnline = false;
    });
  }

  /**
   * Notify connection handlers
   */
  private notifyConnectionHandlers(): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(this.connectionState);
      } catch (error) {
        console.error('Connection handler error:', error);
      }
    });
  }

  /**
   * Handle errors
   */
  private handleError(error: Error): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error handler error:', handlerError);
      }
    });
  }

  /**
   * Generate WebSocket URL
   */
  private getWebSocketUrl(): string {
    // In a real implementation, this would come from environment variables
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
