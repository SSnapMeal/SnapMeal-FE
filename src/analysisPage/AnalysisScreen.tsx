import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, StatusBar, Platform, PermissionsAndroid, View, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Navigation from '../components/Navigation';
import DietCard from '../components/DietCard';
import RecommendCard from '../components/RecommendCard';
import CalendarSection from '../components/CalendarSection';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import TabSelector from '../components/TabSelecter';
import CameraMenu from '../components/CameraMenu';
import CalorieProgress from '../components/CalorieProgress';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type StatusType = '과다' | '적정' | '부족';

type Nutrient = {
  name: string;
  value: string;
};

type CardData = {
  imageSource: any;
  title: string;
  mealTime: string;
  topNutrients: Nutrient[];
  tag: StatusType;
  mealId: number;
};


dayjs.extend(isoWeek);

const mealTypeMap: Record<string, string> = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
};

// 상위 2개 영양소만 추출
const pickTop2Nutrients = (item: any): Nutrient[] => {
  const labelMap: Record<string, string> = {
    protein: '단백질',
    carbs: '탄수화물',
    sugar: '당',
    fat: '지방',
  };

  const pairs = ([
    ['protein', item?.protein],
    ['carbs', item?.carbs],
    ['sugar', item?.sugar],
    ['fat', item?.fat],
  ] as [keyof typeof labelMap, number | undefined][])
    .filter(([, v]) => typeof v === 'number' && !isNaN(v as number))
    .sort((a, b) => (b[1]! - a[1]!))
    .slice(0, 2)
    .map(([key, v]) => ({ name: labelMap[key], value: `${v}g` }));

  return pairs;
};

const AnalysisScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [cameraMenuVisible, setCameraMenuVisible] = useState(false);

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

  const statusColors: Record<StatusType, string> = {
    과다: '#F3B8B8',
    적정: '#ABE88F',
    부족: '#FBE19A',
  };

  // 기준 칼로리에 따라 상태 판단
  const getStatusByCalories = (calories: number): StatusType => {
    if (calories > 2000) return '과다';
    if (calories < 1400) return '부족';
    return '적정';
  };

  // 🔹 상태별 색상
  const statusColorMap: Record<StatusType, string> = {
    과다: '#FA9E9E',
    적정: '#80DAA7',
    부족: '#FED77F',
  };

  const [isLoading, setIsLoading] = useState(false);
  const isToday = selectedDate.isSame(dayjs(), 'day');
  const [marked, setMarked] = useState<{ [key: string]: string }>({});

  const finalMeal: CardData | undefined =
    serverMeal ??
    (receivedMeal && {
      imageSource: receivedMeal.imageSource,
      title: receivedMeal.title,
      mealTime: receivedMeal.mealTime,
      topNutrients: receivedMeal.topNutrients,
      tag: receivedMeal.tag,
      mealId: Number((receivedMeal as any).mealId ?? -1), // ✅ 기본값(-1)
    });

  // 서버에서 식단 가져오는 부분 (className → title, topNutrients 상위 2개 적용)
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
        console.log('🌐 GET http://api.snapmeal.store/meals/date', { date: selectedDay });

        const response = await axios.get('http://api.snapmeal.store/meals/date', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: { date: selectedDay },
          signal: controller.signal as any,
        });

        console.log('📡 서버 응답 데이터:', response.data);

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
              title: item.className ?? item.title ?? '식사',
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
        console.error('❌ 식단 데이터 불러오기 실패:', error?.response?.data || error);
      }
    };

    fetchMeal();
    return () => controller.abort();
  }, [selectedDate]);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        // 🔹 AsyncStorage에서 accessToken 불러오기
        const token = await AsyncStorage.getItem('accessToken');

        if (!token) {
          console.warn('⚠️ 토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        // 🔹 API 요청
        const response = await axios.get(
          'http://api.snapmeal.store/recommendations/today',
          {
            headers: {
              Authorization: `Bearer ${token}`, // ⭐ 반드시 Bearer + 공백 + 토큰
            },
          }
        );

        const data = response.data;
        console.log('🔥 추천 API 데이터:', data);

        setRecommendData({
          consumedCalories: data.consumedCalories ?? 0,
          remainingCalories: data.remainingCalories ?? 0,
          exercises: data.exercises ?? [],
          foods: data.foods ?? [],
        });
      } catch (error) {
        const err = error as any;
        console.error(
          '❌ 추천 데이터 불러오기 실패:',
          err.response?.status,
          err.response?.data
        );
      }
    };

    fetchRecommendation();
  }, []);

  // 전체 식단 데이터 받아와서 날짜별 총칼로리 → 상태별 색상 변환
  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        const response = await axios.get('http://api.snapmeal.store/meals', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = response.data?.result || [];
        console.log('📡 전체 식단 응답:', result);

        // 🔹 날짜별 총 칼로리 계산
        const caloriesByDate: Record<string, number> = {};
        result.forEach((meal: any) => {
          const dateKey = dayjs(meal.mealDate).format('YYYY-MM-DD');
          caloriesByDate[dateKey] = (caloriesByDate[dateKey] || 0) + (meal.calories ?? 0);
        });

        console.log('🔥 날짜별 총칼로리:', caloriesByDate);

        // 🔹 날짜별 색상 매핑
        const markedResult: Record<string, string> = {};
        Object.entries(caloriesByDate).forEach(([date, totalKcal]) => {
          const status = getStatusByCalories(totalKcal);
          markedResult[date] = statusColorMap[status];
        });

        console.log('🎨 markedResult:', markedResult);
        setMarked(markedResult); // ✅ 캘린더에 전달될 상태 저장
      } catch (error) {
        console.error('❌ 전체 식단 불러오기 실패:', error);
      }
    };

    fetchAllMeals();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '카메라 권한 요청',
          message: '앱에서 카메라를 사용할 수 있도록 허용해 주세요.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const imageOptions = {
    mediaType: 'photo' as const,
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8 as const,
  };

  const analyzeImage = async (imageUri: string) => {
    setIsLoading(true);                      // ✅ 로딩 시작
    try {
      const token = await AsyncStorage.getItem('accessToken');

      const predictFormData = new FormData();
      predictFormData.append('file', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const predictRes = await axios.post(
        'http://api.snapmeal.store/predict',
        predictFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const detections = predictRes.data.detections || [];
      const classNames = [...new Set(detections.map((d: any) => d.class_name))] as string[];

      const uploadFormData = new FormData();
      uploadFormData.append('file', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const uploadRes = await axios.post(
        'http://api.snapmeal.store/images/upload-predict',
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const imageId = uploadRes.data.image_id;

      // ✅ 다음 화면으로 이동
      navigation.navigate('ImageCheck', { imageUri, classNames, imageId });

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('❌ 분석 또는 업로드 실패:', error.response?.data || error.message);
      } else {
        console.error('❌ 알 수 없는 에러:', error);
      }
    } finally {
      // ✅ 살짝 늦게 끄면 전환시 깜빡임 방지
      setTimeout(() => setIsLoading(false), 200);
    }
  };

  const openGallery = () => {
    launchImageLibrary(imageOptions, async (response) => {
      if (response.didCancel || response.errorCode) return;
      const selectedImage = response.assets?.[0];
      if (selectedImage?.uri) {
        await analyzeImage(selectedImage.uri);
      }
    });
    setCameraMenuVisible(false);
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('카메라 권한 거부됨');
      return;
    }

    launchCamera(imageOptions, async (response) => {
      if (response.didCancel || response.errorCode) return;
      const capturedImage = response.assets?.[0];
      if (capturedImage?.uri) {
        await analyzeImage(capturedImage.uri);
      }
    });
  };

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
        <View collapsable={false} pointerEvents="box-none" style={styles.headerAction}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Report')}
            style={styles.reportBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            importantForAccessibility="yes"
          >
            <Text style={styles.reportText}>리포트 보러가기 {'>>'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >

          <CalendarSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isExpanded={isCalendarExpanded}
            toggleExpanded={() => setIsCalendarExpanded(!isCalendarExpanded)}
            marked={marked}
          />

          {isToday && (
            <TabSelector
              labels={['식단', '추천']}
              selectedIndex={selectedTabIndex}
              onSelectIndex={(idx) => setSelectedTabIndex(idx)}
            />
          )}

          {selectedTabIndex === 0 ? (
            <>
              {isToday && (
                <CalorieProgress
                  consumedKcal={recommendData.consumedCalories}
                  recommendedKcal={recommendData.consumedCalories + recommendData.remainingCalories}
                />
              )}

              {serverMeals.length === 0 ? (
                <Text style={styles.noMealText}>식사 기록이 없습니다 🍽️</Text>
              ) : (
                serverMeals.map((meal, index) => (
                  <DietCard
                    key={`${meal.mealId}-${index}`}
                    additionalMeal={meal}
                    onDeleted={(deletedId) => {
                      setServerMeals(prev => prev.filter(m => m.mealId !== deletedId));
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

        <TouchableOpacity style={styles.cameraButton} onPress={() => setCameraMenuVisible(prev => !prev)}>
          <Image source={require('../assets/images/cameraIcon.png')} style={styles.cameraIcon} />
        </TouchableOpacity>

        <CameraMenu
          visible={cameraMenuVisible}
          onClose={() => setCameraMenuVisible(false)}
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
    position: 'absolute',
    top: 22,
    right: 16,
    zIndex: 100,
    elevation: 100,
  },
  reportBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.001)',
  },
  reportText: {
    color: '#38B000',
    fontWeight: 'bold'
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
    color: '#333',
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