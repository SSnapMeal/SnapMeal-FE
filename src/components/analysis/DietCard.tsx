import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { RootStackParamList } from '../../types/navigation';

export type Nutrient = {
  name: string;
  value: string;
};

export type CardData = {
  imageSource: any;
  title: string;
  selectedMenu?: string;
  mealName?: string;
  mealTime?: string;
  topNutrients?: Nutrient[];
  mealId: number;
};

type DietCardProps = {
  additionalMeal?: CardData;
  onDeleted?: (mealId: number) => void;
};

type Navigation = NativeStackNavigationProp<RootStackParamList, 'MealRecord'>;

const DietCard: React.FC<DietCardProps> = ({ additionalMeal, onDeleted }) => {
  const navigation = useNavigation<Navigation>();

  if (!additionalMeal) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>식단 정보가 없습니다.</Text>
      </View>
    );
  }

  const item = additionalMeal;
  const hasMealTime = !!item.mealTime;
  const hasNutrients = !!(item.topNutrients && item.topNutrients.length > 0);

  const handleDelete = async (mealId: number) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const res = await fetch(`http://api.snapmeal.store/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      Alert.alert('완료', '식사 기록을 삭제했어요.');
      onDeleted?.(mealId);
    } catch (err: any) {
      Alert.alert('삭제 실패', String(err?.message ?? err));
    }
  };

  const handleEdit = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const res = await axios.get(
        `http://api.snapmeal.store/meals/${item.mealId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data.result ?? res.data;

      const rawNutrients = [
        {
          id: 'protein',
          label: '단백질',
          name: '단백질',
          nutrientName: '단백질',
          grams: data.protein ?? 0,
          color: '#B6E3A8',
        },
        {
          id: 'carb',
          label: '탄수화물',
          name: '탄수화물',
          nutrientName: '탄수화물',
          grams: data.carbs ?? 0,
          color: '#FFD27F',
        },
        {
          id: 'fat',
          label: '지방',
          name: '지방',
          nutrientName: '지방',
          grams: data.fat ?? 0,
          color: '#FFB3B3',
        },
        {
          id: 'sugar',
          label: '당',
          name: '당',
          nutrientName: '당',
          grams: data.sugar ?? 0,
          color: '#FFF2AE',
        },
        {
          id: 'sodium',
          label: '나트륨',
          name: '나트륨',
          nutrientName: '나트륨',
          grams: data.sodium ?? 0,
          color: '#A3C4FF',
        },
      ];

      const menuValue = data.menu ?? '';

      navigation.navigate('MealRecord', {
        mode: 'edit',
        mealId: data.mealId,
        imageUri: data.imageUrl,
        menu: data.menu,
        selectedMenu: menuValue,
        selectedKcal: data.calories,
        mealType: data.mealType ?? data.meal_type,
        memo: data.memo,
        location: data.location,
        mealDate: data.mealDate,
        rawNutrients,
        nutritionId: data.nutritionId,
      });
    } catch (e: any) {
      Alert.alert('오류', '식사 정보를 가져오지 못했어요.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={handleEdit}
    >
      <View style={styles.imageWrapper}>
        <Image source={item.imageSource} style={styles.cardImage} />
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          Alert.alert('삭제하기', '이 식사 기록을 삭제할까요?', [
            { text: '취소', style: 'cancel' },
            { text: '삭제', style: 'destructive', onPress: () => handleDelete(item.mealId) },
          ])
        }
      >
        <Image
          source={require('../../assets/images/waste.png')}
          style={styles.deleteIcon}
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {item.title || item.selectedMenu || item.mealName || 'Unknown'}
        </Text>

        {hasMealTime && <Text style={styles.cardText}>{item.mealTime}</Text>}

        {hasNutrients &&
          item.topNutrients!.map((nutrient, idx) => (
            <Text key={idx} style={styles.cardText}>
              {nutrient.name}: {nutrient.value}
            </Text>
          ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#EDF8E8',
    marginHorizontal: 33,
    borderRadius: 18,
    marginBottom: 26,
    elevation: 2,
    height: 137,
    position: 'relative',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginLeft: 12,
  },
  cardImage: {
    width: 113,
    height: 113,
    borderRadius: 113,
  },
  cardContent: {
    marginLeft: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 25,
    marginBottom: 5,
    color: '#17171B',
  },
  cardText: {
    marginTop: 2,
    fontSize: 12,
    color: '#17171B',
  },
  emptyContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  deleteIcon: {
    width: 30,
    height: 30,
  },
});

export default DietCard;