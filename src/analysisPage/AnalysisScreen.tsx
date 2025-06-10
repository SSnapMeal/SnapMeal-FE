import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, StatusBar, Platform, PermissionsAndroid, } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Navigation from '../components/Navigation';
import DietCard from '../components/DietCard';
import RecommendCard from '../components/RecommendCard';
import CalendarSection from '../components/CalendarSection';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import TabSelector from '../components/TabSelecter';
import CameraMenu from '../components/CameraMenu';
import CalorieProgress from '../components/CalorieProgress';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type StatusType = '과다' | '적정' | '부족';
type CardData = {
  imageSource: any;
  title: string;
  mealTime: string;
  sugar: string;
  protein: string;
  tag: StatusType;
};

dayjs.extend(isoWeek);

const AnalysisScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [cameraMenuVisible, setCameraMenuVisible] = useState(false);
  const recommendedKcal = 2000; // 권장 칼로리
  const consumedKcal = 1500;     // 현재까지 섭취한 칼로리
  const fillPercent = Math.min((consumedKcal / recommendedKcal) * 100, 100);

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Analysis'>>();

  const receivedMeal: CardData | undefined = route.params
    ? {
      imageSource: route.params.imageSource,
      title: route.params.title,
      mealTime: route.params.mealTime,
      sugar: route.params.sugar,
      protein: route.params.protein,
      tag: route.params.tag as StatusType,
    }
    : undefined;

  const statusColors: Record<StatusType, string> = {
    과다: '#F3B8B8',
    적정: '#ABE88F',
    부족: '#FBE19A',
  };

  const statusMarked: Record<StatusType, string[]> = {
    과다: ['2025-04-01', '2025-04-04'],
    적정: ['2025-04-02', '2025-04-10', '2025-05-06'],
    부족: ['2025-04-03', '2025-04-15'],
  };

  const marked: { [key: string]: string } = {};
  (Object.keys(statusMarked) as StatusType[]).forEach((status) => {
    statusMarked[status].forEach(date => {
      marked[date] = statusColors[status];
    });
  });

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '카메라 권한 요청',
          message: '앱에서 카메라를 사용할 수 있도록 허용해 주세요.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const imageOptions = {
    mediaType: 'photo' as const,
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8 as const,
  };

  const analyzeImage = async (imageUri: string) => {
  try {
    const token = await AsyncStorage.getItem('accessToken'); // ✅ 토큰 불러오기

    // ✅ 1. 분석 요청
    const predictFormData = new FormData();
    predictFormData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    const predictRes = await axios.post(
      'http://api.snapmeal.store/predict',
      predictFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // ✅ 인증 추가
        },
      }
    );

    console.log('✅ 분석 결과:', predictRes.data);

    const detections = predictRes.data.detections || [];
    const classNames = [...new Set(detections.map((d: any) => d.class_name))] as string[];

    console.log('🎯 감지된 음식 목록:', classNames);

    // ✅ 2. 이미지 업로드 요청
    const uploadFormData = new FormData();
    uploadFormData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    const uploadRes = await axios.post(
      'http://api.snapmeal.store/images/upload-predict',
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // ✅ 인증 추가
        },
      }
    );

    const imageId = uploadRes.data.image_id;
    console.log('🆔 이미지 업로드 성공, imageId:', imageId);

    // ✅ 다음 화면으로 이동
    navigation.navigate('ImageCheck', {
      imageUri,
      classNames,
      imageId,
    });

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('❌ 분석 또는 업로드 실패:', error.response?.data || error.message);
    } else {
      console.error('❌ 알 수 없는 에러:', error);
    }
  }
};


  const openGallery = () => {
    launchImageLibrary(imageOptions, async (response) => {
      if (response.didCancel || response.errorCode) return;
      const selectedImage = response.assets?.[0];
      if (selectedImage?.uri) {
        await analyzeImage(selectedImage.uri);
      }
    });
    setCameraMenuVisible(false);
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('카메라 권한 거부됨');
      return;
    }

    launchCamera(imageOptions, async (response) => {
      if (response.didCancel || response.errorCode) return;
      const capturedImage = response.assets?.[0];
      if (capturedImage?.uri) {
        await analyzeImage(capturedImage.uri);
      }
    });
  };


  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={() => navigation.navigate('Report')}>
            <Text style={styles.reportLink}>리포트 보러가기 {'>>'}</Text>
          </TouchableOpacity>

          <CalendarSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isExpanded={isCalendarExpanded}
            toggleExpanded={() => setIsCalendarExpanded(!isCalendarExpanded)}
            marked={marked}
          />

          <TabSelector
            labels={['식단', '추천']}
            selectedIndex={selectedTabIndex}
            onSelectIndex={setSelectedTabIndex}
          />

          {selectedTabIndex === 0 ? (
            <>
              <CalorieProgress
                consumedKcal={consumedKcal}
                recommendedKcal={recommendedKcal}
              />
              <DietCard additionalMeal={receivedMeal} />
            </>
          ) : (
            <RecommendCard />
          )}
        </ScrollView>

        <TouchableOpacity style={styles.cameraButton} onPress={() => setCameraMenuVisible(prev => !prev)}>
          <Image source={require('../assets/images/cameraIcon.png')} style={styles.cameraIcon} />
        </TouchableOpacity>

        <CameraMenu
          visible={cameraMenuVisible}
          onClose={() => setCameraMenuVisible(false)}
          onPickGallery={openGallery}
          onOpenCamera={openCamera}
        />
      </SafeAreaView>
      <Navigation />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingBottom: 100,
  },
  reportLink: {
    color: '#38B000',
    fontWeight: 'bold',
    position: 'absolute',
    top: 33,
    right: 32,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#38B000',
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  cameraIcon: {
    width: 33.79,
    height: 33.79,
  },
});

export default AnalysisScreen;