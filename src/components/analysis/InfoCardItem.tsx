import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';

type Variant = 'recommend' | 'detail';

interface Props {
  title: string;
  description: string;
  emoji?: string;
  image?: any;
  intake?: string;
  badge?: { text: string; color: string };
  variant?: Variant;
  style?: ViewStyle;
}

const InfoCardItem = ({
  title,
  description,
  emoji,
  image,
  intake,
  badge,
  variant = 'recommend',
  style,
}: Props) => {
  const isRecommend = variant === 'recommend';

  return (
    <View
      style={[
        styles.baseCard,
        isRecommend ? styles.recommendCard : styles.detailCard,
        style,
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {badge && (
        <View style={[styles.badge, { backgroundColor: badge.color }]}>
          <Text style={styles.badgeText}>{badge.text}</Text>
        </View>
      )}

      {intake && !isRecommend && <Text style={styles.intake}>{intake}</Text>}

      {isRecommend && (
        <>
          {emoji ? (
            <Text style={styles.emoji}>{emoji}</Text>
          ) : (
            image && <Image source={image} style={styles.image} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: 12,
    padding: 14,
  },
  recommendCard: {
    backgroundColor: '#F1FBEF',
    width: 156,
    height: 137,
    marginRight: 17,
    paddingTop: 21,
    paddingLeft: 16,
    paddingRight: 16,
    position: 'relative',
  },
  detailCard: {
    backgroundColor: '#EBF6E6',
    width: 156,
    height: 137,
    marginBottom: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
    color: '#17171B',
  },
  description: {
    fontSize: 12,
    color: '#17171B',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    position: 'absolute',
    left: 16,
    bottom: 14,
    paddingHorizontal: 13,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
    lineHeight: 15,
  },
  intake: {
    fontSize: 12,
    fontWeight: '500',
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  image: {
    position: 'absolute',
    width: 48,
    height: 48,
    bottom: 14,
    right: 15,
  },
  emoji: {
    position: 'absolute',
    bottom: 14,
    right: 15,
    fontSize: 36,
  },
});

export default InfoCardItem;