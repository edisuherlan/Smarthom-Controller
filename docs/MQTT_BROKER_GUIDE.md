# 📡 MQTT BROKER SETUP GUIDE - SMARTHOM

## 🎯 **OVERVIEW**

MQTT (Message Queuing Telemetry Transport) broker adalah komponen kunci dalam sistem SMARTHOM yang memungkinkan komunikasi real-time antara aplikasi mobile dan ESP32. ESP32 akan berfungsi sebagai MQTT broker lokal yang menangani semua komunikasi.

---

## 🔧 **KONFIGURASI MQTT BROKER DI ESP32**

### **1. Library yang Diperlukan**
```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFiManager.h>
```

### **2. Konfigurasi WiFi dan MQTT**
```cpp
// WiFi Configuration
const char* ssid = "SMARTHOM_WiFi";
const char* password = "smarthom123";

// MQTT Broker Configuration
const char* mqtt_server = "192.168.1.100";  // IP ESP32
const int mqtt_port = 1883;
const char* mqtt_username = "smarthom";
const char* mqtt_password = "simulator123";

// MQTT Topics
const char* TOPIC_COMMAND = "smarthom/command";      // Commands from mobile
const char* TOPIC_RESPONSE = "smarthom/response";    // Responses to mobile
const char* TOPIC_STATUS = "smarthom/status";        // Status updates
const char* TOPIC_EMERGENCY = "smarthom/emergency";  // Emergency commands
```

### **3. Setup MQTT Broker**
```cpp
WiFiClient espClient;
PubSubClient client(espClient);

void setupMQTT() {
  // Set MQTT server
  client.setServer(mqtt_server, mqtt_port);
  
  // Set callback function
  client.setCallback(callback);
  
  // Set buffer size for large messages
  client.setBufferSize(512);
  
  Serial.println("MQTT Broker setup completed");
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  
  // Convert payload to string
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);
  
  // Parse and handle the message
  handleMQTTMessage(topic, message);
}
```

---

## 📨 **TOPIC STRUCTURE**

### **Topic Hierarchy**
```
smarthom/
├── command/          # Commands from mobile app
│   ├── movement      # Movement commands
│   ├── speed         # Speed control
│   └── emergency     # Emergency stop
├── response/         # Responses to mobile app
│   ├── status        # Status updates
│   ├── error         # Error messages
│   └── confirm       # Command confirmations
├── status/           # Real-time status
│   ├── battery       # Battery level
│   ├── temperature   # Temperature reading
│   └── position      # Position data
└── emergency/        # Emergency notifications
    ├── stop          # Emergency stop
    └── alert         # Emergency alerts
```

### **Message Format (JSON)**
```json
{
  "type": "movement",
  "direction": "forward",
  "speed": 75,
  "timestamp": 1703123456789,
  "deviceId": "smarthom_simulator"
}
```

---

## 🔄 **MESSAGE HANDLING**

### **1. Command Handler**
```cpp
void handleMQTTMessage(char* topic, String message) {
  // Parse JSON message
  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.println("JSON parsing failed");
    return;
  }
  
  String type = doc["type"];
  String deviceId = doc["deviceId"];
  
  // Verify device ID
  if (deviceId != "smarthom_simulator") {
    Serial.println("Invalid device ID");
    return;
  }
  
  // Handle different command types
  if (type == "movement") {
    handleMovementCommand(doc);
  } else if (type == "speed") {
    handleSpeedCommand(doc);
  } else if (type == "emergency_stop") {
    handleEmergencyStop();
  } else if (type == "status_request") {
    sendStatusUpdate();
  }
}
```

### **2. Movement Command Handler**
```cpp
void handleMovementCommand(DynamicJsonDocument& doc) {
  String direction = doc["direction"];
  int speed = doc["speed"];
  
  Serial.printf("Movement command: %s at speed %d\n", direction.c_str(), speed);
  
  // Execute movement
  if (direction == "forward") {
    moveForward(speed);
  } else if (direction == "backward") {
    moveBackward(speed);
  } else if (direction == "left") {
    moveLeft(speed);
  } else if (direction == "right") {
    moveRight(speed);
  } else if (direction == "stop") {
    stopMotors();
  }
  
  // Send confirmation
  sendCommandConfirmation("movement", direction, true);
}
```

### **3. Speed Command Handler**
```cpp
void handleSpeedCommand(DynamicJsonDocument& doc) {
  int speed = doc["speed"];
  
  Serial.printf("Speed command: %d\n", speed);
  
  // Update speed
  setMotorSpeed(speed);
  
  // Send confirmation
  sendCommandConfirmation("speed", String(speed), true);
}
```

### **4. Emergency Stop Handler**
```cpp
void handleEmergencyStop() {
  Serial.println("EMERGENCY STOP ACTIVATED!");
  
  // Stop all motors immediately
  stopMotors();
  
  // Activate emergency indicators
  digitalWrite(ERROR_LED_PIN, HIGH);
  digitalWrite(BUZZER_PIN, HIGH);
  
  // Send emergency notification
  sendEmergencyNotification("Emergency stop activated");
  
  // Reset after 5 seconds
  delay(5000);
  digitalWrite(ERROR_LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
}
```

