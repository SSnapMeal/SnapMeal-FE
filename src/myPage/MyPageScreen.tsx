import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import Navigation from '../components/Navigation';

const MypageScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView style={styles.container}>
        {/* 상단 사용자 정보 */}
        <View style={styles.profileSection}>
          <Image
            source={require('../assets/images/profile.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileTextBox}>
            <Text style={styles.profileName}>김스냅님</Text>
            <Text style={styles.profileType}>#디저트 집착 유형</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* 권장 정보 */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>권장 칼로리: 2,000kcal</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>권장 운동량: 5km</Text></View>
        </View>

        {/* 섹션: 내 정보 */}
        <Text style={styles.sectionTitle}>내 정보</Text>
        <View style={styles.sectionDivider} />
        {['식사기록 요약', '활동 내역', '친구 목록', '가입한 커뮤니티'].map((label, idx) => (
          <TouchableOpacity key={idx} style={styles.menuItem}>
            <Text style={styles.menuText}>{label}</Text>
          </TouchableOpacity>
        ))}

        {/* 섹션: 이용 안내 */}
        <Text style={styles.sectionTitleGreen}>이용 안내</Text>
        <View style={styles.sectionDividerGreen} />
        {['문의사항', '공지사항', '앱 정보'].map((label, idx) => (
          <TouchableOpacity key={idx} style={styles.menuItem}>
            <Text style={styles.menuText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Navigation />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  profileTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileType: {
    fontSize: 13,
    color: '#555',
  },
  arrow: {
    fontSize: 18,
    color: '#999',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#E6F4EA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 13,
    color: '#333',
  },
  sectionTitle: {
    color: '#38B000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#38B000',
    marginVertical: 12,
  },
  sectionTitleGreen: {
    color: '#38B000',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 32,
  },
  sectionDividerGreen: {
    height: 1,
    backgroundColor: '#38B000',
    marginVertical: 12,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 15,
  },
});

export default MypageScreen;
