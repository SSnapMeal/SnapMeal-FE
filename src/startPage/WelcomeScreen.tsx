import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  StatusBar, 
  Dimensions, 
  SafeAreaView, 
  Text, 
  Alert, 
  Linking 
} from 'react-native';

import { TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const KAKAO_AUTH_URL = `https://accounts.kakao.com/login/?continue=https%3A%2F%2Fkauth.kakao.com%2Foauth%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3D0fe99e36a3be9338e0997100509d18f8%26redirect_uri%3Dhttp%253A%252F%252Fapi.snapmeal.store%252Fusers%252Foauth%252Fkakao%252Fcallback%26through_account%3Dtrue#login`;

  /** 
   * 일반 로그인 
   */
  const handleNormalLogin = async () => {
    let isValid = true;

    // 유효성 검사
    if (userId.trim() === '') {
      setUserIdError('* 아이디를 입력해주세요');
      isValid = false;
    } else {
      setUserIdError('');
    }

    if (password.trim() === '') {
      setPasswordError('* 비밀번호를 입력해주세요');
      isValid = false;
    // } else if (password.trim().length < 8) {
    //   setPasswordError('* 비밀번호는 8자 이상이어야 합니다');
    //   isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    try {
      // 로그인 API 요청
      const response = await axios.post('http://api.snapmeal.store/users/sign-in', {
        userId: userId.trim(),
        password: password.trim(),
      });

      // 토큰 추출
      const { accessToken, refreshToken } = response.data.tokenServiceResponse;
      const role = response.data.role;

      console.log('로그인 성공');
      console.log('User ID:', userId);
      console.log('Role:', role);
      console.log('Access Token:', accessToken);

      // 토큰 저장
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      // 저장 확인 로그
      const storedToken = await AsyncStorage.getItem('accessToken');
      console.log('저장된 Access Token:', storedToken);

      // 홈으로 이동
      navigation.navigate('Home');

    } catch (error) {
      console.error(error);
      Alert.alert('로그인 실패', '아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const handleKakaoLogin = () => {
    console.log('🟡 카카오 로그인 버튼 클릭됨!');
    Linking.openURL(KAKAO_AUTH_URL);
  };

  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      try {
        const url = event.url;
        console.log('📥 앱이 받은 딥링크 URL:', url);

        const [schemeAndPath, queryString] = url.split('?');
        const path = schemeAndPath.split('://')[1] ?? '';

        // URL 파라미터 파싱
        const params: Record<string, string> = {};
        if (queryString) {
          queryString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
              params[key] = decodeURIComponent(value);
            }
          });
        }

        const accessToken = params.token; // ❗ 실제 서버에서 내려주는 키 확인 필요

        if (accessToken) {
          await AsyncStorage.setItem('accessToken', accessToken);
          console.log('✅ 카카오 토큰 저장 완료');

          if (path === 'profile-setup') {
            navigation.navigate('ProfileSetting', { userInfo: undefined });
          } else {
            navigation.navigate('Home');
          }
        } else {
          console.warn('⚠️ accessToken이 없음');
        }
      } catch (err) {
        console.error('❌ 딥링크 처리 중 오류:', err);
      }
    };

    // 이벤트 리스너 등록
    const sub = Linking.addEventListener('url', handleUrl);

    // 앱 최초 실행 시 초기 URL 확인
    Linking.getInitialURL().then(url => {
      if (url) {
        handleUrl({ url });
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#38B000" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.fullScreen}>
          <View style={styles.background} />

          {/* 카메라 이미지 */}
          <Image
            source={require('../assets/images/camera.png')}
            style={styles.cameraImg}
            resizeMode="cover"
          />

          {/* 로그인 박스 */}
          <View style={styles.box}>
            <Text style={styles.appName}>SnapMeal</Text>

            {/* 아이디 입력 */}
            <CustomInput
              placeholder="아이디"
              value={userId}
              onChangeText={(text) => {
                setUserId(text);
                if (text.trim()) setUserIdError('');
              }}
              helperText={userIdError || ' '}
            />

            {/* 비밀번호 입력 */}
            <CustomInput
              placeholder="비밀번호"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text.trim()) setPasswordError('');
              }}
              helperText={passwordError || ' '}
              secureTextEntry
            />

            {/* 아이디/비밀번호 찾기 */}
            <TouchableOpacity onPress={() => navigation.navigate('FindAccount')}>
              <Text style={styles.findAccount}>아이디/비밀번호 찾기</Text>
            </TouchableOpacity>

            {/* 버튼 영역 */}
            <View style={styles.buttonContainer}>
              {/* 일반 로그인 버튼 */}
              <TouchableOpacity style={styles.button} onPress={handleNormalLogin} activeOpacity={0.6}>
                <Text style={styles.loginButton}>로그인</Text>
              </TouchableOpacity>

              {/* 카카오 로그인 버튼 */}
              <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin} activeOpacity={0.6}>
                <Image
                  source={require('../assets/images/kakao.png')}
                  style={styles.kakaoImg}
                  resizeMode="cover"
                />
                <Text style={styles.kakaoButtonText}>카카오톡 로그인</Text>
              </TouchableOpacity>
            </View>

            {/* 회원가입 */}
            <View style={styles.signUpWrap}>
              <Text style={styles.signUp}>아직 계정이 없다면?</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpLink}>   회원가입 하러가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    position: 'relative',
    height: '100%'
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: height,
    backgroundColor: '#38B000',
    zIndex: -1,
    position: 'absolute',
  },
  cameraImg: {
    position: 'absolute',
    top: 30,
    left: 50,
    width: 400,
    height: 400,
    transform: [{ rotate: '-20deg' }],
    zIndex: 1,
  },
  box: {
    position: 'absolute',
    width: '100%',
    height: 529,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 2,
    bottom: 0,
  },
  appName: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Yellowtail-Regular',
    fontSize: 40,
    fontWeight: '400',
    lineHeight: 48,
    marginTop: 24.33
  },
  findAccount: {
    color: '#B8B8B8',
    marginTop: 20,
    fontSize: 12,
    position: 'absolute',
    top: -25,
    right: 26,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 26,
    paddingTop: 54.45,
  },
  button: {
    backgroundColor: '#38B000',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 57.245,
    marginBottom: 10.1
  },
  loginButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 57.245,
    marginBottom: 10.1,
  },
  kakaoButtonText: {
    color: '#17171B',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16
  },
  kakaoImg: {
    position: 'absolute',
    left: 24.69,
    width: 22.619,
    height: 22.619,
  },
  signUpWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16.27,
  },

  signUp: {
    color: '#C3C3C3',
    fontSize: 12,
    lineHeight: 16,
  },

  signUpLink: {
    color: '#FEE500',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 16,
  },


});

export default WelcomeScreen;
