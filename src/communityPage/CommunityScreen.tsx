import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Navigation from '../components/Navigation';
import ChallengeCard, { ChallengeState } from '../components/ChallengeCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityScreen = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const [userName, setUserName] = useState<string>('스냅');

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

  const mapStatusToState = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '참여전';
      case 'IN_PROGRESS':
        return '참여중';
      case 'SUCCESS':
        return '성공';
      default:
        return '참여전';
    }
  };

  const fetchMyChallenges = useCallback(async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('❌ 토큰이 없습니다. 로그인 후 다시 시도하세요.');
        setChallenges([]);
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

      console.log('🔥 내 챌린지 데이터:', response.data);
      setChallenges(response.data);
    } catch (error) {
      console.error('❌ 챌린지 데이터 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyChallenges();
  }, [fetchMyChallenges]);

  useFocusEffect(
    useCallback(() => {
      fetchMyChallenges();
    }, [fetchMyChallenges])
  );


  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <View style={styles.screenContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* 상단 프로필 영역 */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Image
                source={require('../assets/images/profile.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <Text style={styles.nick}>{userName}</Text>
            </View>
          </View>

          {/* 콘텐츠 영역 */}
          <View style={styles.container}>
            <Image
              source={require('../assets/images/challengeBanner.png')}
              style={styles.banner}
            />

            {/* 첫 번째 탭: 친구 커뮤니티 */}
            {selectedTabIndex === 0 ? (
              <View style={styles.tabContent}>
                {/* 챌린지 카테고리 제목 */}
                <Text style={styles.categoryTitle}>챌린지</Text>

                {/* 챌린지 아이콘 목록 */}
                <View style={styles.iconRow}>
                  <TouchableOpacity
                    style={styles.iconItem}
                    onPress={() => navigation.navigate('ChallengeExplorer')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      <Image
                        source={require('../assets/images/search.png')}
                        style={styles.iconImageSearch}
                      />
                    </View>
                    <Text style={styles.iconLabel}>전체</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconItem}
                    onPress={() => navigation.navigate('ChallengeActive')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      <Image
                        source={require('../assets/images/fire.png')}
                        style={styles.iconImageList}
                      />
                    </View>
                    <Text style={styles.iconLabel}>참여 중</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconItem}
                    onPress={() => navigation.navigate('ChallengeDone')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      <Image
                        source={require('../assets/images/note.png')}
                        style={styles.iconImageMessage}
                      />
                    </View>
                    <Text style={styles.iconLabel}>완료</Text>
                  </TouchableOpacity>
                </View>

                {/* 참여 중인 챌린지 목록 */}
                <Text style={styles.categoryTitle}>참여 중인 챌린지</Text>

                <View style={{ marginHorizontal: -16 }}>
                  {loading ? (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>로딩중...</Text>
                  ) : challenges.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                      참여 중인 챌린지가 없습니다.
                    </Text>
                  ) : (
                    challenges.map((challenge: any) => {
                      const state = mapStatusToState(challenge.status) as ChallengeState;
                      return (
                        <ChallengeCard
                          key={challenge.challengeId}
                          imageSource={require('../assets/images/coffee.png')}
                          title={challenge.title}
                          targetMenuName={challenge.targetMenuName}
                          description={challenge.description}
                          state={state}
                          // 진행률이 있으면 이렇게: progressText={`${challenge.done}/${challenge.total}`}
                          onPress={() =>
                            navigation.navigate('ChallengeDetail', {
                              challenge: { ...challenge, state },
                            })
                          }
                        />
                      );
                    })
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.tabContent}>
                <View style={styles.emptyState}>
                  <Image
                    source={require('../assets/images/snap.png')}
                    style={styles.snapImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>
                    아직 준비 중이에요.{'\n'}더 좋은 모습으로 곧 만날게요! 조금만 기다려 주세요 💚
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <Navigation />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingBottom: 60,
  },
  scrollContainer: {
    paddingTop: 14,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderRadius: 21.5,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
  },
  nick: {
    fontSize: 16,
  },
  top: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D9E1E7',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  tabContent: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 15,
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 22,
    marginBottom: 36,
  },
  iconItem: {
    alignItems: 'center',
    width: 72,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconImageSearch: {
    width: 39,
    height: 39,
  },
  iconImageList: {
    width: 39,
    height: 39,
  },
  iconImageMessage: {
    width: 37,
    height: 37,
  },
  iconLabel: {
    fontSize: 13,
    color: '#17171B',
    textAlign: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  snapImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CommunityScreen;
