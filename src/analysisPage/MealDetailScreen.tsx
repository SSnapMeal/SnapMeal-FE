import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import Header from '../components/Header';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import MealTimeSelector from '../components/MealTimeSelector';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import axios from 'axios';
import * as mime from 'react-native-mime-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const MealDetailScreen = () => {
  const [selectedTime, setSelectedTime] = useState('아침');
  const [memo, setMemo] = useState('');
  const [place, setPlace] = useState('');
  const navigation = useNavigation<Navigation>();
  const route = useRoute<RouteProp<RootStackParamList, 'MealDetail'>>();
  const { imageUri } = route.params;

  const uploadImage = async () => {
    if (!imageUri) return;

    const fileName = imageUri.split('/').pop() || 'image.jpg';
    const fileType = mime.lookup(fileName) || 'image/jpeg';

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
      name: fileName,
      type: fileType,
    } as any);

    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        console.warn('⚠️ 토큰이 없습니다. 로그인 상태를 확인하세요.');
        return;
      }

      const response = await axios.post('http://api.snapmeal.store/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('업로드 성공:', response.data);

      navigation.navigate('Analysis', {
        imageSource: { uri: imageUri },
        title: '샐러드 (1757kcal)',
        mealTime: selectedTime,
        sugar: '77g (14%)',
        protein: '77g (24%)',
        tag: '부족',
      });
    } catch (error: any) {
      console.error('업로드 실패:', error.response?.status, error.response?.data);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <TouchableOpacity style={styles.prevButton} onPress={() => navigation.goBack()}>
        <Text style={styles.prevBtn}>{'<<'} 이전</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={uploadImage}>
        <Text style={styles.nextBtn}>완료</Text>
      </TouchableOpacity>

      <Header title="식사 기록" backgroundColor="#FAFAFA" showBackArrow={false} />

      <ScrollView contentContainerStyle={styles.container}>
        <MealTimeSelector selectedTime={selectedTime} onSelectTime={setSelectedTime} />

        <Text style={[styles.label, { marginTop: 30 }, styles.horizontalPadding]}>메모</Text>
        <TextInput
          style={[styles.memoInput]}
          placeholder="메모"
          placeholderTextColor="#999"
          multiline
          value={memo}
          onChangeText={setMemo}
        />

        <CustomInput
          label="장소"
          placeholder="장소를 입력하세요"
          labelColor="#000"
          helperText=""
          helperColor=""
          borderColor="#000"
          textColor="#000"
          value={place}
          onChangeText={setPlace}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  prevButton: {
    position: 'absolute',
    top: 15,
    left: 19,
    zIndex: 10,
  },
  prevBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38B000',
  },
  nextButton: {
    position: 'absolute',
    top: 15,
    right: 28,
    zIndex: 10,
  },
  nextBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38B000',
  },
  container: {
    paddingTop: 34,
    paddingBottom: 80,
    marginHorizontal: 27,
    marginTop: 40,
    backgroundColor: '#FFF',
    borderRadius: 17,
    elevation: 2,
  },
  label: {
    marginBottom: 23,
  },
  horizontalPadding: {
    paddingHorizontal: 24,
  },
  memoInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#989898',
    minHeight: 120,
    textAlignVertical: 'top',
    marginHorizontal: 24,
    paddingLeft: 10,
  },
});

export default MealDetailScreen;