# 🔧 HIVEMQ CLOUD CONFIGURATION - SMARTHOM

## 📋 **KONFIGURASI YANG SUDAH DIUPDATE**

### **✅ HiveMQ Cloud Credentials:**
```
URL: 08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud
Port: 8883 (SSL)
Username: hivemq.webclient.1755853800111
Password: C0?E3iw9Xd&1F:Z<qHsg
```

---

## 🔧 **FILE YANG SUDAH DIUPDATE**

### **1. ESP32 Code (`examples/ESP32_HIVEMQ_CLIENT.ino`)**
```cpp
// HiveMQ Cloud Configuration
const char* mqtt_server = "08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;  // SSL port
const char* mqtt_username = "hivemq.webclient.1755853800111";
const char* mqtt_password = "C0?E3iw9Xd&1F:Z<qHsg";
```

### **2. Mobile App (`src/services/ESP32Service.ts`)**
```typescript
export const defaultESP32Config: ESP32Config = {
  mqttBroker: '08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud',
  mqttPort: 8883,  // SSL port
  mqttClientId: 'smarthom_mobile_' + Date.now(),
  httpEndpoint: 'https://08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud',
  deviceId: 'smarthom_simulator',
  mqttUsername: 'hivemq.webclient.1755853800111',
  mqttPassword: 'C0?E3iw9Xd&1F:Z<qHsg',
  connectionTimeout: 15000,
  retryAttempts: 3,
};
```

### **3. Connection Config (`src/services/ConnectionConfig.ts`)**
```typescript
const DEFAULT_CONFIG: ConnectionConfig = {
  esp32IpAddress: '08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud',
  mqttPort: 8883, // SSL port
  httpPort: 443, // HTTPS port
  deviceId: 'smarthom_simulator',
  mqttUsername: 'hivemq.webclient.1755853800111',
  mqttPassword: 'C0?E3iw9Xd&1F:Z<qHsg',
};
```

---

## 🚀 **LANGKAH SELANJUTNYA**

### **Step 1: Update WiFi Credentials di ESP32**
Buka file `examples/ESP32_HIVEMQ_CLIENT.ino` dan update:
```cpp
const char* ssid = "YOUR_WIFI_SSID";  // Ganti dengan WiFi SSID Anda
const char* password = "YOUR_WIFI_PASSWORD";  // Ganti dengan WiFi password Anda
```

### **Step 2: Upload ESP32 Code**
1. Buka Arduino IDE
2. Load file `examples/ESP32_HIVEMQ_CLIENT.ino`
3. Update WiFi credentials
4. Upload ke ESP32
5. Monitor serial output

### **Step 3: Build Mobile App**
```bash
# Build aplikasi
npx react-native run-android

# Atau untuk iOS
npx react-native run-ios
```

### **Step 4: Test Connection**
1. Buka aplikasi SMARTHOM
2. Klik "Connect WiFi"
3. Status harus "Connected to HiveMQ Cloud"
4. Test kontrol motor

---

## 🧪 **TESTING COMMANDS**

### **ESP32 Serial Monitor Commands:**
```bash
# Command yang tersedia:
status      - Kirim status update
emergency   - Emergency stop
wifi        - Cek status WiFi
mqtt        - Cek status MQTT
debug       - Info lengkap sistem
forward     - Test motor forward
backward    - Test motor backward
left        - Test motor left
right       - Test motor right
stop        - Stop semua motor
```

### **Expected ESP32 Output:**
```
SMARTHOM ESP32 HiveMQ Cloud Client Starting...
Pins initialized
Connecting to WiFi...
WiFi connected
IP address: 192.168.1.100
MQTT Client setup completed
Broker: 08051896871a4a2ca7130f5d4afb5811.s1.eu.hivemq.cloud:8883
Attempting MQTT connection to HiveMQ Cloud...connected
```

---

## 📊 **MONITORING HIVEMQ CLOUD**

### **HiveMQ Cloud Console:**
- Login: https://console.hivemq.cloud/
- Cluster: `08051896871a4a2ca7130f5d4afb5811`
- Monitor connections dan messages

### **MQTT Topics yang Digunakan:**
- `smarthom/command` - Commands dari mobile app
- `smarthom/response` - Responses dari ESP32
- `smarthom/status` - Status updates
- `smarthom/emergency` - Emergency notifications

---

## 🔒 **SECURITY NOTES**

### **SSL/TLS Configuration:**
- Port 8883 menggunakan SSL/TLS encryption
- Semua komunikasi dienkripsi
- Credentials aman dan terproteksi

### **Rate Limits (Free Plan):**
- 25 concurrent connections
- 1,000 messages per hour
- 1 GB message persistence

---

## 🚨 **TROUBLESHOOTING**

### **Jika ESP32 tidak connect:**
1. Cek WiFi credentials
2. Cek internet connection
3. Monitor serial output untuk error messages
4. Restart ESP32 jika perlu

### **Jika Mobile App tidak connect:**
1. Cek internet connection
2. Restart aplikasi
3. Cek console logs untuk error
4. Verify HiveMQ Cloud cluster status

### **Jika MQTT connection failed:**
1. Cek credentials di kode
2. Verify cluster status di HiveMQ console
3. Cek firewall settings
4. Test dengan MQTT Explorer

---

## 📞 **SUPPORT**

### **HiveMQ Cloud Support:**
- Documentation: https://www.hivemq.com/docs/
- Web Client: https://www.hivemq.com/demos/websocket-client/
- Support: https://www.hivemq.com/support/

### **SMARTHOM Resources:**
- 📖 `docs/PIN_GUIDE.md` - Pin configuration
- 📖 `docs/PIN_MAPPING.md` - Hardware mapping
- 📖 `docs/HIVEMQ_CLOUD_SETUP.md` - Setup guide

---

*Konfigurasi ini sudah diupdate untuk HiveMQ Cloud Anda. Selamat testing! 🎉*
