import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import Header from '../components/Header';
import InfoCardItem from '../components/InfoCardItem';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type PhotoPreviewRouteProp = RouteProp<RootStackParamList, 'PhotoPreview'>;

const PhotoPreviewScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<PhotoPreviewRouteProp>();
  const { imageUri } = route.params;

  const data = [
    { key: 1, value: 20, color: '#CDE8BF', label: '단백질' },
    { key: 2, value: 13, color: '#FFD794', label: '탄수화물' },
    { key: 3, value: 5, color: '#FFC5C6', label: '당' },
    { key: 4, value: 3, color: '#FFF7C2', label: '지방' },
    { key: 5, value: 6, color: '#C9D8F0', label: '기타' },
  ];

  const pieData = data.map((item) => ({
    value: item.value,
    svg: { fill: item.color },
    key: item.key,
  }));

  const details = [
    {
      title: '🥚단백질 🥚',
      description: '오늘 하루 권장 칼로리 중\n152kcal를 섭취했어요',
      badge: { text: '적정', color: '#85DFAC' },
      intake: '12g / 60g',
    },
    {
      title: '🍞 탄수화물 🍞',
      description: '다음 식사에서 조금 더\n보충해보세요!',
      badge: { text: '부족', color: '#FED77F' },
      intake: '34g / 260g',
    },
    {
      title: '🍬 당 🍬',
      description: 'WHO 권장량의 약 24%,\n아직 여유가 있어요!',
      badge: { text: '부족', color: '#FED77F' },
      intake: '6g / 25g',
    },
    {
      title: '🥑 지방 🥑',
      description: '적당한 지방 섭취!\n깔끔한 한 끼였어요.',
      badge: { text: '과다', color: '#FFA3A3' },
      intake: '8g / 60g',
    },
  ];

  const handleSave = () => {
    navigation.navigate('MealRecord', { imageUri });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header title="분석 결과" backgroundColor='#FAFAFA'/>
      <Text style={styles.title}>
        #샐러드 <Text style={styles.kcal}>#152kcal</Text>
      </Text>

      <View style={styles.card}>
        <PieChart
          style={styles.chart}
          data={pieData}
          outerRadius={'100%'}
          innerRadius={'57%'}
          padAngle={0}
        />
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
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
      </View>

      <Text style={styles.sectionHeader}>영양 정보</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>전체적으로 균형잡힌 식단이에요!</Text>
        <Text style={styles.summaryKcal}>210/2000kcal</Text>
      </View>

      <View style={styles.grid}>
        {details.map((item, index) => (
          <InfoCardItem
            key={index}
            {...item}
            variant="detail"
          />
        ))}
      </View>

      {/* 기록 안내 + 버튼 */}
      <View style={styles.saveWrapper}>
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            💡 기록하지 않으면 분석 결과가 저장되지 않아요!
          </Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>기록하고 저장하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#FAFAFA',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 49,
    paddingHorizontal: 27,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    marginHorizontal: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 7,
    marginLeft: 38,
  },
  kcal: {},
  chart: {
    height: 180,
    width: 180,
    marginBottom: 33,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 5,
    marginBottom: 37,
  },
  activeDot: {
    backgroundColor: '#38B000',
  },
  nutrientList: {
    width: '100%',
    marginBottom: 16,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23,
  },
  colorBox: {
    width: 17,
    height: 17,
    borderRadius: 3,
    marginRight: 15,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 62,
    marginBottom: 12,
    marginLeft: 38,
  },
  summaryCard: {
    backgroundColor: '#EBF6E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 28,
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 14,
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
    paddingHorizontal: 28,
  },
  saveWrapper: {
    paddingHorizontal: 28,
    marginBottom: 18,
    marginTop: 24,
  },
  noticeBox: {
    backgroundColor: '#F3F3F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 14,
  },
  noticeText: {
    fontSize: 13,
    color: '#555',
  },
  saveButton: {
    width: '100%',
    paddingHorizontal: 18,
    height: 52,
    backgroundColor: '#38B000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    lineHeight: 52,
  },
});

export default PhotoPreviewScreen;
