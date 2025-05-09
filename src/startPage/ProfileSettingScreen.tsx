import React, { useEffect, useState } from 'react';

import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ScrollView, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const TAGS = [
    '고기', '채소', '야식', '간식',
    '대식', '소식', '음료', '디저트',
    '배달', '단맛', '짠맛', '매운맛',
    '간헐적 단식', '다이어트', '패스트 푸드',
    '규칙', '불규칙',
];

const ProfileSettingScreen = () => {
    const [nickname, setNickname] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const isActive = (tag: string) => selectedTags.includes(tag);

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <ScrollView>
                    {/*상단 안내 문두*/}
                    <Text style={styles.titleText}>거의 다 왔어요!</Text>
                    <Text style={styles.subtitleText}>나만의 닉네임과 사진, 식사 유형을 선택해주세요 😎</Text>
                    <View style={{ height: 1, backgroundColor: '#EAEAEA', width: 350, marginTop: 33, alignSelf: 'center' }} />

                    {/*닉네임 입력*/}
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

                    {/*식습관 선택*/}
                    <Text style={styles.habitTitle}>#2 식습관 유형을 선택해주세요 (최소 2개 이상)</Text>
                    <View style={styles.container}>
                        <View style={styles.tagContainer}>
                            {TAGS.map(tag => {
                                const active = isActive(tag);

                                return (
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

                                );
                            })}

                        </View>

                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                selectedTags.length >= 2
                                    ? styles.nextButtonActive
                                    : styles.nextButtonDisabled,
                            ]}
                            disabled={selectedTags.length < 2}
                            onPress={() => {
                                console.log('선택된 태그:', selectedTags);
                                navigation.navigate('SignupComplete'); // 이동할 페이지 이름
                            }}
                        >
                            <Text style={styles.nextButtonText}>다음</Text>
                        </TouchableOpacity>
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
        fontWeight: 700,
        marginTop: 23,
    },
    subtitleText: {
        color: '#000',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 400,
        marginTop: 21,
    },
    nicknameTitle: {
        color: '#000',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 700,
        marginTop: 37,
        marginBottom: 16
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
        fontWeight: 700,
    },
    underline: {
        height: 1,
        backgroundColor: '#38B000', // 초록색 밑줄
        marginTop: 4,
    },
    container: {
        padding: 16,
    },
    habitTitle: {
        color: '#000',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 700,
        marginTop: 61,
        marginBottom: 16
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
    nextButton: {
        marginTop: 40,
        paddingVertical: 17,
        borderRadius: 5,
        alignItems: 'center',
    },
    nextButtonActive: {
        backgroundColor: '#38B000',
    },
    nextButtonDisabled: {
        backgroundColor: '#ccc',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 20,
    },
});

export default ProfileSettingScreen;
