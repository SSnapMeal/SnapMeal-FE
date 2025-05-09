import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import Header from '../components/Header';

const PhotoPreviewScreen = () => {
  const data = [
    { key: 1, value: 20, color: '#C9E4C5', label: '단백질' },
    { key: 2, value: 13, color: '#FBD37C', label: '탄수화물' },
    { key: 3, value: 5, color: '#F7B2AD', label: '당' },
    { key: 4, value: 3, color: '#FAEDCA', label: '지방' },
    { key: 5, value: 6, color: '#BDD7EC', label: '기타' },
  ];

  const pieData = data.map((item) => ({
    value: item.value,
    svg: { fill: item.color },
    key: item.key,
  }));

  const details = [
    {
      title: '단백질 🥚',
      description: '오늘 하루 권장 칼로리 중\n152kcal를 섭취했어요',
      status: '적정',
      intake: '12g / 60g',
      badgeColor: '#38B000',
    },
    {
      title: '🍞 탄수화물 🍞',
      description: '다음 식사에서 조금 더\n보충해보세요!',
      status: '부족',
      intake: '34g / 260g',
      badgeColor: '#F4B400',
    },
    {
      title: '🍬 당 🍬',
      description: 'WHO 권장량의 약 24%,\n아직 여유가 있어요!',
      status: '부족',
      intake: '6g / 25g',
      badgeColor: '#F4B400',
    },
    {
      title: '🥑 지방 🥑',
      description: '적당한 지방 섭취!\n깔끔한 한 끼였어요.',
      status: '과다',
      intake: '8g / 60g',
      badgeColor: '#FF6B6B',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* 상단 헤더 */}
      <Header title="분석 결과" />

      <View style={styles.card}>
        <Text style={styles.title}>
          #샐러드 <Text style={styles.kcal}>#152kcal</Text>
        </Text>

        <PieChart
          style={styles.chart}
          data={pieData}
          outerRadius={'90%'}
          innerRadius={'60%'}
        />

        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.nutrientList}>
          {data.map((item) => (
            <View key={item.key} style={styles.nutrientRow}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}%</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeader}>영양 정보</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>전체적으로 균형잡힌 식단이에요!</Text>
          <Text style={styles.summaryKcal}>210/2000kcal</Text>
        </View>

        <View style={styles.grid}>
          {details.map((item, index) => (
            <View key={index} style={styles.detailCard}>
              <Text style={styles.detailTitle}>{item.title}</Text>
              <Text style={styles.detailDesc}>{item.description}</Text>
              <View style={styles.detailBottom}>
                <Text style={[styles.statusBadge, { backgroundColor: item.badgeColor }]}> {item.status} </Text>
                <Text style={styles.detailIntake}>{item.intake}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  kcal: {
    fontWeight: 'normal',
    color: '#777',
  },
  chart: {
    height: 200,
    width: 200,
    marginBottom: 16,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#38B000',
  },
  nutrientList: {
    width: '100%',
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#E6F4EA',
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  summaryKcal: {
    fontSize: 14,
    color: '#444',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  detailTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  detailDesc: {
    fontSize: 12,
    marginBottom: 12,
    color: '#555',
  },
  detailBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 11,
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  detailIntake: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
});

export default PhotoPreviewScreen;
