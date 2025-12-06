import { View, Text, StyleSheet } from 'react-native';

type DinnerCardProps = {
  title?: string;
  note?: string;
  emoji?: string;
};

const DinnerCard = ({ title, note, emoji }: DinnerCardProps) => {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <View style={styles.container}>
        <Text style={styles.emoji}>{emoji || '🍽️'}</Text>

        <View style={styles.textWrapper}>
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