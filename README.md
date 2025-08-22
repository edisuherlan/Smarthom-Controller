# 🏠 SMARTHOM - Sistem Kontrol Alat Simulasi Persalinan

## 📋 **OVERVIEW**

SMARTHOM adalah aplikasi mobile React Native untuk mengontrol alat simulasi persalinan menggunakan ESP32 sebagai microcontroller. Aplikasi ini mendukung koneksi WiFi dan Bluetooth untuk kontrol jarak jauh dengan interface yang user-friendly.

## 🎯 **FITUR UTAMA**

- ✅ **Kontrol Pergerakan:** Maju, mundur, kiri, kanan, stop
- ✅ **Kontrol Kecepatan:** 0-100% dengan PWM
- ✅ **Koneksi Ganda:** WiFi dan Bluetooth
- ✅ **Monitoring Real-time:** Suhu, baterai, status
- ✅ **Emergency Stop:** Penghentian darurat
- ✅ **UI Modern:** Interface yang intuitif dan responsif
- ✅ **Konfigurasi Fleksibel:** IP address yang dapat diubah
- ✅ **Scan Network:** Otomatis mencari ESP32 di jaringan

## 🔌 **HARDWARE REQUIREMENTS**

### **ESP32 Development Board**
- ESP32 DevKit V1 atau kompatibel
- WiFi dan Bluetooth built-in
- 18 GPIO pins yang dapat dikonfigurasi

### **Motor Control**
- 4x Motor DC 12V (untuk pergerakan)
- L298N atau L293D Motor Driver
- Power supply 12V untuk motor

### **Sensors**
- LM35 Temperature Sensor
- Voltage divider untuk monitoring baterai
- LED indicators (status dan error)
- Active buzzer untuk alarm

## 📱 **SOFTWARE REQUIREMENTS**

### **Mobile App**
- React Native 0.81.0+
- Node.js 20.19.4+
- Android Studio / Xcode
- Android SDK / iOS SDK

### **Dependencies**
```json
{
  "react-native-mqtt": "^2.0.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-safe-area-context": "^4.8.0"
}
```

## 🚀 **INSTALASI & SETUP**

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/smarthom.git
cd smarthom
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Setup ESP32**
1. Upload kode ESP32 ke board
2. Konfigurasi WiFi credentials
3. **Setup MQTT broker (HiveMQ Cloud recommended)**
4. Test koneksi

### **4. Setup MQTT Broker (HiveMQ Cloud)**
1. Daftar di https://www.hivemq.com/cloud/
2. Buat cluster gratis
3. Dapatkan credentials
4. Update konfigurasi di ESP32 dan mobile app
5. Lihat panduan lengkap di [`docs/HIVEMQ_CLOUD_SETUP.md`](docs/HIVEMQ_CLOUD_SETUP.md)

### **5. Run Mobile App**
```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

## 📚 **DOKUMENTASI**

### **📖 Panduan Lengkap**
- [`docs/PIN_GUIDE.md`](docs/PIN_GUIDE.md) - Panduan lengkap pin dan kode
- [`docs/PIN_MAPPING.md`](docs/PIN_MAPPING.md) - Mapping pin ESP32 detail
- [`docs/MQTT_BROKER_GUIDE.md`](docs/MQTT_BROKER_GUIDE.md) - Setup MQTT broker
- [`docs/BROKER_STORAGE_GUIDE.md`](docs/BROKER_STORAGE_GUIDE.md) - Opsi penyimpanan broker
- [`docs/HIVEMQ_CLOUD_SETUP.md`](docs/HIVEMQ_CLOUD_SETUP.md) - **Setup HiveMQ Cloud (Rekomendasi)**

### **🔧 Struktur Kode**
```
src/
├── screens/
│   └── HomeScreen.tsx          # Main control interface
├── services/
│   ├── ESP32Service.ts         # ESP32 communication service
│   └── ConnectionConfig.ts     # Connection configuration
├── components/                 # Reusable UI components
└── types/                      # TypeScript type definitions
```

## 🔌 **PIN CONFIGURATION**

### **Motor Control Pins**
| Pin | Function | Description |
|-----|----------|-------------|
| **26** | `MOTOR_FORWARD_PIN` | Motor Maju |
| **27** | `MOTOR_BACKWARD_PIN` | Motor Mundur |
| **25** | `MOTOR_LEFT_PIN` | Motor Kiri |
| **33** | `MOTOR_RIGHT_PIN` | Motor Kanan |
| **32** | `MOTOR_SPEED_PIN` | PWM Kecepatan |

### **Sensor Pins**
| Pin | Function | Description |
|-----|----------|-------------|
| **34** | `TEMP_SENSOR_PIN` | Sensor Suhu |
| **35** | `BATTERY_MONITOR_PIN` | Monitoring Baterai |

### **Indicator Pins**
| Pin | Function | Description |
|-----|----------|-------------|
| **2** | `STATUS_LED_PIN` | LED Status |
| **4** | `ERROR_LED_PIN` | LED Error |
| **5** | `BUZZER_PIN` | Buzzer Emergency |

## 🔄 **FLOW KONEKSI**

### **1. Inisialisasi**
```typescript
// Setup ESP32 service dengan konfigurasi default
const [esp32Service] = useState(() => new ESP32Service(defaultESP32Config));
```

### **2. Request Permission**
```typescript
// Request permission untuk WiFi dan Bluetooth
const hasPermissions = await requestPermissions();
```

### **3. Smart Connection**
```typescript
// Coba koneksi WiFi, fallback ke Bluetooth
const success = await esp32Service.connect();
```

### **4. Control Commands**
```typescript
// Kirim command ke ESP32
await esp32Service.moveForward(speed);
await esp32Service.setSpeed(75);
```

## 🎮 **CARA PENGGUNAAN**

### **1. Koneksi**
1. Buka aplikasi SMARTHOM
2. Tap "🔗 Connect" di bagian Status Koneksi
3. Pilih "WiFi/IoT" atau "Bluetooth"
4. Tunggu hingga status berubah menjadi "Terhubung"

### **2. Kontrol Pergerakan**
1. Gunakan D-pad untuk kontrol arah:
   - **▲ MAJU** - Motor maju
   - **▼ MUNDUR** - Motor mundur
   - **◀ KIRI** - Motor kiri
   - **▶ KANAN** - Motor kanan
   - **STOP** - Hentikan semua motor

### **3. Kontrol Kecepatan**
1. Pilih kecepatan dari 0%, 25%, 50%, 75%, atau 100%
2. Kecepatan akan diterapkan ke semua motor

### **4. Emergency Stop**
1. Tap tombol "🔌 Disconnect" di header
2. Atau gunakan floating button merah di pojok kanan bawah
3. Semua motor akan berhenti segera

### **5. Konfigurasi**
1. Tap "⚙️ Konfigurasi ESP32" di pengaturan
2. Masukkan IP address ESP32
3. Tap "Simpan"

## ⚙️ **KONFIGURASI ESP32**

### **Default Configuration**
```cpp
// WiFi Configuration
const char* ssid = "SMARTHOM_WiFi";
const char* password = "smarthom123";

