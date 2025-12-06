import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Header from '../components/common/Header';
import CustomInput from '../components/common/CustomInput';
import MealTimeSelector from '../components/analysis/MealTimeSelector';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type MealDetailRouteProp = RouteProp<RootStackParamList, 'MealDetail'>;

const MealDetailScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<MealDetailRouteProp>();

  const {
    imageUri,
    rawNutrients,
    selectedMenu = '',
    ocrMenuName = '',
    selectedKcal = 0,
    nutritionId = 0,
    mode,
    mealType,
    memo: initialMemo,
    location: initialLocation,
    mealDate,
    mealId,
  } = route.params;

  const isEditMode = mode === 'edit';

  const [selectedTime, setSelectedTime] = useState(() => {
    if (mealType === 'BREAKFAST') return '아침';
    if (mealType === 'LUNCH') return '점심';
    if (mealType === 'DINNER') return '저녁';
    return '아침';
  });

  const [memo, setMemo] = useState(initialMemo ?? '');
  const [place, setPlace] = useState(initialLocation ?? '');

  const uploadMeal = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const timeMap: Record<string, string> = {
        아침: 'BREAKFAST',
        점심: 'LUNCH',
        저녁: 'DINNER',
      };

      const apiMealType = timeMap[selectedTime] || 'DINNER';

      const body = {
        nutritionId,
        memo,
        location: place,
        meal_type: apiMealType,
        className: selectedMenu || ocrMenuName || null,
        menu: selectedMenu || ocrMenuName || null,
        imageUrl: imageUri,
        tag: '적정',
      };

      console.log('보내는 바디', body);

      if (isEditMode && mealId) {
        await axios.put(`http://api.snapmeal.store/meals/${mealId}`, body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('http://api.snapmeal.store/meals', body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const sortedNutrients = [...(rawNutrients || [])].sort(
        (a, b) => b.grams - a.grams
      );
      const topNutrients = sortedNutrients.slice(0, 2).map(item => ({
        name: item.label,
        value: `${item.grams}g`,
      }));

      navigation.navigate('Analysis', {
        imageSource: { uri: imageUri },
        title: `${selectedMenu || ocrMenuName} (${selectedKcal}kcal)`,
        mealTime: selectedTime,
        topNutrients,
        tag: '적정',
      });
    } catch (error: any) {
      console.log('업로드 실패:', error.response?.data);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <TouchableOpacity
        style={styles.prevButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.prevBtn}>{'<<'} 이전</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={uploadMeal}>
        <Text style={styles.nextBtn}>{isEditMode ? '수정' : '완료'}</Text>
      </TouchableOpacity>

      <Header title="식사 기록" backgroundColor="#FAFAFA" showBackArrow={false} />

      <ScrollView contentContainerStyle={styles.container}>
        <MealTimeSelector
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />

        <Text style={[styles.label, { marginTop: 30 }, styles.horizontalPadding]}>
          메모
        </Text>

        <TextInput
          style={styles.memoInput}
          placeholder="메모"
          placeholderTextColor="#999"
          multiline
          value={memo}
          onChangeText={setMemo}
        />

        <CustomInput
          label="장소"
          placeholder="장소를 입력하세요"
          labelColor="#17171B"
          helperText=""
          helperColor=""
          borderColor="#17171B"
          textColor="#17171B"
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