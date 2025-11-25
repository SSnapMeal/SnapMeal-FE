import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  Image,
} from 'react-native';
import Header from '../components/Header';
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
    case 'FAIL':
    case 'FAILED':
      return '실패';
    default:
      return '참여전';
  }
};

const ChallengeActiveScreen = () => {
  const navigation = useNavigation<any>();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveChallenges = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('토큰 없음');
        return;
      }

      const response = await axios.get(
        'http://api.snapmeal.store/challenges/my',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            statuses: 'IN_PROGRESS',
          },
        }
      );

      setChallenges(response.data || []);
    } catch (error) {
      console.error('참여중 챌린지 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveChallenges();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchActiveChallenges();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="참여 중인 챌린지" backgroundColor="#FAFAFA" />

      <View style={styles.topRow}>
        <Text style={styles.titleText}>총 {challenges.length}개의 챌린지</Text>
      </View>

      {loading ? (
        <Text style={styles.loading}>로딩중...</Text>
      ) : challenges.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require('../assets/images/snap.png')}
            style={styles.snapImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>
            아직 참여 중인 챌린지가 없어요.{'\n'}마음에 드는 챌린지부터 시작해볼까요? 💚
          </Text>
        </View>
      ) : (
        <View style={styles.cardList}>
          {challenges.map((challenge: any) => {
            const state = mapStatusToState(challenge.status);

            return (
              <ChallengeCard
                key={challenge.challengeId}
                imageSource={require('../assets/images/challenge_background.png')}
                title={challenge.title}
                targetMenuName={challenge.targetMenuName}
                description={challenge.description}
                state={state}
                onPress={() => {
                  console.log(
                    '[ChallengeActive] 카드 눌림 → ChallengeDetail 이동',
                    challenge.challengeId
                  );
                  navigation.navigate('ChallengeDetail', {
                    challenge: {
                      challengeId: challenge.challengeId,
                      title: challenge.title,
                      description: challenge.description,
                      targetMenuName: challenge.targetMenuName,
                      status: challenge.status,
                      startDate: challenge.startDate,
                      endDate: challenge.endDate,
                      introduction: challenge.introduction ?? {},
                      stamps: Array.isArray(challenge.stamps) ? challenge.stamps : [],
                    },
                  });
                }}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  titleText: { fontSize: 18, fontWeight: '700', marginLeft: 2, marginTop: 41 },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  cardList: {
    marginTop: 20,
    marginBottom: 40,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 24,
  },
  snapImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChallengeActiveScreen;