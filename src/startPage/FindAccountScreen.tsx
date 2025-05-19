import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LoginBackground from '../components/LoginBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../components/CustomInput';
import { Image } from 'react-native';
import AccountFinderTabs from '../components/AccountFinderTabs';

const { height } = Dimensions.get('window');

const FindAccountScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'id' | 'password'>('id');
  const [showVerification, setShowVerification] = useState(false); // 인증번호 입력창 보이기
  const [timer, setTimer] = useState(0); // 0이면 타이머 비활성

  const handleSendVerification = () => {
    setShowVerification(true); // 인증번호 입력창 보여줘
    setTimer(179);             // 3분 타이머 시작
  };

  return (
    <>
      <LoginBackground />
      {/* 배경 위에 덮는 입력폼 */}
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../assets/images/backArrow.png')}
          style={{ width: 53, height: 53, marginLeft: 26, marginTop: 11 }}
        />
        <AccountFinderTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        <View style={styles.inputGroup}>
          <CustomInput label="이름" placeholder="김스냅" helperText="* 이름을 입력해주세요" />
        </View>
        <View style={styles.inputGroup}>
          <CustomInput
            label="이메일"
            placeholder="snap@gmail.com"
            helperText="* 안내메시지"
            showButton={true}
            onPressButton={handleSendVerification}
          />
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
  inputGroup: {
    marginBottom: 30,
  },
});

export default FindAccountScreen;
