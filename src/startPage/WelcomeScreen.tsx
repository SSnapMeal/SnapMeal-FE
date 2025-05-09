import React from 'react';
import { View, StyleSheet, Image, StatusBar, Dimensions, SafeAreaView, Text, Button } from 'react-native';

const { height } = Dimensions.get('window');

import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

import CustomInput from '../components/CustomInput';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const handlePress = () => {
    console.log('로그인 시도!');
    navigation.navigate('Home'); // 로그인 성공 시 이동
  };

  return (
    <>
      <StatusBar backgroundColor="#38B000" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.fullScreen}>
          <View style={styles.background} />
          {/*이미지*/}
          <Image
            source={require('../assets/images/camera.png')}
            style={styles.cameraImg}
            resizeMode="cover"
          />

          {/*박스*/}
          <View style={styles.box}>
            {/*앱네임*/}
            <Text style={styles.appName}>SnapMeal</Text>

            {/*로그인*/}
            <CustomInput placeholder="아이디" helperText="* 아이디를 입력해주세요" />
            <CustomInput placeholder="비밀번호" helperText="* 비밀번호를 입력해주세요" />
            
            {/*아이디/비밀번호 찾기*/}
            <TouchableOpacity onPress={() => navigation.navigate('FindAccount')}>
              <Text style={styles.findAccount}>아이디/비밀번호 찾기</Text>
            </TouchableOpacity>
            
            {/*로그인 버튼*/}
            <View style={styles.buttonContainer}>
              {/*일반로그인*/}
              <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.6}>
                <Text style={styles.loginButton}>로그인</Text>
              </TouchableOpacity>

              {/*카카오 로그인*/}
              <TouchableOpacity style={styles.kakaoButton} onPress={handlePress} activeOpacity={0.6}>
                <Image
                  source={require('../assets/images/kakao.png')}
                  style={styles.kakaoImg}
                  resizeMode="cover"
                />
                <Text style={styles.kakaoButtonText}>카카오톡 로그인</Text>
              </TouchableOpacity>
            </View>

            {/*회원가입 하러가기*/}
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
    color: '#000',
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
