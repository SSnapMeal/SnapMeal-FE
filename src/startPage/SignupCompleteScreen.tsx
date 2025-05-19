import React, { useEffect, useState } from 'react';

import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const ProfileSettingScreen = () => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <ScrollView>
                    {/*축하 문구*/}
                    <Text style={styles.titleText}>🎉 회원가입이 완료되었어요 🎉</Text>
                    <Text style={styles.subtitleText}>가입을 축하드려요! 새로운 여정을 함께해보아요!</Text>
                    <View style={{ height: 1, backgroundColor: '#EAEAEA', width: 350, marginTop: 33, alignSelf: 'center' }} />

                    {/*유형 안내*/}
                    <Text style={styles.resultText}>식습관 유형 분석 결과,</Text>
                    <Text style={styles.categoryText}>김스냅님은</Text>
                    <Text style={styles.categoryText}>
                        <Text style={styles.hashTag}>#디저트 집착 유형</Text>
                        <Text>이에요</Text>
                    </Text>

                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../assets/images/hand1.png')}
                            style={styles.righthandImage}
                            resizeMode="contain"
                        />
                        <Image
                            source={require('../assets/images/hand2.png')}
                            style={[styles.lefthandImage, { transform: [{ rotate: '30deg' }] }]}
                            resizeMode="contain"
                        />
                    </View>

                    {/*그라데이션 배경*/}
                    <LinearGradient
                        colors={['#FFFFFF', '#C3E8B1']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.gradationTop}
                    />
                    <LinearGradient
                        colors={['#FFFFFF', '#C3E8B1']}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                        style={styles.gradationBottom}
                    />

                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={styles.completeButton}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.completeButtonText}>완료</Text>
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
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        gap: 20, // RN 0.71 이상 사용 시
    },
    lefthandImage: {
        width: 220,
        height: 220,
        position: 'absolute',
        top: 120,
        left: 0,
    },
    righthandImage: {
        width: 220,
        height: 220,
        position: 'absolute',
        top: -20,
        right: -30
    },
    resultText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 400,
        marginTop: 37,
        paddingHorizontal: 31,
        marginBottom: 12,
    },
    categoryText: {
        color: '#000',
        fontSize: 28,
        fontWeight: 400,
        paddingHorizontal: 31,
    },
    hashTag: {
        color: '#38B000',
        fontWeight: '700',
    },
    gradationTop: {
        position: 'absolute',
        top: 329,
        left: 0,
        right: 0,
        height: 150,
        zIndex: -1,
    },
    gradationBottom: {
        position: 'absolute',
        top: 479,
        left: 0,
        right: 0,
        height: 150,
        zIndex: -1,
    },
    buttonWrapper: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        marginTop: 420,
    },

    completeButton: {
        paddingVertical: 17,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#38B000',
    },
    completeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 20,
    },

});

export default ProfileSettingScreen;
