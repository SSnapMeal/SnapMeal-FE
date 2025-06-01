import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import LoginBackground from '../components/LoginBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../components/CustomInput';
import AccountFinderTabs from '../components/AccountFinderTabs';
import NextButton from '../components/NextButton';

const { height } = Dimensions.get('window');

const FindAccountScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'id' | 'password'>('id');
  const [showVerification, setShowVerification] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false); // ✅ 추가

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleSendVerification = () => {
    setShowVerification(true);
    setTimer(179);
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  const handleGoToPasswordTab = () => {
    setIsComplete(false);
    setSelectedTab('password');
    setShowVerification(false);
    setTimer(0);
  };

  const handleStartReset = () => {
    setIsResettingPassword(true); // ✅ 비밀번호 재설정 시작
  };

  return (
    <>
      <LoginBackground />
      <SafeAreaView style={styles.container}>
        {/* 항상 보이는 backArrow */}
        <Image
          source={require('../assets/images/backArrow.png')}
          style={{ width: 53, height: 53, marginLeft: 26, marginTop: 11 }}
        />

        {/* ✅ 비밀번호 재설정 중일 때 화면 */}
        {isResettingPassword ? (
          <>
            <View style={styles.resetContainer}>
              <CustomInput label="새 비밀번호" placeholder="snap1234^^" helperText="* 비밀번호를 입력해주세요" secureTextEntry />
              <CustomInput label="새 비밀번호 확인" placeholder="snap1234^^" helperText="* 비밀번호가 일치하지 않습니다" secureTextEntry />
              <View style={styles.ButtonWrapper}>
                <NextButton text="확인" onPress={() => { /* 재설정 처리 */ }} />
              </View>
            </View>
          </>
        ) : !isComplete ? (
          <>
            <AccountFinderTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

            <View style={styles.inputGroup}>
              <CustomInput label="이름" placeholder="김스냅" helperText="* 이름을 입력해주세요" />
            </View>

            {selectedTab === 'id' && (
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

                {showVerification && (
                  <View style={styles.ButtonWrapper}>
                    <NextButton onPress={handleComplete} text="완료" />
                  </View>
                )}
              </>
            )}

            {selectedTab === 'password' && (
              <>
                <View style={styles.inputGroup}>
                  <CustomInput
                    label="아이디"
                    placeholder="snap12"
                    helperText="* 올바르지 않은 아이디 형식입니다"
                  />
                </View>

                <View style={styles.ButtonWrapper}>
                  <NextButton onPress={handleStartReset} text="비밀번호 재설정" />
                </View>
              </>
            )}
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>김스냅님의 아이디는 snap12입니다</Text>
            <View style={styles.ButtonWrapper}>
              <NextButton onPress={handleGoToPasswordTab} text="비밀번호 찾기" />
            </View>
          </View>
        )}
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
  inputGroup: {
    marginBottom: 30,
  },
  ButtonWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 17,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '500',
    marginBottom: 100,
  },
  resetContainer: {
    flex: 1,
    paddingTop: 40,
  },

});

export default FindAccountScreen;
