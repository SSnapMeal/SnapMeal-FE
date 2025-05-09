import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type MealRecordRouteProp = RouteProp<RootStackParamList, 'MealRecord'>;

const MealRecordScreen = () => {
  const route = useRoute<MealRecordRouteProp>();
  const { imageUri } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>식사 기록하기</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
      {/* 여기서 입력폼이나 저장 버튼 등을 추가하면 돼 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  image: { width: '100%', height: 250, resizeMode: 'contain' },
});

export default MealRecordScreen;
