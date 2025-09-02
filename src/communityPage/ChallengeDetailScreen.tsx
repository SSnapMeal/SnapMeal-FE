// screens/ChallengeDetailScreen.tsx
import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    StatusBar,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import QuitConfirmModal from '../components/QuitConfirmModal';
import CompleteButton from '../components/CompleteButton';

const DAY_COUNT = 7;
const rating = 4;

const ChallengeDetailScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    // 넘어온 state 값이 '참여중'이면 true
    const initialState = route.params?.state as '참여전' | '참여중' | '실패' | '성공';
    const [joined, setJoined] = useState(
        initialState === '참여중' || initialState === '실패' || initialState === '성공'
    );

    const [doneDays, setDoneDays] = useState<number[]>([3, 5]);
    const periodText = '25.07.31 ~ 25.08.06';

    // ✅ 포기 모달 상태
    const [showQuitModal, setShowQuitModal] = useState(false);

    return (
        <View style={styles.wrap}>
            <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <Header title="커피 마시지 않기" backgroundColor="#FAFAFA" />

                {/* 배경 이미지 */}
                <Image
                    source={require('../assets/images/challenge_background.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />

                {/* 참여 후: 진행상황 카드 */}
                {joined && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {initialState === '성공'
                                ? `챌린지 결과 - 성공 (${periodText})`
                                : initialState === '실패'
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
                        <Text style={styles.value}>커피 안마시기</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>목적</Text>
                        <Text style={styles.value}>카페인 줄이기 및 건강 관리</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>상세설명</Text>
                        <Text style={styles.value}>
                            아메리카노, 에스프레소, 라떼 등 모든 커피 종류 포함
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>달성 기간</Text>
                        <Text style={styles.value}>주 5회 이상</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>달성 조건</Text>
                        <Text style={styles.value}>기간 동안 커피 관련 미기록시 성공</Text>
                    </View>
                </View>
            </ScrollView>

            {/* 하단 버튼 영역 */}
            {!joined ? (
                <CompleteButton
                    title="챌린지 참여하기"
                    onPress={() => setJoined(true)}
                />
            ) : initialState === '성공' || initialState === '실패' ? null : ( // ✅ 성공/실패면 버튼 숨김
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={[styles.bottomBtn, styles.bottomBtnDisabled]}
                        onPress={() => setShowQuitModal(true)} // ✅ 모달 열기
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

            {/* ✅ 포기 확인 모달 */}
            <QuitConfirmModal
                visible={showQuitModal}
                onConfirm={() => {
                    setJoined(false);     // 참여 전 상태로 변경
                    setShowQuitModal(false);
                }}
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
    cardTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 12 },

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
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
    row: { flexDirection: 'row', marginBottom: 8 },
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


    // ✅ 모달 스타일
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
