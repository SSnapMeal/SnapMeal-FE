import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InfoCardItem from './InfoCardItem'; // 기존 RecommendationCardItem → 통합된 InfoCardItem 사용

const RecommendCard = () => {
  const consumedCalories = 152;
  const remainingCalories = 1848;

  const exerciseData = [
    {
      title: '자전거',
      description: `1시간을 타면 200kcal가 소모돼요!`,
      image: require('../assets/images/bike.png'),
      badge: { text: '유산소', color: '#85DFAC' },
    },
    {
      title: '테니스',
      description: `1시간을 하면 200kcal가 소모돼요!`,
      image: require('../assets/images/tennis.png'),
      badge: { text: '유산소', color: '#85DFAC' },
    },
    {
      title: '테니스',
      description: `1시간을 하면 200kcal가 소모돼요!`,
      image: require('../assets/images/tennis.png'),
      badge: { text: '유산소', color: '#85DFAC' },
    },
  ];

  const foodData = [
    {
      title: '샐러드',
      description: '302kcal로 ○○을 채우기 효과적이에요',
      image: require('../assets/images/salad.png'),
    },
    {
      title: '치즈',
      description: '부족한 ○○을 섭취하고 건강을 챙겨요',
      image: require('../assets/images/cheese.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 운동 추천 */}
      <Text style={styles.sectionTitle}>
        {consumedCalories}kcal에 딱 맞는 운동
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
        {exerciseData.map((item, index) => (
          <InfoCardItem key={index} {...item} variant="recommend" />
        ))}
      </ScrollView>

      {/* 음식 추천 */}
      <Text style={styles.sectionTitle}>
        남은 {remainingCalories}kcal는 이렇게 채워봐요!
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
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