// MQTT Configuration
const char* mqtt_server = "192.168.1.100";
const int mqtt_port = 1883;
const char* mqtt_username = "smarthom";
const char* mqtt_password = "simulator123";
```

### **Pin Definitions**
```cpp
// Motor Control Pins
#define MOTOR_FORWARD_PIN  26
#define MOTOR_BACKWARD_PIN 27
#define MOTOR_LEFT_PIN     25
#define MOTOR_RIGHT_PIN    33
#define MOTOR_SPEED_PIN    32

// Sensor Pins
#define TEMP_SENSOR_PIN    34
#define BATTERY_MONITOR_PIN 35

// Indicator Pins
#define STATUS_LED_PIN     2
#define ERROR_LED_PIN      4
#define BUZZER_PIN         5
```

## 🚨 **TROUBLESHOOTING**

### **Masalah Koneksi**
1. **"Connection Failed"**
   - Cek IP address ESP32 di settings
   - Pastikan ESP32 dan HP dalam jaringan yang sama
   - Restart ESP32 dan aplikasi

2. **"MQTT Connection Error"**
   - Cek MQTT broker berjalan di ESP32
   - Verifikasi username/password
   - Cek port 1883 tidak diblokir

### **Masalah Kontrol**
1. **Motor tidak bergerak**
   - Cek koneksi motor ke driver
   - Verifikasi pin motor di ESP32
   - Cek power supply motor

2. **Kecepatan tidak berubah**
   - Cek PWM configuration
   - Verifikasi pin PWM (32)
   - Cek duty cycle calculation

## 🔧 **DEVELOPMENT**

### **Menambah Fitur Baru**
1. Update interface di `HomeScreen.tsx`
2. Tambah method di `ESP32Service.ts`
3. Update ESP32 firmware
4. Test fitur baru

### **Customization**
1. **UI Theme:** Edit `styles` di komponen
2. **Pin Mapping:** Update pin definitions
3. **MQTT Topics:** Modifikasi topic structure
4. **Commands:** Tambah command types baru

## 📋 **TESTING CHECKLIST**

### **Hardware Testing**
- [ ] Motor movement in all directions
- [ ] Speed control (0-100%)
- [ ] Temperature sensor reading
- [ ] Battery level monitoring
- [ ] LED indicators working
- [ ] Buzzer alarm functioning

### **Software Testing**
- [ ] WiFi connection
- [ ] Bluetooth connection
- [ ] MQTT communication
- [ ] HTTP fallback
- [ ] Emergency stop
- [ ] Configuration saving

### **Integration Testing**
- [ ] End-to-end control flow
- [ ] Error handling
- [ ] Connection recovery
- [ ] Performance under load
- [ ] Battery usage optimization

## 🤝 **CONTRIBUTING**

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 **LICENSE**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **SUPPORT**

- **Email:** support@smarthom.com
- **WhatsApp:** +62-xxx-xxx-xxxx
- **Documentation:** https://docs.smarthom.com
- **Issues:** [GitHub Issues](https://github.com/your-username/smarthom/issues)

## 🙏 **ACKNOWLEDGMENTS**

- React Native team untuk framework yang luar biasa
- ESP32 community untuk dokumentasi yang komprehensif
- MQTT.js untuk library komunikasi yang reliable
- Semua contributor yang telah membantu pengembangan

---

**SMARTHOM v1.0** - Sistem Kontrol Alat Simulasi Persalinan yang Modern dan Handal 🚀
