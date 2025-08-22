# 📋 PANDUAN PIN DAN KODE SMARTHOM

## 🎯 **OVERVIEW**
Aplikasi SMARTHOM adalah sistem kontrol alat simulasi persalinan yang menggunakan ESP32 sebagai microcontroller utama. Aplikasi ini mendukung koneksi WiFi dan Bluetooth untuk kontrol jarak jauh.

---

## 🔌 **KONFIGURASI PIN ESP32**

### **Pin Motor Control (Pergerakan Simulator)**
```cpp
// Pin untuk kontrol motor DC
#define MOTOR_FORWARD_PIN  26    // Pin untuk motor maju
#define MOTOR_BACKWARD_PIN 27    // Pin untuk motor mundur
#define MOTOR_LEFT_PIN     25    // Pin untuk motor kiri
#define MOTOR_RIGHT_PIN    33    // Pin untuk motor kanan

// Pin untuk kontrol kecepatan (PWM)
#define MOTOR_SPEED_PIN    32    // Pin PWM untuk kontrol kecepatan motor
#define PWM_CHANNEL        0     // Channel PWM yang digunakan
#define PWM_FREQ          5000   // Frekuensi PWM (5kHz)
#define PWM_RESOLUTION     8     // Resolusi PWM (8-bit = 0-255)
```

### **Pin Sensor dan Monitoring**
```cpp
// Pin untuk sensor suhu
#define TEMP_SENSOR_PIN    34    // Pin analog untuk sensor suhu

// Pin untuk monitoring baterai
#define BATTERY_MONITOR_PIN 35   // Pin analog untuk monitoring level baterai

// Pin untuk LED status
#define STATUS_LED_PIN     2     // Pin untuk LED status koneksi
#define ERROR_LED_PIN      4     // Pin untuk LED error

// Pin untuk buzzer/alarm
#define BUZZER_PIN         5     // Pin untuk buzzer emergency
```

### **Pin Koneksi Komunikasi**
```cpp
// Pin untuk komunikasi serial (debug)
#define UART_TX_PIN        17    // Pin TX untuk komunikasi serial
#define UART_RX_PIN        16    // Pin RX untuk komunikasi serial

// Pin untuk WiFi (built-in)
// ESP32 memiliki WiFi built-in, tidak memerlukan pin eksternal

// Pin untuk Bluetooth (built-in)
// ESP32 memiliki Bluetooth built-in, tidak memerlukan pin eksternal
```

---

## 📱 **STRUKTUR KODE APLIKASI MOBILE**

### **1. State Management (Pengelolaan State)**
```typescript
// State untuk kecepatan simulator
const [currentSpeed, setCurrentSpeed] = useState(50);

// State untuk informasi koneksi
const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
  type: 'none',           // Jenis koneksi: 'wifi' | 'bluetooth' | 'none'
  status: 'disconnected', // Status: 'connected' | 'connecting' | 'disconnected' | 'error'
  signalStrength: 0,      // Kekuatan sinyal (0-100%)
  deviceName: undefined,  // Nama device yang terhubung
});

// State untuk status simulator
const [simulatorStatus, setSimulatorStatus] = useState<SimulatorStatus | null>(null);

// State untuk konfigurasi ESP32
const [esp32IpAddress, setEsp32IpAddress] = useState('192.168.1.100');
```

### **2. Fungsi Koneksi WiFi**
```typescript
const connectWiFi = async (): Promise<boolean> => {
  try {
    console.log('🔗 Attempting WiFi connection...');
    
    // Mencoba koneksi ke ESP32
    const success = await esp32Service.connect();
    
    if (success) {
      // Update status koneksi
      setConnectionInfo({
        type: 'wifi',
        status: 'connected',
        signalStrength: Math.floor(Math.random() * 40) + 60, // 60-100%
        deviceName: 'SMARTHOM_Simulator',
      });
      
      // Mulai polling status
      startStatusPolling();
      console.log('✅ WiFi connection successful');
    } else {
      console.log('❌ WiFi connection failed');
    }
    return success;
  } catch (error) {
    console.error('💥 WiFi connection error:', error);
    return false;
  }
};
```

### **3. Fungsi Kontrol Pergerakan**
```typescript
const handleControlPress = async (direction: string) => {
  // Cek apakah sudah terhubung
  if (connectionInfo.status !== 'connected') {
    Alert.alert('Not Connected', 'Please connect to the simulator first.');
    return;
  }

  let success = false;
  switch (direction) {
    case 'forward':   // Motor maju - Pin 26
      success = await esp32Service.moveForward(currentSpeed);
      break;
    case 'backward':  // Motor mundur - Pin 27
      success = await esp32Service.moveBackward(currentSpeed);
      break;
    case 'left':      // Motor kiri - Pin 25
      success = await esp32Service.moveLeft(currentSpeed);
      break;
    case 'right':     // Motor kanan - Pin 33
      success = await esp32Service.moveRight(currentSpeed);
      break;
    case 'stop':      // Stop semua motor
      success = await esp32Service.stop();
      break;
    default:
      console.log(`Unknown direction: ${direction}`);
      return;
  }

  if (!success) {
    Alert.alert('Command Failed', 'Failed to send command to simulator. Please try again.');
  }
};
```

