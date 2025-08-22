/*
 * SMARTHOM ESP32 MQTT BROKER SERVER
 * ESP32 sebagai MQTT Broker + Client
 * 
 * Fitur:
 * - MQTT Broker embedded
 * - WiFi Access Point
 * - Motor Control
 * - Sensor Monitoring
 * - Emergency System
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <DNSServer.h>

// WiFi Access Point Configuration
const char* ap_ssid = "SMARTHOM_AP";
const char* ap_password = "smarthom123";
const int ap_channel = 1;
const bool ap_hidden = false;
const int ap_max_connection = 4;

// MQTT Broker Configuration
const char* mqtt_broker_ip = "192.168.4.1";  // ESP32 AP IP
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
WiFiServer mqttServer(mqtt_port);
WebServer webServer(80);
DNSServer dnsServer;

// MQTT Clients (max 4 connections)
WiFiClient mqttClients[4];
PubSubClient mqttClientInstances[4];
bool clientConnected[4] = {false, false, false, false};
String clientIds[4] = {"", "", "", ""};

// System Variables
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
  Serial.println("SMARTHOM ESP32 MQTT Broker Server Starting...");
  
  // Initialize pins
  setupPins();
  
  // Setup WiFi Access Point
  setupWiFiAP();
  
  // Setup MQTT Broker Server
  setupMQTTBroker();
  
  // Setup Web Server
  setupWebServer();
  
  Serial.println("SMARTHOM ESP32 MQTT Broker Server initialized successfully");
  Serial.printf("AP IP: %s\n", WiFi.softAPIP().toString().c_str());
  Serial.printf("MQTT Broker: %s:%d\n", mqtt_broker_ip, mqtt_port);
}

void loop() {
  // Handle MQTT connections
  handleMQTTConnections();
  
  // Handle web server
  webServer.handleClient();
  dnsServer.processNextRequest();
  
  // Periodic tasks
  periodicStatusUpdate();
  periodicSensorRead();
  
  // Handle serial commands
  handleSerialCommands();
  
  // Small delay
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

// WiFi Access Point Setup
void setupWiFiAP() {
  // Configure Access Point
  WiFi.softAP(ap_ssid, ap_password, ap_channel, ap_hidden, ap_max_connection);
  
  // Set static IP for AP
  IPAddress localIP(192, 168, 4, 1);
  IPAddress gateway(192, 168, 4, 1);
  IPAddress subnet(255, 255, 255, 0);
  WiFi.softAPConfig(localIP, gateway, subnet);
  
  Serial.println("WiFi Access Point started");
  Serial.printf("SSID: %s\n", ap_ssid);
  Serial.printf("Password: %s\n", ap_password);
  Serial.printf("IP Address: %s\n", WiFi.softAPIP().toString().c_str());
  
  // Update status LED
  digitalWrite(STATUS_LED_PIN, HIGH);
}

// MQTT Broker Server Setup
void setupMQTTBroker() {
  // Start MQTT server
  mqttServer.begin();
  
  // Initialize MQTT client instances
  for (int i = 0; i < 4; i++) {
    mqttClientInstances[i].setClient(mqttClients[i]);
    mqttClientInstances[i].setCallback([i](char* topic, byte* payload, unsigned int length) {
      mqttCallback(i, topic, payload, length);
    });
  }
  
  Serial.printf("MQTT Broker started on port %d\n", mqtt_port);
}

// MQTT Connection Handler
void handleMQTTConnections() {
  // Check for new connections
  WiFiClient newClient = mqttServer.available();
  if (newClient) {
    Serial.println("New MQTT client connecting...");
    
    // Find free slot
    int freeSlot = -1;
    for (int i = 0; i < 4; i++) {
      if (!clientConnected[i]) {
        freeSlot = i;
        break;
      }
    }
    
    if (freeSlot >= 0) {
      // Accept connection
      mqttClients[freeSlot] = newClient;
      clientConnected[freeSlot] = true;
      clientIds[freeSlot] = "Client_" + String(freeSlot);
      
      Serial.printf("Client %d connected: %s\n", freeSlot, newClient.remoteIP().toString().c_str());
      
      // Send welcome message
      sendWelcomeMessage(freeSlot);
    } else {
      Serial.println("No free slots available");
      newClient.stop();
    }
  }
  
  // Handle existing connections
  for (int i = 0; i < 4; i++) {
    if (clientConnected[i]) {
      // Check if client is still connected
      if (!mqttClients[i].connected()) {
        Serial.printf("Client %d disconnected\n", i);
        clientConnected[i] = false;
        clientIds[i] = "";
        mqttClients[i].stop();
      } else {
        // Process MQTT messages
        mqttClientInstances[i].loop();
      }
    }
  }
}

// MQTT Callback Function
void mqttCallback(int clientIndex, char* topic, byte* payload, unsigned int length) {
  Serial.printf("Message from client %d [%s]: ", clientIndex, topic);
  
  // Convert payload to string
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);
  
  // Parse and handle the message
  handleMQTTMessage(clientIndex, topic, message);
}

// MQTT Message Handler
void handleMQTTMessage(int clientIndex, char* topic, String message) {
  // Parse JSON message
  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.println("JSON parsing failed");
    sendErrorMessage(clientIndex, "JSON parsing failed");
    return;
  }
  
  String type = doc["type"];
  String deviceId = doc["deviceId"];
  
  // Verify device ID
  if (deviceId != "smarthom_simulator") {
    Serial.println("Invalid device ID");
    sendErrorMessage(clientIndex, "Invalid device ID");
    return;
  }
  
  // Handle different command types
  if (type == "movement") {
    handleMovementCommand(clientIndex, doc);
  } else if (type == "speed") {
    handleSpeedCommand(clientIndex, doc);
  } else if (type == "emergency_stop") {
    handleEmergencyStop();
    broadcastToAllClients(TOPIC_EMERGENCY, createEmergencyMessage("Emergency stop activated"));
  } else if (type == "status_request") {
    sendStatusUpdate(clientIndex);
  } else {
    sendErrorMessage(clientIndex, "Unknown command type: " + type);
  }
}

// Movement Command Handler
void handleMovementCommand(int clientIndex, DynamicJsonDocument& doc) {
  String direction = doc["direction"];
  int speed = doc["speed"];
  
  Serial.printf("Movement command from client %d: %s at speed %d\n", clientIndex, direction.c_str(), speed);
  
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
    sendErrorMessage(clientIndex, "Invalid direction: " + direction);
    return;
  }
  
  // Send confirmation
  sendCommandConfirmation(clientIndex, "movement", direction, true);
  
  // Broadcast status to all clients
  broadcastToAllClients(TOPIC_STATUS, createStatusMessage());
}

// Speed Command Handler
void handleSpeedCommand(int clientIndex, DynamicJsonDocument& doc) {
  int speed = doc["speed"];
  
  Serial.printf("Speed command from client %d: %d\n", clientIndex, speed);
  
  // Update speed
  setMotorSpeed(speed);
  
  // Send confirmation
  sendCommandConfirmation(clientIndex, "speed", String(speed), true);
  
  // Broadcast status to all clients
  broadcastToAllClients(TOPIC_STATUS, createStatusMessage());
}

// Emergency Stop Handler
void handleEmergencyStop() {
  Serial.println("EMERGENCY STOP ACTIVATED!");
  
  // Stop all motors immediately
  stopMotors();
  
  // Activate emergency indicators
  digitalWrite(ERROR_LED_PIN, HIGH);
  digitalWrite(BUZZER_PIN, HIGH);
  
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
  int rawValue = analogRead(TEMP_SENSOR_PIN);
  float voltage = (rawValue / 4095.0) * 3.3;
  float temperature = voltage * 100;
  return temperature;
}

float readBatteryLevel() {
  int rawValue = analogRead(BATTERY_MONITOR_PIN);
  float voltage = (rawValue / 4095.0) * 3.3;
  float batteryVoltage = voltage * 3.64;
  float percentage = (batteryVoltage / 12.0) * 100;
  return constrain(percentage, 0, 100);
}

// Message Creation Functions
String createStatusMessage() {
  DynamicJsonDocument doc(512);
  doc["type"] = "status";
  doc["battery"] = currentBatteryLevel;
  doc["temperature"] = currentTemperature;
  doc["speed"] = currentSpeed;
  doc["status"] = systemStatus;
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  JsonObject position = doc.createNestedObject("position");
  position["x"] = currentPosition.x;
  position["y"] = currentPosition.y;
  position["z"] = currentPosition.z;
  
  String response;
  serializeJson(doc, response);
  return response;
}

String createEmergencyMessage(String message) {
  DynamicJsonDocument doc(256);
  doc["type"] = "emergency";
  doc["message"] = message;
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  String response;
  serializeJson(doc, response);
  return response;
}

// Response Functions
void sendWelcomeMessage(int clientIndex) {
  String welcomeMsg = "{\"type\":\"welcome\",\"message\":\"Connected to SMARTHOM MQTT Broker\",\"timestamp\":" + String(millis()) + ",\"deviceId\":\"smarthom_simulator\"}";
  sendToClient(clientIndex, TOPIC_RESPONSE, welcomeMsg);
}

void sendCommandConfirmation(int clientIndex, String commandType, String value, bool success) {
  DynamicJsonDocument doc(256);
  doc["type"] = "confirmation";
  doc["command"] = commandType;
  doc["value"] = value;
  doc["success"] = success;
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  String response;
  serializeJson(doc, response);
  
  sendToClient(clientIndex, TOPIC_RESPONSE, response);
}

void sendStatusUpdate(int clientIndex) {
  String statusMsg = createStatusMessage();
  sendToClient(clientIndex, TOPIC_STATUS, statusMsg);
}

void sendErrorMessage(int clientIndex, String error) {
  DynamicJsonDocument doc(256);
  doc["type"] = "error";
  doc["message"] = error;
  doc["timestamp"] = millis();
  doc["deviceId"] = "smarthom_simulator";
  
  String response;
  serializeJson(doc, response);
  
  sendToClient(clientIndex, TOPIC_RESPONSE, response);
}

// Client Communication Functions
void sendToClient(int clientIndex, const char* topic, String message) {
  if (clientConnected[clientIndex]) {
    // Simple MQTT-like message format
    String mqttMessage = String(topic) + ":" + message;
    mqttClients[clientIndex].println(mqttMessage);
    Serial.printf("Sent to client %d: %s\n", clientIndex, mqttMessage.c_str());
  }
}

void broadcastToAllClients(const char* topic, String message) {
  for (int i = 0; i < 4; i++) {
    if (clientConnected[i]) {
      sendToClient(i, topic, message);
    }
  }
}

// Web Server Setup
void setupWebServer() {
  // DNS Server for captive portal
  dnsServer.start(53, "*", WiFi.softAPIP());
  
  // Web server routes
  webServer.on("/", handleRoot);
  webServer.on("/status", handleStatus);
  webServer.on("/control", handleControl);
  webServer.onNotFound(handleNotFound);
  
  webServer.begin();
  Serial.println("Web server started");
}

void handleRoot() {
  String html = R"(
    <!DOCTYPE html>
    <html>
    <head>
      <title>SMARTHOM Control Panel</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial; margin: 20px; }
        .button { padding: 15px; margin: 5px; font-size: 18px; }
        .status { padding: 10px; margin: 10px 0; background: #f0f0f0; }
      </style>
    </head>
    <body>
      <h1>SMARTHOM Control Panel</h1>
      <div class="status" id="status">Loading...</div>
      <button class="button" onclick="control('forward')">Forward</button>
      <button class="button" onclick="control('backward')">Backward</button>
      <button class="button" onclick="control('left')">Left</button>
      <button class="button" onclick="control('right')">Right</button>
      <button class="button" onclick="control('stop')">Stop</button>
      <button class="button" onclick="control('emergency')">Emergency Stop</button>
      <script>
        function control(cmd) {
          fetch('/control?cmd=' + cmd).then(r => r.text()).then(console.log);
        }
        setInterval(() => {
          fetch('/status').then(r => r.json()).then(data => {
            document.getElementById('status').innerHTML = 
              'Battery: ' + data.battery + '% | ' +
              'Temperature: ' + data.temperature + '°C | ' +
              'Speed: ' + data.speed + '% | ' +
              'Status: ' + data.status;
          });
        }, 2000);
      </script>
    </body>
    </html>
  )";
  webServer.send(200, "text/html", html);
}

void handleStatus() {
  String json = createStatusMessage();
  webServer.send(200, "application/json", json);
}

void handleControl() {
  String cmd = webServer.hasArg("cmd") ? webServer.arg("cmd") : "";
  
  if (cmd == "forward") moveForward(50);
  else if (cmd == "backward") moveBackward(50);
  else if (cmd == "left") moveLeft(50);
  else if (cmd == "right") moveRight(50);
  else if (cmd == "stop") stopMotors();
  else if (cmd == "emergency") handleEmergencyStop();
  
  webServer.send(200, "text/plain", "OK");
}

void handleNotFound() {
  webServer.send(404, "text/plain", "Not found");
}

// Periodic Tasks
void periodicStatusUpdate() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastStatusUpdate >= STATUS_INTERVAL) {
    // Broadcast status to all connected clients
    broadcastToAllClients(TOPIC_STATUS, createStatusMessage());
    lastStatusUpdate = currentTime;
  }
}

void periodicSensorRead() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastSensorRead >= SENSOR_INTERVAL) {
    currentTemperature = readTemperature();
    currentBatteryLevel = readBatteryLevel();
    
    // Check for critical values
    if (currentBatteryLevel < 20) {
      broadcastToAllClients(TOPIC_EMERGENCY, createEmergencyMessage("Low battery warning"));
    }
    
    if (currentTemperature > 50) {
      broadcastToAllClients(TOPIC_EMERGENCY, createEmergencyMessage("High temperature warning"));
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
      Serial.println(createStatusMessage());
    } else if (command == "emergency") {
      handleEmergencyStop();
    } else if (command == "clients") {
      printClientStatus();
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
      Serial.println("Available commands: status, emergency, clients, forward, backward, left, right, stop");
    }
  }
}

void printClientStatus() {
  Serial.println("=== CLIENT STATUS ===");
  for (int i = 0; i < 4; i++) {
    if (clientConnected[i]) {
      Serial.printf("Client %d: %s (%s)\n", i, clientIds[i].c_str(), mqttClients[i].remoteIP().toString().c_str());
    } else {
      Serial.printf("Client %d: Disconnected\n", i);
    }
  }
  Serial.println("====================");
}
