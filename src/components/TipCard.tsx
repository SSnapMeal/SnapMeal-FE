import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TipCardProps = {
  healthGuidance?: string; // 서버에서 내려온 건강 가이드 문자열
};

const TipCard = ({ healthGuidance }: TipCardProps) => {
  return (
    <View style={styles.card}>
      {/* 타이틀은 그대로 유지 */}
      <Text style={styles.title}>다음에는 이렇게 해보아요 :)</Text>

      {/* 서버 데이터가 있으면 그걸 표시, 없으면 기본 안내 */}
      <Text style={styles.subText}>
        {healthGuidance || '아직 건강 가이드 데이터가 없습니다.'}
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
  subText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});

export default TipCard;
