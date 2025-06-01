import React, { useEffect, useState } from 'react';

import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import LoginBackground from '../components/LoginBackground';
import CustomInput from '../components/CustomInput'; // 입력창 컴포넌트
import { TextInput } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const SignUpScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [step, setStep] = useState(1); // 현재 입력 단계를 관리
  const [idHelper, setIdHelper] = useState('');
  const [isIdTouched, setIsIdTouched] = useState(false);

  const [isIdValid, setIsIdValid] = useState(true);
  const [passwordHelper, setPasswordHelper] = useState('');
  const [passwordCheckHelper, setPasswordCheckHelper] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const [emailHelper, setEmailHelper] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationHelper, setVerificationHelper] = useState('');
  const [nameHelper, setNameHelper] = useState('');

  const [passwordCheck, setPasswordCheck] = useState(''); // formData에 없으면 따로
  const [showVerification, setShowVerification] = useState(false); // 인증번호 입력창 보이기
  const [timer, setTimer] = useState(0); // 0이면 타이머 비활성
  const [isFemale, setIsFemale] = useState(true); // 여자가 기본 선택
  const [formData, setFormData] = useState<{
    userId: string;
    password: string;
    name: string;
    email: string;
    age: string;
    gender: 'FEMALE' | 'MALE';
    nickname: string;
    type: string;
  }>({
    userId: '',
    password: '',
    name: '',
    email: '',
    age: '',
    gender: 'FEMALE',
    nickname: '',
    type: 'NORMAL',
  });


  const handleSubmit = () => {
    navigation.replace('ProfileSetting', {
      userInfo: {
        userId: formData.userId,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        type: formData.type,
      },
    });
  };

  // 타이머
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

  // 포맷타임
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
              <TouchableOpacity
                onPress={() => {
                  console.log('✅ 버튼 눌림');
                  handleSubmit();
                }}
              >
                <Text style={styles.endButton}>완료</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (step === 1) {
                    const isValidStep1 =
                      isIdTouched &&
                      isPasswordTouched &&
                      idHelper === '' &&
                      passwordHelper === '' &&
                      passwordCheckHelper === '';

                    if (isValidStep1) {
                      setStep(prev => prev + 1);
                    } else {
                      console.log('❌ step 1 유효성 검사 실패');
                    }
                  }
                  else {
                    setStep(prev => prev + 1);
                  }
                }}
              >
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
                <CustomInput
                  label="아이디"
                  placeholder="snap12"
                  helperText={isIdTouched && idHelper ? idHelper : ''}
                  value={formData.userId}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, userId: text }));
                    if (!isIdTouched) setIsIdTouched(true);

                    if (text.length < 4 || text.length > 12) {
                      setIdHelper('* 4~12자의 아이디를 입력해주세요');
                    } else {
                      setIdHelper('');
                    }
                  }}
                />
              </View>
              <View style={styles.inputGroup}>
                <CustomInput
                  label="비밀번호"
                  placeholder="snap1234^^"
                  helperText={isPasswordTouched && passwordHelper ? passwordHelper : ''}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, password: text }));
                    if (!isPasswordTouched) setIsPasswordTouched(true);

                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(text);
                    if (text.length < 8 || !hasSpecialChar) {
                      setPasswordHelper('* 8자 이상, 특수문자를 포함해주세요');
                      setIsPasswordValid(false);
                    } else {
                      setPasswordHelper('');
                      setIsPasswordValid(true);
                    }
                  }}
                />
              </View>

              <View style={styles.inputGroup}>
                <CustomInput
                  label="비밀번호 확인"
                  placeholder="snap1234^^"
                  helperText={passwordCheckHelper}
                  value={passwordCheck}
                  onChangeText={(text) => {
                    setPasswordCheck(text);
                    const match = text === formData.password;
                    setIsPasswordMatch(match);
                    setPasswordCheckHelper(
                      match ? '' : '* 비밀번호가 일치하지 않습니다'
                    );
                  }}
                />
              </View>
            </>
          )}
          {step === 2 && (
            <>
              <View style={styles.inputGroup}>
                <CustomInput
                  label="이메일"
                  placeholder="snap@gmail.com"
                  helperText={emailHelper}
                  showButton={true}
                  onPressButton={handleSendVerification}
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, email: text }));

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(text)) {
                      setEmailHelper('* 유효한 이메일 형식을 입력해주세요');
                      setIsEmailValid(false);
                    } else {
                      setEmailHelper('');
                      setIsEmailValid(true);
                    }
                  }}
                />

              </View>

              {showVerification && (
                <View style={styles.inputGroup}>
                  <CustomInput
                    label="인증번호"
                    placeholder="1234"
                    helperText={verificationHelper}
                    keyboardType="numeric"
                    value={verificationCode}
                    onChangeText={(text) => {
                      setVerificationCode(text);
                      // 아직 백 연결 안 됐으니까 숫자만 체크하자
                      if (text.length !== 4 || isNaN(Number(text))) {
                        setVerificationHelper('* 4자리 숫자를 입력해주세요');
                      } else {
                        setVerificationHelper('');
                      }
                    }}
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
                <CustomInput
                  label="이름"
                  placeholder="김스냅"
                  helperText={nameHelper}
                  value={formData.name}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, name: text }));
                    // 한글 이름 유효성 검사: 2자 이상
                    if (text.trim().length < 2) {
                      setNameHelper('* 이름은 최소 2자 이상 입력해주세요');
                    } else {
                      setNameHelper('');
                    }
                  }}
                />

              </View>

              {/* 나이 + 성별 */}
              <View style={[styles.inputGroup, { flexDirection: 'row', gap: 36, paddingHorizontal: 26 }]}>
                {/* 나이 입력 */}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 14, marginBottom: 6 }}>나이</Text>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#fff',
                      paddingVertical: 4,
                    }}
                  >
                    <TextInput
                      placeholder="23"
                      placeholderTextColor="#aaa"
                      keyboardType="numeric"
                      value={formData.age}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, age: text }))
                      }
                      style={{
                        fontSize: 16,
                        color: '#fff',
                        paddingVertical: 4,
                        paddingHorizontal: 0,
                      }}
                    />
                  </View>
                  <Text style={{ color: '#fff', fontSize: 12, marginTop: 3 }}>
                    * 나이를 입력해주세요
                  </Text>
                </View>


                {/* 성별 선택 */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>성별</Text>
                  <View style={{ flexDirection: 'row', gap: 7 }}>
                    <TouchableOpacity
                      style={[styles.genderButton, !isFemale && styles.genderButtonActive]}
                      onPress={() => {
                        setIsFemale(false);
                        setFormData((prev) => ({ ...prev, gender: 'MALE' }));
                      }}
                    >
                      <Text style={[styles.genderText, !isFemale && styles.genderTextActive]}>남자</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.genderButton, isFemale && styles.genderButtonActive]}
                      onPress={() => {
                        setIsFemale(true);
                        setFormData((prev) => ({ ...prev, gender: 'FEMALE' }));
                      }}
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
