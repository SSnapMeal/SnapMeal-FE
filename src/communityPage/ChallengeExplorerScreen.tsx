import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
} from 'react-native';
import Header from '../components/Header';
import TabSwitcher from '../components/TabSwitcher';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChallengeCard, { ChallengeState } from '../components/ChallengeCard';

const mapStatusToState = (status: string): ChallengeState => {
  switch (status) {
    case 'PENDING':
      return '참여전';
    case 'IN_PROGRESS':
      return '참여중';
    case 'COMPLETED':
    case 'SUCCESS':
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

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 로그인 후 다시 시도하세요.');
        setChallenges([]);
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

      setChallenges(response.data);
    } catch (error) {
      console.error('❌ 챌린지 데이터 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  useFocusEffect(
    useCallback(() => {
      fetchChallenges();
    }, [fetchChallenges])
  );

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

      <View style={styles.cardList}>
        {loading ? (
          <Text style={styles.loadingText}>로딩중...</Text>
        ) : filteredChallenges.length === 0 ? (
          <Text style={styles.emptyText}>챌린지가 없습니다.</Text>
        ) : (
          filteredChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.challengeId}
              imageSource={require('../assets/images/challenge_background.png')}
              title={challenge.title}
              targetMenuName={challenge.targetMenuName}
              description={challenge.description}
              state={mapStatusToState(challenge.status)}
              onPress={() =>
                navigation.navigate('ChallengeDetail', {
                  challenge: challenge,
                })
              }
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
    paddingBottom: 20,
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