### **4. Fungsi Kontrol Kecepatan**
```typescript
const handleSpeedChange = async (newSpeed: number) => {
  setCurrentSpeed(newSpeed);
  
  if (connectionInfo.status === 'connected') {
    // Kirim perintah ke ESP32 untuk mengubah kecepatan
    // ESP32 akan mengubah duty cycle PWM pada Pin 32
    const success = await esp32Service.setSpeed(newSpeed);
    
    if (!success) {
      Alert.alert('Speed Update Failed', 'Failed to update speed on simulator.');
    }
  }
};
```

---

## 🔧 **KONFIGURASI ESP32 SERVICE**

### **Default Configuration**
```typescript
export const defaultESP32Config: ESP32Config = {
  mqttBroker: '192.168.1.100',    // IP Address ESP32
  mqttPort: 1883,                 // Port MQTT default
  mqttClientId: 'smarthom_mobile', // ID client MQTT
  httpEndpoint: 'http://192.168.1.100', // Endpoint HTTP ESP32
  deviceId: 'smarthom_simulator', // ID device
  mqttUsername: 'smarthom',       // Username MQTT
  mqttPassword: 'simulator123',   // Password MQTT
  connectionTimeout: 15000,       // Timeout koneksi (15 detik)
  retryAttempts: 3,               // Jumlah percobaan koneksi
};
```

### **Format Command yang Dikirim ke ESP32**
```typescript
interface SimulatorCommand {
  type: 'movement' | 'speed' | 'status' | 'emergency_stop';
  direction?: 'forward' | 'backward' | 'left' | 'right' | 'stop';
  speed?: number;        // 0-100 (akan dikonversi ke duty cycle PWM)
  timestamp: number;     // Timestamp command
}

// Contoh command untuk motor maju dengan kecepatan 75%
{
  type: 'movement',
  direction: 'forward',
  speed: 75,
  timestamp: 1703123456789
}
```

---

## 📊 **MONITORING DAN STATUS**

### **Status Simulator yang Diterima dari ESP32**
```typescript
interface SimulatorStatus {
  battery: number;       // Level baterai (0-100%) - Pin 35
  speed: number;         // Kecepatan saat ini (0-100%) - Pin 32
  position: {
    x: number;           // Posisi X (jika ada encoder)
    y: number;           // Posisi Y (jika ada encoder)
    z: number;           // Posisi Z (jika ada encoder)
  };
  status: 'idle' | 'moving' | 'error' | 'emergency';
  temperature: number;   // Suhu (dalam Celsius) - Pin 34
  lastCommand: string;   // Command terakhir yang diterima
}
```

### **Polling Status**
```typescript
const startStatusPolling = () => {
  const pollInterval = setInterval(async () => {
    if (connectionInfo.status === 'connected') {
      // Ambil status dari ESP32 setiap 2 detik
      const status = await esp32Service.getStatus();
      if (status) {
        setSimulatorStatus(status);
      }
    } else {
      clearInterval(pollInterval);
    }
  }, 2000); // Poll setiap 2 detik
};
```

---

## 🚨 **EMERGENCY STOP**

### **Fungsi Emergency Stop**
```typescript
const handleEmergencyStop = async () => {
  if (connectionInfo.status === 'connected') {
    // Kirim command emergency stop ke ESP32
    const success = await esp32Service.emergencyStop();
    
    if (success) {
      // ESP32 akan:
      // 1. Stop semua motor (Pin 26, 27, 25, 33)
      // 2. Aktifkan buzzer (Pin 5)
      // 3. Nyalakan LED error (Pin 4)
      Alert.alert('Emergency Stop', 'Emergency stop activated!');
    } else {
      Alert.alert('Emergency Stop Failed', 'Failed to activate emergency stop.');
    }
  }
};
```

---

## ⚙️ **PENGATURAN KONEKSI**

### **Scan Network untuk ESP32**
```typescript
const scanForDevices = async () => {
  Alert.alert('Scanning Network', 'Looking for ESP32 devices... This may take a moment.');
  
  try {
    // Scan IP range untuk mencari ESP32
    const devices = await ConnectionConfigService.scanForEsp32Devices();
    
    if (devices.length > 0) {
      Alert.alert(
        'Devices Found',
        `Found ${devices.length} device(s):\n${devices.join('\n')}\n\nPlease update the IP address in settings.`
      );
    } else {
      Alert.alert('No Devices Found', 'No ESP32 devices found on the network. Please check your connection.');
    }
  } catch (error) {
    Alert.alert('Scan Error', 'Failed to scan for devices. Please try again.');
  }
};
```

