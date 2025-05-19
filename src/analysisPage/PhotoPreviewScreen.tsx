import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import Header from '../components/Header';
import InfoCardItem from '../components/InfoCardItem';
import NutrientList from '../components/NutrientList';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import NutrientBarChart from '../components/NutrientBarChart';
import SaveNoticeBox from '../components/SaveNoticeBox';

type PhotoPreviewRouteProp = RouteProp<RootStackParamList, 'PhotoPreview'>;

const screenWidth = Dimensions.get('window').width;

const PhotoPreviewScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<PhotoPreviewRouteProp>();
  const { imageUri } = route.params;

  const rawNutrients = [
    { key: 1, grams: 20, color: '#CDE8BF', label: '단백질' },
    { key: 2, grams: 13, color: '#FFD794', label: '탄수화물' },
    { key: 3, grams: 5, color: '#FFC5C6', label: '당' },
    { key: 4, grams: 3, color: '#FFF7C2', label: '지방' },
    { key: 5, grams: 6, color: '#C9D8F0', label: '기타' },
  ];

  const totalGrams = rawNutrients.reduce((sum, item) => sum + item.grams, 0);

  const data = rawNutrients.map(item => ({
    ...item,
    value: parseFloat(((item.grams / totalGrams) * 100).toFixed(1)),
  }));

  const pieData = data.map(item => ({
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

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [cardWidth, setCardWidth] = useState(screenWidth - 56);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / cardWidth);
    setActiveIndex(index);
  };

  const handleSave = () => {
    navigation.navigate('MealRecord', { imageUri, rawNutrients });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* ✅ 고정된 상단 영역 */}
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="분석 결과" backgroundColor="#FAFAFA" />

      {/* ✅ 스크롤 가능한 본문 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          #샐러드 <Text style={styles.kcal}>#152kcal</Text>
        </Text>

        <View
          style={styles.card}
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            setCardWidth(width);
          }}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollRef}
          >
            {/* Slide 1 */}
            <View style={{ width: cardWidth, alignItems: 'center', justifyContent: 'center' }}>
              <PieChart
                style={styles.chart}
                data={pieData}
                outerRadius={'95%'}
                innerRadius={'54%'}
                padAngle={0}
              />
            </View>

            {/* Slide 2 */}
            <View style={{ width: cardWidth }}>
              <NutrientBarChart data={data} customStyle={{ width: '80%', marginTop: 40 }} />
            </View>
          </ScrollView>

          <View style={styles.pagination}>
            <View style={[styles.dot, activeIndex === 0 && styles.activeDot]} />
            <View style={[styles.dot, activeIndex === 1 && styles.activeDot]} />
          </View>

          <View style={{ paddingHorizontal: 27, width: '100%' }}>
            <NutrientList data={data} />
          </View>
        </View>

        <Text style={styles.sectionHeader}>영양 정보</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>전체적으로 균형잡힌 식단이에요!</Text>
          <Text style={styles.summaryKcal}>210/2000kcal</Text>
        </View>

        <View style={styles.grid}>
          {details.map((item, index) => (
            <InfoCardItem key={index} {...item} variant="detail" />
          ))}
        </View>

        <SaveNoticeBox onSave={handleSave} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#FAFAFA',
    paddingBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    marginHorizontal: 28,
    marginBottom: 62,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 37,
    marginBottom: 7,
    marginLeft: 38,
  },
  kcal: {},
  chart: {
    height: 190,
    width: 190,
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
  sectionHeader: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default PhotoPreviewScreen;
