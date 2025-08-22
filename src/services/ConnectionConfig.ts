import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ConnectionConfig {
  esp32IpAddress: string;
  mqttPort: number;
  httpPort: number;
  deviceId: string;
  mqttUsername: string;
  mqttPassword: string;
}

const DEFAULT_CONFIG: ConnectionConfig = {
  esp32IpAddress: '08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud', // HiveMQ Cloud
  mqttPort: 8883, // SSL port
  httpPort: 443, // HTTPS port
  deviceId: 'smarthom_simulator',
  mqttUsername: 'hivemq.webclient.1755853800111',
  mqttPassword: 'C0?E3iw9Xd&1F:Z<qHsg',
};

class ConnectionConfigService {
  private static instance: ConnectionConfigService;
  private config: ConnectionConfig = DEFAULT_CONFIG;

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): ConnectionConfigService {
    if (!ConnectionConfigService.instance) {
      ConnectionConfigService.instance = new ConnectionConfigService();
    }
    return ConnectionConfigService.instance;
  }

  private async loadConfig() {
    try {
      const savedConfig = await AsyncStorage.getItem('connectionConfig');
      if (savedConfig) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Error loading connection config:', error);
    }
  }

  public async saveConfig(config: Partial<ConnectionConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...config };
      await AsyncStorage.setItem('connectionConfig', JSON.stringify(this.config));
      console.log('✅ Connection config saved:', this.config);
    } catch (error) {
      console.error('Error saving connection config:', error);
    }
  }

  public getConfig(): ConnectionConfig {
    return { ...this.config };
  }

  public getMqttBroker(): string {
    return this.config.esp32IpAddress;
  }

  public getHttpEndpoint(): string {
    return `https://${this.config.esp32IpAddress}`;
  }

  public async updateEsp32IpAddress(ipAddress: string): Promise<void> {
    await this.saveConfig({ esp32IpAddress: ipAddress });
  }

  public async resetToDefaults(): Promise<void> {
    this.config = { ...DEFAULT_CONFIG };
    await AsyncStorage.removeItem('connectionConfig');
    console.log('🔄 Connection config reset to defaults');
  }

  // Helper method to validate IP address
  public static isValidIpAddress(ip: string): boolean {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  }

  // Helper method to scan for ESP32 devices on network
  public static async scanForEsp32Devices(): Promise<string[]> {
    const commonPorts = [80, 1883, 8080];
    const possibleIps: string[] = [];
    
    // Generate possible IP addresses in common ranges
    for (let i = 1; i <= 254; i++) {
      possibleIps.push(`192.168.1.${i}`);
      possibleIps.push(`192.168.0.${i}`);
      possibleIps.push(`10.0.0.${i}`);
    }

    const foundDevices: string[] = [];

    // Test each IP address
    for (const ip of possibleIps.slice(0, 50)) { // Limit to first 50 for performance
      try {
        const response = await fetch(`http://${ip}`, {
          method: 'GET',
          timeout: 2000,
        });
        
        if (response.ok) {
          foundDevices.push(ip);
          console.log(`🔍 Found device at ${ip}`);
        }
      } catch (error) {
        // Device not found or not responding
      }
    }

    return foundDevices;
  }
}

export default ConnectionConfigService;
