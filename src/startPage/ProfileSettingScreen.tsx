import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Image,
    StatusBar,
    ScrollView,
    TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import NextButton from '../components/NextButton';
import axios from 'axios';

type ProfileRouteProp = RouteProp<RootStackParamList, 'ProfileSetting'>;


const { height } = Dimensions.get('window');

const TAGS = [
    '고기', '채소', '야식', '간식',
    '대식', '소식', '음료', '디저트',
    '배달', '단맛', '짠맛', '매운맛',
    '간헐적 단식', '다이어트', '패스트 푸드',
    '규칙', '불규칙',
];

type ProfileSettingRouteProp = RouteProp<RootStackParamList, 'ProfileSetting'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileSetting'>;

const ProfileSettingScreen = () => {
    const [nickname, setNickname] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ProfileSettingRouteProp>();
    const userInfo = route.params?.userInfo;

    useEffect(() => {
        if (userInfo) {
            console.log('🟢 유저 정보 있음:', userInfo);
        } else {
            console.log('🟡 유저 정보 없음');
        }
    }, []);

    if (!userInfo) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>잘못된 접근입니다. 이전 화면으로 돌아가 주세요.</Text>
            </SafeAreaView>
        );
    }

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const isActive = (tag: string) => selectedTags.includes(tag);

    const handleFinalSubmit = async () => {
        const finalPayload = {
            ...userInfo,
            nickname: nickname,
            type: userInfo.type,
        };

        const dietPayload = {
            selectedTypes: selectedTags, // 서버 요구 형식에 맞게 전송
        };

        try {
            // 1. 회원가입 API 먼저 호출
            const signupRes = await axios.post('http://api.snapmeal.store/users/sign-up', finalPayload);
            console.log('✅ 회원가입 완료:', signupRes.data);

            // 2. 식사 유형 API 호출
            const dietRes = await axios.post('http://api.snapmeal.store/api/diet-type', dietPayload);
            console.log('✅ 식사 유형 등록 완료:', dietRes.data);

            // 3. 성공 시 이동
            navigation.navigate('SignupComplete');

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('❌ 서버 응답 에러:', error.response?.data || error.message);
            } else {
                console.error('❌ 알 수 없는 에러:', error);
            }
        }
    };

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <ScrollView>
                    <Text style={styles.titleText}>거의 다 왔어요!</Text>
                    <Text style={styles.subtitleText}>나만의 닉네임과 사진, 식사 유형을 선택해주세요 😎</Text>
                    <View style={{ height: 1, backgroundColor: '#EAEAEA', width: 350, marginTop: 33, alignSelf: 'center' }} />

                    <Text style={styles.nicknameTitle}>#1 닉네임을 입력해주세요</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../assets/images/profileSetting.png')}
                            style={{ width: 88, height: 88 }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.nicknameForm}>
                        <TextInput
                            style={styles.input}
                            placeholder="닉네임"
                            placeholderTextColor="#9C9C9C"
                            value={nickname}
                            onChangeText={setNickname}
                        />
                        <View style={styles.underline} />
                    </View>

                    <Text style={styles.habitTitle}>#2 식습관 유형을 선택해주세요 (최소 2개 이상)</Text>
                    <View style={styles.container}>
                        <View style={styles.tagContainer}>
                            {TAGS.map(tag => (
                                <TouchableOpacity key={tag} onPress={() => toggleTag(tag)}>
                                    <LinearGradient
                                        colors={
                                            isActive(tag)
                                                ? ['#DAF1CF', '#ABE88F']
                                                : ['#F8F8F8', '#F8F8F8']
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.linearGradient}
                                    >
                                        <Text style={[styles.tagText, isActive(tag) && styles.tagTextActive]}>
                                            {tag}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <NextButton
                            onPress={handleFinalSubmit}
                            disabled={selectedTags.length < 2 || nickname.trim() === ''}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    titleText: {
        color: '#000',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 23,
    },
    subtitleText: {
        color: '#000',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '400',
        marginTop: 21,
    },
    nicknameTitle: {
        color: '#000',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 37,
        marginBottom: 16,
    },
    nicknameForm: {
        width: 157,
        alignSelf: 'center',
        marginTop: 13,
    },
    input: {
        fontSize: 16,
        paddingVertical: 4,
        color: '#999',
        textAlign: 'center',
        fontWeight: '700',
    },
    underline: {
        height: 1,
        backgroundColor: '#38B000',
        marginTop: 4,
    },
    container: {
        padding: 16,
    },
    habitTitle: {
        color: '#000',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 61,
        marginBottom: 16,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 17,
        justifyContent: 'center',
    },
    linearGradient: {
        paddingVertical: 14,
        paddingHorizontal: 17,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagText: {
        color: '#333',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 18,
    },
    tagTextActive: {
        color: '#000',
    },
});

export default ProfileSettingScreen;
