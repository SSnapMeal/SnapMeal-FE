import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import Header from '../components/common/Header';
import TabSwitcher from '../components/challenge/TabSwitcher';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import ChallengeCard, { ChallengeState } from '../components/challenge/ChallengeCard';


const mapStatusToState = (status: string): ChallengeState => {
  switch (status) {
    case 'SUCCESS':
    case 'COMPLETED':
      return '성공';
    case 'FAIL':
    case 'FAILED':
      return '실패';
    default:
      return '참여전';
  }
};

const ChallengeDoneScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'전체' | '성공'>('전체');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewedChallengeIds, setReviewedChallengeIds] = useState<number[]>([]);
  const navigation = useNavigation<any>();

  // 완료된 챌린지 + 내가 쓴 리뷰 목록 불러오기
  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
        setChallenges([]);
        setReviewedChallengeIds([]);
        return;
      }

      const commonHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // 1) 완료된 챌린지
      const challengeRes = await axios.get(
        'http://api.snapmeal.store/challenges/my',
        {
          headers: commonHeaders,
          params: {
            statuses: 'FAIL,SUCCESS',
          },
        }
      );

      setChallenges(challengeRes.data);

      // 2) 내가 쓴 리뷰 전체
      try {
        const reviewRes = await axios.get(
          'http://api.snapmeal.store/challenges/reviews/my',
          {
            headers: commonHeaders,
          }
        );

        const ids =
          Array.isArray(reviewRes.data)
            ? reviewRes.data.map((r: any) => r.challengeId)
            : [];

        setReviewedChallengeIds(ids);
      } catch (err) {
        console.error('리뷰 목록 불러오기 실패:', err);
        setReviewedChallengeIds([]);
      }
    } catch (e) {
      console.error('완료된 챌린지 불러오기 실패:', e);
      setChallenges([]);
      setReviewedChallengeIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 첫 진입 시 한 번 호출
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // 다른 화면 갔다가 돌아올 때마다 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchChallenges();
    }, [fetchChallenges])
  );

  const filteredChallenges =
    selectedTab === '전체'
      ? challenges
      : challenges.filter(c => c.status === 'SUCCESS');

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
        {loading ? (
          <ActivityIndicator size="large" color="#888" style={{ marginTop: 40 }} />
        ) : filteredChallenges.length === 0 ? (
          <Text style={styles.emptyText}>완료된 챌린지가 없습니다</Text>
        ) : (
          filteredChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.challengeId}
              imageSource={require('../assets/images/challenge_background.png')}
              title={challenge.title}
              targetMenuName={challenge.targetMenuName}
              description={challenge.description}
              state={mapStatusToState(challenge.status)}
              hasReview={reviewedChallengeIds.includes(challenge.challengeId)}
              onPress={() => {
                console.log('challenge item:', challenge);
                navigation.navigate('ChallengeDetail', {
                  challenge: {
                    ...challenge,
                    introduction: challenge.introduction ?? {},
                    stamps: Array.isArray(challenge.stamps) ? challenge.stamps : [],
                  },
                });
              }}
            />
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
    marginBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});

export default ChallengeDoneScreen;