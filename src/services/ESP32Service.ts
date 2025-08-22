import { Alert } from 'react-native';
import mqtt from 'react-native-mqtt';

// ESP32 Communication Service
export interface ESP32Config {
  mqttBroker: string;
  mqttPort: number;
  mqttClientId: string;
  httpEndpoint: string;
  deviceId: string;
  mqttUsername?: string;
  mqttPassword?: string;
  connectionTimeout?: number;
  retryAttempts?: number;
}

export interface SimulatorCommand {
  type: 'movement' | 'speed' | 'status' | 'emergency_stop';
  direction?: 'forward' | 'backward' | 'left' | 'right' | 'stop';
  speed?: number;
  timestamp: number;
}

export interface SimulatorStatus {
  battery: number;
  speed: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  status: 'idle' | 'moving' | 'error' | 'emergency';
  temperature: number;
  lastCommand: string;
}

class ESP32Service {
  private config: ESP32Config;
  private mqttClient: any = null;
  private isConnected: boolean = false;
  private reconnectInterval: any = null;
  private connectionAttempts: number = 0;
  private maxRetryAttempts: number = 3;

  constructor(config: ESP32Config) {
    this.config = {
      connectionTimeout: 15000,
      retryAttempts: 3,
      ...config
    };
    this.maxRetryAttempts = this.config.retryAttempts || 3;
  }

  // MQTT Connection Management with improved error handling
  async connectMQTT(): Promise<boolean> {
    try {
      console.log('🔗 Attempting MQTT connection to:', this.config.mqttBroker);
      console.log('📊 Connection attempt:', this.connectionAttempts + 1, 'of', this.maxRetryAttempts);
      
      const mqttOptions = {
        host: this.config.mqttBroker,
        port: this.config.mqttPort,
        clientId: `${this.config.mqttClientId}_${Date.now()}`, // Unique client ID
        username: this.config.mqttUsername,
        password: this.config.mqttPassword,
        keepalive: 60,
        clean: true,
        reconnectPeriod: 0, // Disable auto-reconnect for manual control
        connectTimeout: this.config.connectionTimeout || 15000,
        rejectUnauthorized: false, // Allow self-signed certificates
      };

      this.mqttClient = mqtt.connect(mqttOptions);
      
      return new Promise((resolve) => {
        let connectionTimeout: any;
        let hasResolved = false;

        const resolveOnce = (success: boolean) => {
          if (!hasResolved) {
            hasResolved = true;
            clearTimeout(connectionTimeout);
            resolve(success);
          }
        };

        this.mqttClient.on('connect', () => {
          console.log('✅ MQTT Connected successfully');
          this.isConnected = true;
          this.connectionAttempts = 0; // Reset attempts on success
          this.setupMQTTSubscriptions();
          resolveOnce(true);
        });

        this.mqttClient.on('error', (error: any) => {
          console.error('❌ MQTT Connection error:', error);
          this.isConnected = false;
          this.connectionAttempts++;
          
          if (this.connectionAttempts >= this.maxRetryAttempts) {
            console.log('🔄 Max retry attempts reached');
            resolveOnce(false);
          } else {
            console.log('🔄 Retrying connection...');
            setTimeout(() => {
              this.connectMQTT().then(resolveOnce);
            }, 2000); // Wait 2 seconds before retry
          }
        });

        this.mqttClient.on('close', () => {
          console.log('🔌 MQTT Connection closed');
          this.isConnected = false;
        });

        this.mqttClient.on('offline', () => {
          console.log('📴 MQTT Client went offline');
          this.isConnected = false;
        });

        // Connection timeout
        connectionTimeout = setTimeout(() => {
          console.log('⏰ MQTT Connection timeout');
          this.connectionAttempts++;
          
          if (this.connectionAttempts >= this.maxRetryAttempts) {
            console.log('🔄 Max retry attempts reached');
            resolveOnce(false);
          } else {
            console.log('🔄 Retrying connection after timeout...');
            setTimeout(() => {
              this.connectMQTT().then(resolveOnce);
            }, 2000);
          }
        }, this.config.connectionTimeout || 15000);
      });
    } catch (error) {
      console.error('💥 MQTT Connection exception:', error);
      this.connectionAttempts++;
      return false;
    }
  }

