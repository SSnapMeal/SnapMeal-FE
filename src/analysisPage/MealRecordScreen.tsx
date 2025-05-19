import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList, NutrientItem } from '../types/navigation';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../components/CustomInput';
import CustomNumInput from '../components/CustomNumInput';
import NutrientList from '../components/NutrientList';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type MealRecordRouteProp = RouteProp<RootStackParamList, 'MealRecord'>;

const MealRecordScreen = () => {
  const route = useRoute<MealRecordRouteProp>();
  const navigation = useNavigation<Navigation>();

  const {
    imageUri,
    rawNutrients,
    selectedMenu = '',
    selectedKcal = 0,
  } = route.params ?? {
    imageUri: '',
    rawNutrients: [],
    selectedMenu: '',
    selectedKcal: 0,
  };

  const handleSave = () => {
    // 저장 처리
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('MealDetail', {imageUri,})}
      >
        <Text style={styles.nextBtn}>다음 {'>>'}</Text>
      </TouchableOpacity>

      <Header title="식사 기록" backgroundColor="#FAFAFA" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={{ color: '#999' }}>이미지가 없습니다</Text>
            </View>
          )}

          <View style={styles.contentBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={styles.search}
                onPress={() => navigation.navigate('FoodSearch', { imageUri, rawNutrients })}
              >
                <LinearGradient
                  colors={['#DAF1CF', '#ABE88F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}
                >
                  <Text style={styles.searchText}>🔍 검색하기</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: -15 }}>
              <CustomInput
                label="메뉴"
                placeholder="샐러드"
                defaultValue={selectedMenu}
                labelColor="#000"
                helperText="* 안내메시지"
                helperColor="red"
                textColor="#000"
                borderColor="#000"
              />
              <CustomNumInput
                label="칼로리"
                placeholder="152"
                defaultValue={selectedKcal.toString()}
                labelColor="#000"
                helperText="* 안내메시지"
                helperColor="red"
                textColor="#000"
                borderColor="#000"
              />

              <View style={{ paddingHorizontal: 27, marginTop: 54 }}>
                <NutrientList
                  data={(rawNutrients || []).map(item => ({
                    ...item,
                    value: item.grams,
                  }))}
                  editable={true}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MealRecordScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    paddingHorizontal: 27,
    paddingTop: 21,
  },
  nextButton: {
    position: 'absolute',
    top: 15,
    right: 19,
    zIndex: 10,
  },
  nextBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38B000',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imagePlaceholder: {
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flex: 1,
    position: 'relative',
    elevation: 2,
  },
  search: {
    width: 100,
    height: 45,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 27,
    overflow: 'hidden',
    elevation: 3,
  },
  gradientBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  searchText: {
    color: '#000',
    fontWeight: 'bold',
  },
});