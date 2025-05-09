import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const RecommendCard = () => {
  return (
    <View style={styles.container}>
      {/* 운동 추천 */}
      <Text style={styles.sectionTitle}>152kcal에 딱 맞는 운동</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>자전거</Text>
          <Text style={styles.cardDesc}>1시간을 타면 200kcal가 소모돼요!</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>유산소</Text>
          </View>
          <Image source={require('../assets/images/bike.png')} style={styles.cardImage} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>테니스</Text>
          <Text style={styles.cardDesc}>1시간을 하면 200kcal가 소모돼요!</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>유산소</Text>
          </View>
          <Image source={require('../assets/images/tennis.png')} style={styles.cardImage} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>테니스</Text>
          <Text style={styles.cardDesc}>1시간을 하면 200kcal가 소모돼요!</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>유산소</Text>
          </View>
          <Image source={require('../assets/images/tennis.png')} style={styles.cardImage} />
        </View>
      </ScrollView>

      {/* 음식 추천 */}
      <Text style={styles.sectionTitle}>남은 1848kcal는 이렇게 채워봐요!</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>샐러드</Text>
          <Text style={styles.cardDesc}>302kcal로 ○○을 채우기 효과적이에요</Text>
          <Image source={require('../assets/images/salad.png')} style={styles.cardImage} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>치즈</Text>
          <Text style={styles.cardDesc}>부족한 ○○을 섭취하고 건강을 챙겨요</Text>
          <Image source={require('../assets/images/cheese.png')} style={styles.cardImage} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>치즈</Text>
          <Text style={styles.cardDesc}>부족한 ○○을 섭취하고 건강을 챙겨요</Text>
          <Image source={require('../assets/images/cheese.png')} style={styles.cardImage} />
        </View>
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
  card: {
    backgroundColor: '#F1FBEF',
    width: 156,
    height: 137,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 21,
    borderRadius: 18,
    marginRight: 17,
    elevation: 2
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#D8F3DC',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#3E8E41',
  },
  cardImage: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignSelf: 'center',
    bottom: 14,
    right: 15
  },
});

export default RecommendCard;
