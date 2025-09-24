import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type DinnerCardProps = {
  title?: string;   // 상단 제목
  note?: string;    // 설명 텍스트
  emoji?: string;   // 이모지 (🌙 등)
};

const DinnerCard = ({ title, note, emoji }: DinnerCardProps) => {
  return (
    <View style={styles.card}>
      {/* title이 있으면 표시 */}
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <View style={styles.container}>
        {/* ✅ 이미지 대신 이모지를 표시 */}
        <Text style={styles.emoji}>{emoji || '🍽️'}</Text>

        <View style={styles.textWrapper}>
          {/* note가 있으면 표시, 없으면 안내 메시지 */}
          <Text style={styles.note}>
            {note || '저녁 식사 데이터가 아직 없습니다.'}
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
    marginRight: 10,
  },
  emoji: {
    fontSize: 48, // 이모지를 크게 보여줌
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