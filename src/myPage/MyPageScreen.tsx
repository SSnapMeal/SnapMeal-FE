import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navigation from '../components/Navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

const MypageScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // 알림 개수
  const [unreadCount] = useState(1);

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView style={styles.container}>

        {/* 상단 알림 버튼 */}
        <View style={styles.bellContainer}>
          <TouchableOpacity
            style={styles.bellWrapper}
            onPress={() => navigation.navigate('Notification')}
          >
            <Image
              source={require('../assets/images/bell.png')}
              style={styles.bell}
            />
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

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
          <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
            <Image
              source={require('../assets/images/profileSetting-arrow.png')}
              style={[styles.arrowImage]}
            />
          </TouchableOpacity>
        </View>

        {/* 권장 정보 */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>권장 칼로리: 2,000kcal</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>권장 운동량: 5km</Text></View>
        </View>

        {/* 섹션: 내 정보 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>내 정보</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {['식사기록 요약', '활동 내역', '친구 목록', '가입한 커뮤니티'].map((label, idx) => (
          <TouchableOpacity key={idx} style={styles.menuItem}>
            <Text style={styles.menuText}>{label}</Text>
          </TouchableOpacity>
        ))}

        {/* 섹션: 이용 안내 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>이용 정보</Text>
          <View style={styles.sectionDividerLine} />
        </View>

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
    paddingHorizontal: 26,
    paddingTop: 6,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 40,
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
    fontSize: 14,
    marginTop: 2,
  },
  arrowImage: {
    width: 21,
    height: 42,
  },
  bellContainer: {
    alignItems: 'flex-end',
  },
  bellWrapper: {
    position: 'relative',
    width: 28,
    height: 28,
  },
  bell: {
    width: 28,
    height: 28,
  },
  bellBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#E9F6E2',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  badgeText: {
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  sectionTitle: {
    color: '#38B000',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 12,
    lineHeight: 18,
  },
  sectionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#38B000',
  },
  menuItem: {
    paddingVertical: 20,
  },
  menuText: {
    fontSize: 16,
  },
});

export default MypageScreen;
