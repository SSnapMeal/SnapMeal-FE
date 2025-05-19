import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DinnerCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>주로 저녁에 칼로리가 높은 음식을 먹었어요</Text>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/dinner-time.png')}
          style={styles.image}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.note}>
            전체의 40%의 칼로리를 저녁에 섭취하였고,{'\n'}
            탄수화물은 30g을 저녁마다 먹었어요
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 11,
  },
  textWrapper: {
    flex: 1,
  },
  note: {
    fontSize: 12,
    color: '#717171',
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default DinnerCard;