  // HTTP Connection as fallback
  async connectHTTP(): Promise<boolean> {
    try {
      console.log('🌐 Attempting HTTP connection to:', this.config.httpEndpoint);
      
      const response = await fetch(`${this.config.httpEndpoint}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        console.log('✅ HTTP connection successful');
        this.isConnected = true;
        return true;
      } else {
        console.log('❌ HTTP connection failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('💥 HTTP connection error:', error);
      return false;
    }
  }

  // Smart connection that tries both MQTT and HTTP
  async connect(): Promise<boolean> {
    console.log('🚀 Starting smart connection...');
    
    // Try MQTT first
    const mqttSuccess = await this.connectMQTT();
    if (mqttSuccess) {
      console.log('✅ Connected via MQTT');
      return true;
    }

    console.log('🔄 MQTT failed, trying HTTP...');
    
    // Try HTTP as fallback
    const httpSuccess = await this.connectHTTP();
    if (httpSuccess) {
      console.log('✅ Connected via HTTP');
      return true;
    }

    console.log('❌ Both MQTT and HTTP connections failed');
    return false;
  }

  private setupMQTTSubscriptions() {
    if (!this.mqttClient) return;

    // Subscribe to ESP32 topics
    const topics = [
      `${this.config.deviceId}/status`,
      `${this.config.deviceId}/response`,
      `${this.config.deviceId}/error`,
    ];

    topics.forEach(topic => {
      this.mqttClient.subscribe(topic, (err: any) => {
        if (err) {
          console.error('❌ Failed to subscribe to', topic, err);
        } else {
          console.log('✅ Subscribed to', topic);
        }
      });
    });

    // Handle incoming messages
    this.mqttClient.on('message', (topic: string, message: any) => {
      console.log('📨 Received message on', topic, ':', message.toString());
      this.handleIncomingMessage(topic, message);
    });
  }

  private handleIncomingMessage(topic: string, message: any) {
    try {
      const data = JSON.parse(message.toString());
      console.log('📊 Parsed message:', data);
      
      // Handle different message types
      if (topic.includes('/status')) {
        // Handle status updates
        console.log('📈 Status update received');
      } else if (topic.includes('/response')) {
        // Handle command responses
        console.log('✅ Command response received');
      } else if (topic.includes('/error')) {
        // Handle errors
        console.error('❌ Error received:', data);
      }
    } catch (error) {
      console.error('💥 Error parsing message:', error);
    }
  }

  // Send command with improved error handling
  private async sendCommand(command: SimulatorCommand): Promise<boolean> {
    if (!this.isConnected) {
      console.log('❌ Not connected, attempting to reconnect...');
      const reconnected = await this.connect();
      if (!reconnected) {
        console.log('❌ Failed to reconnect');
        return false;
      }
    }

    try {
      const topic = `${this.config.deviceId}/command`;
      const message = JSON.stringify(command);
      
      console.log('📤 Sending command:', command.type, 'to topic:', topic);
      
      if (this.mqttClient && this.isConnected) {
        this.mqttClient.publish(topic, message, (err: any) => {
          if (err) {
            console.error('❌ Failed to publish command:', err);
          } else {
            console.log('✅ Command sent successfully');
          }
        });
        return true;
      } else {
        console.log('🔄 MQTT not available, trying HTTP...');
        return await this.sendCommandHTTP(command);
      }
    } catch (error) {
      console.error('💥 Error sending command:', error);
      return false;
    }
  }

  // HTTP fallback for sending commands
  private async sendCommandHTTP(command: SimulatorCommand): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.httpEndpoint}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),

      });

      if (response.ok) {
        console.log('✅ Command sent via HTTP');
        return true;
      } else {
        console.log('❌ HTTP command failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('💥 HTTP command error:', error);
      return false;
    }
  }

  // Get simulator status
  async getStatus(): Promise<SimulatorStatus | null> {
    try {
      if (!this.isConnected) {
        console.log('❌ Not connected, cannot get status');
        return null;
      }

      // Try MQTT first
      if (this.mqttClient) {
        return new Promise((resolve) => {
          const topic = `${this.config.deviceId}/status/request`;
          this.mqttClient.publish(topic, JSON.stringify({ timestamp: Date.now() }));
          
          // Wait for response
          setTimeout(() => {
            resolve(null);
          }, 3000);
        });
      }

      // Fallback to HTTP
      const response = await fetch(`${this.config.httpEndpoint}/status`);
      if (response.ok) {
        const status = await response.json();
        return status as SimulatorStatus;
      }
      
      return null;
    } catch (error) {
      console.error('💥 Error getting status:', error);
      return null;
    }
  }

  // Emergency stop
  async emergencyStop(): Promise<boolean> {
    const command: SimulatorCommand = {
      type: 'emergency_stop',
      timestamp: Date.now(),
    };

    console.log('🚨 Emergency stop triggered');
    return await this.sendCommand(command);
  }

  // Movement commands
  async moveForward(speed: number = 50): Promise<boolean> {
    return this.sendCommand({
      type: 'movement',
      direction: 'forward',
      speed,
      timestamp: Date.now(),
    });
  }

  async moveBackward(speed: number = 50): Promise<boolean> {
    return this.sendCommand({
      type: 'movement',
      direction: 'backward',
      speed,
      timestamp: Date.now(),
    });
  }

  async moveLeft(speed: number = 50): Promise<boolean> {
    return this.sendCommand({
      type: 'movement',
      direction: 'left',
      speed,
      timestamp: Date.now(),
    });
  }

  async moveRight(speed: number = 50): Promise<boolean> {
    return this.sendCommand({
      type: 'movement',
      direction: 'right',
      speed,
      timestamp: Date.now(),
    });
  }

  async stop(): Promise<boolean> {
    return this.sendCommand({
      type: 'movement',
      direction: 'stop',
      timestamp: Date.now(),
    });
  }

  // Speed control
  async setSpeed(speed: number): Promise<boolean> {
    return this.sendCommand({
      type: 'speed',
      speed: Math.max(0, Math.min(100, speed)), // Clamp between 0-100
      timestamp: Date.now(),
    });
  }

  // Disconnect
  disconnect() {
    console.log('🔌 Disconnecting ESP32 Service...');
    this.isConnected = false;
    this.connectionAttempts = 0;
    
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    if (this.mqttClient) {
      this.mqttClient.end();
      this.mqttClient = null;
    }
    
    console.log('✅ ESP32 Service disconnected');
  }

  // Connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Get connection info
  getConnectionInfo() {
    return {
      isConnected: this.isConnected,
      connectionAttempts: this.connectionAttempts,
      maxRetryAttempts: this.maxRetryAttempts,
      config: this.config,
    };
  }
}

// Default configuration with better defaults
export const defaultESP32Config: ESP32Config = {
  mqttBroker: '08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud',  // HiveMQ Cloud cluster ID
  mqttPort: 8883,  // SSL port
  mqttClientId: 'smarthom_mobile_' + Date.now(),
  httpEndpoint: 'https://08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud',  // HTTPS endpoint
  deviceId: 'smarthom_simulator',
  mqttUsername: 'hivemq.webclient.1755853800111',  // HiveMQ Cloud username
  mqttPassword: 'C0?E3iw9Xd&1F:Z<qHsg',  // HiveMQ Cloud password
  connectionTimeout: 15000, // 15 seconds
  retryAttempts: 3,
};

export default ESP32Service;
