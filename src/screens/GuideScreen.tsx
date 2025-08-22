import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GuideScreen = () => {
  const guideSteps = [
    {
      id: 1,
      title: 'Persiapan Simulator',
      description: 'Pastikan alat simulasi persalinan sudah terhubung ke power supply dan siap untuk dikontrol.',
      icon: '🔌',
      color: '#FF6B9D',
      tips: [
        'Periksa koneksi power supply simulator',
        'Pastikan simulator dalam mode normal (tidak dalam mode maintenance)',
        'Periksa LED status pada simulator'
      ]
    },
    {
      id: 2,
      title: 'Pilih Koneksi',
      description: 'Pilih metode koneksi yang sesuai: WiFi/IoT untuk jarak jauh atau Bluetooth untuk koneksi langsung.',
      icon: '📡',
      color: '#8B5CF6',
      tips: [
        'WiFi/IoT: Untuk kontrol jarak jauh dengan internet',
        'Bluetooth: Untuk koneksi langsung tanpa internet',
        'Pastikan perangkat dalam jangkauan sinyal',
        'Ikuti instruksi pairing yang muncul di layar'
      ]
    },
    {
      id: 3,
      title: 'Kontrol Pergerakan',
      description: 'Gunakan D-pad untuk mengontrol arah pergerakan simulator dengan presisi.',
      icon: '🎮',
      color: '#06B6D4',
      tips: [
        'Tap tombol MAJU untuk gerakan ke depan',
        'Tap tombol MUNDUR untuk gerakan ke belakang',
        'Tap tombol KIRI/KANAN untuk belok',
        'Gunakan dengan satu tangan untuk kenyamanan'
      ]
    },
    {
      id: 4,
      title: 'Pengaturan Kecepatan',
      description: 'Atur kecepatan simulator dari 0-100% sesuai kebutuhan pelatihan.',
      icon: '⚡',
      color: '#10B981',
      tips: [
        'Pilih kecepatan 0% untuk berhenti total',
        'Kecepatan 25-50% untuk kontrol presisi',
        'Kecepatan 75-100% untuk gerakan cepat',
        'Monitor status kecepatan di real-time'
      ]
    },
    {
      id: 5,
      title: 'Quick Actions',
      description: 'Gunakan tombol quick action untuk fungsi-fungsi penting seperti stop dan reset.',
      icon: '🛑',
      color: '#F59E0B',
      tips: [
        'STOP: Emergency stop untuk menghentikan semua gerakan',
        'RESET: Reset simulator ke kondisi awal',
        'AUTO: Mode otomatis untuk simulasi berulang',
        'DATA: Lihat log aktivitas dan status simulator'
      ]
    },
    {
      id: 6,
      title: 'Monitoring & Troubleshooting',
      description: 'Pantau status koneksi, baterai, dan periksa jika ada masalah.',
      icon: '📊',
      color: '#EF4444',
      tips: [
        'Monitor level baterai di status card',
        'Periksa kekuatan sinyal koneksi',
        'Restart aplikasi jika kontrol tidak responsif',
        'Periksa koneksi fisik simulator jika diperlukan'
      ]
    }
  ];

  const features = [
    {
      icon: '🎮',
      title: 'D-Pad Control',
      description: 'Kontrol arah yang intuitif dan nyaman'
    },
    {
      icon: '⚡',
      title: 'Speed Control',
      description: 'Pengaturan kecepatan yang presisi'
    },
    {
      icon: '📡',
      title: 'Dual Connection',
      description: 'WiFi dan Bluetooth support'
    },
    {
      icon: '🔋',
      title: 'Real-time Status',
      description: 'Monitor baterai dan koneksi'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Image
                source={require('../../asset/logo_smarthom.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <View style={styles.headerText}>
                <Text style={styles.title}>📖 Panduan Aplikasi</Text>
                <Text style={styles.subtitle}>Cara menggunakan SMARTHOM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Start */}
        <View style={styles.section}>
          <View style={styles.quickStartCard}>
            <Text style={styles.quickStartIcon}>🚀</Text>
            <Text style={styles.quickStartTitle}>Mulai Cepat</Text>
            <Text style={styles.quickStartDescription}>
              Ikuti langkah-langkah di bawah ini untuk memulai menggunakan aplikasi SMARTHOM 
              untuk kontrol alat simulasi persalinan Anda.
            </Text>
          </View>
        </View>

        {/* Guide Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Langkah-langkah Penggunaan</Text>
          {guideSteps.map((step) => (
            <View key={step.id} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={[styles.stepIcon, { backgroundColor: step.color }]}>
                  <Text style={styles.stepIconText}>{step.icon}</Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={styles.stepNumber}>Langkah {step.id}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
              </View>
              <Text style={styles.stepDescription}>{step.description}</Text>
              
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>💡 Tips:</Text>
                {step.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Fitur Unggulan</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Troubleshooting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Troubleshooting</Text>
          <View style={styles.troubleshootCard}>
            <View style={styles.troubleshootItem}>
              <View style={styles.troubleshootIcon}>
                <Text style={styles.troubleshootIconText}>❓</Text>
              </View>
              <View style={styles.troubleshootContent}>
                <Text style={styles.troubleshootTitle}>Simulator tidak merespons?</Text>
                <Text style={styles.troubleshootText}>
                  Pastikan simulator terhubung ke power supply dan dalam mode normal (tidak dalam mode maintenance).
                </Text>
              </View>
            </View>
            <View style={styles.troubleshootItem}>
              <View style={styles.troubleshootIcon}>
                <Text style={styles.troubleshootIconText}>⚠️</Text>
              </View>
              <View style={styles.troubleshootContent}>
                <Text style={styles.troubleshootTitle}>Kontrol tidak responsif?</Text>
                <Text style={styles.troubleshootText}>
                  Periksa koneksi WiFi/Bluetooth dan restart aplikasi jika diperlukan.
                </Text>
              </View>
            </View>
            <View style={styles.troubleshootItem}>
              <View style={styles.troubleshootIcon}>
                <Text style={styles.troubleshootIconText}>🔑</Text>
              </View>
              <View style={styles.troubleshootContent}>
                <Text style={styles.troubleshootTitle}>Koneksi terputus?</Text>
                <Text style={styles.troubleshootText}>
                  Periksa jarak perangkat dan kekuatan sinyal koneksi.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <View style={styles.supportCard}>
            <Text style={styles.supportIcon}>📞</Text>
            <Text style={styles.supportTitle}>Butuh Bantuan?</Text>
            <Text style={styles.supportText}>
              Jika Anda mengalami kesulitan atau memiliki pertanyaan, jangan ragu untuk menghubungi tim support kami:
            </Text>
            <View style={styles.supportInfo}>
              <TouchableOpacity style={styles.supportItem}>
                <Text style={styles.supportItemIcon}>📧</Text>
                <Text style={styles.supportItemText}>support@smarthom.com</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.supportItem}>
                <Text style={styles.supportItemIcon}>🌐</Text>
                <Text style={styles.supportItemText}>www.smarthom.com</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.supportItem}>
                <Text style={styles.supportItemIcon}>📞</Text>
                <Text style={styles.supportItemText}>+62 812-3456-7890</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickStartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: -20,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  quickStartIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  quickStartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  quickStartDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepIconText: {
    fontSize: 24,
  },
  stepInfo: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 12,
    color: '#EC4899',
    fontWeight: '600',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipsContainer: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 14,
    color: '#EC4899',
    marginRight: 8,
    marginTop: 1,
  },
  tipText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
    lineHeight: 18,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  troubleshootCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  troubleshootItem: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  troubleshootIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  troubleshootIconText: {
    fontSize: 18,
  },
  troubleshootContent: {
    flex: 1,
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  troubleshootText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  supportCard: {
    backgroundColor: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  supportIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  supportInfo: {
    width: '100%',
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  supportItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  supportItemText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default GuideScreen;
