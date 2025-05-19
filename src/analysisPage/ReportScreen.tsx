import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import dayjs from 'dayjs';
import Header from '../components/Header';
import TabSwitcher from '../components/TabSwitcher';
import WeeklyBarChart from '../components/WeeklyBarChart';
import NutrientSummary from '../components/NutrientSummary';
import DinnerCard from '../components/DinnerCard';
import TipCard from '../components/TipCard';

const getValidWeeks = () => {
  const today = dayjs();
  const oneMonthAgo = today.subtract(1, 'month').startOf('month');
  const endDate = today.subtract(1, 'week').endOf('week');

  const weeks = [];
  let current = oneMonthAgo.startOf('week');
  let lastMonth = null;
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


const ReportScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<'주간' | '월간'>('주간');

  const weeks = useMemo(() => getValidWeeks(), []);
  const [weekIndex, setWeekIndex] = useState(weeks.length);

  const nutrients = [
    { label: '단백질', value: 20, unit: 'g', color: '#CDE8BF' },
    { label: '탄수화물', value: 13, unit: 'g', color: '#FFD794' },
    { label: '당', value: 5, unit: 'g', color: '#FFC5C6' },
    { label: '지방', value: 3, unit: 'g', color: '#FFF7C2' },
    { label: '기타', value: 6, unit: 'g', color: '#C9D8F0' },
  ];

  const weeklyBarData = [
    { label: '월', value: 40, color: '#FED77F' },
    { label: '화', value: 60, color: '#80DAA7' },
    { label: '수', value: 50, color: '#80DAA7' },
    { label: '목', value: 80, color: '#FA9E9E' },
    { label: '금', value: 10, color: '#FED77F' },
    { label: '토', value: 65, color: '#80DAA7' },
    { label: '일', value: 30, color: '#FED77F' },
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="리포트" backgroundColor="#FAFAFA" />

      <View style={styles.tabRow}>
        <Text style={styles.tabTitle}>칼로리 분석</Text>
        <TabSwitcher
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
      </View>

      <View style={styles.whiteSection}>
        <View style={styles.weekNav}>
          <TouchableOpacity
            onPress={() => setWeekIndex((prev) => Math.max(1, prev - 1))}>
            <Text style={styles.weekArrow}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.weekText}>{weeks[weekIndex - 1]?.label ?? ''}</Text>
          <TouchableOpacity
            onPress={() => setWeekIndex((prev) => Math.min(weeks.length, prev + 1))}>
            <Text style={styles.weekArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <WeeklyBarChart
          data={weeklyBarData}
          averageText="일주일동안 평균 1980kcal를 섭취했어요!"
        />
        <Text style={styles.totalText}>총 섭취 칼로리: 14,700kcal</Text>

        <NutrientSummary data={nutrients} />
        <DinnerCard />
        <TipCard />
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
