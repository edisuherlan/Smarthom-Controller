declare module 'react-native-mqtt' {
  interface MqttClient {
    connect(): Promise<void>;
    disconnect(): void;
    publish(topic: string, message: string, options?: any): void;
    subscribe(topic: string, options?: any): void;
    unsubscribe(topic: string): void;
    on(event: string, callback: (topic: string, message: string) => void): void;
    end(): void;
  }

  interface MqttOptions {
    host: string;
    port: number;
    clientId: string;
    username?: string;
    password?: string;
    keepalive?: number;
    clean?: boolean;
    reconnectPeriod?: number;
    connectTimeout?: number;
    rejectUnauthorized?: boolean;
  }

  function connect(options: MqttOptions): MqttClient;
  
  export default {
    connect
  };
}

