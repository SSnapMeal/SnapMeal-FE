import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

type MealRecordRouteProp = RouteProp<RootStackParamList, 'MealRecord'>;

const MealRecordScreen = () => {
  const route = useRoute<MealRecordRouteProp>();
  const { imageUri } = route.params;

  return (
    <>
      <Header title="식사 기록" backgroundColor="#FAFAFA" />
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        {/* 흰색 컨테이너 */}
        <View style={styles.contentBox}>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchText}>검색하기</Text>
          </TouchableOpacity>

          {/* 필요한 콘텐츠 추가 가능 */}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 27,
    paddingTop: 21,
    backgroundColor: '#FAFAFA',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    position: 'relative',
    elevation: 2,
  },
  searchButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#38B000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  searchText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MealRecordScreen;
