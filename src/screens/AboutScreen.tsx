import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutScreen = () => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const teamMembers = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      role: 'Lead Developer',
      email: 'ahmad@smarthom.com',
      avatar: 'AR',
      description: 'Bertanggung jawab atas arsitektur aplikasi dan pengembangan fitur utama',
      skills: ['React Native', 'TypeScript', 'Node.js', 'Firebase']
    },
    {
      id: 2,
      name: 'Sarah Putri',
      role: 'UI/UX Designer',
      email: 'sarah@smarthom.com',
      avatar: 'SP',
      description: 'Mendesain interface yang user-friendly dan pengalaman pengguna yang optimal',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research']
    },
    {
      id: 3,
      name: 'Budi Santoso',
      role: 'Backend Developer',
      email: 'budi@smarthom.com',
      avatar: 'BS',
      description: 'Mengembangkan API dan sistem backend untuk mendukung aplikasi mobile',
      skills: ['Python', 'Django', 'PostgreSQL', 'AWS']
    },
    {
      id: 4,
      name: 'Dewi Kartika',
      role: 'QA Engineer',
      email: 'dewi@smarthom.com',
      avatar: 'DK',
      description: 'Memastikan kualitas aplikasi melalui testing yang komprehensif',
      skills: ['Manual Testing', 'Automation', 'Jira', 'Test Planning']
    },
    {
      id: 5,
      name: 'Rendi Pratama',
      role: 'DevOps Engineer',
      email: 'rendi@smarthom.com',
      avatar: 'RP',
      description: 'Mengelola infrastruktur dan deployment aplikasi',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Computing']
    }
  ];

  const appFeatures = [
    {
      icon: '🤖',
      title: 'Simulator Control',
      description: 'Kontrol alat simulasi persalinan dengan interface yang intuitif dan responsif'
    },
    {
      icon: '📡',
      title: 'Dual Connection',
      description: 'Dukungan WiFi/IoT dan Bluetooth untuk fleksibilitas koneksi'
    },
    {
      icon: '🎮',
      title: 'D-Pad Control',
      description: 'Kontrol arah dengan D-pad yang nyaman untuk penggunaan satu tangan'
    },
    {
      icon: '⚡',
      title: 'Speed Control',
      description: 'Pengaturan kecepatan yang presisi dari 0-100% untuk simulasi realistis'
    },
    {
      icon: '🔋',
      title: 'Real-time Monitoring',
      description: 'Monitor status baterai dan koneksi simulator secara real-time'
    },
    {
      icon: '🛑',
      title: 'Emergency Control',
      description: 'Tombol emergency stop dan reset untuk keamanan pelatihan'
    }
  ];

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
                <Text style={styles.title}>ℹ️ Tentang SMARTHOM</Text>
                <Text style={styles.subtitle}>Aplikasi Smart Home Terdepan</Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Info with Modern Card */}
        <View style={styles.section}>
          <View style={styles.appInfoCard}>
            <View style={styles.appLogoContainer}>
              <Image
                source={require('../../asset/logo_smarthom.png')}
                style={styles.appLogoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>SMARTHOM</Text>
            <Text style={styles.appVersion}>Versi 1.0.0</Text>
            <Text style={styles.appDescription}>
              SMARTHOM adalah aplikasi mobile revolusioner untuk kontrol alat simulasi persalinan 
              dengan interface yang intuitif dan responsif. Dilengkapi dengan D-pad control, 
              speed control, dan dual connection (WiFi/Bluetooth) untuk memberikan pengalaman 
              kontrol yang sempurna dalam pelatihan medis persalinan.
            </Text>
          </View>
        </View>

        {/* App Features with Modern Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Fitur Unggulan</Text>
          <View style={styles.featuresGrid}>
            {appFeatures.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Company Info with Modern Design */}
        <View style={styles.section}>
          <View style={styles.companyCard}>
            <View style={styles.companyIconContainer}>
              <Text style={styles.companyIcon}>🏢</Text>
            </View>
            <Text style={styles.companyTitle}>Tentang Perusahaan</Text>
            <Text style={styles.companyDescription}>
              SMARTHOM adalah startup teknologi yang berfokus pada pengembangan solusi kontrol alat simulasi medis 
              yang inovatif dan user-friendly. Didirikan pada tahun 2023, kami berkomitmen untuk 
              menghadirkan teknologi simulasi persalinan yang terjangkau dan mudah digunakan untuk 
              pelatihan tenaga medis.
            </Text>
            <View style={styles.companyStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Rumah Sakit</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1000+</Text>
                <Text style={styles.statLabel}>Tenaga Medis</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>99.9%</Text>
                <Text style={styles.statLabel}>Akurasi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Team with Modern Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Tim Pengembang</Text>
          <Text style={styles.teamDescription}>
            Tim kami terdiri dari para profesional berpengalaman yang berdedikasi 
            untuk menghadirkan solusi kontrol alat simulasi persalinan terbaik bagi tenaga medis.
          </Text>
          {teamMembers.map((member) => (
            <View key={member.id} style={styles.teamMember}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitial}>{member.avatar}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberDescription}>{member.description}</Text>
                <View style={styles.skillsContainer}>
                  {member.skills.map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.memberEmail}>{member.email}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tech Stack with Modern Design */}
        <View style={styles.section}>
          <View style={styles.techCard}>
            <View style={styles.techIconContainer}>
              <Text style={styles.techIcon}>🛠️</Text>
            </View>
            <Text style={styles.techTitle}>Teknologi</Text>
            <Text style={styles.techDescription}>
              SMARTHOM dibangun menggunakan teknologi modern dan terdepan untuk 
              memastikan performa kontrol alat simulasi persalinan yang optimal, keamanan koneksi, dan akurasi simulasi.
            </Text>
            <View style={styles.techList}>
              <View style={styles.techItem}>
                <Text style={styles.techName}>Frontend</Text>
                <Text style={styles.techDetails}>React Native, TypeScript, Redux</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techName}>Backend</Text>
                <Text style={styles.techDetails}>Node.js, Express, MongoDB</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techName}>Medical Simulation</Text>
                <Text style={styles.techDetails}>Arduino, ESP32, WiFi/Bluetooth</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techName}>Security</Text>
                <Text style={styles.techDetails}>SSL/TLS, JWT, HIPAA Compliance</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact with Modern Gradient */}
        <View style={styles.section}>
          <View
            style={styles.contactCard}
          >
            <View style={styles.contactIconContainer}>
              <Text style={styles.contactIcon}>📞</Text>
            </View>
            <Text style={styles.contactTitle}>Hubungi Kami</Text>
            <Text style={styles.contactDescription}>
              Kami siap membantu Anda dengan pertanyaan, saran, atau dukungan teknis.
            </Text>
            <View style={styles.contactInfo}>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => openLink('mailto:support@smarthom.com')}
              >
                <Text style={styles.contactItemIcon}>📧</Text>
                <Text style={styles.contactItemText}>support@smarthom.com</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => openLink('https://smarthom.com')}
              >
                <Text style={styles.contactItemIcon}>🌐</Text>
                <Text style={styles.contactItemText}>www.smarthom.com</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => openLink('tel:+6281234567890')}
              >
                <Text style={styles.contactItemIcon}>📞</Text>
                <Text style={styles.contactItemText}>+62 812-3456-7890</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => openLink('https://instagram.com/smarthom')}
              >
                <Text style={styles.contactItemIcon}>📱</Text>
                <Text style={styles.contactItemText}>@smarthom</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>
            © 2024 SMARTHOM. All rights reserved.
          </Text>
          <Text style={styles.copyrightText}>
            Dibuat dengan ❤️ di Indonesia
          </Text>
          <Text style={styles.copyrightText}>
            Versi 1.0.0 | Build 2024.01.15
          </Text>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginTop: -20,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  appLogoContainer: {
    marginBottom: 16,
  },
  appLogoImage: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 16,
    color: '#EC4899',
    fontWeight: '600',
    marginBottom: 16,
  },
  appDescription: {
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
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
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
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
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
  companyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  companyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyIcon: {
    fontSize: 30,
  },
  companyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  companyDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  teamDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  teamMember: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
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
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#EC4899',
    fontWeight: '500',
    marginBottom: 8,
  },
  memberDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  skillTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  memberEmail: {
    fontSize: 12,
    color: '#8B5CF6',
  },
  techCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  techIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  techIcon: {
    fontSize: 30,
  },
  techTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  techDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  techList: {
    width: '100%',
  },
  techItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  techName: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  techDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactCard: {
    backgroundColor: '#EC4899',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIcon: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  contactInfo: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  contactItemIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#FFFFFF',
  },
  contactItemText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  copyright: {
    padding: 20,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default AboutScreen;
