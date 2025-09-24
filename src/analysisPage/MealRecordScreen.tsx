import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
    nutritionId,
  } = route.params ?? {
    imageUri: '',
    rawNutrients: [],
    selectedMenu: '',
    selectedKcal: 0,
    nutritionId: 0,
  };

  // ✅ 메뉴를 상태로 관리하도록 추가 (이거 때문에 화면 반영 안 됐던 것)
  const [menuText, setMenuText] = useState(selectedMenu);
  const [kcalText, setKcalText] = useState(selectedKcal.toString());

  const handleSave = () => {
    // 이후 저장 버튼 만들면 여기에 저장 로직 추가 가능
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('MealDetail', {
          imageUri,
          rawNutrients,
          selectedMenu: menuText,
          selectedKcal: Number(kcalText),
          nutritionId,
        })}

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
                onPress={() => navigation.navigate('FoodSearch', {
                  imageUri,
                  rawNutrients,
                  selectedMenu: menuText,
                  selectedKcal: Number(kcalText),
                  nutritionId,
                })}
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
                value={menuText}
                onChangeText={setMenuText}
                labelColor="#17171B"
                // helperText="* 안내메시지"
                helperColor="red"
                textColor="#17171B"
                borderColor="#17171B"
              />
              <CustomNumInput
                label="칼로리"
                placeholder="152"
                value={kcalText}
                onChangeText={setKcalText}
                labelColor="#17171B"
                helperColor="red"
                textColor="#17171B"
                borderColor="#17171B"
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
    color: '#17171B',
    fontWeight: 'bold',
  },
});
