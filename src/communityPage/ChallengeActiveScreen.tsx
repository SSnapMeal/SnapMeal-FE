import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Header from '../components/Header';
import DietCard from '../components/DietCard';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChallengeActiveScreen = () => {
  const navigation = useNavigation<any>();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 참여중만 필터링
  const activeChallenges = challenges.filter(c => c.state === '참여중');

  const fetchActiveChallenges = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 로그인 후 다시 시도하세요.');
        return;
      }

      const response = await axios.get('http://api.snapmeal.store/challenges/my', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          statuses: 'IN_PROGRESS', // 참여중 챌린지만 불러오기
        },
      });

      console.log('🔥 참여중 챌린지 데이터:', response.data);
      setChallenges(response.data); // 서버에서 받은 데이터 저장
    } catch (error) {
      console.error('❌ 챌린지 데이터 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트되면 API 호출
  useEffect(() => {
    fetchActiveChallenges();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="참여 중인 챌린지" backgroundColor="#FAFAFA" />

      <View style={styles.topRow}>
        <Text style={styles.titleText}>
          총 {challenges.length}개의 챌린지
        </Text>
      </View>

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>로딩중...</Text>
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
          {challenges.map(challenge => (
            <TouchableOpacity
              key={challenge.challengeId}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ChallengeDetail', {
                  challengeId: challenge.challengeId,
                  state: '참여중',
                })
              }
            >
              <DietCard
                variant="challenge"
                challengeState="참여중"
                additionalMeal={{
                  imageSource: require('../assets/images/coffee.png'), // 서버에서 이미지 URL 받으면 변경
                  title: challenge.title,
                  targetMenuName: challenge.targetMenuName,
                  description: challenge.description,
                  mealId: challenge.challengeId,
                }}
              />
            </TouchableOpacity>
          ))}
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
  cardList: {
    marginTop: 20,
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
