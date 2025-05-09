import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FindAccountScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>아이디/비밀번호 찾기</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: 'black' },
});

export default FindAccountScreen;
