import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StyleSheet,
    ScrollView,
    StatusBar,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import QuitConfirmModal from '../components/QuitConfirmModal';
import CompleteButton from '../components/CompleteButton';

const DAY_COUNT = 7;
const rating = 4;

type ChallengeState = '참여전' | '참여중' | '실패' | '성공';

const mapStatusToState = (status: string): ChallengeState => {
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

const ChallengeDetailScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { challenge } = route.params;

    // 서버에서 받은 status를 한글로 변환
    const [status, setStatus] = useState<ChallengeState>(
        mapStatusToState(challenge.status)
    );

    const [joined, setJoined] = useState(
        ['참여중', '성공', '실패'].includes(mapStatusToState(challenge.status))
    );

    const [doneDays, setDoneDays] = useState<number[]>([3, 5]);
    const [showQuitModal, setShowQuitModal] = useState(false);

    const periodText = `${challenge.startDate} ~ ${challenge.endDate}`;

    /* 챌린지 참여하기 API */
    const handleParticipate = async () => {
        console.log('🔹 handleParticipate 호출됨');

        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                console.error('❌ 토큰이 없습니다. 로그인 후 다시 시도하세요.');
                return;
            }

            const response = await axios.post(
                `http://api.snapmeal.store/challenges/${challenge.challengeId}/participate`,
                {}, // 참여할 때는 빈 바디
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ 참여 성공:', response.data);

            setJoined(true);
            setStatus('참여중');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.log('❌ 챌린지 참여 실패 - 응답:', error.response?.data);
            } else {
                console.log('❌ 알 수 없는 에러:', JSON.stringify(error, null, 2));
            }
        }
    };

    /** ✅ 챌린지 포기하기 API */
    const handleGiveUp = async () => {
        console.log('🔹 handleGiveUp 호출됨');

        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                console.error('❌ 토큰이 없습니다. 로그인 후 다시 시도하세요.');
                return;
            }

            const response = await axios.post(
                `http://api.snapmeal.store/challenges/${challenge.challengeId}/give-up`,
                { status: 'CANCELLED' }, // 서버에 상태 전달
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ 포기 성공:', response.data);

            // 상태를 '참여전'으로 돌리고 UI 반영
            setJoined(false);
            setStatus('참여전');
            setShowQuitModal(false);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.log('❌ 챌린지 포기 실패 - 응답:', error.response?.data);
            } else {
                console.log('❌ 알 수 없는 에러:', JSON.stringify(error, null, 2));
            }
        }
    };

    return (
        <View style={styles.wrap}>
            <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <Header title={challenge.title} backgroundColor="#FAFAFA" />

                {/* 배경 이미지 */}
                <Image
                    source={require('../assets/images/challenge_background.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />

                {/* 진행 상황 카드 */}
                {joined && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {status === '성공'
                                ? `챌린지 결과 - 성공 (${periodText})`
                                : status === '실패'
                                    ? `챌린지 결과 - 실패 (${periodText})`
                                    : `챌린지 진행 상황 (${periodText})`}
                        </Text>

                        <View style={styles.stampGrid}>
                            {Array.from({ length: DAY_COUNT }, (_, i) => {
                                const day = i + 1;
                                const completed = doneDays.includes(day);
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
                                        {!completed && (
                                            <Text style={styles.stampNumber}>{day}</Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* 별점 */}
                <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>{rating}.0</Text>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Image
                            key={i}
                            source={
                                i < rating
                                    ? require('../assets/images/star_active.png')
                                    : require('../assets/images/star.png')
                            }
                            style={styles.star}
                        />
                    ))}
                </View>

                {/* 챌린지 소개 */}
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
                        <Text style={styles.value}>미연결</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>달성 조건</Text>
                        <Text style={styles.value}>미연결</Text>
                    </View>
                </View>
            </ScrollView>

            {/* 하단 버튼 */}
            {!joined ? (
                <CompleteButton title="챌린지 참여하기" onPress={handleParticipate} />
            ) : status === '성공' || status === '실패' ? null : (
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
            )}

            {/* 포기 확인 모달 */}
            <QuitConfirmModal
                visible={showQuitModal}
                onConfirm={handleGiveUp}
                onCancel={() => setShowQuitModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: { flex: 1, backgroundColor: '#FAFAFA' },
    container: { flex: 1 },
    backgroundImage: { width: '100%', height: 170 },

    card: {
        marginHorizontal: 22,
        marginTop: -50,
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
        resizeMode: 'contain',
    },
    stampNumber: {
        position: 'absolute',
        color: '#121212',
        fontWeight: '700',
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        marginTop: 12,
    },
    ratingText: { fontSize: 14, marginRight: 4, fontWeight: '500' },
    star: { width: 19.61, height: 19.61, marginHorizontal: 1 },

    detailBox: { paddingHorizontal: 48, paddingTop: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 34 },
    row: { flexDirection: 'row', marginBottom: 15, gap: 20, },
    label: { width: 80, fontWeight: '500', color: '#A1A1A1' },
    value: { flex: 1, color: '#121212' },

    bottomBar: {
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 22,
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalBtn: {
        flex: 1,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBtnQuit: { backgroundColor: '#E6E6E6', marginRight: 8 },
    modalBtnContinue: { backgroundColor: '#38B000', marginLeft: 8 },
    modalBtnQuitText: { color: '#333', fontWeight: '700' },
    modalBtnContinueText: { color: '#FFF', fontWeight: '700' },
});

export default ChallengeDetailScreen;
