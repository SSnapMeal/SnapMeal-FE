import React from 'react';
import { View, StyleSheet, Image, StatusBar, Dimensions, SafeAreaView } from 'react-native';

const { height } = Dimensions.get('window');

const LoginBackground = () => {
  return (
    <>
      <StatusBar backgroundColor="#113500" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.fullScreen}>
          {/* 초록 배경 */}
          <View style={styles.background} />

          {/* 카메라 이미지 */}
          <Image
            source={require('../assets/images/camera.png')}
            style={styles.cameraImg}
            resizeMode="cover"
          />

          {/* 검정 투명 오버레이 */}
          <View style={styles.overlay} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    position: 'relative',
    height: '100%',
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2,
  },
});

export default LoginBackground;