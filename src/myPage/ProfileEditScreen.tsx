import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';


import Header from '../components/Header';

const ProfileEditScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Header title="프로필 설정" />
      <View style={styles.container}>
        {/* 상단 프로필 정보 */}
        <View style={styles.profileBox}>
          <Image
            source={require('../assets/images/profileEdit.png')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.profileName}>김스냅님</Text>
          <Text style={styles.profileType}>#디저트 집착 유형</Text>
        </View>

        {/* 메뉴 항목들 */}
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.menuItem}  onPress={() => navigation.navigate('EditGoal')}>
            <Text style={styles.menuText}>권장 칼로리/운동량 수정</Text>
            <Image
              source={require('../assets/images/profileSetting-arrow.png')}
              style={styles.arrowImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}  onPress={() => navigation.navigate('EditIdNick')}>
            <Text style={styles.menuText}>아이디/닉네임 수정</Text>
            <Image
              source={require('../assets/images/profileSetting-arrow.png')}
              style={styles.arrowImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}  onPress={() => navigation.navigate('EditPass')}>
            <Text style={styles.menuText}>비밀번호 수정</Text>
            <Image
              source={require('../assets/images/profileSetting-arrow.png')}
              style={styles.arrowImage}
            />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <Text style={styles.menuText}>계정정보</Text>
            <Text style={styles.kakaoLogin}>카카오 로그인</Text>
          </View>
        </View>

        {/* 하단 버튼 */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.bottomText}>로그아웃</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.bottomText}>회원탈퇴</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 46,
    backgroundColor: '#fff',
  },
  profileBox: {
    marginBottom: 38,
    alignItems: 'center',
  },
  profileImage: {
    width: 88,
    height: 88,
    resizeMode: 'contain',
  },
  profileText: {
    marginBottom: 37,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileType: {
    fontSize: 14,
    marginTop: 2,
  },
  menuBox: {
    gap: 37,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  menuText: {
    fontSize: 16,
  },
  arrowImage: {
    width: 21,
    height: 42,
    resizeMode: 'contain',
  },
  kakaoLogin: {
    fontSize: 16,
    color: '#757575',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    gap: 20,
  },
  bottomText: {
    fontSize: 14,
    color: '#757575',
  },
  separator: {
    color: '#757575',
  },
});

export default ProfileEditScreen;
