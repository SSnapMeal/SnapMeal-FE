import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type DinnerCardProps = {
  title?: string; // 상단 제목
  note?: string;  // 설명 텍스트
};

const DinnerCard = ({ title, note }: DinnerCardProps) => {
  return (
    <View style={styles.card}>
      {/* title이 있으면 표시 */}
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <View style={styles.container}>
        <Image
          source={require('../assets/images/dinner-time.png')}
          style={styles.image}
        />
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
