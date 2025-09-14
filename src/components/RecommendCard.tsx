import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InfoCardItem from './InfoCardItem';

type RecommendCardProps = {
  consumedCalories: number;
  remainingCalories: number;
  exerciseSuggestion: string;
  foodSuggestion: string;
};

const RecommendCard = ({
  consumedCalories,
  remainingCalories,
  exerciseSuggestion,
  foodSuggestion,
}: RecommendCardProps) => {
  // 운동 카드 데이터
  const exerciseData = [
    {
      title: '자전거',
      description: exerciseSuggestion,
      image: require('../assets/images/bike.png'),
      badge: { text: '유산소', color: '#85DFAC' },
    },
    {
      title: '테니스',
      description: exerciseSuggestion,
      image: require('../assets/images/tennis.png'),
      badge: { text: '유산소', color: '#85DFAC' },
    },
    {
      title: '테니스',
      description: exerciseSuggestion,
      image: require('../assets/images/tennis.png'),
      badge: { text: '유산소', color: '#85DFAC' },
    },
  ];

  // 음식 카드 데이터
  const foodData = [
    {
      title: '샐러드',
      description: foodSuggestion,
      image: require('../assets/images/salad.png'),
    },
    {
      title: '치즈',
      description: foodSuggestion,
      image: require('../assets/images/cheese.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 운동 추천 */}
      <Text style={styles.sectionTitle}>{consumedCalories}kcal에 딱 맞는 운동</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        {exerciseData.map((item, index) => (
          <InfoCardItem key={index} {...item} variant="recommend" />
        ))}
      </ScrollView>

      {/* 음식 추천 */}
      <Text style={styles.sectionTitle}>
        남은 {remainingCalories}kcal는 이렇게 채워봐요!
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        {foodData.map((item, index) => (
          <InfoCardItem key={index} {...item} variant="recommend" />
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
  },
  slider: {
    marginBottom: 54,
    paddingBottom: 10,
  },
});

export default RecommendCard;
