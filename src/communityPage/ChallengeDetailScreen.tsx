import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import QuitConfirmModal from '../components/QuitConfirmModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_OFFSET = SCREEN_HEIGHT * 0.22;
const HANDLE_HEIGHT = 16;
const HEADER_HEIGHT = 48;

type ChallengeState = '참여전' | '참여중' | '실패' | '성공';

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

const ChallengeDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { challenge } = route.params;

  const initialState = mapStatusToState(challenge.status);
  const [status, setStatus] = useState<ChallengeState>(initialState);
  const [joined, setJoined] = useState(initialState === '참여중');
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isFinished = status === '성공' || status === '실패';
  const [stamps, setStamps] = useState<boolean[]>(() => {
    if (challenge.stamps && challenge.stamps.length > 0) {
      return challenge.stamps;
    }

    const dayCount = 7;
    return Array(dayCount).fill(false);
  });
  const [backdropEnabled, setBackdropEnabled] = useState(false);
  const [review, setReview] = useState('');

  const periodText = `${challenge.startDate ?? ''} ~ ${challenge.endDate ?? ''}`;
  const translateY = useRef(new Animated.Value(COLLAPSED_OFFSET)).current;

  useEffect(() => {
    const t = setTimeout(() => setBackdropEnabled(true), 120);
    return () => clearTimeout(t);
  }, []);

  const expandSheet = () => {
    setExpanded(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const collapseSheet = () => {
    setExpanded(false);
    Animated.timing(translateY, {
      toValue: COLLAPSED_OFFSET,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleParticipate = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) return;

    setJoined(true);
    setStatus('참여중');

    try {
      const res = await axios.post(
        `http://api.snapmeal.store/challenges/${challenge.challengeId}/participate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data?.stamps) {
        setStamps(res.data.stamps);
      }
    } catch (e: any) {
      console.log('❌ participate error:', e?.response?.status, e?.response?.data);
    }
  };


  const handleGiveUp = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      await axios.post(
        `http://api.snapmeal.store/challenges/${challenge.challengeId}/give-up`,
        { status: 'CANCELLED' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setJoined(false);
      setStatus('참여전');
      setShowQuitModal(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      await axios.post(
        `http://api.snapmeal.store/challenges/${challenge.challengeId}/reviews`,
        {
          rating: 5,
          content: review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert("리뷰가 저장됐어요!");
    } catch (error) {
      console.log(error);
      Alert.alert("리뷰 저장 중 오류가 발생했어요.");
    }
  };

  return (
    <View style={styles.overlay}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      {backdropEnabled ? (
        <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />
      ) : (
        <View style={styles.backdrop} pointerEvents="none" />
      )}

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
            borderTopLeftRadius: expanded ? 0 : 28,
            borderTopRightRadius: expanded ? 0 : 28,
          },
        ]}
      >
        <View style={styles.fixedHandle} />
        <View style={styles.fixedHeader}>
          <Header title={challenge.title} backgroundColor="transparent" showBackArrow={false} />
        </View>

        <ScrollView
          style={[styles.container, { marginTop: HANDLE_HEIGHT + HEADER_HEIGHT + 4 }]}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          onScroll={e => {
            const y = e.nativeEvent.contentOffset.y;
            if (!expanded && y > 0) {
              expandSheet();
            } else if (expanded && y <= 0) {
              collapseSheet();
            }
          }}
          scrollEventThrottle={16}
          bounces
        >
          {/* ✅ 진행중일 때만 스탬프 보여줌 */}
          {joined && !isFinished && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {`챌린지 기록 (${periodText})`}
              </Text>

              <View style={styles.stampGrid}>
                {stamps.map((completed, index) => {
                  const day = index + 1;
                  return (
                    <View key={day} style={styles.stampWrap}>
                      <Image
                        source={
                          completed
                            ? require('../assets/images/stamp.png')
                            : require('../assets/images/stamp_base.png')
                        }
                        style={styles.stampImage}
                        resizeMode="contain"
                      />
                      {!completed && <Text style={styles.stampNumber}>{day}</Text>}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* 성공/실패 시에는 소감 박스 */}
          {isFinished && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {status === '성공'
                  ? `챌린지 결과 - 성공 (${periodText})`
                  : `챌린지 결과 - 실패 (${periodText})`}
              </Text>
              <Text style={styles.reviewLabel}>이번 챌린지 어땠나요?</Text>
              <TextInput
                style={styles.reviewInput}
                value={review}
                onChangeText={setReview}
                placeholder="챌린지의 어떤 점이 잘됐는지, 어떤 점이 힘들었는지 적어주세요."
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.bottomBtn, styles.bottomBtnPrimary, { marginTop: 16 }]}
                onPress={handleSubmitReview}
              >
                <Text style={styles.bottomBtnPrimaryText}>리뷰 저장하기</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.detailBox}>
            <Text style={styles.sectionTitle}>챌린지 소개</Text>

            <View style={styles.row}>
              <Text style={styles.label}>주 목표</Text>
              <Text style={styles.value}>{challenge.targetMenuName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>목적</Text>
              <Text style={styles.value}>{challenge.title}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>상세설명</Text>
              <Text style={styles.value}>{challenge.description}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>달성 기간</Text>
              <Text style={styles.value}>{periodText || '미연결'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>달성 조건</Text>
              <Text style={styles.value}>
                {challenge.introduction?.successCondition ?? '미연결'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <View pointerEvents="box-none" style={styles.floatingBottom}>
        {status === '참여전' ? (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.bottomBtn, styles.bottomBtnPrimary]}
              onPress={handleParticipate}
            >
              <Text style={styles.bottomBtnPrimaryText}>챌린지 참여하기</Text>
            </TouchableOpacity>
          </View>
        ) : joined && !isFinished ? (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.bottomBtn, styles.bottomBtnDisabled]}
              onPress={() => setShowQuitModal(true)}
            >
              <Text style={styles.bottomBtnDisabledText}>포기하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomBtn, styles.bottomBtnPrimary]}
              onPress={() => navigation.navigate('Analysis')}
            >
              <Text style={styles.bottomBtnPrimaryText}>식단 기록하기</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <QuitConfirmModal
        visible={showQuitModal}
        onConfirm={handleGiveUp}
        onCancel={() => setShowQuitModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: -SCREEN_HEIGHT,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: 'rgba(37, 21, 21, 0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FAFAFA',
  },
  fixedHandle: {
    position: 'absolute',
    top: 6,
    height: 4,
    width: 46,
    borderRadius: 2,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    zIndex: 20,
  },
  fixedHeader: {
    position: 'absolute',
    top: HANDLE_HEIGHT + 6,
    left: 0,
    right: 0,
    zIndex: 15,
    backgroundColor: '#FAFAFA',
  },
  container: { flex: 1 },
  card: {
    marginHorizontal: 22,
    marginTop: 30,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 15 },
  stampGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stampWrap: {
    width: 56,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  stampImage: {
    width: '100%',
    height: '100%',
  },
  stampNumber: {
    position: 'absolute',
    color: '#121212',
    fontWeight: '700',
  },
  reviewLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },
  reviewInput: {
    minHeight: 110,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    padding: 12,
    fontSize: 13,
  },
  detailBox: { paddingHorizontal: 24, paddingTop: 39, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 24, color: '#121212' },
  row: { flexDirection: 'row', marginBottom: 15, gap: 20 },
  label: { width: 80, fontWeight: '500', color: '#A1A1A1' },
  value: { flex: 1, color: '#121212' },
  floatingBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 16,
    pointerEvents: 'box-none',
  },
  bottomBar: {
    marginHorizontal: 18,
    flexDirection: 'row',
    gap: 12,
  },
  bottomBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtnDisabled: { backgroundColor: '#E6E6E6' },
  bottomBtnPrimary: { backgroundColor: '#38B000' },
  bottomBtnDisabledText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 52,
  },
  bottomBtnPrimaryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 52,
  },
});

export default ChallengeDetailScreen;