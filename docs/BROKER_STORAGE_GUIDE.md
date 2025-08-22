# 📍 MQTT BROKER STORAGE GUIDE - SMARTHOM

## 🎯 **OVERVIEW**

Panduan ini menjelaskan berbagai opsi penyimpanan MQTT broker untuk sistem SMARTHOM, termasuk lokasi, konfigurasi, dan implementasi yang direkomendasikan.

---

## 🏆 **REKOMENDASI UTAMA: ESP32 EMBEDDED BROKER**

### **📍 Lokasi: Langsung di ESP32**
```
ESP32 → MQTT Broker Embedded → Mobile App
```

### **✅ Keunggulan:**
- **Tidak perlu server terpisah**
- **Hemat biaya** (hanya ESP32)
- **Setup sederhana** (satu device)
- **Koneksi langsung** (WiFi AP)
- **Tidak bergantung internet**
- **Real-time communication**

### **🔧 Konfigurasi:**
```cpp
// ESP32 sebagai Access Point + MQTT Broker
const char* ap_ssid = "SMARTHOM_AP";
const char* ap_password = "smarthom123";
const char* mqtt_broker_ip = "192.168.4.1";  // IP ESP32
const int mqtt_port = 1883;
```

---

## 🏗️ **OPSI PENYIMPANAN BROKER**

### **1. 🏆 ESP32 Embedded Broker (REKOMENDASI)**

#### **Lokasi:** ESP32 Device
```cpp
// File: examples/ESP32_MQTT_BROKER_SERVER.ino
// ESP32 sebagai MQTT Broker + WiFi AP + Motor Control
```

#### **Fitur:**
- ✅ WiFi Access Point otomatis
- ✅ MQTT Broker embedded
- ✅ Web interface untuk kontrol
- ✅ Motor control langsung
- ✅ Sensor monitoring
- ✅ Emergency system

#### **Setup:**
1. Upload kode ke ESP32
2. ESP32 akan membuat WiFi AP "SMARTHOM_AP"
3. Connect HP ke WiFi AP
4. Akses web interface di `192.168.4.1`
5. Mobile app connect ke MQTT broker

#### **Keunggulan:**
- **Standalone system** - Tidak perlu device lain
- **Portable** - Bisa dibawa kemana-mana
- **Real-time** - Latency minimal
- **Secure** - Jaringan lokal
- **Cost-effective** - Hanya ESP32

---

### **2. 🖥️ Raspberry Pi Local Broker**

#### **Lokasi:** Raspberry Pi di jaringan lokal
```bash
# Install Mosquitto di Raspberry Pi
sudo apt update
sudo apt install mosquitto mosquitto-clients

# Konfigurasi
sudo nano /etc/mosquitto/mosquitto.conf
```

#### **Konfigurasi Mosquitto:**
```conf
# /etc/mosquitto/mosquitto.conf
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd
persistence true
persistence_location /var/lib/mosquitto/
log_dest file /var/log/mosquitto/mosquitto.log
log_type all
```

#### **Setup User:**
```bash
# Buat user untuk SMARTHOM
sudo mosquitto_passwd -c /etc/mosquitto/passwd smarthom
# Password: simulator123

# Restart service
sudo systemctl restart mosquitto
sudo systemctl enable mosquitto
```

#### **ESP32 Configuration:**
```cpp
// ESP32 sebagai client ke Raspberry Pi
const char* mqtt_server = "192.168.1.50";  // IP Raspberry Pi
const int mqtt_port = 1883;
const char* mqtt_username = "smarthom";
const char* mqtt_password = "simulator123";
```

#### **Keunggulan:**
- ✅ **Persistent storage** - Data tersimpan
- ✅ **Multiple clients** - Bisa handle banyak device
- ✅ **Advanced features** - QoS, retained messages
- ✅ **Monitoring** - Log dan analytics
- ✅ **Scalable** - Bisa expand

#### **Kekurangan:**
- ❌ **Perlu device tambahan** (Raspberry Pi)
- ❌ **Setup lebih kompleks**
- ❌ **Biaya tambahan**

---

### **3. ☁️ Cloud Broker (Internet)**

#### **Lokasi:** Server cloud (AWS, Google Cloud, dll)

#### **A. HiveMQ Public Broker:**
```cpp
// Free public broker
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_username = "";  // No authentication
const char* mqtt_password = "";
```

#### **B. Eclipse Mosquitto:**
```cpp
// Test broker
const char* mqtt_server = "test.mosquitto.org";
const int mqtt_port = 1883;
const char* mqtt_username = "";
const char* mqtt_password = "";
```

#### **C. AWS IoT Core:**
```cpp
// AWS IoT (perlu setup)
const char* mqtt_server = "your-aws-endpoint.amazonaws.com";
const int mqtt_port = 8883;  // SSL
const char* mqtt_username = "your-username";
const char* mqtt_password = "your-password";
```

