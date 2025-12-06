import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import Header from '../components/common/Header';
import InfoCardItem from '../components/analysis/InfoCardItem';
import NutrientList from '../components/analysis/NutrientList';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import NutrientBarChart from '../components/common/NutrientBarChart';
import SaveNoticeBox from '../components/common/SaveNoticeBox';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';


type Params = {
  imageUri: string;
  classNames: string[] | string;
  imageId: number;
  nutritionId: number;
};

const screenWidth = Dimensions.get('window').width;

const PhotoPreviewScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const { imageUri, classNames, nutritionId: receivedNutritionId } = route.params;
  const imageId = Array.isArray(route.params.imageId) ? route.params.imageId[0] : route.params.imageId;
  const [isLoading, setIsLoading] = useState(true);

  const [nutrients, setNutrients] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    sugar: 0,
    fat: 0,
    sodium: 0,
  });

  const [nutritionId, setNutritionId] = useState<number>(receivedNutritionId);

  const foodNames =
    typeof classNames === 'string'
      ? classNames.split(',')
      : Array.isArray(classNames)
        ? classNames
        : [];

  const menuText = foodNames.join(', ');

  const foodTags =
    typeof classNames === 'string'
      ? `#${classNames}`
      : Array.isArray(classNames)
        ? `#${classNames.join(', ')}`
        : '';

  const rawNutrients = useMemo(() => {
    return [
      { key: 1, grams: nutrients.protein, color: '#CDE8BF', label: '단백질' },
      { key: 2, grams: nutrients.carbs, color: '#FFD794', label: '탄수화물' },
      { key: 3, grams: nutrients.sugar, color: '#FFC5C6', label: '당' },
      { key: 4, grams: nutrients.fat, color: '#FFF7C2', label: '지방' },
      { key: 5, grams: nutrients.sodium, color: '#c2fff9ff', label: '나트륨' },
    ];
  }, [nutrients]);

  const totalGrams = rawNutrients.reduce((sum, item) => sum + item.grams, 0);
  const data = rawNutrients.map(item => {
    const value =
      totalGrams === 0
        ? 0
        : parseFloat(((item.grams / totalGrams) * 100).toFixed(1));

    return {
      key: item.key,
      label: item.label,
      color: item.color,
      grams: item.grams,
      value,
    };
  });

  const pieData = data
    .filter(item => item.grams > 0)
    .map(item => ({
      name: item.label,
      population: item.grams,
      color: item.color,
      legendFontColor: '#444',
      legendFontSize: 12,
    }));

  const details = [
    {
      title: '🥚단백질 🥚',
      description: `오늘 하루 권장 칼로리 중\n${nutrients.calories}kcal를 섭취했어요`,
      badge: { text: '적정', color: '#85DFAC' },
      intake: `${nutrients.protein}g / 60g`,
    },
    {
      title: '🍞 탄수화물 🍞',
      description: '다음 식사에서 조금 더\n보충해보세요!',
      badge: { text: '부족', color: '#FED77F' },
      intake: `${nutrients.carbs}g / 260g`,
    },
    {
      title: '🍬 당 🍬',
      description: 'WHO 권장량의 약 24%,\n아직 여유가 있어요!',
      badge: { text: '부족', color: '#FED77F' },
      intake: `${nutrients.sugar}g / 25g`,
    },
    {
      title: '🥑 지방 🥑',
      description: '적당한 지방 섭취!\n깔끔한 한 끼였어요.',
      badge: { text: '과다', color: '#FFA3A3' },
      intake: `${nutrients.fat}g / 60g`,
    },
  ];

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('accessToken');

        if (!foodNames.length || !imageId || !token) {
          Alert.alert('필요한 정보가 누락되었습니다.');
          return;
        }

        const response = await axios.post(
          'http://api.snapmeal.store/nutritions/analyze',
          {
            foodNames,
            imageId: Number(imageId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data?.result) {
          const nutrition = response.data.result;

          setNutrients({
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            sugar: nutrition.sugar,
            fat: nutrition.fat,
            sodium: nutrition.sodium,
          });

          setNutritionId(nutrition.nutritionId);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            'API 요청 실패:',
            'status:',
            error.response?.status,
            'data:',
            error.response?.data
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNutritionData();
  }, [imageId, classNames]);

  const handleSave = () => {
    const converted = rawNutrients.map(item => ({
      id: String(item.key),
      label: item.label,
      name: item.label,
      nutrientName: item.label,
      grams: item.grams,
      color: item.color,
    }));

    navigation.navigate('MealRecord', {
      imageUri,
      rawNutrients: converted,
      selectedMenu: menuText,
      selectedKcal: nutrients.calories,
      nutritionId: nutritionId,
    });
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [cardWidth, setCardWidth] = useState(screenWidth - 56);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / cardWidth);
    setActiveIndex(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="분석 결과" backgroundColor="#FAFAFA" />

      {!isLoading && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            {foodTags}
            <Text style={styles.kcal}> #{nutrients.calories}kcal</Text>
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
              snapToInterval={cardWidth}
              decelerationRate="fast"
              snapToAlignment="start"
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              overScrollMode="never"
              ref={scrollRef}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            >
              <View style={{ width: cardWidth, alignItems: 'center', justifyContent: 'center' }}>
                <PieChart
                  data={pieData}
                  width={cardWidth}
                  height={190}
                  accessor="population"
                  backgroundColor="transparent"
                  chartConfig={{ color: () => '#000' }}
                  hasLegend={false}
                  paddingLeft="83"
                />
              </View>

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
            <Text style={styles.summaryKcal}>{nutrients.calories}/2000kcal</Text>
          </View>

          <View style={styles.grid}>
            {details.map((item, index) => (
              <InfoCardItem key={index} {...item} variant="detail" />
            ))}
          </View>

          <SaveNoticeBox onSave={handleSave} />
        </ScrollView>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>분석 중...</Text>
        </View>
      )}
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
    shadowColor: '#17171B',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)', // 살짝 흐림
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
});

export default PhotoPreviewScreen;