---

## 📤 **RESPONSE FUNCTIONS**

### **1. Command Confirmation**
```cpp
void sendCommandConfirmation(String commandType, String value, bool success) {
  DynamicJsonDocument doc(256);
  doc["type"] = "confirmation";
  doc["command"] = commandType;
  doc["value"] = value;
  doc["success"] = success;
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  String response;
  serializeJson(doc, response);
  
  client.publish(TOPIC_RESPONSE, response.c_str());
  Serial.printf("Confirmation sent: %s\n", response.c_str());
}
```

### **2. Status Update**
```cpp
void sendStatusUpdate() {
  DynamicJsonDocument doc(512);
  doc["type"] = "status";
  doc["battery"] = readBatteryLevel();
  doc["temperature"] = readTemperature();
  doc["speed"] = currentSpeed;
  doc["status"] = getSystemStatus();
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  // Add position data if available
  JsonObject position = doc.createNestedObject("position");
  position["x"] = currentPosition.x;
  position["y"] = currentPosition.y;
  position["z"] = currentPosition.z;
  
  String response;
  serializeJson(doc, response);
  
  client.publish(TOPIC_STATUS, response.c_str());
  Serial.printf("Status update sent: %s\n", response.c_str());
}
```

### **3. Emergency Notification**
```cpp
void sendEmergencyNotification(String message) {
  DynamicJsonDocument doc(256);
  doc["type"] = "emergency";
  doc["message"] = message;
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  String response;
  serializeJson(doc, response);
  
  client.publish(TOPIC_EMERGENCY, response.c_str());
  Serial.printf("Emergency notification sent: %s\n", response.c_str());
}
```

---

## 🔗 **CONNECTION MANAGEMENT**

### **1. WiFi Connection**
```cpp
void setupWiFi() {
  WiFi.begin(ssid, password);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Update status LED
  digitalWrite(STATUS_LED_PIN, HIGH);
}
```

### **2. MQTT Connection**
```cpp
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Create a random client ID
    String clientId = "SMARTHOM_ESP32_";
    clientId += String(random(0xffff), HEX);
    
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      
      // Subscribe to command topics
      client.subscribe(TOPIC_COMMAND);
      client.subscribe(TOPIC_EMERGENCY);
      
      // Send initial status
      sendStatusUpdate();
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5 seconds");
      delay(5000);
    }
  }
}
```

### **3. Connection Monitoring**
```cpp
void checkConnections() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost. Reconnecting...");
    setupWiFi();
  }
  
  // Check MQTT connection
  if (!client.connected()) {
    Serial.println("MQTT connection lost. Reconnecting...");
    reconnectMQTT();
  }
  
  // Process MQTT messages
  client.loop();
}
```

---

## ⏰ **PERIODIC TASKS**

### **1. Status Polling**
```cpp
unsigned long lastStatusUpdate = 0;
const unsigned long STATUS_INTERVAL = 2000; // 2 seconds

void periodicStatusUpdate() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastStatusUpdate >= STATUS_INTERVAL) {
    sendStatusUpdate();
    lastStatusUpdate = currentTime;
  }
}
```

### **2. Sensor Reading**
```cpp
unsigned long lastSensorRead = 0;
const unsigned long SENSOR_INTERVAL = 1000; // 1 second

void periodicSensorRead() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastSensorRead >= SENSOR_INTERVAL) {
    // Read sensors
    float temperature = readTemperature();
    float batteryLevel = readBatteryLevel();
    
    // Update global variables
    currentTemperature = temperature;
    currentBatteryLevel = batteryLevel;
    
    // Check for critical values
    if (batteryLevel < 20) {
      sendEmergencyNotification("Low battery warning");
    }
    
    if (temperature > 50) {
      sendEmergencyNotification("High temperature warning");
    }
    
    lastSensorRead = currentTime;
  }
}
```

---

## 🚨 **ERROR HANDLING**

### **1. Connection Error Handling**
```cpp
void handleConnectionError() {
  Serial.println("Connection error detected");
  
  // Blink status LED
  for (int i = 0; i < 5; i++) {
    digitalWrite(STATUS_LED_PIN, HIGH);
    delay(200);
    digitalWrite(STATUS_LED_PIN, LOW);
    delay(200);
  }
  
  // Attempt reconnection
  checkConnections();
}
```

### **2. Message Error Handling**
```cpp
void handleMessageError(String error) {
  Serial.printf("Message error: %s\n", error.c_str());
  
  // Send error response
  DynamicJsonDocument doc(256);
  doc["type"] = "error";
  doc["message"] = error;
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  String response;
  serializeJson(doc, response);
  
  client.publish(TOPIC_RESPONSE, response.c_str());
}
```

---

## 🔧 **COMPLETE SETUP FUNCTION**

