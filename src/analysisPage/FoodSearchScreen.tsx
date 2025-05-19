import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, TextInput } from 'react-native';
import Header from '../components/Header';
import FoodItem from '../components/FoodItem';
import CompleteButton from '../components/CompleteButton';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'FoodSearch'>;
type FoodSearchRouteProp = RouteProp<RootStackParamList, 'FoodSearch'>;

const sampleData = [
  '샐러드',
  '과일 샐러드',
  '파스타 샐러드',
  '콥 샐러드',
];

const FoodSearchScreen = () => {
  const [selectedTags, setSelectedTags] = useState<{ name: string; kcal: number }[]>([]);
  const navigation = useNavigation<Navigation>();
  const route = useRoute<FoodSearchRouteProp>();
  const { imageUri = '', rawNutrients = [] } = route.params || {};

  const handleAddTag = (name: string, kcal: number) => {
    if (!selectedTags.some(tag => tag.name === name)) {
      setSelectedTags(prev => [...prev, { name, kcal }]);
    }
  };

  const handleRemoveTag = (item: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.name !== item));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <Header title="" />

      {/* 상단 검색바 */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="음식명 작성"
            placeholderTextColor="#BEBEBE"
            underlineColorAndroid="transparent"
            blurOnSubmit={false}
          />
        </View>
      </View>

      <View style={styles.container}>
        <ScrollView style={{ paddingHorizontal: 29, paddingTop: 26 }}>
          {sampleData.map((item, index) => (
            <FoodItem
              key={index}
              name={item}
              kcal={320}
              onAdd={() => handleAddTag(item, 320)}
            />
          ))}
        </ScrollView>

        {/* 선택된 태그 영역 */}
        <View style={styles.selectedBox}>
          <View style={styles.tagContainer}>
            {selectedTags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>
                  {tag.name} <Text onPress={() => handleRemoveTag(tag.name)}> ✕</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        <CompleteButton
          title="완료"
          onPress={() => {
            const menu = selectedTags.map(t => t.name).join(', ');
            const totalKcal = selectedTags.reduce((sum, t) => sum + t.kcal, 0);

            navigation.navigate('MealRecord', {
              imageUri,
              rawNutrients,
              selectedMenu: menu,
              selectedKcal: totalKcal,
            });
          }}
        />
      </View>
    </View>
  );
};

export default FoodSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    marginTop: 10,
    marginLeft: 60,
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderRadius: 21.5,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#F4F4F5',
    borderRadius: 21.5,
    paddingLeft: 14,
  },
  selectedBox: {},
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 100,
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
    paddingTop: 14,
    paddingHorizontal: 18,
  },
  tag: {
    backgroundColor: '#E9F6E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 6,
    height: 33,
  },
  tagText: {
    fontSize: 14,
  },
});
