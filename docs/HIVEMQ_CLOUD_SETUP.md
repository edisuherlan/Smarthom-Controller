# ☁️ HIVEMQ CLOUD SETUP GUIDE - SMARTHOM

## 🎯 **OVERVIEW**

Panduan lengkap untuk setup HiveMQ Cloud versi gratis untuk sistem SMARTHOM. HiveMQ Cloud menyediakan MQTT broker yang reliable, secure, dan scalable tanpa biaya bulanan.

---

## 🚀 **STEP 1: DAFTAR HIVEMQ CLOUD**

### **1.1 Buka Website HiveMQ Cloud**
```
https://www.hivemq.com/cloud/
```

### **1.2 Klik "Get Started Free"**
- Pilih plan **"Cloud Starter"** (Gratis)
- Klik "Start Free Trial"

### **1.3 Buat Akun**
- Masukkan email Anda
- Buat password yang kuat
- Verifikasi email

---

## 🏗️ **STEP 2: BUAT CLUSTER**

### **2.1 Login ke Console**
- Login ke https://console.hivemq.cloud/
- Klik "Create Cluster"

### **2.2 Konfigurasi Cluster**
```
Cluster Name: smarthom-cluster
Region: Asia Pacific (Singapore) - s1
Plan: Cloud Starter (Free)
```

### **2.3 Tunggu Deployment**
- Proses deployment memakan waktu 2-5 menit
- Status akan berubah dari "Creating" ke "Running"

---

## 🔑 **STEP 3: DAPATKAN CREDENTIALS**

### **3.1 Klik Cluster yang Sudah Dibuat**
- Masuk ke detail cluster
- Klik tab "Connect"

### **3.2 Catat Informasi Penting**
```
Broker URL: your-cluster-id.s1.eu.hivemq.cloud
Port: 8883 (SSL) atau 8884 (WebSocket)
Username: your-username
Password: your-password
```

### **3.3 Test Connection**
- Klik "Test Connection" untuk memastikan cluster berfungsi
- Status harus "Connected"

---

## 🔧 **STEP 4: KONFIGURASI ESP32**

### **4.1 Update Kode ESP32**
Buka file `examples/ESP32_HIVEMQ_CLIENT.ino` dan update konfigurasi:

```cpp
// WiFi Configuration (Connect ke WiFi lokal)
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// HiveMQ Cloud Configuration
const char* mqtt_server = "your-cluster-id.s1.eu.hivemq.cloud";  // Ganti dengan cluster ID Anda
const int mqtt_port = 8883;  // SSL port
const char* mqtt_username = "your-username";  // Ganti dengan username Anda
const char* mqtt_password = "your-password";  // Ganti dengan password Anda
```

### **4.2 Upload ke ESP32**
1. Buka Arduino IDE
2. Load file `ESP32_HIVEMQ_CLIENT.ino`
3. Update konfigurasi WiFi dan HiveMQ
4. Upload ke ESP32
5. Monitor serial output

---

## 📱 **STEP 5: KONFIGURASI MOBILE APP**

### **5.1 Update ESP32Service.ts**
Buka file `src/services/ESP32Service.ts` dan update:

```typescript
export const defaultESP32Config: ESP32Config = {
  mqttBroker: 'your-cluster-id.s1.eu.hivemq.cloud',  // HiveMQ Cloud cluster ID
  mqttPort: 8883,  // SSL port
  mqttClientId: 'smarthom_mobile_' + Date.now(),
  httpEndpoint: 'https://your-cluster-id.s1.eu.hivemq.cloud',  // HTTPS endpoint
  deviceId: 'smarthom_simulator',
  mqttUsername: 'your-username',  // HiveMQ Cloud username
  mqttPassword: 'your-password',  // HiveMQ Cloud password
  connectionTimeout: 15000,
  retryAttempts: 3,
};
```

### **5.2 Build dan Test**
```bash
# Build aplikasi
npx react-native run-android

# Test koneksi
# Buka app dan coba connect ke HiveMQ Cloud
```

---

## 🧪 **STEP 6: TESTING**

### **6.1 Test ESP32 Connection**
Monitor serial output ESP32:
```
SMARTHOM ESP32 HiveMQ Cloud Client Starting...
WiFi connected
IP address: 192.168.1.100
MQTT Client setup completed
Broker: your-cluster-id.s1.eu.hivemq.cloud:8883
Attempting MQTT connection to HiveMQ Cloud...connected
```

### **6.2 Test Mobile App**
1. Buka aplikasi SMARTHOM
2. Klik "Connect WiFi"
3. Status harus "Connected to HiveMQ Cloud"
4. Test kontrol motor

### **6.3 Test MQTT Messages**
Gunakan MQTT Explorer atau HiveMQ Web Client:

**Publish Command:**
```json
{
  "type": "movement",
  "direction": "forward",
  "speed": 50,
  "timestamp": 1703123456789,
  "deviceId": "smarthom_simulator"
}
```

**Topic:** `smarthom/command`

---