### **Main Setup Function**
```cpp
void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  
  // Initialize pins
  setupPins();
  
  // Setup WiFi
  setupWiFi();
  
  // Setup MQTT
  setupMQTT();
  
  // Connect to MQTT broker
  reconnectMQTT();
  
  Serial.println("SMARTHOM ESP32 MQTT Broker initialized successfully");
}
```

### **Main Loop Function**
```cpp
void loop() {
  // Check and maintain connections
  checkConnections();
  
  // Periodic tasks
  periodicStatusUpdate();
  periodicSensorRead();
  
  // Handle any pending tasks
  handlePendingTasks();
  
  // Small delay to prevent watchdog reset
  delay(10);
}
```

---

## 📊 **MONITORING & DEBUGGING**

### **1. Serial Monitor Commands**
```cpp
void handleSerialCommands() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command == "status") {
      sendStatusUpdate();
    } else if (command == "emergency") {
      handleEmergencyStop();
    } else if (command == "wifi") {
      Serial.printf("WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
      Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
    } else if (command == "mqtt") {
      Serial.printf("MQTT Status: %s\n", client.connected() ? "Connected" : "Disconnected");
    }
  }
}
```

### **2. Debug Information**
```cpp
void printDebugInfo() {
  Serial.println("=== SMARTHOM DEBUG INFO ===");
  Serial.printf("WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
  Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
  Serial.printf("MQTT Status: %s\n", client.connected() ? "Connected" : "Disconnected");
  Serial.printf("Battery Level: %.1f%%\n", currentBatteryLevel);
  Serial.printf("Temperature: %.1f°C\n", currentTemperature);
  Serial.printf("Current Speed: %d%%\n", currentSpeed);
  Serial.printf("Free Memory: %d bytes\n", ESP.getFreeHeap());
  Serial.println("==========================");
}
```

---

## ⚙️ **CONFIGURATION OPTIONS**

### **1. MQTT Settings**
```cpp
// MQTT Quality of Service (QoS)
#define MQTT_QOS 1  // 0 = at most once, 1 = at least once, 2 = exactly once

// MQTT Keep Alive
#define MQTT_KEEPALIVE 60  // seconds

// MQTT Clean Session
#define MQTT_CLEAN_SESSION true

// MQTT Last Will and Testament
#define MQTT_LWT_TOPIC "smarthom/status"
#define MQTT_LWT_MESSAGE "offline"
#define MQTT_LWT_QOS 1
#define MQTT_LWT_RETAIN true
```

### **2. Network Settings**
```cpp
// WiFi timeout
#define WIFI_TIMEOUT 30000  // 30 seconds

// MQTT reconnect interval
#define MQTT_RECONNECT_INTERVAL 5000  // 5 seconds

// Status update interval
#define STATUS_UPDATE_INTERVAL 2000  // 2 seconds
```

---

## 🔍 **TESTING MQTT BROKER**

### **1. Test Commands**
```bash
# Test connection
mosquitto_pub -h 192.168.1.100 -p 1883 -u smarthom -P simulator123 -t "smarthom/command" -m '{"type":"movement","direction":"forward","speed":50,"timestamp":1703123456789,"deviceId":"smarthom_simulator"}'

# Test status request
mosquitto_pub -h 192.168.1.100 -p 1883 -u smarthom -P simulator123 -t "smarthom/command" -m '{"type":"status_request","timestamp":1703123456789,"deviceId":"smarthom_simulator"}'

# Test emergency stop
mosquitto_pub -h 192.168.1.100 -p 1883 -u smarthom -P simulator123 -t "smarthom/command" -m '{"type":"emergency_stop","timestamp":1703123456789,"deviceId":"smarthom_simulator"}'
```

### **2. Monitor Responses**
```bash
# Monitor all responses
mosquitto_sub -h 192.168.1.100 -p 1883 -u smarthom -P simulator123 -t "smarthom/response" -v

# Monitor status updates
mosquitto_sub -h 192.168.1.100 -p 1883 -u smarthom -P simulator123 -t "smarthom/status" -v

# Monitor emergency notifications
mosquitto_sub -h 192.168.1.100 -p 1883 -u smarthom -P simulator123 -t "smarthom/emergency" -v
```

---

## 🚀 **TROUBLESHOOTING**

### **Common Issues**

1. **MQTT Connection Failed**
   - Check WiFi connection
   - Verify MQTT credentials
   - Check firewall settings
   - Ensure port 1883 is open

2. **Messages Not Received**
   - Check topic subscriptions
   - Verify JSON format
   - Check message size limits
   - Monitor serial output for errors

3. **High Memory Usage**
   - Reduce JSON document size
   - Increase ESP32 heap size
   - Optimize string handling
   - Use smaller data types

4. **Connection Drops**
   - Increase keep-alive interval
   - Check WiFi signal strength
   - Implement reconnection logic
   - Monitor network stability

---

*MQTT Broker Guide ini dibuat untuk SMARTHOM v1.0 - Pastikan untuk mengikuti konfigurasi dengan teliti untuk komunikasi yang reliable.*