#### **Keunggulan:**
- ✅ **Global access** - Akses dari mana saja
- ✅ **Reliable** - Uptime tinggi
- ✅ **Scalable** - Handle traffic besar
- ✅ **Advanced features** - Analytics, security

#### **Kekurangan:**
- ❌ **Bergantung internet**
- ❌ **Latency tinggi**
- ❌ **Biaya bulanan** (untuk paid service)
- ❌ **Security concerns** (untuk public broker)

---

## 📊 **PERBANDINGAN OPSI**

| Opsi | Lokasi | Biaya | Setup | Latency | Internet | Scalability |
|------|--------|-------|-------|---------|----------|-------------|
| **ESP32 Embedded** | ESP32 | Rendah | Mudah | Sangat Rendah | Tidak | Terbatas |
| **Raspberry Pi** | Local Network | Sedang | Sedang | Rendah | Tidak | Baik |
| **Cloud Public** | Internet | Gratis | Mudah | Tinggi | Ya | Sangat Baik |
| **Cloud Private** | Internet | Tinggi | Kompleks | Tinggi | Ya | Sangat Baik |

---

## 🚀 **IMPLEMENTASI REKOMENDASI**

### **Step 1: Upload ESP32 Broker Code**
```bash
# 1. Buka Arduino IDE
# 2. Upload file: examples/ESP32_MQTT_BROKER_SERVER.ino
# 3. Monitor serial output
```

### **Step 2: Connect ke ESP32**
```bash
# ESP32 akan membuat WiFi AP:
# SSID: SMARTHOM_AP
# Password: smarthom123
# IP: 192.168.4.1
```

### **Step 3: Test Koneksi**
```bash
# Test dari terminal
mosquitto_pub -h 192.168.4.1 -p 1883 -t "smarthom/command" -m '{"type":"movement","direction":"forward","speed":50,"timestamp":1703123456789,"deviceId":"smarthom_simulator"}'
```

### **Step 4: Mobile App Configuration**
```typescript
// src/services/ESP32Service.ts
export const defaultESP32Config: ESP32Config = {
  mqttBroker: '192.168.4.1',     // ESP32 AP IP
  mqttPort: 1883,
  mqttClientId: 'smarthom_mobile',
  httpEndpoint: 'http://192.168.4.1',
  deviceId: 'smarthom_simulator',
  mqttUsername: 'smarthom',
  mqttPassword: 'simulator123',
  connectionTimeout: 15000,
  retryAttempts: 3,
};
```

---

## 🔧 **KONFIGURASI LANJUTAN**

### **1. ESP32 Broker dengan Storage**

#### **A. SPIFFS Storage (untuk logs):**
```cpp
#include <SPIFFS.h>

// Setup SPIFFS
if (!SPIFFS.begin(true)) {
  Serial.println("SPIFFS Mount Failed");
  return;
}

// Simpan log ke file
void saveLog(String message) {
  File file = SPIFFS.open("/mqtt_log.txt", FILE_APPEND);
  if (file) {
    file.println(message);
    file.close();
  }
}
```

#### **B. EEPROM Storage (untuk config):**
```cpp
#include <EEPROM.h>

// Simpan konfigurasi
void saveConfig() {
  EEPROM.put(0, config);
  EEPROM.commit();
}

// Load konfigurasi
void loadConfig() {
  EEPROM.get(0, config);
}
```

### **2. Raspberry Pi dengan Database**

#### **A. SQLite Database:**
```bash
# Install SQLite
sudo apt install sqlite3

# Buat database
sqlite3 /var/lib/mosquitto/smarthom.db

# Tabel untuk menyimpan data
CREATE TABLE sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperature REAL,
    battery_level REAL,
    speed INTEGER,
    status TEXT
);
```

#### **B. InfluxDB (untuk time-series data):**
```bash
# Install InfluxDB
wget https://dl.influxdata.com/influxdb/releases/influxdb2-2.7.1-linux-amd64.tar.gz
tar xvzf influxdb2-2.7.1-linux-amd64.tar.gz
cd influxdb2-2.7.1
./influxd
```

---

## 📱 **MOBILE APP INTEGRATION**

### **1. Connection Configuration**
```typescript
// src/services/ConnectionConfig.ts
export class ConnectionConfigService {
  static async getDefaultConfig(): Promise<ESP32Config> {
    return {
      mqttBroker: '192.168.4.1',  // ESP32 AP IP
      mqttPort: 1883,
      mqttClientId: 'smarthom_mobile_' + Date.now(),
      httpEndpoint: 'http://192.168.4.1',
      deviceId: 'smarthom_simulator',
      mqttUsername: 'smarthom',
      mqttPassword: 'simulator123',
      connectionTimeout: 15000,
      retryAttempts: 3,
    };
  }
}
```

