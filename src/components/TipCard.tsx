import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TipCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>다음에는 이렇게 해보아요 :)</Text>
      <Text style={styles.tip}>☝ 영양소는 고르게 섭취해요</Text>
      <Text style={styles.subText}>
        당은 과다, 다른 영양소는 부족해요. 에너지만 아니라 필수 영양소도 챙기며 균형 잡힌 식사로 시작해보세요.
      </Text>
      <Text style={styles.tip}>✌ 저녁과 야식은 라이트하게!</Text>
      <Text style={styles.subText}>
        속도 편하고 마음도 가볍게, 라이트한 한 끼로 건강한 하루의 끝을 만들어보세요.
      </Text>
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
  tip: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
});

export default TipCard;
