import React, { useEffect, useState } from 'react';

import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import LoginBackground from '../components/LoginBackground';
import CustomInput from '../components/CustomInput'; // 입력창 컴포넌트
import CustomNumInput from '../components/CustomNumInput';

const { height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const SignUpScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [step, setStep] = useState(1); // 현재 입력 단계를 관리
  const [showVerification, setShowVerification] = useState(false); // 인증번호 입력창 보이기
  const [timer, setTimer] = useState(0); // 0이면 타이머 비활성
  const [isFemale, setIsFemale] = useState(true); // 여자가 기본 선택


  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) clearInterval(interval);
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleSendVerification = () => {
    setShowVerification(true); // 인증번호 입력창 보여줘
    setTimer(179);             // 3분 타이머 시작
  };

  return (
    <>
      <LoginBackground />

      {/* 배경 위에 덮는 입력폼 */}
      <SafeAreaView style={styles.container}>
        {/* 상단 네비 */}
        <View style={styles.topNav}>
          {/* 왼쪽 영역 */}
          <View style={styles.sideBox}>
            {step === 1 ? (
              <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                <Image
                  source={require('../assets/images/backArrow.png')}
                  style={styles.backArrow}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setStep(prev => prev - 1)}>
                <Text style={styles.prevButton}>&lt;&lt; 이전</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 중앙 프로그래스 바 */}
          <View style={styles.progressBar}>
            {[0, 1, 2].map((idx) => (
              <View
                key={idx}
                style={step === idx + 1 ? styles.progressFilled : styles.progressEmpty}
              />
            ))}
          </View>

          {/* 오른쪽 영역 */}
          <View style={styles.sideBox}>
            {step === 3 ? (
              <TouchableOpacity onPress={() => navigation.replace('ProfileSetting')}>
                <Text style={styles.endButton}>완료</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setStep(prev => prev + 1)}>
                <Text style={styles.nextButton}>다음 &gt;&gt;</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>


        {/* 입력폼 */}
        <View style={styles.inputSection}>
          {step == 1 && (
            <>
              <View style={styles.inputGroup}>
                <CustomInput label="아이디" placeholder="snap12" helperText="* 아이디를 입력해주세요" />
              </View>

              <View style={styles.inputGroup}>
                <CustomInput label="비밀번호" placeholder="snap1234^^" helperText="* 비밀번호를 입력해주세요" />
              </View>

              <View style={styles.inputGroup}>
                <CustomInput label="비밀번호 확인" placeholder="snap1234^^" helperText="* 비밀번호가 일치하지 않습니다" />
              </View>
            </>
          )}
          {step === 2 && (
            <>
              <View style={styles.inputGroup}>
                <CustomInput
                  label="이메일"
                  placeholder="snap@gmail.com"
                  helperText="* 안내메시지"
                  showButton={true}
                  onPressButton={handleSendVerification}
                />
              </View>

              {showVerification && (
                <View style={styles.inputGroup}>
                  <CustomInput
                    label="인증번호"
                    placeholder="1234"
                    helperText="* 인증번호가 일치하지 않습니다"
                    keyboardType="numeric"
                    rightElement={
                      timer === 0 ? (
                        <TouchableOpacity onPress={handleSendVerification}>
                          <Text style={{ color: '#38B000', fontWeight: 'bold' }}>재전송</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={{ color: '#38B000', fontWeight: 'bold' }}>
                          {formatTime(timer)}
                        </Text>
                      )
                    }
                  />
                </View>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.inputGroup}>
                <CustomInput label="이름" placeholder="김스냅" helperText="* 이름을 입력해주세요" />
              </View>

              {/* 나이 + 성별 */}
              <View style={[styles.inputGroup, { flexDirection: 'row', gap: 36, paddingHorizontal: 26 }]}>
                {/* 나이 입력 */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>나이</Text>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'white' }}>
                    <CustomNumInput
                      label="나이"
                      placeholder="23"
                      helperText="* 나이를 입력해주세요"
                      labelColor="#fff"
                      borderColor="#fff"
                    />

                  </View>
                  <Text style={styles.helperText}>* 안내메시지</Text>
                </View>

                {/* 성별 선택 */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>성별</Text>
                  <View style={{ flexDirection: 'row', marginBottom: 4, gap: 7 }}>
                    <TouchableOpacity
                      style={[styles.genderButton, !isFemale && styles.genderButtonActive]}
                      onPress={() => setIsFemale(false)}
                    >
                      <Text style={[styles.genderText, !isFemale && styles.genderTextActive]}>남자</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderButton, isFemale && styles.genderButtonActive]}
                      onPress={() => setIsFemale(true)}
                    >
                      <Text style={[styles.genderText, isFemale && styles.genderTextActive]}>여자</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </>
          )}

        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: height,
    zIndex: 10,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 11,
    height: 64,
  },

  backArrow: {
    width: 53,
    height: 53
  },
  prevButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  endButton: {
    color: '#38B000',
    fontSize: 16,
    fontWeight: '700',
  },
  sideBox: {
    width: 70, // 좌우 같은 너비로 설정
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    justifyContent: 'center', // 중앙 정렬 유지
  },

  progressFilled: {
    width: 51,
    height: 5,
    backgroundColor: '#38B000',
    borderRadius: 2.5,
  },
  progressEmpty: {
    width: 51,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 2.5,
  },
  inputSection: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 30,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  helperText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
  separator: {
    marginTop: 5,
    height: 1,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 8,
  },

  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginTop: 2
  },
  genderButtonActive: {
    backgroundColor: '#38B000',
    borderColor: '#38B000',
  },
  genderText: {
    color: '#fff',
    fontWeight: '700',
    marginTop: -1,
  },
  genderTextActive: {
    color: '#fff',
  },


});

export default SignUpScreen;
