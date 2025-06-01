import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Navigation from '../components/Navigation';
import NutrientBarChart from '../components/NutrientBarChart';
import MealCard from '../components/MealCard';
import { launchCamera, CameraOptions, CameraType } from 'react-native-image-picker';

const { height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

const chartData = [
  { label: '단백질', value: 90, color: '#FF9C9C' },
  { label: '탄수화물', value: 60, color: '#7DDBA3' },
  { label: '당', value: 70, color: '#7DDBA3' },
  { label: '지방', value: 30, color: '#FED77F' },
  { label: '기타', value: 20, color: '#C0C0C0' },
];

const cameraOptions: CameraOptions = {
  mediaType: 'photo',
  cameraType: 'back' as CameraType,
  saveToPhotos: true,
};

const HomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const userName = '스냅';

  const handlePress = () => {
    launchCamera(cameraOptions, response => {
      if (response.didCancel) {
        console.log('사용자가 촬영을 취소함');
      } else if (response.errorCode) {
        console.error('카메라 오류:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          navigation.navigate('MealRecord', { imageUri, rawNutrients: [], });
        }
      }
    });
  };

  return (
    <>
      <StatusBar backgroundColor="#E1F3D8" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.fullScreen}>
          <View style={styles.background} />

          <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
            <View style={styles.greetingSection}>
              <Text style={styles.helloMent}>안녕하세요!</Text>
              <Text style={styles.userMent}>{userName}님 :)</Text>
              <Image source={require('../assets/images/profile.png')} style={styles.profileImg} resizeMode="cover" />
            </View>

            <View style={styles.analyzeCard}>
              <Text style={styles.cardTitle}>칼로리를 분석하세요!</Text>
              <Text style={styles.cardMent}>
                지금 당장 사진을 업로드하면 쉽고 빠르게 칼로리 분석을 받을 수 있습니다
              </Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={handlePress} activeOpacity={0.6}>
                <View style={styles.uploadContent}>
                  <Text style={styles.uploadBtnText}>사진 업로드 하기</Text>
                  <Image source={require('../assets/images/upload.png')} style={styles.uploadBtnIcon} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.mealSection}>
              <Text style={styles.sectionTitle}>오늘의 식사 기록</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <MealCard backgroundColor="#FED77F" title="아침" kcal="360kcal" nutrients="단백질 12g, 탄수화물 30g, ..." />
                <MealCard backgroundColor="#85DFAC" title="점심" kcal="360kcal" nutrients="단백질 12g, 탄수화물 30g, ..." />
                <MealCard backgroundColor="#FFA3A3" title="저녁" kcal="360kcal" nutrients="단백질 12g, 탄수화물 30g, ..." />
              </ScrollView>
            </View>
            <View style={{ paddingHorizontal: 35 }}>
              <NutrientBarChart data={chartData} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <Navigation />
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: height,
    backgroundColor: '#FAFAFA',
    zIndex: -1,
  },
  scrollContent: {
    paddingTop: 250,
    paddingBottom: 30,
  },
  greetingSection: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 221,
    backgroundColor: '#E1F3D8',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingLeft: 51,
    paddingRight: 51,
    paddingTop: 58,
  },
  helloMent: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  userMent: {
    color: '#000',
    fontSize: 30,
    fontWeight: '700',
  },
  profileImg: {
    position: 'absolute',
    top: 45,
    right: 51,
    width: 75,
    height: 75,
  },
  analyzeCard: {
    position: 'absolute',
    top: 138,
    left: '50%',
    transform: [{ translateX: -160 }],
    width: 320,
    height: 174,
    backgroundColor: '#FCFEF9',
    borderRadius: 40,
    elevation: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 23,
  },
  cardTitle: {
    color: '#10152C',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardMent: {
    color: '#10152C',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 34,
  },
  uploadBtn: {
    backgroundColor: '#38B000',
    width: 213,
    height: 52,
    marginTop: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16,
    marginRight: 10,
  },
  uploadBtnIcon: {
    width: 32,
    height: 32,
  },
  mealSection: {
    marginTop: 100,
    paddingLeft: 27,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10152C',
    marginBottom: 16,
    marginLeft: 6,
  },
});

export default HomeScreen;
