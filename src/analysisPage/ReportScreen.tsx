import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Header from '../components/Header';

const ReportScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'주간' | '월간'>('주간');
  const [weekIndex, setWeekIndex] = useState(3); // 예: 4월 3주차
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      {/* 상단 헤더 */}
      <Header title="리포트" backgroundColor='#FAFAFA'/>

      {/* 탭 메뉴 */}
      <View style={styles.tabRow}>
        <Text style={styles.tabTitle}>칼로리 분석</Text>
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === '주간' && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab('주간')}
          >
            <Text style={[styles.tabButtonText]}>주간</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === '월간' && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab('월간')}
          >
            <Text style={[styles.tabButtonText]}>월간</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.whiteSection}>
        {/* 주차 네비게이션 */}
        <View style={styles.weekNav}>
          <TouchableOpacity onPress={() => setWeekIndex((prev) => Math.max(1, prev - 1))}>
            <Text style={styles.weekArrow}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.weekText}>25년 4월 {weekIndex}주차</Text>
          <TouchableOpacity onPress={() => setWeekIndex((prev) => prev + 1)}>
            <Text style={styles.weekArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* 평균 섭취 칼로리 */}
        <Text style={styles.avgText}>일주일동안 평균 1980kcal를 섭취했어요!</Text>

        {/* 바 그래프 섹션 (예시용) */}
        <View style={styles.barChart}>
          <View style={styles.barChartRow}>
            {[
              { label: '월', value: 40, color: '#FED77F' },
              { label: '화', value: 60, color: '#80DAA7' },
              { label: '수', value: 50, color: '#80DAA7' },
              { label: '목', value: 80, color: '#FA9E9E' },
              { label: '금', value: 10, color: '#FED77F' },
              { label: '토', value: 65, color: '#80DAA7' },
              { label: '일', value: 30, color: '#FED77F' },
            ].map((item, index) => (
              <View key={index} style={styles.barItem}>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, {
                    height: `${item.value}%`,
                    backgroundColor: item.color,
                  }]} />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* 기준선 (평균선) */}
          <View style={styles.dottedLine} />
        </View>

        <Text style={styles.totalText}>총 섭취 칼로리: 14,700kcal</Text>

        {/* 영양소 분석 */}
        <View style={styles.card}>
          <Text style={styles.nutrientTitle}>평균적으로 다음과 같이 섭취했어요</Text>
          {[
            { label: '단백질', value: '20g', color: '#CDE8BF' },
            { label: '탄수화물', value: '13g', color: '#FFD794' },
            { label: '당', value: '5g', color: '#FFC5C6' },
            { label: '지방', value: '3g', color: '#FFF7C2' },
            { label: '기타', value: '6g', color: '#C9D8F0' },
          ].map((item, idx) => (
            <View key={idx} style={styles.nutrientRow}>
              <Text>{item.label}</Text>
              <View style={[styles.nutrientBar, { backgroundColor: item.color }]} />
              <Text>{item.value}</Text>
            </View>
          ))}
          <Text style={styles.nutrientNote}>
            전체적으로 적게 섭취하는 경향이 있어요{'\n'}
            현재 탄수화물 섭취가 너무 낮고, 당 섭취가 높아요
          </Text>
        </View>

        {/* 섭취 경향 설명 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>주로 저녁에 칼로리가 높은 음식을 먹었어요</Text>
          <View style={styles.cardContainer}>
            <Image source={require('../assets/images/dinner-time.png')} style={styles.cardImage} />
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardNote}>
                전체의 40%의 칼로리를 저녁에 섭취하였고, 탄수화물은 30g을 저녁마다 먹었어요
              </Text>
            </View>
          </View>
        </View>

        {/* 다음 행동 추천 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>다음에는 이렇게 해보아요 :)</Text>
          <Text style={styles.tipText}>☝ 영양소는 고르게 섭취해요</Text>
          <Text style={styles.tipSubText}>
            당은 과다, 다른 영양소는 부족해요. 에너지만 아니라 필수 영양소도 챙기며 균형 잡힌 식사로 시작해보세요.
          </Text>
          <Text style={styles.tipText}>✌ 저녁과 야식은 라이트하게!</Text>
          <Text style={styles.tipSubText}>
            속도 편하고 마음도 가볍게, 라이트한 한 끼로 건강한 하루의 끝을 만들어보세요.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  tabRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 22 },
  tabTitle: { fontSize: 18, fontWeight: '700', marginLeft: 2, marginTop: 41 },
  tabButtons: { flexDirection: 'row' },
  tabButton: {
    paddingHorizontal: 21,
    paddingVertical: 6,
    backgroundColor: '#DCDCDC',
    borderRadius: 17,
    marginLeft: 9,
    marginTop: 38,
    height: 34
  },
  tabButtonActive: { backgroundColor: '#38B000' },
  tabButtonText: { color: '#FFF', marginBottom: 2 },
  whiteSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingBottom: 32,
    paddingTop: 8,
    elevation: 1,
    marginHorizontal: 21,
    borderRadius: 20,
    marginTop: 13,
    marginBottom: 41
  },
  weekNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  weekArrow: { fontSize: 18, paddingHorizontal: 12 },
  weekText: { fontSize: 16, fontWeight: '600' },
  avgText: { textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  barChart: {
    height: 180,
    marginVertical: 0,
    position: 'relative',
    paddingHorizontal: 15
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 12,
  },
  barItem: {
    alignItems: 'center',
    width: 31,
  },
  barBackground: {
    width: 31,
    height: 120,
    backgroundColor: '#F4F5F9',
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
  dottedLine: {
    position: 'absolute',
    top: 80, // 기준선 위치 조정
    left: 0,
    right: 0,
    borderTopWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#9B9B9B',
  },
  totalText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#717171',
    marginTop: 11
  },
  card: {
    borderRadius: 16,
    marginTop: 60,
  },
  nutrientTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
  },
  nutrientBar: {
    height: 17,
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 3,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
    justifyContent: 'space-between',
  },
  nutrientNote: {
    fontSize: 12,
    color: '#717171',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 11,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardNote: {
    fontSize: 12,
    color: '#717171',
    lineHeight: 18,
    fontWeight: 500,
  },
  tipText: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },
  tipSubText: { fontSize: 13, color: '#555', marginBottom: 6 },
});

export default ReportScreen;
