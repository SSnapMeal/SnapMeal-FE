import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Navigation from '../components/Navigation';
import DietCard from '../components/DietCard';
import RecommendCard from '../components/RecommendCard';
import CalendarSection from '../components/CalendarSection';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

dayjs.extend(isoWeek);

const AnalysisScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'식단' | '추천'>('식단');
  const [cameraMenuVisible, setCameraMenuVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  type StatusType = '과다' | '적정' | '부족';

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

  const openGallery = () => {
    launchImageLibrary(imageOptions, (response) => {
      if (response.didCancel || response.errorCode) return;
      const selectedImage = response.assets?.[0];
      if (selectedImage?.uri) {
        navigation.navigate('PhotoPreview', { imageUri: selectedImage.uri });
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

    launchCamera(imageOptions, (response) => {
      if (response.didCancel || response.errorCode) return;
      const capturedImage = response.assets?.[0];
      if (capturedImage?.uri) {
        navigation.navigate('PhotoPreview', { imageUri: capturedImage.uri });
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
          <View style={styles.tabWrapper}>
            {['식단', '추천'].map((tab) => {
              const isActive = selectedTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabItem, isActive && { backgroundColor: '#FFFFFF' }]}
                  onPress={() => setSelectedTab(tab as '식단' | '추천')}
                >
                  <Text
                    style={[
                      styles.tabItemText,
                      isActive ? { fontWeight: 'bold', color: '#000' } : { color: '#999' },
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedTab === '식단' ? (
            <>
              <View style={styles.kcalRow}>
                <Text style={styles.kcalLabel}>칼로리</Text>
                <View style={styles.kcalBarBackground}>
                  <View style={styles.kcalBarFill} />
                </View>
                <Text style={styles.kcalValue}>152kcal</Text>
              </View>
              <DietCard />
            </>
          ) : (
            <RecommendCard />
          )}
        </ScrollView>

        <TouchableOpacity style={styles.cameraButton} onPress={() => setCameraMenuVisible(prev => !prev)}>
          <Image source={require('../assets/images/cameraIcon.png')} style={styles.cameraIcon} />
        </TouchableOpacity>

        {cameraMenuVisible && (
          <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={() => setCameraMenuVisible(false)}>
            <View style={styles.menuWrapper}>
              <TouchableOpacity style={styles.menuItem} onPress={openGallery}>
                <Image source={require('../assets/images/picture-icon.png')} style={styles.picture} />
                <Text style={styles.menuText}>사진첩</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={openCamera}>
                <Image source={require('../assets/images/camera-icon.png')} style={styles.camera} />
                <Text style={styles.menuText}>카메라</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
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
  tabWrapper: {
    backgroundColor: '#F1F1F3',
    marginHorizontal: 24,
    marginTop: 17,
    borderRadius: 4,
    flexDirection: 'row',
    padding: 5,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 3,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabItemText: {
    fontSize: 12,
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 45,
    paddingHorizontal: 42,
  },
  kcalLabel: {
    marginRight: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  kcalBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F1F3',
    borderRadius: 4,
    marginRight: 15,
  },
  kcalBarFill: {
    width: '40%',
    height: 8,
    backgroundColor: '#38B000',
    borderRadius: 4,
  },
  kcalValue: {
    fontWeight: 'bold',
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  menuWrapper: {
    position: 'absolute',
    bottom: 170,
    right: 20,
  },
  menuItem: {
    width: 134,
    height: 53,
    backgroundColor: '#fff',
    borderRadius: 26.5,
    marginVertical: 9,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 22,
  },
  camera: {
    width: 26,
    height: 26,
  },
  picture: {
    width: 26,
    height: 26,
  },
  menuText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 13,
    lineHeight: 26,
  },
});

export default AnalysisScreen;