### **Validasi IP Address**
```typescript
public static isValidIpAddress(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}
```

---

## 🔄 **FLOW KONEKSI LENGKAP**

### **1. Inisialisasi**
```typescript
// Saat aplikasi dimulai
const [esp32Service] = useState(() => new ESP32Service(defaultESP32Config));
const [configService] = useState(() => ConnectionConfigService.getInstance());
```

### **2. Request Permission**
```typescript
const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,  // Untuk WiFi scanning
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,        // Untuk Bluetooth
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,     // Untuk Bluetooth
      ]);
      return Object.values(granted).every(
        (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};
```

### **3. Smart Connection**
```typescript
const smartConnect = async () => {
  // 1. Request permission
  const hasPermissions = await requestPermissions();
  if (!hasPermissions) {
    Alert.alert('Permission Required', 'Please grant necessary permissions to connect.');
    return;
  }

  // 2. Check WiFi availability
  const wifiAvailable = await checkWiFiAvailability();
  
  // 3. Show connection options
  Alert.alert(
    'Choose Connection Type',
    'Select your preferred connection method:',
    [
      {
        text: 'WiFi/IoT',
        onPress: async () => {
          if (wifiAvailable) {
            setConnectionInfo({ ...connectionInfo, status: 'connecting' });
            const success = await connectWiFi();
            if (!success) {
              Alert.alert('Connection Failed', 'Failed to connect via WiFi. Please try again.');
              setConnectionInfo({ ...connectionInfo, status: 'error' });
            }
          } else {
            Alert.alert('WiFi Unavailable', 'WiFi connection is not available. Please try Bluetooth.');
          }
        },
      },
      {
        text: 'Bluetooth',
        onPress: async () => {
          setConnectionInfo({ ...connectionInfo, status: 'connecting' });
          const success = await connectBluetooth();
          if (!success) {
            Alert.alert('Connection Failed', 'Failed to connect via Bluetooth. Please try again.');
            setConnectionInfo({ ...connectionInfo, status: 'error' });
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]
  );
};
```

---

## 📋 **CHECKLIST IMPLEMENTASI**

### **Hardware (ESP32)**
- [ ] Solder motor driver ke pin 26, 27, 25, 33
- [ ] Hubungkan sensor suhu ke pin 34
- [ ] Hubungkan voltage divider untuk monitoring baterai ke pin 35
- [ ] Pasang LED status di pin 2 dan 4
- [ ] Pasang buzzer di pin 5
- [ ] Konfigurasi PWM di pin 32 untuk kontrol kecepatan

### **Software (ESP32)**
- [ ] Setup WiFi Access Point atau Station mode
- [ ] Implementasi MQTT broker
- [ ] Setup HTTP server untuk fallback
- [ ] Implementasi motor control dengan PWM
- [ ] Setup sensor reading (suhu, baterai)
- [ ] Implementasi emergency stop

### **Mobile App**
- [ ] Setup React Native project
- [ ] Install dependencies (MQTT, AsyncStorage)
- [ ] Implementasi ESP32Service
- [ ] Setup UI components
- [ ] Implementasi connection management
- [ ] Testing koneksi dan kontrol

---

## 🚀 **TROUBLESHOOTING**

### **Masalah Koneksi**
1. **"Connection Failed"**
   - Cek IP address ESP32 di settings
   - Pastikan ESP32 dan HP dalam jaringan yang sama
   - Cek firewall/router settings

2. **"MQTT Connection Error"**
   - Cek MQTT broker berjalan di ESP32
   - Verifikasi username/password
   - Cek port 1883 tidak diblokir

3. **"HTTP Connection Error"**
   - Cek HTTP server berjalan di ESP32
   - Verifikasi endpoint URL
   - Cek port 80 tidak diblokir

### **Masalah Kontrol**
1. **Motor tidak bergerak**
   - Cek koneksi motor ke driver
   - Verifikasi pin motor di ESP32
   - Cek power supply motor

2. **Kecepatan tidak berubah**
   - Cek PWM configuration
   - Verifikasi pin PWM (32)
   - Cek duty cycle calculation

3. **Sensor tidak terbaca**
   - Cek koneksi sensor
   - Verifikasi pin analog
   - Cek ADC configuration

---

## 📞 **SUPPORT**

Untuk bantuan teknis atau pertanyaan lebih lanjut:
- Email: support@smarthom.com
- WhatsApp: +62-xxx-xxx-xxxx
- Documentation: https://docs.smarthom.com

---

*Dokumentasi ini dibuat untuk SMARTHOM v1.0 - Sistem Kontrol Alat Simulasi Persalinan*
