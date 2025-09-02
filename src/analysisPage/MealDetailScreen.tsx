import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Header from '../components/Header';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import MealTimeSelector from '../components/MealTimeSelector';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type MealDetailRouteProp = RouteProp<RootStackParamList, 'MealDetail'>;

const MealDetailScreen = () => {
  const [selectedTime, setSelectedTime] = useState('아침');
  const [memo, setMemo] = useState('');
  const [place, setPlace] = useState('');
  const navigation = useNavigation<Navigation>();
  const route = useRoute<MealDetailRouteProp>();
  const { imageUri, rawNutrients, selectedMenu = '', selectedKcal = 0, nutritionId = 8 } = route.params;

  const uploadMeal = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('⚠️ 토큰이 없습니다. 로그인 상태 확인!');
        return;
      }

      const timeMap: Record<string, string> = {
        '아침': 'BREAKFAST',
        '점심': 'LUNCH',
        '저녁': 'DINNER',
      };
      const apiMealType = timeMap[selectedTime] || 'DINNER';

      // ✅ topNutrients 추출 (내림차순으로 상위 2개)
      const sortedNutrients = [...rawNutrients].sort((a, b) => b.grams - a.grams);
      const topNutrients = sortedNutrients.slice(0, 2).map(item => ({
        name: item.label,
        value: `${item.grams}g`
      }));

      const mealResponse = await axios.post(
        'http://api.snapmeal.store/meals',
        {
          nutritionId,
          memo,
          location: place,
          meal_type: apiMealType,
          title: selectedMenu,
          imageUrl: imageUri,
          tag: '적정',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );

      console.log('식사 등록 성공:', mealResponse.data);

      navigation.navigate('Analysis', {
        imageSource: { uri: imageUri },
        title: `${selectedMenu} (${selectedKcal}kcal)`,
        mealTime: selectedTime,
        topNutrients: topNutrients,
        tag: '적정',
      });

    } catch (error: any) {
      console.error('등록 실패:', error.response?.status, error.response?.data);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <TouchableOpacity style={styles.prevButton} onPress={() => navigation.goBack()}>
        <Text style={styles.prevBtn}>{'<<'} 이전</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={uploadMeal}>
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
