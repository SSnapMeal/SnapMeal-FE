import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Header from '../components/Header';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import MealTimeSelector from '../components/MealTimeSelector';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'react-native';


type Navigation = NativeStackNavigationProp<RootStackParamList>;

const MealDetailScreen = () => {
  const [selectedTime, setSelectedTime] = useState('아침');
  const [memo, setMemo] = useState('');
  const navigation = useNavigation<Navigation>();
  const route = useRoute<RouteProp<RootStackParamList, 'MealDetail'>>();
  const { imageUri } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* 상단바 */}
      <TouchableOpacity
        style={styles.prevButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.prevBtn}>{'<<'} 이전</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>
          navigation.navigate('Analysis', {
            imageSource: { uri: imageUri },
            title: '샐러드 (1757kcal)',
            mealTime: selectedTime,
            sugar: '77g (14%)',
            protein: '77g (24%)',
            tag: '부족',
          })
        }
      >
        <Text style={styles.nextBtn}>완료</Text>
      </TouchableOpacity>

      <Header title="식사 기록" backgroundColor="#FAFAFA" showBackArrow={false} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 시간 선택 */}
        <MealTimeSelector selectedTime={selectedTime} onSelectTime={setSelectedTime} />

        {/* 메모 입력 */}
        <Text style={[styles.label, { marginTop: 30 }, styles.horizontalPadding]}>메모</Text>
        <TextInput
          style={[styles.memoInput]}
          placeholder="메모"
          placeholderTextColor="#999"
          multiline
          value={memo}
          onChangeText={setMemo}
        />

        {/* 장소 입력 */}
        <CustomInput
          label="장소"
          placeholder="장소를 입력하세요"
          labelColor="#000"
          helperText=""
          helperColor=""
          borderColor="#000"
          textColor="#000"
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
    paddingLeft: 10
  },
});

export default MealDetailScreen;