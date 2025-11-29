import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Navigation from '../components/Navigation';
import NutrientBarChart from '../components/NutrientBarChart';
import MealCard from '../components/MealCard';
import { launchCamera, CameraOptions, CameraType } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const { height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

type TotalsType = {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalSugar: number;
  totalFat: number;
};

type Meal = {
  mealId: number;
  mealType: string;
  memo: string;
  location: string;
  mealDate: string;
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat: number;
  className: string;
  imageUrl: string;
};

const cameraOptions: CameraOptions = {
  mediaType: 'photo',
  cameraType: 'back' as CameraType,
  saveToPhotos: true,
};

const HomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [userName, setUserName] = useState<string>('스냅');
  const [meals, setMeals] = useState<Meal[]>([]);

  // API에서 가져온 합계 값 저장
  const [nutritionData, setNutritionData] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalSugar: 0,
    totalFat: 0,
  });

  const handleNickname = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      const res = await axios.get(
        'http://api.snapmeal.store/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("내 정보 조회 성공", res.data);

      setUserName(res.data.nickname);

    } catch (error) {
      console.log("내 정보 조회 실패", error);

    }
  };

  useEffect(() => {
    handleNickname();
  }, []);

  // 오늘 날짜 기반으로 식사 데이터 불러오기
  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('⚠️ 토큰이 없습니다. 로그인 확인 필요!');
          setMeals([]);
          setNutritionData({
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalSugar: 0,
            totalFat: 0,
          });
          return;
        }

        // 오늘 날짜를 YYYY-MM-DD 형식으로 생성
        const today = dayjs().format('YYYY-MM-DD');
        console.log('📅 오늘 날짜:', today);

        // /meals/date API GET 요청 (하루 단위)
        const response = await axios.get('http://api.snapmeal.store/meals/date', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: { date: today },
        });

        console.log('🍽 서버 응답:', response.data);

        // 결과를 배열 형태로 안전하게 정규화
        const raw = response.data?.result;
        const mealsData: Meal[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

        if (response.data?.isSuccess && mealsData.length > 0) {
          // (선택) 아침-점심-저녁 순으로 정렬
          const order: Record<string, number> = { BREAKFAST: 0, LUNCH: 1, DINNER: 2 };
          mealsData.sort((a, b) => {
            const byType = (order[a.mealType] ?? 99) - (order[b.mealType] ?? 99);
            if (byType !== 0) return byType;
            return dayjs(a.mealDate).valueOf() - dayjs(b.mealDate).valueOf();
          });

          // 합계 계산
          const totals = mealsData.reduce<TotalsType>(
            (acc, meal) => {
              acc.totalCalories += meal.calories || 0;
              acc.totalProtein += meal.protein || 0;
              acc.totalCarbs += meal.carbs || 0;
              acc.totalSugar += meal.sugar || 0;
              acc.totalFat += meal.fat || 0;
              return acc;
            },
            {
              totalCalories: 0,
              totalProtein: 0,
              totalCarbs: 0,
              totalSugar: 0,
              totalFat: 0,
            }
          );

          console.log('오늘 섭취 합계:', totals);
          setNutritionData(totals);
          setMeals(mealsData);
        } else {
          console.warn('오늘 날짜에 해당하는 식사가 없습니다.');
          setMeals([]);
          setNutritionData({
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalSugar: 0,
            totalFat: 0,
          });
        }
      } catch (error: any) {
        console.error('❌ meals/date API 요청 실패:', error?.response?.status, error?.response?.data || error);
        setMeals([]);
        setNutritionData({
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalSugar: 0,
          totalFat: 0,
        });
      }
    };

    fetchMealData();
  }, []);

  // 색상 결정 함수
  const getColorByStatus = (value: number) => {
    if (value >= 80) return '#FF9C9C'; // 과다
    if (value >= 40) return '#7DDBA3'; // 적정
    return '#FED77F';                  // 부족
  };

  const chartData = [
    { label: '단백질', value: nutritionData.totalProtein, color: getColorByStatus(nutritionData.totalProtein) },
    { label: '탄수화물', value: nutritionData.totalCarbs, color: getColorByStatus(nutritionData.totalCarbs) },
    { label: '당', value: nutritionData.totalSugar, color: getColorByStatus(nutritionData.totalSugar) },
    { label: '지방', value: nutritionData.totalFat, color: getColorByStatus(nutritionData.totalFat) },
  ];

  const handlePress = () => {
    launchCamera(cameraOptions, response => {
      if (response.didCancel) {
        console.log('사용자가 촬영을 취소함');
      } else if (response.errorCode) {
        console.error('카메라 오류:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
      }
    });
  };

  // 컴포넌트 안에 헬퍼 추가
  const getMealColorByKcal = (kcal: number) => {
    if (kcal > 700) return '#FFA3A3'; // 과다
    if (kcal >= 400) return '#85DFAC'; // 적정
    return '#FED77F'; // 부족
  };

  // 상위 2개 영양소 문자열 (단위 g 가정)
  const getTop2NutrStr = (m: Meal) => {
    const pairs: Array<{ key: keyof Meal; label: string; val: number }> = [
      { key: 'protein', label: '단백질', val: m.protein || 0 },
      { key: 'carbs', label: '탄수화물', val: m.carbs || 0 },
      { key: 'sugar', label: '당', val: m.sugar || 0 },
      { key: 'fat', label: '지방', val: m.fat || 0 },
    ];
    const top2 = pairs.sort((a, b) => b.val - a.val).slice(0, 2);
    return `${top2[0].label} ${top2[0].val}g, ${top2[1].label} ${top2[1].val}g`;
  };

  return (
    <>
      <StatusBar backgroundColor="#E1F3D8" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.fullScreen}>
          <View style={styles.background} />

          <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
            {/* 인사말 */}
            <View style={styles.greetingSection}>
              <Text style={styles.helloMent}>안녕하세요!</Text>
              <Text style={styles.userMent}>{userName}님 :)</Text>
              <Image source={require('../assets/images/profile.png')} style={styles.profileImg} resizeMode="cover" />
            </View>

            {/* 분석 카드 */}
            <View style={styles.analyzeCard}>
              <Text style={styles.cardTitle}>칼로리를 분석하세요!</Text>
              <Text style={styles.cardMent}>
                지금 당장 사진을 업로드하면 쉽고 빠르게 칼로리 분석을 받을 수 있습니다
              </Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={handlePress} activeOpacity={0.6}>
                <View style={styles.uploadContent}>
                  <Text style={styles.uploadBtnText}>사진 업로드 하기</Text>
                  <Image source={require('../assets/images/upload.png')} style={styles.uploadBtnIcon} />
                </View>
              </TouchableOpacity>
            </View>

            {/* 오늘 식사 기록 */}
            <View style={styles.mealSection}>
              <Text style={styles.sectionTitle}>오늘의 식사 기록</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {meals.length === 0 ? (
                  <MealCard
                    backgroundColor="#C0C0C0"
                    title="기록 없음"
                    kcal="0kcal"
                    nutrients="—"
                  />
                ) : (
                  meals.map((m, idx) => (
                    <MealCard
                      key={m.mealId}
                      backgroundColor={getMealColorByKcal(m.calories || 0)}
                      title={m.className || '식사'}
                      kcal={`${m.calories || 0}kcal`}
                      nutrients={getTop2NutrStr(m)}
                      style={idx === meals.length - 1 ? { marginRight: 16 } : undefined}
                    />
                  ))
                )}
              </ScrollView>
            </View>

            {/* 오늘의 영양 차트 */}
            <View style={{ paddingHorizontal: 35 }}>
              <NutrientBarChart data={chartData} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <Navigation />
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: height,
    backgroundColor: '#FAFAFA',
    zIndex: -1,
  },
  scrollContent: {
    paddingTop: 250,
    paddingBottom: 30,
  },
  greetingSection: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 221,
    backgroundColor: '#E1F3D8',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingLeft: 51,
    paddingRight: 51,
    paddingTop: 58,
  },
  helloMent: {
    color: '#17171B',
    fontSize: 16,
    fontWeight: '500',
  },
  userMent: {
    color: '#17171B',
    fontSize: 30,
    fontWeight: '700',
  },
  profileImg: {
    position: 'absolute',
    top: 45,
    right: 51,
    width: 75,
    height: 75,
  },
  analyzeCard: {
    position: 'absolute',
    top: 138,
    left: '50%',
    transform: [{ translateX: -160 }],
    width: 320,
    height: 174,
    backgroundColor: '#FCFEF9',
    borderRadius: 40,
    elevation: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 23,
  },
  cardTitle: {
    color: '#10152C',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardMent: {
    color: '#10152C',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 34,
  },
  uploadBtn: {
    backgroundColor: '#38B000',
    width: 213,
    height: 52,
    marginTop: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16,
    marginRight: 10,
  },
  uploadBtnIcon: {
    width: 32,
    height: 32,
  },
  mealSection: {
    marginTop: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10152C',
    marginBottom: 16,
    marginLeft: 6,
    paddingLeft: 27,
  },
});

export default HomeScreen;