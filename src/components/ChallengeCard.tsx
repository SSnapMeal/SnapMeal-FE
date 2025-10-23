import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

export type ChallengeState = '참여전' | '참여중' | '실패' | '성공';

type Props = {
  imageSource: ImageSourcePropType;
  title: string;
  targetMenuName?: string;
  description?: string;
  state: ChallengeState;
  progressText?: string;
  onPress?: () => void;
  badgeTop?: number;
};

const getColors = (s: ChallengeState) => {
  switch (s) {
    case '참여전': return { text: '#7A7A7A', bg: '#E9E9E9' };
    case '참여중': return { text: '#38B000', bg: '#EDF8E8' };
    case '성공':   return { text: '#EDF8E8', bg: '#38B000' };
    case '실패':   return { text: '#E67373', bg: '#F8E8E8' };
    default:       return { text: '#7A7A7A', bg: '#E9E9E9' };
  }
};

const ChallengeCard: React.FC<Props> = ({
  imageSource,
  title,
  targetMenuName,
  description,
  state,
  progressText,
  onPress,
  badgeTop = 52,
}) => {
  const colors = getColors(state);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.shadowWrap}>
      <View style={styles.card}>
        {/* 상단 이미지 */}
        <Image source={imageSource} style={styles.image} />

        {/* 본문 */}
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>

          {!!targetMenuName && <Text style={styles.bullet}>•  {targetMenuName}</Text>}
          {!!description && <Text style={styles.bullet}>•  {description}</Text>}

          <View
            style={[
              styles.badgeAbsolute,
              { top: badgeTop, backgroundColor: colors.bg },
            ]}
          >
            <Text style={[styles.badgeText, { color: colors.text }]}>
              {state}{progressText ? ` ${progressText}` : ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadowWrap: {
    marginHorizontal: 34,
    marginBottom: 26,
  },
  card: {
    width: 324,
    height: 225,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 136,
    resizeMode: 'cover',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'relative',  // ✅ 배지 absolute 기준
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17171B',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 12,
    color: '#17171B',
    lineHeight: 18,
  },
  badgeAbsolute: {
    position: 'absolute',
    right: 16,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default ChallengeCard;
