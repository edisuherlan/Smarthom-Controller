# 🔌 PIN MAPPING ESP32 SMARTHOM

## 📍 **PIN LAYOUT ESP32**

```
                    ESP32 DEVKIT V1
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ 3V3 │ │ EN  │ │ VP  │ │ VN  │ │ 34  │ │ 35  │      │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ 32  │ │ 33  │ │ 25  │ │ 26  │ │ 27  │ │ 14  │      │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ 12  │ │ 13  │ │ 9   │ │ 10  │ │ 11  │ │ 6   │      │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ 5   │ │ 23  │ │ 22  │ │ TX  │ │ RX  │ │ 21  │      │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ 19  │ │ 18  │ │ 4   │ │ 2   │ │ 15  │ │ 8   │      │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ 7   │ │ 0   │ │ 16  │ │ 17  │ │ 3V3 │ │ GND │      │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 **DETAILED PIN ASSIGNMENT**

### **🔧 MOTOR CONTROL PINS**

| Pin | Function | Description | Voltage | Current | Notes |
|-----|----------|-------------|---------|---------|-------|
| **26** | `MOTOR_FORWARD_PIN` | Motor Maju | 3.3V | 40mA | Digital Output |
| **27** | `MOTOR_BACKWARD_PIN` | Motor Mundur | 3.3V | 40mA | Digital Output |
| **25** | `MOTOR_LEFT_PIN` | Motor Kiri | 3.3V | 40mA | Digital Output |
| **33** | `MOTOR_RIGHT_PIN` | Motor Kanan | 3.3V | 40mA | Digital Output |
| **32** | `MOTOR_SPEED_PIN` | PWM Kecepatan | 3.3V | 40mA | PWM Output |

**⚠️ Catatan Motor:**
- Pin 26, 27, 25, 33 → Motor Driver (L298N/L293D)
- Pin 32 → PWM untuk kontrol kecepatan
- Gunakan motor driver untuk arus tinggi
- Motor DC 12V dengan arus maksimal 2A

### **📊 SENSOR PINS**

| Pin | Function | Description | Voltage | Type | Notes |
|-----|----------|-------------|---------|------|-------|
| **34** | `TEMP_SENSOR_PIN` | Sensor Suhu | 3.3V | Analog Input | LM35/DHT22 |
| **35** | `BATTERY_MONITOR_PIN` | Monitoring Baterai | 3.3V | Analog Input | Voltage Divider |

**⚠️ Catatan Sensor:**
- Pin 34 → LM35 (0-100°C) atau DHT22
- Pin 35 → Voltage divider untuk 12V → 3.3V
- ADC resolution: 12-bit (0-4095)

### **💡 LED & INDICATOR PINS**

| Pin | Function | Description | Voltage | Type | Notes |
|-----|----------|-------------|---------|------|-------|
| **2** | `STATUS_LED_PIN` | LED Status Koneksi | 3.3V | Digital Output | Built-in LED |
| **4** | `ERROR_LED_PIN` | LED Error/Emergency | 3.3V | Digital Output | External LED |

**⚠️ Catatan LED:**
- Pin 2 → Built-in LED ESP32
- Pin 4 → LED eksternal dengan resistor 220Ω
- LED menyala saat HIGH (3.3V)

### **🔊 AUDIO PINS**

| Pin | Function | Description | Voltage | Type | Notes |
|-----|----------|-------------|---------|------|-------|
| **5** | `BUZZER_PIN` | Buzzer Emergency | 3.3V | Digital Output | Active Buzzer |

**⚠️ Catatan Buzzer:**
- Pin 5 → Active buzzer 5V
- Gunakan transistor untuk switching jika diperlukan
- Buzzer aktif saat HIGH

### **📡 COMMUNICATION PINS**

| Pin | Function | Description | Voltage | Type | Notes |
|-----|----------|-------------|---------|------|-------|
| **17** | `UART_TX_PIN` | Serial TX | 3.3V | Digital Output | Debug/Logging |
| **16** | `UART_RX_PIN` | Serial RX | 3.3V | Digital Input | Debug/Logging |

**⚠️ Catatan Komunikasi:**
- Pin 17, 16 → UART untuk debugging
- Baud rate: 115200
- WiFi & Bluetooth built-in (tidak perlu pin eksternal)

---

## 🔌 **WIRING DIAGRAM**

### **Motor Control Circuit**
```
ESP32 Pin 26 ──┐
ESP32 Pin 27 ──┤
ESP32 Pin 25 ──┤─── L298N Motor Driver ─── Motor DC
ESP32 Pin 33 ──┤
ESP32 Pin 32 ──┘
```

### **Sensor Circuit**
```
ESP32 Pin 34 ─── LM35 (Vout) ─── GND
ESP32 Pin 35 ─── Voltage Divider ─── 12V Battery
```

### **LED & Buzzer Circuit**
```
ESP32 Pin 2  ─── Built-in LED
ESP32 Pin 4  ─── 220Ω Resistor ─── LED ─── GND
ESP32 Pin 5  ─── Transistor ─── Buzzer ─── 5V
```

---

## ⚡ **POWER SUPPLY SPECIFICATIONS**

### **ESP32 Power**
- **Input Voltage:** 3.3V (regulated)
- **Operating Current:** 80-260mA
- **Peak Current:** 500mA

### **Motor Power**
- **Motor Voltage:** 12V DC
- **Motor Current:** 0.5-2A per motor
- **Total Current:** 2-8A (4 motors)

### **Sensor Power**
- **LM35:** 3.3V, 60μA
- **DHT22:** 3.3V, 1.5mA
- **LED:** 3.3V, 20mA per LED
- **Buzzer:** 5V, 30mA

---

## 🔧 **CODE IMPLEMENTATION**

### **Pin Definitions (Arduino/ESP32)**
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

// LED & Indicator Pins
#define STATUS_LED_PIN     2
#define ERROR_LED_PIN      4

// Audio Pins
#define BUZZER_PIN         5

// Communication Pins
#define UART_TX_PIN        17
#define UART_RX_PIN        16

// PWM Configuration
#define PWM_CHANNEL        0
#define PWM_FREQ          5000
#define PWM_RESOLUTION     8
```

