import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import TabSwitcher from '../components/TabSwitcher';
import DietCard from '../components/DietCard';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// status → state 매핑 함수
const mapStatusToState = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '참여전';
    case 'IN_PROGRESS':
      return '참여중';
    case 'COMPLETED':
      return '성공';
    default:
      return '참여전';
  }
};

const ChallengeExplorerScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'전체' | '참여전'>('전체');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  // 서버에서 챌린지 데이터 가져오기
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');

        if (!token) {
          console.error('❌ 토큰이 없습니다. 로그인 후 다시 시도하세요.');
          return;
        }

        const response = await axios.post(
          'http://api.snapmeal.store/challenges/weekly/generate',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('🔥 챌린지 데이터:', response.data);
        setChallenges(response.data);
      } catch (error) {
        console.error('❌ 챌린지 데이터 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);


  // 탭에 따라 데이터 필터링
  const filteredChallenges =
    selectedTab === '전체'
      ? challenges.filter(c => {
        const mappedState = mapStatusToState(c.status);
        return mappedState === '참여전' || mappedState === '참여중';
      })
      : challenges.filter(c => mapStatusToState(c.status) === '참여전');

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="전체 챌린지" backgroundColor="#FAFAFA" />

      {/* 상단 탭 영역 */}
      <View style={styles.tabRow}>
        <Text style={styles.tabTitle}>
          총 {filteredChallenges.length}개의 챌린지
        </Text>
        <TabSwitcher
          tabs={['전체', '참여전']}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
      </View>

      {/* 카드 리스트 */}
      <View style={styles.cardList}>
        {loading ? (
          <Text style={styles.loadingText}>로딩중...</Text>
        ) : filteredChallenges.length === 0 ? (
          <Text style={styles.emptyText}>챌린지가 없습니다.</Text>
        ) : (
          filteredChallenges.map(challenge => (
            <TouchableOpacity
              key={challenge.challengeId}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ChallengeDetail', {
                  challenge: challenge,
                })
              }
            >
              <DietCard
                variant="challenge"
                challengeState={mapStatusToState(challenge.status)}
                additionalMeal={{
                  imageSource: require('../assets/images/coffee.png'),
                  title: challenge.title,
                  targetMenuName: challenge.targetMenuName, // 🔹 추가
                  description: challenge.description,       // 🔹 추가
                  mealId: challenge.challengeId,
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
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 16,
  },
});

export default ChallengeExplorerScreen;