### **2. Auto-Discovery**
```typescript
// Scan untuk ESP32 di jaringan
static async scanForEsp32Devices(): Promise<string[]> {
  const devices: string[] = [];
  
  // Scan IP range 192.168.4.x
  for (let i = 1; i <= 10; i++) {
    const ip = `192.168.4.${i}`;
    try {
      const response = await fetch(`http://${ip}/status`, {
        method: 'GET',
        timeout: 1000,
      });
      if (response.ok) {
        devices.push(ip);
      }
    } catch (error) {
      // IP tidak aktif
    }
  }
  
  return devices;
}
```

---

## 🔒 **SECURITY CONSIDERATIONS**

### **1. ESP32 Embedded Broker**
```cpp
// WPA2 Encryption untuk WiFi AP
WiFi.softAP(ap_ssid, ap_password, ap_channel, ap_hidden, ap_max_connection);

// MQTT Authentication
const char* mqtt_username = "smarthom";
const char* mqtt_password = "simulator123";

// Rate limiting
unsigned long lastCommandTime = 0;
const unsigned long COMMAND_INTERVAL = 100; // 100ms minimum interval
```

### **2. Raspberry Pi Broker**
```bash
# SSL/TLS Configuration
sudo nano /etc/mosquitto/mosquitto.conf

# Tambahkan:
listener 8883
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
```

### **3. Cloud Broker**
```typescript
// TLS/SSL Connection
const mqttConfig = {
  host: 'broker.hivemq.com',
  port: 8883,  // SSL port
  protocol: 'mqtts',
  username: 'your-username',
  password: 'your-password',
  rejectUnauthorized: false,
};
```

---

## 📋 **CHECKLIST IMPLEMENTASI**

### **ESP32 Embedded Broker:**
- [ ] Upload `ESP32_MQTT_BROKER_SERVER.ino`
- [ ] Test WiFi AP creation
- [ ] Test MQTT broker functionality
- [ ] Test web interface
- [ ] Test mobile app connection
- [ ] Test motor control
- [ ] Test sensor reading
- [ ] Test emergency stop

### **Raspberry Pi Broker:**
- [ ] Install Mosquitto
- [ ] Configure authentication
- [ ] Setup SSL certificates
- [ ] Configure persistence
- [ ] Test MQTT connection
- [ ] Setup monitoring
- [ ] Configure backup

### **Cloud Broker:**
- [ ] Choose cloud provider
- [ ] Setup MQTT broker
- [ ] Configure authentication
- [ ] Setup SSL/TLS
- [ ] Test connection
- [ ] Monitor usage
- [ ] Setup alerts

---

## 🚨 **TROUBLESHOOTING**

### **ESP32 Broker Issues:**
1. **WiFi AP tidak muncul**
   - Cek kode setupWiFiAP()
   - Restart ESP32
   - Cek power supply

2. **MQTT connection failed**
   - Cek IP address (192.168.4.1)
   - Cek port 1883
   - Cek firewall settings

3. **Mobile app tidak connect**
   - Pastikan HP connect ke WiFi AP
   - Cek IP address di app
   - Restart mobile app

### **Raspberry Pi Broker Issues:**
1. **Mosquitto tidak start**
   - Cek konfigurasi file
   - Cek log: `sudo journalctl -u mosquitto`
   - Restart service

2. **Authentication failed**
   - Cek password file
   - Recreate user: `sudo mosquitto_passwd -c /etc/mosquitto/passwd smarthom`

### **Cloud Broker Issues:**
1. **Connection timeout**
   - Cek internet connection
   - Cek broker endpoint
   - Cek firewall settings

2. **SSL certificate error**
   - Update certificates
   - Use `rejectUnauthorized: false` for testing

---

## 📞 **SUPPORT & RESOURCES**

### **Documentation:**
- 📖 `docs/MQTT_BROKER_GUIDE.md` - MQTT setup guide
- 📖 `docs/PIN_GUIDE.md` - Pin configuration
- 📖 `docs/PIN_MAPPING.md` - Hardware mapping

### **Code Examples:**
- 🔧 `examples/ESP32_MQTT_BROKER_SERVER.ino` - Complete broker
- 🔧 `examples/ESP32_SMARTHOM_BROKER.ino` - Client only

### **Tools:**
- 🛠️ **MQTT Explorer** - GUI client
- 🛠️ **Mosquitto CLI** - Command line tools
- 🛠️ **Arduino IDE** - ESP32 programming

---

*Broker Storage Guide ini dibuat untuk SMARTHOM v1.0 - Pilih opsi yang sesuai dengan kebutuhan dan budget Anda.*
