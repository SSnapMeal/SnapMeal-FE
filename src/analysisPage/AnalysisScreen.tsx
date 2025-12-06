import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  View,
  ActivityIndicator,
} from 'react-native';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Navigation from '../components/common/Navigation';
import DietCard from '../components/analysis/DietCard';
import RecommendCard from '../components/analysis/RecommendCard';
import CalendarSection from '../components/analysis/CalendarSection';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import TabSelector from '../components/analysis/TabSelecter';
import CameraMenu from '../components/analysis/CameraMenu';
import CalorieProgress from '../components/analysis/CalorieProgress';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { StatusType, Nutrient, CardData } from '../types/meal';
import {
  mealTypeMap,
  pickTop2Nutrients,
  getStatusByCalories,
  statusColorMap,
} from '../utils/meal';
import { useImageAnalyze } from '../hooks/useImageAnalyze';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

dayjs.extend(isoWeek);

const AnalysisScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [serverMeal, setServerMeal] = useState<CardData | undefined>(undefined);
  const [serverMeals, setServerMeals] = useState<CardData[]>([]);

  const recommendedKcal = 2000;
  const consumedKcal = 1500;

  const [recommendData, setRecommendData] = useState({
    consumedCalories: 0,
    remainingCalories: 0,
    exercises: [],
    foods: [],
  });

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Analysis'>>();
  const receivedMeal = route.params;

  const [marked, setMarked] = useState<{ [key: string]: string }>({});
  const isToday = selectedDate.isSame(dayjs(), 'day');

  const {
    isLoading,
    cameraMenuVisible,
    toggleCameraMenu,
    openGallery,
    openCamera,
  } = useImageAnalyze();

  const finalMeal: CardData | undefined =
    serverMeal ??
    (receivedMeal && {
      imageSource: receivedMeal.imageSource,
      title: receivedMeal.title,
      mealTime: receivedMeal.mealTime,
      topNutrients: receivedMeal.topNutrients,
      tag: receivedMeal.tag,
      mealId: Number((receivedMeal as any).mealId ?? -1),
    });

  // 날짜별 식단 가져오기
  useEffect(() => {
    const controller = new AbortController();

    const fetchMeal = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('⚠️ 토큰 없음: 로그인 필요');
          return;
        }

        const selectedDay = selectedDate.startOf('day').format('YYYY-MM-DD');

        const response = await axios.get(
          'http://api.snapmeal.store/meals/date',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            params: { date: selectedDay },
            signal: controller.signal as any,
          }
        );

        const result = response.data?.result;
        const list = Array.isArray(result) ? result : result ? [result] : [];

        const meals: CardData[] = list
          .map((item: any) => {
            const id = Number(item.mealId ?? item.id);
            if (!Number.isFinite(id)) return null;

            const top2 = pickTop2Nutrients(item);

            return {
              imageSource: item.imageUrl
                ? { uri: item.imageUrl }
                : require('../assets/images/food_sample.png'),
              title: item.menu ?? '식사',
              mealTime: mealTypeMap[item.mealType] || '',
              topNutrients: top2,
              tag: '적정',
              mealId: id,
            };
          })
          .filter(Boolean) as CardData[];

        setServerMeals(meals);
      } catch (error: any) {
        if (axios.isCancel?.(error) || error?.code === 'ERR_CANCELED') {
          console.log('🛑 요청 취소됨');
          return;
        }
        console.error(
          '❌ 식단 데이터 불러오기 실패:',
          error?.response?.data || error
        );
      }
    };

    fetchMeal();
    return () => controller.abort();
  }, [selectedDate]);

  // 추천 데이터
  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('⚠️ 토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        const response = await axios.get(
          'http://api.snapmeal.store/recommendations/today',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        setRecommendData({
          consumedCalories: data.consumedCalories ?? 0,
          remainingCalories: data.remainingCalories ?? 0,
          exercises: data.exercises ?? [],
          foods: data.foods ?? [],
        });
      } catch (error: any) {
        console.error(
          '❌ 추천 데이터 불러오기 실패:',
          error.response?.status,
          error.response?.data
        );
      }
    };

    fetchRecommendation();
  }, []);

  // 전체 식단 → 캘린더 색
  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        const response = await axios.get('http://api.snapmeal.store/meals', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = response.data?.result || [];

        const caloriesByDate: Record<string, number> = {};
        result.forEach((meal: any) => {
          const dateKey = dayjs(meal.mealDate).format('YYYY-MM-DD');
          caloriesByDate[dateKey] =
            (caloriesByDate[dateKey] || 0) + (meal.calories ?? 0);
        });

        const markedResult: Record<string, string> = {};
        Object.entries(caloriesByDate).forEach(([date, totalKcal]) => {
          const status = getStatusByCalories(totalKcal);
          markedResult[date] = statusColorMap[status];
        });

        setMarked(markedResult);
      } catch (error) {
        console.error('❌ 전체 식단 불러오기 실패:', error);
      }
    };

    fetchAllMeals();
  }, []);

  const fillPercent = Math.min((consumedKcal / recommendedKcal) * 100, 100);

  const handleSelectTab = (idx: number) => {
    if (idx === 1 && !isToday) {
      Alert.alert('오늘만 이용 가능', '운동 추천은 오늘 날짜에서만 확인할 수 있어.');
      return;
    }
    setSelectedTabIndex(idx);
  };

  useEffect(() => {
    if (!isToday && selectedTabIndex !== 0) {
      setSelectedTabIndex(0);
    }
  }, [isToday, selectedTabIndex]);

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          <CalendarSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isExpanded={isCalendarExpanded}
            toggleExpanded={() =>
              setIsCalendarExpanded(!isCalendarExpanded)
            }
            marked={marked}
            headerRight={
              <TouchableOpacity
                onPress={() => navigation.navigate('Report')}
                style={styles.reportBtn}
              >
                <Text style={styles.reportText}>
                  리포트 보러가기 {'>>'}
                </Text>
              </TouchableOpacity>
            }
          />

          {isToday && (
            <TabSelector
              labels={['식단', '추천']}
              selectedIndex={selectedTabIndex}
              onSelectIndex={handleSelectTab}
            />
          )}

          {selectedTabIndex === 0 ? (
            <>
              {isToday && (
                <CalorieProgress
                  consumedKcal={recommendData.consumedCalories}
                  recommendedKcal={
                    recommendData.consumedCalories +
                    recommendData.remainingCalories
                  }
                />
              )}

              {serverMeals.length === 0 ? (
                <Text style={styles.noMealText}>
                  식사 기록이 없습니다 🍽️
                </Text>
              ) : (
                serverMeals.map((meal, index) => (
                  <DietCard
                    key={`${meal.mealId}-${index}`}
                    additionalMeal={meal}
                    onDeleted={(deletedId) => {
                      setServerMeals((prev) =>
                        prev.filter((m) => m.mealId !== deletedId)
                      );
                    }}
                  />
                ))
              )}
            </>
          ) : (
            <RecommendCard
              consumedCalories={recommendData.consumedCalories}
              remainingCalories={recommendData.remainingCalories}
              exercises={recommendData.exercises}
              foods={recommendData.foods}
            />
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={toggleCameraMenu}
        >
          <Image
            source={require('../assets/images/cameraIcon.png')}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>

        <CameraMenu
          visible={cameraMenuVisible}
          onClose={toggleCameraMenu}
          onPickGallery={openGallery}
          onOpenCamera={openCamera}
        />
      </SafeAreaView>
      <Navigation />
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>분석 중이에요...</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingBottom: 100,
  },
  headerAction: {
    paddingTop: 16,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  reportBtn: {
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.001)',
  },
  reportText: {
    color: '#38B000',
    fontWeight: 'bold',
    marginTop: -2
  },
  cameraButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#38B000',
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#17171B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  cameraIcon: {
    width: 33.79,
    height: 33.79,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#17171B',
  },
  noMealText: {
    textAlign: 'center',
    color: '#9BA1A6',
    fontSize: 15,
    marginTop: 30,
    marginBottom: 10,
  },
});

export default AnalysisScreen;