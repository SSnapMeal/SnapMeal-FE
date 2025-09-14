import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import dayjs from 'dayjs';
import Header from '../components/Header';
import TabSwitcher from '../components/TabSwitcher';
import WeeklyBarChart from '../components/WeeklyBarChart';
import NutrientSummary from '../components/NutrientSummary';
import DinnerCard from '../components/DinnerCard';
import TipCard from '../components/TipCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getValidWeeks = () => {
  const today = dayjs();
  const oneMonthAgo = today.subtract(1, 'month').startOf('month');
  const endDate = today.subtract(1, 'week').endOf('week');

  const weeks = [];
  let current = oneMonthAgo.startOf('week');
  let lastMonth: number | null = null;
  let weekInMonth = 1;

  while (current.isBefore(endDate, 'day')) {
    const startOfWeek = current.startOf('week');
    const endOfWeek = current.endOf('week');
    const monthOfWeek = startOfWeek.month();
    const year = startOfWeek.year();

    if (monthOfWeek !== lastMonth) {
      weekInMonth = 1;
      lastMonth = monthOfWeek;
    }

    weeks.push({
      year,
      month: monthOfWeek + 1,
      week: weekInMonth,
      label: `${year % 100}년 ${monthOfWeek + 1}월 ${weekInMonth}주차`,
      start: startOfWeek.format('YYYY-MM-DD'),
      end: endOfWeek.format('YYYY-MM-DD'),
    });

    weekInMonth += 1;
    current = current.add(1, 'week');
  }

  return weeks;
};

// YYYY-MM-DD → "YY년 M월 N주차" 변환
const toWeekLabel = (dateStr: string) => {
  const d = dayjs(dateStr);
  if (!d.isValid()) return '';
  const year2 = d.year() % 100;
  const month = d.month() + 1;

  // 그 달의 "주차" 계산: 해당 달의 시작을 주의 시작으로 당겨서(일/월 시작 환경에 맞춰) 몇 번째 주인지 계산
  const monthStartAligned = d.startOf('month').startOf('week');
  const thisWeekAligned = d.startOf('week');
  const weekIndex = thisWeekAligned.diff(monthStartAligned, 'week') + 1;

  return `${year2}년 ${month}월 ${weekIndex}주차`;
};

type ReportResponse = {
  reportDate: string;            // "2025-09-03"
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  recommendedExercise: string;
  foodSuggestion: string;
  nutritionSummary: string;
  caloriePattern: string;
  healthGuidance: string;
};

const ReportScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<'주간' | '월간'>('주간');

  const weeks = useMemo(() => getValidWeeks(), []);
  const [weekIndex, setWeekIndex] = useState(weeks.length);

  const [weekLabelFromApi, setWeekLabelFromApi] = useState<string>('');
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [nutrients, setNutrients] = useState<
    { label: string; value: number; unit: string; color: string }[]
  >([
    { label: '단백질', value: 0, unit: 'g', color: '#CDE8BF' },
    { label: '탄수화물', value: 0, unit: 'g', color: '#FFD794' },
    { label: '당', value: 0, unit: 'g', color: '#FFC5C6' }, // API에 없으므로 0
    { label: '지방', value: 0, unit: 'g', color: '#FFF7C2' },
    { label: '기타', value: 0, unit: 'g', color: '#C9D8F0' }, // 필요 시 재계산
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nutritionSummary, setNutritionSummary] = useState<string>('');
  const [caloriePattern, setCaloriePattern] = useState<string>('');
  const [healthGuidance, setHealthGuidance] = useState<string>('');
  const [recommendedExercise, setRecommendedExercise] = useState<string>('');
  const [foodSuggestion, setFoodSuggestion] = useState<string>('');


  const weeklyBarData = [
    { label: '월', value: 40, color: '#FED77F' },
    { label: '화', value: 60, color: '#80DAA7' },
    { label: '수', value: 50, color: '#80DAA7' },
    { label: '목', value: 80, color: '#FA9E9E' },
    { label: '금', value: 10, color: '#FED77F' },
    { label: '토', value: 65, color: '#80DAA7' },
    { label: '일', value: 30, color: '#FED77F' },
  ];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchReport = async () => {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem('accessToken');
        console.log('🔑 accessToken:', token);

        if (!token) {
          throw new Error('토큰이 없습니다. 로그인 후 이용해주세요.');
        }

        const res = await fetch('http://api.snapmeal.store/reports/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        // 응답 본문을 텍스트로 확인
        const responseText = await res.text();
        console.log('📩 Raw Response:', responseText);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${responseText}`);
        }

        // 안전 파싱
        let data: ReportResponse;
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error('서버 응답이 JSON 형식이 아닙니다.');
        }
        console.log('📊 Parsed Data:', data);

        // 1) 주차 라벨: "YY년 M월 N주차" 형태로 변환
        const labelFromDate = toWeekLabel(data.reportDate);

        // 2) 숫자 필드 방어적 변환
        const totalCaloriesNum = Number(data.totalCalories) || 0;
        const protein = Number(data.totalProtein) || 0;
        const fat = Number(data.totalFat) || 0;
        const carbs = Number(data.totalCarbs) || 0;

        // 3) 상태 업데이트 (언마운트 시 무시)
        if (isMounted) {
          setWeekLabelFromApi(labelFromDate);
          setTotalCalories(totalCaloriesNum);
          setNutrients([
            { label: '단백질', value: protein, unit: 'g', color: '#CDE8BF' },
            { label: '탄수화물', value: carbs, unit: 'g', color: '#FFD794' },
            { label: '당', value: 0, unit: 'g', color: '#FFC5C6' },
            { label: '지방', value: fat, unit: 'g', color: '#FFF7C2' },
            { label: '기타', value: 0, unit: 'g', color: '#C9D8F0' },
          ]);

          // ✅ 텍스트 데이터 세팅
          setNutritionSummary(data.nutritionSummary ?? '');
          setCaloriePattern(data.caloriePattern ?? '');
          setHealthGuidance(data.healthGuidance ?? '');
          setRecommendedExercise(data.recommendedExercise ?? '');
          setFoodSuggestion(data.foodSuggestion ?? '');
        }

      } catch (err: any) {
        if (err?.name === 'AbortError') return; // 화면 떠날 때 요청 중단
        console.error('❌ fetch error:', err);
        Alert.alert('오류', `리포트 데이터를 불러오지 못했습니다.\n${String(err?.message ?? err)}`);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);


  const formatNumber = (n: number) => {
    try {
      return new Intl.NumberFormat('ko-KR').format(n);
    } catch {
      return `${n}`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="리포트" backgroundColor="#FAFAFA" />

      <View style={styles.tabRow}>
        <Text style={styles.tabTitle}>칼로리 분석</Text>
        <TabSwitcher selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      </View>

      <View style={styles.whiteSection}>
        <View style={styles.weekNav}>
          <TouchableOpacity onPress={() => setWeekIndex((prev) => Math.max(1, prev - 1))}>
            <Text style={styles.weekArrow}>{'<'}</Text>
          </TouchableOpacity>

          {/* API로 받은 라벨이 있으면 우선 사용 */}
          <Text style={styles.weekText}>
            {weekLabelFromApi || weeks[weekIndex - 1]?.label || ''}
          </Text>

          <TouchableOpacity onPress={() => setWeekIndex((prev) => Math.min(weeks.length, prev + 1))}>
            <Text style={styles.weekArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <WeeklyBarChart
              data={weeklyBarData /* 일단 기존 막대 데이터 유지 (일별 값 API 생기면 교체) */}
              averageText={
                totalCalories > 0
                  ? `일주일동안 평균 ${formatNumber(Math.round(totalCalories / 7))}kcal를 섭취했어요!`
                  : '이번 주 데이터가 충분하지 않아요.'
              }
            />

            <Text style={styles.totalText}>
              총 섭취 칼로리: {formatNumber(totalCalories)}kcal
            </Text>

            <NutrientSummary data={nutrients} nutritionSummary={nutritionSummary} />

            <DinnerCard
              title="칼로리 섭취 패턴"
              note={caloriePattern}
            />
            <TipCard healthGuidance={healthGuidance} />

            {(!!recommendedExercise || !!foodSuggestion) && (
              <View style={{ marginTop: 12, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderColor: '#eee', borderWidth: 1 }}>
                {!!recommendedExercise && (
                  <>
                    <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>운동 제안</Text>
                    <Text style={{ lineHeight: 20, marginBottom: !!foodSuggestion ? 12 : 0 }}>
                      {recommendedExercise}
                    </Text>
                  </>
                )}
                {!!foodSuggestion && (
                  <>
                    <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>식단 제안</Text>
                    <Text style={{ lineHeight: 20 }}>{foodSuggestion}</Text>
                  </>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  tabTitle: { fontSize: 18, fontWeight: '700', marginLeft: 2, marginTop: 41 },
  whiteSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingBottom: 32,
    paddingTop: 8,
    elevation: 1,
    marginHorizontal: 21,
    borderRadius: 20,
    marginTop: 13,
    marginBottom: 41,
  },
  weekNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  weekArrow: { fontSize: 18, paddingHorizontal: 12 },
  weekText: { fontSize: 16, fontWeight: '600' },
  totalText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#717171',
    marginTop: 11,
  },
});

export default ReportScreen;
