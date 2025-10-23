import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import TabSwitcher from '../components/TabSwitcher';
import DietCard from '../components/DietCard';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChallengeDoneScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'전체' | '성공'>('전체');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const navigation = useNavigation<any>();

  /** ✅ 서버에서 데이터 가져오기 */
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('현재 저장된 토큰:', token);

        if (!token) {
          console.error('❌ 토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          'http://api.snapmeal.store/challenges/my?statuses=FAIL,SUCCESS',
          {
            method: 'GET',
            headers: {
              'accept': '*/*', // ✅ 스웨거와 동일하게
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // ✅ 토큰 포함
            },
          }
        );

        console.log('응답 코드:', response.status);

        const rawText = await response.text();
        console.log('서버 응답 원문:', rawText);

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        // JSON 파싱
        const data = JSON.parse(rawText);

        // 데이터 가공 후 상태 업데이트
        const mappedData = data.map((item: any) => ({
          id: item.challengeId,
          mealId: item.challengeId,
          title: item.title,
          targetMenuName: item.targetMenuName, // 챌린지 대상 메뉴
          description: item.description, // 챌린지 설명
          imageSource: require('../assets/images/coffee.png'), // 서버 이미지 있으면 교체
          state: item.status === 'SUCCESS' ? '성공' : '실패',
        }));

        setChallenges(mappedData);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  /** ✅ 탭에 따라 자동 필터링 */
  const filteredChallenges =
    selectedTab === '전체'
      ? challenges // 전체 → 성공 + 실패 모두
      : challenges.filter(c => c.state === '성공'); // 성공만

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="완료된 챌린지" backgroundColor="#FAFAFA" />

      <View style={styles.tabRow}>
        <Text style={styles.tabTitle}>
          총 {filteredChallenges.length}개의 챌린지
        </Text>
        <TabSwitcher
          tabs={['전체', '성공']}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
      </View>

      <View style={styles.cardList}>
        {/* 로딩 중 */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#888"
            style={{ marginTop: 40 }}
          />
        ) : filteredChallenges.length === 0 ? (
          // 데이터 없을 때
          <Text style={styles.emptyText}>완료된 챌린지가 없습니다</Text>
        ) : (
          // 데이터 있을 때
          filteredChallenges.map(challenge => (
            <TouchableOpacity
              key={challenge.id}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ChallengeDetail', {
                  challenge: challenge, // ✅ 객체 통째로 전달
                })
              }
            >
              <DietCard
                variant="challenge"
                challengeState={challenge.state}
                additionalMeal={{
                  mealId: challenge.mealId,
                  imageSource: challenge.imageSource,
                  title: challenge.title,
                  targetMenuName: challenge.targetMenuName,
                  description: challenge.description,
                }}
              />
            </TouchableOpacity>
          ))
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
  cardList: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});

export default ChallengeDoneScreen;
