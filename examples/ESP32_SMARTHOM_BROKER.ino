/*
 * SMARTHOM ESP32 MQTT Broker
 * Sistem Kontrol Alat Simulasi Persalinan
 * 
 * Pin Configuration:
 * - Pin 26: Motor Forward
 * - Pin 27: Motor Backward  
 * - Pin 25: Motor Left
 * - Pin 33: Motor Right
 * - Pin 32: PWM Speed Control
 * - Pin 34: Temperature Sensor
 * - Pin 35: Battery Monitor
 * - Pin 2:  Status LED
 * - Pin 4:  Error LED
 * - Pin 5:  Buzzer
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "SMARTHOM_WiFi";
const char* password = "smarthom123";

// MQTT Configuration
const char* mqtt_server = "192.168.1.100";
const int mqtt_port = 1883;
const char* mqtt_username = "smarthom";
const char* mqtt_password = "simulator123";

// MQTT Topics
const char* TOPIC_COMMAND = "smarthom/command";
const char* TOPIC_RESPONSE = "smarthom/response";
const char* TOPIC_STATUS = "smarthom/status";
const char* TOPIC_EMERGENCY = "smarthom/emergency";

// Pin Definitions
#define MOTOR_FORWARD_PIN  26
#define MOTOR_BACKWARD_PIN 27
#define MOTOR_LEFT_PIN     25
#define MOTOR_RIGHT_PIN    33
#define MOTOR_SPEED_PIN    32

#define TEMP_SENSOR_PIN    34
#define BATTERY_MONITOR_PIN 35

#define STATUS_LED_PIN     2
#define ERROR_LED_PIN      4
#define BUZZER_PIN         5

// PWM Configuration
#define PWM_CHANNEL        0
#define PWM_FREQ          5000
#define PWM_RESOLUTION     8

// Global Variables
WiFiClient espClient;
PubSubClient client(espClient);

int currentSpeed = 50;
float currentTemperature = 0;
float currentBatteryLevel = 0;
String systemStatus = "idle";

struct Position {
  float x = 0;
  float y = 0;
  float z = 0;
} currentPosition;

// Timing variables
unsigned long lastStatusUpdate = 0;
unsigned long lastSensorRead = 0;
const unsigned long STATUS_INTERVAL = 2000;
const unsigned long SENSOR_INTERVAL = 1000;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("SMARTHOM ESP32 MQTT Broker Starting...");
  
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

void loop() {
  // Check and maintain connections
  checkConnections();
  
  // Periodic tasks
  periodicStatusUpdate();
  periodicSensorRead();
  
  // Handle serial commands
  handleSerialCommands();
  
  // Small delay to prevent watchdog reset
  delay(10);
}

// Pin Setup Function
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
  
  // Initialize all outputs to LOW
  digitalWrite(MOTOR_FORWARD_PIN, LOW);
  digitalWrite(MOTOR_BACKWARD_PIN, LOW);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  digitalWrite(STATUS_LED_PIN, LOW);
  digitalWrite(ERROR_LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  
  Serial.println("Pins initialized");
}

// WiFi Setup Function
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

// MQTT Setup Function
void setupMQTT() {
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  client.setBufferSize(512);
  
  Serial.println("MQTT Broker setup completed");
}

// MQTT Callback Function
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

// MQTT Message Handler
void handleMQTTMessage(char* topic, String message) {
  // Parse JSON message
  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.println("JSON parsing failed");
    handleMessageError("JSON parsing failed");
    return;
  }
  
  String type = doc["type"];
  String deviceId = doc["deviceId"];
  
  // Verify device ID
  if (deviceId != "smarthom_simulator") {
    Serial.println("Invalid device ID");
    handleMessageError("Invalid device ID");
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
  } else {
    handleMessageError("Unknown command type: " + type);
  }
}

// Movement Command Handler
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
  } else {
    handleMessageError("Invalid direction: " + direction);
    return;
  }
  
  // Send confirmation
  sendCommandConfirmation("movement", direction, true);
}

// Speed Command Handler
void handleSpeedCommand(DynamicJsonDocument& doc) {
  int speed = doc["speed"];
  
  Serial.printf("Speed command: %d\n", speed);
  
  // Update speed
  setMotorSpeed(speed);
  
  // Send confirmation
  sendCommandConfirmation("speed", String(speed), true);
}

// Emergency Stop Handler
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

// Motor Control Functions
void moveForward(int speed) {
  digitalWrite(MOTOR_FORWARD_PIN, HIGH);
  digitalWrite(MOTOR_BACKWARD_PIN, LOW);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  
  setMotorSpeed(speed);
  systemStatus = "moving";
}

void moveBackward(int speed) {
  digitalWrite(MOTOR_FORWARD_PIN, LOW);
  digitalWrite(MOTOR_BACKWARD_PIN, HIGH);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  
  setMotorSpeed(speed);
  systemStatus = "moving";
}

void moveLeft(int speed) {
  digitalWrite(MOTOR_FORWARD_PIN, LOW);
  digitalWrite(MOTOR_BACKWARD_PIN, LOW);
  digitalWrite(MOTOR_LEFT_PIN, HIGH);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  
  setMotorSpeed(speed);
  systemStatus = "moving";
}

void moveRight(int speed) {
  digitalWrite(MOTOR_FORWARD_PIN, LOW);
  digitalWrite(MOTOR_BACKWARD_PIN, LOW);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, HIGH);
  
  setMotorSpeed(speed);
  systemStatus = "moving";
}

void stopMotors() {
  digitalWrite(MOTOR_FORWARD_PIN, LOW);
  digitalWrite(MOTOR_BACKWARD_PIN, LOW);
  digitalWrite(MOTOR_LEFT_PIN, LOW);
  digitalWrite(MOTOR_RIGHT_PIN, LOW);
  ledcWrite(PWM_CHANNEL, 0);
  systemStatus = "idle";
}

void setMotorSpeed(int speed) {
  currentSpeed = constrain(speed, 0, 100);
  int dutyCycle = map(currentSpeed, 0, 100, 0, 255);
  ledcWrite(PWM_CHANNEL, dutyCycle);
}

// Sensor Reading Functions
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

// Response Functions
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

void sendStatusUpdate() {
  DynamicJsonDocument doc(512);
  doc["type"] = "status";
  doc["battery"] = currentBatteryLevel;
  doc["temperature"] = currentTemperature;
  doc["speed"] = currentSpeed;
  doc["status"] = systemStatus;
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  // Add position data
  JsonObject position = doc.createNestedObject("position");
  position["x"] = currentPosition.x;
  position["y"] = currentPosition.y;
  position["z"] = currentPosition.z;
  
  String response;
  serializeJson(doc, response);
  
  client.publish(TOPIC_STATUS, response.c_str());
  Serial.printf("Status update sent: %s\n", response.c_str());
}

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

// Connection Management
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

// Periodic Tasks
void periodicStatusUpdate() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastStatusUpdate >= STATUS_INTERVAL) {
    sendStatusUpdate();
    lastStatusUpdate = currentTime;
  }
}

void periodicSensorRead() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastSensorRead >= SENSOR_INTERVAL) {
    // Read sensors
    currentTemperature = readTemperature();
    currentBatteryLevel = readBatteryLevel();
    
    // Check for critical values
    if (currentBatteryLevel < 20) {
      sendEmergencyNotification("Low battery warning");
    }
    
    if (currentTemperature > 50) {
      sendEmergencyNotification("High temperature warning");
    }
    
    lastSensorRead = currentTime;
  }
}

// Serial Commands
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
    } else if (command == "debug") {
      printDebugInfo();
    } else if (command == "forward") {
      moveForward(50);
    } else if (command == "backward") {
      moveBackward(50);
    } else if (command == "left") {
      moveLeft(50);
    } else if (command == "right") {
      moveRight(50);
    } else if (command == "stop") {
      stopMotors();
    } else {
      Serial.println("Unknown command. Available commands: status, emergency, wifi, mqtt, debug, forward, backward, left, right, stop");
    }
  }
}

void printDebugInfo() {
  Serial.println("=== SMARTHOM DEBUG INFO ===");
  Serial.printf("WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
  Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
  Serial.printf("MQTT Status: %s\n", client.connected() ? "Connected" : "Disconnected");
  Serial.printf("Battery Level: %.1f%%\n", currentBatteryLevel);
  Serial.printf("Temperature: %.1f°C\n", currentTemperature);
  Serial.printf("Current Speed: %d%%\n", currentSpeed);
  Serial.printf("System Status: %s\n", systemStatus.c_str());
  Serial.printf("Free Memory: %d bytes\n", ESP.getFreeHeap());
  Serial.println("==========================");
}
