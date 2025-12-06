import { useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useImageAnalyze = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [cameraMenuVisible, setCameraMenuVisible] = useState(false);

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
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const detections = predictRes.data.detections || [];
      const classNames = [
        ...new Set(detections.map((d: any) => d.class_name)),
      ] as string[];

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const imageId = uploadRes.data.image_id;

      navigation.navigate('ImageCheck', { imageUri, classNames, imageId });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          '❌ 분석 또는 업로드 실패:',
          error.response?.data || error.message
        );
      } else {
        console.error('❌ 알 수 없는 에러:', error);
      }
    } finally {
      setTimeout(() => setIsLoading(false), 200);
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

  const toggleCameraMenu = () => {
    setCameraMenuVisible((prev) => !prev);
  };

  return {
    isLoading,
    cameraMenuVisible,
    toggleCameraMenu,
    openGallery,
    openCamera,
  };
};