### **Pin Initialization**
```cpp
void setupPins() {
  // Motor pins as outputs
  pinMode(MOTOR_FORWARD_PIN, OUTPUT);
  pinMode(MOTOR_BACKWARD_PIN, OUTPUT);
  pinMode(MOTOR_LEFT_PIN, OUTPUT);
  pinMode(MOTOR_RIGHT_PIN, OUTPUT);
  
  // PWM setup for speed control
  ledcSetup(PWM_CHANNEL, PWM_FREQ, PWM_RESOLUTION);
  ledcAttachPin(MOTOR_SPEED_PIN, PWM_CHANNEL);
  
  // LED pins as outputs
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(ERROR_LED_PIN, OUTPUT);
  
  // Buzzer pin as output
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Sensor pins as inputs (analog)
  // Pin 34 and 35 are analog inputs by default
  
  // Initialize all outputs to LOW
  digitalWrite(MOTOR_FORWARD_PIN, LOW);
  digitalWrite(MOTOR_BACKWARD_PIN, LOW);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  digitalWrite(STATUS_LED_PIN, LOW);
  digitalWrite(ERROR_LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
}
```

### **Motor Control Functions**
```cpp
void moveForward(int speed) {
  digitalWrite(MOTOR_FORWARD_PIN, HIGH);
  digitalWrite(MOTOR_BACKWARD_PIN, LOW);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  
  // Convert speed (0-100) to PWM duty cycle (0-255)
  int dutyCycle = map(speed, 0, 100, 0, 255);
  ledcWrite(PWM_CHANNEL, dutyCycle);
}

void moveBackward(int speed) {
  digitalWrite(MOTOR_FORWARD_PIN, LOW);
  digitalWrite(MOTOR_BACKWARD_PIN, HIGH);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  
  int dutyCycle = map(speed, 0, 100, 0, 255);
  ledcWrite(PWM_CHANNEL, dutyCycle);
}

void stopMotors() {
  digitalWrite(MOTOR_FORWARD_PIN, LOW);
  digitalWrite(MOTOR_BACKWARD_PIN, LOW);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  ledcWrite(PWM_CHANNEL, 0);
}
```

### **Sensor Reading Functions**
```cpp
float readTemperature() {
  // Read analog value from LM35
  int rawValue = analogRead(TEMP_SENSOR_PIN);
  
  // Convert to voltage (0-3.3V)
  float voltage = (rawValue / 4095.0) * 3.3;
  
  // Convert to temperature (LM35: 10mV/°C)
  float temperature = voltage * 100;
  
  return temperature;
}

float readBatteryLevel() {
  // Read analog value from voltage divider
  int rawValue = analogRead(BATTERY_MONITOR_PIN);
  
  // Convert to voltage (0-3.3V)
  float voltage = (rawValue / 4095.0) * 3.3;
  
  // Convert to battery voltage (voltage divider ratio)
  float batteryVoltage = voltage * 3.64; // Adjust based on your divider
  
  // Convert to percentage (assuming 12V battery)
  float percentage = (batteryVoltage / 12.0) * 100;
  
  return constrain(percentage, 0, 100);
}
```

---

## ⚠️ **SAFETY CONSIDERATIONS**

### **Electrical Safety**
1. **Voltage Levels:**
   - ESP32 pins: 3.3V maximum
   - Motor voltage: 12V (isolated from ESP32)
   - Use level shifters if needed

2. **Current Protection:**
   - ESP32 pins: 40mA maximum
   - Use motor drivers for high current
   - Add fuses for protection

3. **Ground Connection:**
   - Common ground between ESP32 and motor driver
   - Separate ground for high-power circuits

### **Mechanical Safety**
1. **Emergency Stop:**
   - Hardware emergency stop button
   - Software emergency stop function
   - Automatic stop on error

2. **Motor Protection:**
   - Current limiting
   - Overheating protection
   - Stall detection

---

## 🔍 **TESTING PROCEDURES**

### **Pin Testing Checklist**
- [ ] **Pin 26:** Test motor forward
- [ ] **Pin 27:** Test motor backward  
- [ ] **Pin 25:** Test motor left
- [ ] **Pin 33:** Test motor right
- [ ] **Pin 32:** Test PWM speed control
- [ ] **Pin 34:** Test temperature sensor
- [ ] **Pin 35:** Test battery monitoring
- [ ] **Pin 2:** Test status LED
- [ ] **Pin 4:** Test error LED
- [ ] **Pin 5:** Test buzzer

### **Function Testing**
- [ ] Motor movement in all directions
- [ ] Speed control (0-100%)
- [ ] Emergency stop
- [ ] Temperature reading
- [ ] Battery level monitoring
- [ ] LED indicators
- [ ] Buzzer alarm
- [ ] WiFi connection
- [ ] MQTT communication

---

*Pin mapping ini dibuat untuk SMARTHOM v1.0 - Pastikan untuk mengikuti diagram wiring dengan teliti untuk menghindari kerusakan hardware.*
