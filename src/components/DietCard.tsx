import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export type StatusType = '과다' | '적정' | '부족';

// 챌린지 상태 추가
export type ChallengeState = '참여전' | '참여중' | '실패' | '성공';

export type Nutrient = {
  name: string;
  value: string;
};

export type CardData = {
  imageSource: any;
  title: string;
  mealTime?: string;
  topNutrients?: Nutrient[];
  tag?: StatusType;
};

type DietCardProps = {
  additionalMeal?: CardData;
  variant?: 'default' | 'challenge';
  challengeState?: ChallengeState; // ✅ 챌린지 상태 prop 추가
};

const statusColors: Record<StatusType, string> = {
  과다: '#F3B8B8',
  적정: '#ABE88F',
  부족: '#FBE19A',
};

// 챌린지 상태별 스타일 매핑
const challengeStyles: Record<ChallengeState, any> = {
  참여전: {
    shadowColor: '#A9A9A9',
    label: '참여 전',
    labelColor: '#A9A9A9',
  },
  참여중: {
    shadowColor: '#38B000',
    label: '참여 중 (4/5)',
    labelColor: '#38B000',
  },
  실패: {
    shadowColor: '#E67373',
    label: '실패',
    labelColor: '#E67373',
  },
  성공: {
    shadowColor: '#38B000',
    label: '성공',
    labelColor: '#38B000',
  },
};

const DietCard: React.FC<DietCardProps> = ({
  additionalMeal,
  variant = 'default',
  challengeState,
}) => {
  if (!additionalMeal) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>식단 정보가 없습니다.</Text>
      </View>
    );
  }

  const item = additionalMeal;
  const hasMealTime = !!item.mealTime;
  const hasNutrients = !!(item.topNutrients && item.topNutrients.length > 0);
  const showChallengeReplacement =
    variant === 'challenge' && !hasMealTime && !hasNutrients;

  // 챌린지 모드일 때 상태별 스타일 선택
  const currentChallenge =
    variant === 'challenge' && challengeState
      ? challengeStyles[challengeState]
      : null;

  return (
    <View
      style={[
        styles.card,
        variant === 'challenge' && styles.cardChallenge,
        currentChallenge && { shadowColor: currentChallenge.shadowColor },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image source={item.imageSource} style={styles.cardImage} />
      </View>

      {variant !== 'challenge' && <Text style={styles.cardMenu}>⋯</Text>}

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        {showChallengeReplacement ? (
          <>
            <Text style={styles.challengeInfoLine1}>• 주 5회 이상</Text>
            <Text style={styles.challengeInfoLine2}>
              • 카페인 줄이기 및 건강관리
            </Text>
          </>
        ) : (
          <>
            {hasMealTime && <Text style={styles.cardText}>{item.mealTime}</Text>}
            {hasNutrients &&
              item.topNutrients!.map((nutrient, idx) => (
                <Text key={idx} style={styles.cardText}>
                  {nutrient.name}: {nutrient.value}
                </Text>
              ))}
          </>
        )}
      </View>

      {variant === 'challenge' ? (
        <Text
          style={[
            styles.challengeTagText,
            currentChallenge && { color: currentChallenge.labelColor },
          ]}
        >
          {currentChallenge?.label}
        </Text>
      ) : (
        item.tag && (
          <View
            style={[
              styles.cardTag,
              { backgroundColor: statusColors[item.tag] || '#DDD' },
            ]}
          >
            <Text style={styles.cardTagText}>{item.tag}</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#EDF8E8',
    marginHorizontal: 33,
    borderRadius: 18,
    marginBottom: 26,
    elevation: 2,
    height: 137,
    position: 'relative',
  },
  cardChallenge: {
    backgroundColor: '#FFF',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginLeft: 12,
  },
  cardImage: {
    width: 113,
    height: 113,
    borderRadius: 113,
  },
  cardContent: {
    marginLeft: 12,
    position: 'relative',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 25,
  },
  cardMenu: {
    fontSize: 24,
    color: '#000',
    position: 'absolute',
    top: 6,
    right: 15,
    fontWeight: 'bold',
  },
  cardText: {
    marginTop: 2,
    fontSize: 12,
  },
  challengeInfoLine1: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  challengeInfoLine2: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  challengeTagText: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
    bottom: 14,
    right: 17,
  },
  cardTag: {
    position: 'absolute',
    bottom: 14,
    right: 17,
    borderRadius: 8,
    width: 45,
    height: 19,
  },
  cardTagText: {
    fontSize: 10,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default DietCard;
