import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InfoCardItem from './InfoCardItem';

type Exercise = {
  name: string;
  calories: number;
  duration: string;
  repeat: number;
  category: string;
  emoji: string;
};

type Food = {
  name: string;
  calories: number;
  benefit: string;
  emoji: string;
};

type RecommendCardProps = {
  consumedCalories: number;
  remainingCalories: number;
  exercises: {
    name: string;
    calories: number;
    duration: string;
    repeat: number;
    category: string;
    emoji: string;
  }[];
  foods: {
    name: string;
    calories: number;
    benefit: string;
    emoji: string;
  }[];
};

const RecommendCard = ({
  consumedCalories,
  remainingCalories,
  exercises,
  foods,
}: RecommendCardProps) => {
  return (
    <View style={styles.container}>
      {/* 운동 추천 */}
      <Text style={styles.sectionTitle}>
        {consumedCalories}kcal에 딱 맞는 운동
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        {exercises.map((item, index) => (
          <InfoCardItem
            key={`exercise-${index}`}
            title={item.name}
            description={`${item.duration} • ${item.calories}kcal`}
            emoji={item.emoji}
            badge={{ text: item.category, color: '#85DFAC' }}
            variant="recommend"
          />
        ))}
      </ScrollView>

      {/* 음식 추천 */}
      <Text style={styles.sectionTitle}>
        {remainingCalories > 0
          ? `남은 ${remainingCalories}kcal는 이렇게 채워봐요!`
          : '오늘의 칼로리를 초과했어요!'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        {foods.map((item, index) => (
          <InfoCardItem
            key={`food-${index}`}
            title={item.name}
            description={item.benefit}
            emoji={item.emoji}
            variant="recommend"
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 33,
    paddingTop: 30,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#17171B',
  },
  slider: {
    marginBottom: 54,
    paddingBottom: 10,
  },
});

export default RecommendCard;