## 📊 **STEP 7: MONITORING**

### **7.1 HiveMQ Cloud Console**
- Login ke https://console.hivemq.cloud/
- Klik cluster Anda
- Monitor:
  - **Connections** - Jumlah client yang connect
  - **Messages** - Jumlah pesan yang dikirim/diterima
  - **Topics** - Topic yang aktif

### **7.2 ESP32 Serial Monitor**
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

---

## 🔒 **SECURITY FEATURES**

### **SSL/TLS Encryption**
- Semua komunikasi dienkripsi dengan SSL/TLS
- Port 8883 untuk MQTT over SSL
- Port 8884 untuk MQTT over WebSocket

### **Authentication**
- Username/password authentication
- Client ID yang unik
- Rate limiting otomatis

### **Network Security**
- Firewall protection
- DDoS protection
- 99.9% uptime guarantee

---

## 📈 **PERFORMANCE & LIMITS**

### **Free Plan Limits:**
- **Connections:** 25 concurrent connections
- **Messages:** 1,000 messages per hour
- **Storage:** 1 GB message persistence
- **Support:** Community support

### **Upgrade Options:**
- **Cloud Professional:** $50/month
- **Cloud Enterprise:** Custom pricing
- **On-Premise:** Self-hosted solution

---

## 🚨 **TROUBLESHOOTING**

### **ESP32 Connection Issues:**

#### **1. WiFi Connection Failed**
```cpp
// Cek konfigurasi WiFi
const char* ssid = "YOUR_WIFI_SSID";        // Pastikan benar
const char* password = "YOUR_WIFI_PASSWORD"; // Pastikan benar
```

#### **2. MQTT Connection Failed**
```cpp
// Cek konfigurasi HiveMQ
const char* mqtt_server = "your-cluster-id.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;  // Pastikan port SSL
const char* mqtt_username = "your-username";
const char* mqtt_password = "your-password";
```

#### **3. SSL Certificate Error**
```cpp
// Tambahkan di setupMQTT()
espClient.setInsecure();  // Untuk development
```

### **Mobile App Issues:**

#### **1. Connection Timeout**
```typescript
// Increase timeout
connectionTimeout: 30000,  // 30 seconds
```

#### **2. SSL Certificate Error**
```typescript
// Di ESP32Service.ts
const mqttConfig = {
  rejectUnauthorized: false,  // Untuk development
};
```

### **HiveMQ Cloud Issues:**

#### **1. Cluster Not Running**
- Cek status di console
- Restart cluster jika perlu
- Contact support jika masalah berlanjut

#### **2. Rate Limit Exceeded**
- Upgrade ke plan berbayar
- Optimize message frequency
- Implement message queuing

---

## 📋 **CHECKLIST SETUP**

### **HiveMQ Cloud:**
- [ ] Daftar akun HiveMQ Cloud
- [ ] Buat cluster baru
- [ ] Catat credentials
- [ ] Test connection
- [ ] Monitor dashboard

### **ESP32:**
- [ ] Update WiFi credentials
- [ ] Update HiveMQ credentials
- [ ] Upload kode baru
- [ ] Test WiFi connection
- [ ] Test MQTT connection
- [ ] Test motor control

### **Mobile App:**
- [ ] Update ESP32Service.ts
- [ ] Build aplikasi
- [ ] Test connection
- [ ] Test motor control
- [ ] Test emergency stop

### **Integration:**
- [ ] Test end-to-end communication
- [ ] Monitor message flow
- [ ] Test error handling
- [ ] Verify security

---

## 🔗 **USEFUL LINKS**

### **HiveMQ Resources:**
- 📖 **Documentation:** https://www.hivemq.com/docs/
- 🛠️ **MQTT Explorer:** https://mqtt-explorer.com/
- 🌐 **Web Client:** https://www.hivemq.com/demos/websocket-client/
- 📧 **Support:** https://www.hivemq.com/support/

### **SMARTHOM Resources:**
- 📖 `docs/PIN_GUIDE.md` - Pin configuration
- 📖 `docs/PIN_MAPPING.md` - Hardware mapping
- 📖 `docs/MQTT_BROKER_GUIDE.md` - MQTT setup
- 🔧 `examples/ESP32_HIVEMQ_CLIENT.ino` - ESP32 code

---

## 💡 **BEST PRACTICES**

### **1. Security:**
- Gunakan password yang kuat
- Jangan share credentials
- Monitor connection logs
- Update credentials secara berkala

### **2. Performance:**
- Optimize message size
- Implement QoS levels
- Use retained messages sparingly
- Monitor rate limits

### **3. Reliability:**
- Implement reconnection logic
- Handle connection errors
- Use heartbeat messages
- Monitor system health

### **4. Development:**
- Test di environment terpisah
- Use unique client IDs
- Implement proper error handling
- Log semua aktivitas penting

---

*HiveMQ Cloud Setup Guide ini dibuat untuk SMARTHOM v1.0 - Ikuti langkah-langkah di atas untuk setup yang sukses.*
