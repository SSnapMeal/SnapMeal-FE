import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type HealthItem = {
  title: string;
  description: string;
};

type TipCardProps = {
  healthGuidance?: HealthItem[]; // 서버에서 내려온 건강 가이드 배열
};

const TipCard = ({ healthGuidance }: TipCardProps) => {
  const hasData = healthGuidance && healthGuidance.length > 0;

  return (
    <View style={styles.card}>
      {/* 메인 타이틀 */}
      <Text style={styles.title}>다음에는 이렇게 해보아요 :)</Text>

      {hasData ? (
        // ✅ 배열 데이터가 있을 때
        healthGuidance.map((item, index) => (
          <View key={index} style={styles.itemWrapper}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        ))
      ) : (
        // ❌ 데이터가 없을 때
        <Text style={styles.emptyText}>아직 건강 가이드 데이터가 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 45,
    borderWidth: 1,
    borderColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  itemWrapper: {
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 13,
    color: '#717171',
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default TipCard;
