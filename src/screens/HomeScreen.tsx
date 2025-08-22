import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ESP32Service, { defaultESP32Config, SimulatorStatus } from '../services/ESP32Service';
import ConnectionConfigService from '../services/ConnectionConfig';

// Types
type ConnectionType = 'wifi' | 'bluetooth' | 'none';
type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';
type ConnectionInfo = {
  type: ConnectionType;
  status: ConnectionStatus;
  signalStrength: number;
  deviceName?: string;
};

const HomeScreen = () => {
  // State management
  const [currentSpeed, setCurrentSpeed] = useState(50);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    type: 'none',
    status: 'disconnected',
    signalStrength: 0,
  });
  const [availableDevices, setAvailableDevices] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [simulatorStatus, setSimulatorStatus] = useState<SimulatorStatus | null>(null);
  const [esp32Service] = useState(() => new ESP32Service(defaultESP32Config));
  const [configService] = useState(() => ConnectionConfigService.getInstance());
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [esp32IpAddress, setEsp32IpAddress] = useState('192.168.1.100');

  // Connection functions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
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

  const checkWiFiAvailability = async (): Promise<boolean> => {
    // Simulate WiFi check
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.3); // 70% chance of WiFi being available
      }, 1000);
    });
  };

  const connectWiFi = async (): Promise<boolean> => {
    try {
      console.log('🔗 Attempting WiFi connection...');
      const success = await esp32Service.connect();
      if (success) {
        setConnectionInfo({
          type: 'wifi',
          status: 'connected',
          signalStrength: Math.floor(Math.random() * 40) + 60,
          deviceName: 'SMARTHOM_Simulator',
        });
        
        // Start status polling
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

  const connectBluetooth = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2;
        if (success) {
          setConnectionInfo({
            type: 'bluetooth',
            status: 'connected',
            signalStrength: Math.floor(Math.random() * 30) + 70,
            deviceName: 'SMARTHOM_BT',
          });
        }
        resolve(success);
      }, 1500);
    });
  };

  const smartConnect = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      Alert.alert('Permission Required', 'Please grant necessary permissions to connect.');
      return;
    }

    const wifiAvailable = await checkWiFiAvailability();
    
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

  // Status polling function
  const startStatusPolling = () => {
    const pollInterval = setInterval(async () => {
      if (connectionInfo.status === 'connected') {
        const status = await esp32Service.getStatus();
        if (status) {
          setSimulatorStatus(status);
        }
      } else {
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds
  };

  const disconnect = () => {
    esp32Service.disconnect();
    setConnectionInfo({
      type: 'none',
      status: 'disconnected',
      signalStrength: 0,
    });
    setSimulatorStatus(null);
  };

  const toggleConnection = () => {
    if (connectionInfo.status === 'connected') {
      disconnect();
    } else {
      smartConnect();
    }
  };

  const handleControlPress = async (direction: string) => {
    if (connectionInfo.status !== 'connected') {
      Alert.alert('Not Connected', 'Please connect to the simulator first.');
      return;
    }

    let success = false;
    switch (direction) {
      case 'forward':
        success = await esp32Service.moveForward(currentSpeed);
        break;
      case 'backward':
        success = await esp32Service.moveBackward(currentSpeed);
        break;
      case 'left':
        success = await esp32Service.moveLeft(currentSpeed);
        break;
      case 'right':
        success = await esp32Service.moveRight(currentSpeed);
        break;
      case 'stop':
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

  const handleSpeedChange = async (newSpeed: number) => {
    setCurrentSpeed(newSpeed);
    if (connectionInfo.status === 'connected') {
      const success = await esp32Service.setSpeed(newSpeed);
      if (!success) {
        Alert.alert('Speed Update Failed', 'Failed to update speed on simulator.');
      }
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionInfo.status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionInfo.status) {
      case 'connected':
        return '#10B981';
      case 'connecting':
        return '#F59E0B';
      case 'disconnected':
        return '#EF4444';
      case 'error':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getConnectionButtonText = () => {
    if (connectionInfo.status === 'connected') {
      return 'Disconnect';
    } else if (connectionInfo.status === 'connecting') {
      return 'Connecting...';
    } else {
      return 'Choose Connection';
    }
  };

  // Configuration functions
  const openConfigModal = () => {
    const config = configService.getConfig();
    setEsp32IpAddress(config.esp32IpAddress);
    setShowConfigModal(true);
  };

  const saveConfig = async () => {
    if (!ConnectionConfigService.isValidIpAddress(esp32IpAddress)) {
      Alert.alert('Invalid IP Address', 'Please enter a valid IP address (e.g., 192.168.1.100)');
      return;
    }

    await configService.updateEsp32IpAddress(esp32IpAddress);
    setShowConfigModal(false);
    Alert.alert('Configuration Saved', 'ESP32 IP address updated successfully!');
  };

  const scanForDevices = async () => {
    Alert.alert('Scanning Network', 'Looking for ESP32 devices... This may take a moment.');
    
    try {
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



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                 {/* Modern Header with Glassmorphism */}
         <View
           style={styles.header}
         >
           <View style={styles.headerContent}>
             <View style={styles.headerLeft}>
               <View style={styles.logoContainer}>
                 <Image
                   source={require('../../asset/logo_smarthom.png')}
                   style={styles.headerLogo}
                   resizeMode="contain"
                 />
               </View>
               <View style={styles.headerText}>
                 <Text style={styles.greeting}>Selamat Datang di</Text>
                 <Text style={styles.username}>SMARTHOM</Text>
                 <Text style={styles.userRole}>Kontrol Alat Simulasi Persalinan</Text>
               </View>
             </View>
             
             {/* Quick Disconnect Button */}
             {connectionInfo.status === 'connected' && (
               <TouchableOpacity
                 style={styles.headerDisconnectButton}
                 onPress={disconnect}
               >
                 <Text style={styles.headerDisconnectButtonText}>🔌</Text>
               </TouchableOpacity>
             )}
           </View>
         </View>

        {/* Status Cards with Modern Design */}
        <View style={styles.statusSection}>
          <View style={styles.statusGrid}>
            {/* Power Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusIconContainer}>
                <Text style={styles.statusIcon}>🔋</Text>
              </View>
              <Text style={styles.statusValue}>85%</Text>
              <Text style={styles.statusLabel}>Battery</Text>
            </View>

            {/* Speed Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusIconContainer}>
                <Text style={styles.statusIcon}>⚡</Text>
              </View>
              <Text style={styles.statusValue}>{currentSpeed}%</Text>
              <Text style={styles.statusLabel}>Speed</Text>
            </View>

            {/* Connection Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusIconContainer}>
                <Text style={styles.statusIcon}>📡</Text>
              </View>
              <Text style={[styles.statusValue, { color: getConnectionStatusColor() }]}>
                {getConnectionStatusText()}
              </Text>
              <Text style={styles.statusLabel}>Connection</Text>
            </View>
          </View>
        </View>



        {/* Direction Control with Enhanced D-Pad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 Kontrol Pergerakan Simulator</Text>
          <View style={styles.controlCard}>
            <View style={styles.dpadContainer}>
              {/* Top Button */}
              <TouchableOpacity
                style={[styles.dpadButton, styles.dpadTop]}
                onPress={() => handleControlPress('forward')}
                activeOpacity={0.6}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.dpadIcon}>▲</Text>
                  <Text style={styles.buttonLabel}>MAJU</Text>
                </View>
              </TouchableOpacity>

              {/* Center Row */}
              <View style={styles.dpadCenterRow}>
                {/* Left Button */}
                <TouchableOpacity
                  style={[styles.dpadButton, styles.dpadLeft]}
                  onPress={() => handleControlPress('left')}
                  activeOpacity={0.6}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.dpadIcon}>◀</Text>
                    <Text style={styles.buttonLabel}>KIRI</Text>
                  </View>
                </TouchableOpacity>

                {/* Center Button */}
                <View style={styles.dpadCenter}>
                  <View style={styles.centerCircle}>
                    <Text style={styles.dpadCenterText}>STOP</Text>
                  </View>
                </View>

                {/* Right Button */}
                <TouchableOpacity
                  style={[styles.dpadButton, styles.dpadRight]}
                  onPress={() => handleControlPress('right')}
                  activeOpacity={0.6}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.dpadIcon}>▶</Text>
                    <Text style={styles.buttonLabel}>KANAN</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Bottom Button */}
              <TouchableOpacity
                style={[styles.dpadButton, styles.dpadBottom]}
                onPress={() => handleControlPress('backward')}
                activeOpacity={0.6}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.dpadIcon}>▼</Text>
                  <Text style={styles.buttonLabel}>MUNDUR</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Speed Control with Modern Slider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Kontrol Kecepatan Simulator</Text>
          <View style={styles.speedCard}>
            <Text style={styles.speedTitle}>Current Speed: {currentSpeed}%</Text>
            <View style={styles.speedSliderContainer}>
              {[0, 25, 50, 75, 100].map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.speedButton,
                    currentSpeed === speed && styles.speedButtonActive,
                  ]}
                  onPress={() => handleSpeedChange(speed)}
                >
                  <Text style={[
                    styles.speedButtonText,
                    currentSpeed === speed && styles.speedButtonTextActive,
                  ]}>
                    {speed}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

                 {/* Connection Status and Control */}
         <View style={styles.section}>
           <Text style={styles.sectionTitle}>🔗 Status Koneksi</Text>
           
           {/* Connection Status Card */}
           <View style={styles.connectionStatusCard}>
             <View style={styles.connectionStatusHeader}>
               <View style={styles.connectionStatusIcon}>
                 <Text style={styles.connectionStatusIconText}>
                   {connectionInfo.status === 'connected' ? '✅' : '❌'}
                 </Text>
               </View>
               <View style={styles.connectionStatusInfo}>
                 <Text style={styles.connectionStatusTitle}>
                   {connectionInfo.status === 'connected' ? 'Terhubung' : 'Tidak Terhubung'}
                 </Text>
                 <Text style={styles.connectionStatusDesc}>
                   {connectionInfo.status === 'connected' 
                     ? `${connectionInfo.type.toUpperCase()} - ${connectionInfo.deviceName || 'Device'}`
                     : 'Belum ada koneksi aktif'
                   }
                 </Text>
                 {connectionInfo.status === 'connected' && (
                   <Text style={styles.connectionStatusSignal}>
                     Sinyal: {connectionInfo.signalStrength}%
                   </Text>
                 )}
               </View>
             </View>
             
             {/* Connection Action Button */}
             <TouchableOpacity
               style={[
                 styles.connectionActionButton,
                 connectionInfo.status === 'connected' 
                   ? styles.disconnectButton 
                   : styles.connectButton
               ]}
               onPress={toggleConnection}
             >
               <Text style={styles.connectionActionButtonText}>
                 {connectionInfo.status === 'connected' ? '🔌 Disconnect' : '🔗 Connect'}
               </Text>
             </TouchableOpacity>
           </View>
         </View>

         {/* Connection Options - Only show when disconnected */}
         {connectionInfo.status === 'disconnected' && (
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>🔗 Pilih Koneksi</Text>
             <View style={styles.connectionOptionsContainer}>
               <TouchableOpacity style={styles.connectionOptionCard} onPress={smartConnect}>
                 <View style={styles.connectionOptionIcon}>
                   <Text style={styles.connectionOptionIconText}>📶</Text>
                 </View>
                 <View style={styles.connectionOptionContent}>
                   <Text style={styles.connectionOptionTitle}>WiFi/IoT</Text>
                   <Text style={styles.connectionOptionDesc}>Koneksi jarak jauh dengan internet</Text>
                   <View style={styles.connectionFeatures}>
                     <Text style={styles.connectionFeature}>• Kontrol dari jarak jauh</Text>
                     <Text style={styles.connectionFeature}>• Monitoring real-time</Text>
                     <Text style={styles.connectionFeature}>• Data logging</Text>
                   </View>
                 </View>
               </TouchableOpacity>

               <TouchableOpacity style={styles.connectionOptionCard} onPress={smartConnect}>
                 <View style={styles.connectionOptionIcon}>
                   <Text style={styles.connectionOptionIconText}>🔵</Text>
                 </View>
                 <View style={styles.connectionOptionContent}>
                   <Text style={styles.connectionOptionTitle}>Bluetooth</Text>
                   <Text style={styles.connectionOptionDesc}>Koneksi langsung tanpa internet</Text>
                   <View style={styles.connectionFeatures}>
                     <Text style={styles.connectionFeature}>• Koneksi langsung</Text>
                     <Text style={styles.connectionFeature}>• Latency rendah</Text>
                     <Text style={styles.connectionFeature}>• Hemat baterai</Text>
                   </View>
                 </View>
               </TouchableOpacity>
             </View>
           </View>
         )}

         {/* Settings Section */}
         <View style={styles.section}>
           <Text style={styles.sectionTitle}>⚙️ Pengaturan Koneksi</Text>
           <View style={styles.settingsContainer}>
             <TouchableOpacity style={styles.settingCard} onPress={openConfigModal}>
               <View style={styles.settingIcon}>
                 <Text style={styles.settingIconText}>🔧</Text>
               </View>
               <View style={styles.settingContent}>
                 <Text style={styles.settingTitle}>Konfigurasi ESP32</Text>
                 <Text style={styles.settingDesc}>Atur IP address ESP32</Text>
               </View>
             </TouchableOpacity>

             <TouchableOpacity style={styles.settingCard} onPress={scanForDevices}>
               <View style={styles.settingIcon}>
                 <Text style={styles.settingIconText}>🔍</Text>
               </View>
               <View style={styles.settingContent}>
                 <Text style={styles.settingTitle}>Scan Perangkat</Text>
                 <Text style={styles.settingDesc}>Cari ESP32 di jaringan</Text>
               </View>
             </TouchableOpacity>
           </View>
         </View>
       </ScrollView>

       {/* Configuration Modal */}
       <Modal
         visible={showConfigModal}
         animationType="slide"
         transparent={true}
         onRequestClose={() => setShowConfigModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>⚙️ Konfigurasi ESP32</Text>
             
             <View style={styles.inputContainer}>
               <Text style={styles.inputLabel}>IP Address ESP32:</Text>
               <TextInput
                 style={styles.textInput}
                 value={esp32IpAddress}
                 onChangeText={setEsp32IpAddress}
                 placeholder="192.168.1.100"
                 keyboardType="numeric"
                 autoCapitalize="none"
               />
             </View>

             <View style={styles.modalButtons}>
               <TouchableOpacity
                 style={[styles.modalButton, styles.cancelButton]}
                 onPress={() => setShowConfigModal(false)}
               >
                 <Text style={styles.cancelButtonText}>Batal</Text>
               </TouchableOpacity>
               
               <TouchableOpacity
                 style={[styles.modalButton, styles.saveButton]}
                 onPress={saveConfig}
               >
                 <Text style={styles.saveButtonText}>Simpan</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>

       {/* Floating Disconnect Button */}
       {connectionInfo.status === 'connected' && (
         <TouchableOpacity
           style={styles.floatingDisconnectButton}
           onPress={disconnect}
         >
           <Text style={styles.floatingDisconnectButtonText}>🔌</Text>
         </TouchableOpacity>
       )}
     </SafeAreaView>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerLogo: {
    width: 50,
    height: 50,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 2,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statusSection: {
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 3,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  statusIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  connectionOptionsContainer: {
    gap: 12,
  },
  connectionOptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  connectionOptionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  connectionOptionIconText: {
    fontSize: 24,
  },
  connectionOptionContent: {
    flex: 1,
  },
  connectionOptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  connectionOptionDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  connectionFeatures: {
    gap: 2,
  },
  connectionFeature: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  controlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  dpadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadTop: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  dpadBottom: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  dpadLeft: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  dpadRight: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: '#A855F7',
  },
  dpadCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dpadButton: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    alignItems: 'center',
  },
  dpadIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dpadCenter: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  dpadCenterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  speedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  speedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  speedSliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedButton: {
    flex: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  speedButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#EC4899',
  },
  speedButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  speedButtonTextActive: {
    color: '#FFFFFF',
  },
  // Settings styles
  settingsContainer: {
    gap: 12,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  settingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIconText: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
     saveButtonText: {
     fontSize: 16,
     fontWeight: '600',
     color: '#FFFFFF',
   },
   // Connection Status styles
   connectionStatusCard: {
     backgroundColor: '#FFFFFF',
     borderRadius: 20,
     padding: 20,
     shadowColor: '#8B5CF6',
     shadowOffset: {
       width: 0,
       height: 4,
     },
     shadowOpacity: 0.1,
     shadowRadius: 12,
     elevation: 6,
     borderWidth: 1,
     borderColor: 'rgba(139, 92, 246, 0.1)',
   },
   connectionStatusHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 16,
   },
   connectionStatusIcon: {
     width: 50,
     height: 50,
     borderRadius: 25,
     backgroundColor: 'rgba(139, 92, 246, 0.1)',
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 16,
   },
   connectionStatusIconText: {
     fontSize: 24,
   },
   connectionStatusInfo: {
     flex: 1,
   },
   connectionStatusTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#1F2937',
     marginBottom: 4,
   },
   connectionStatusDesc: {
     fontSize: 14,
     color: '#6B7280',
     marginBottom: 4,
   },
   connectionStatusSignal: {
     fontSize: 12,
     color: '#8B5CF6',
     fontWeight: '600',
   },
   connectionActionButton: {
     paddingVertical: 12,
     paddingHorizontal: 20,
     borderRadius: 12,
     alignItems: 'center',
     borderWidth: 2,
   },
   connectButton: {
     backgroundColor: '#10B981',
     borderColor: '#10B981',
   },
   disconnectButton: {
     backgroundColor: '#EF4444',
     borderColor: '#EF4444',
   },
   connectionActionButtonText: {
     fontSize: 16,
     fontWeight: '600',
     color: '#FFFFFF',
   },
   // Header disconnect button
   headerDisconnectButton: {
     backgroundColor: 'rgba(239, 68, 68, 0.9)',
     borderRadius: 20,
     width: 40,
     height: 40,
     justifyContent: 'center',
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 2,
     },
     shadowOpacity: 0.3,
     shadowRadius: 4,
     elevation: 4,
   },
   headerDisconnectButtonText: {
     fontSize: 18,
     color: '#FFFFFF',
   },
   // Floating disconnect button
   floatingDisconnectButton: {
     position: 'absolute',
     bottom: 30,
     right: 20,
     backgroundColor: '#EF4444',
     borderRadius: 30,
     width: 60,
     height: 60,
     justifyContent: 'center',
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 4,
     },
     shadowOpacity: 0.3,
     shadowRadius: 8,
     elevation: 8,
     zIndex: 1000,
   },
   floatingDisconnectButtonText: {
     fontSize: 24,
     color: '#FFFFFF',
   },
});

export default HomeScreen;
