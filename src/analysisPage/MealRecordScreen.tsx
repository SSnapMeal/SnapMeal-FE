import { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import Header from '../components/common/Header';
import LinearGradient from 'react-native-linear-gradient';

import CustomInput from '../components/common/CustomInput';
import CustomNumInput from '../components/common/CustomNumInput';
import NutrientList from '../components/analysis/NutrientList';

import { DEFAULT_NUTRIENTS, mergeNutrients, RawNutrient } from '../utils/nutrition';

import ImagePickerSheet from '../components/common/ImagePickerSheet';

import { useNutritionOcr } from '../hooks/useNutritionOcr';


type Navigation = NativeStackNavigationProp<RootStackParamList>;
type MealRecordRouteProp = RouteProp<RootStackParamList, 'MealRecord'>;

const MealRecordScreen = () => {
  const route = useRoute<MealRecordRouteProp>();
  const navigation = useNavigation<Navigation>();
  const params = route.params ?? {};
  const isEditMode = params.mode === 'edit';

  const [imageUri, setImageUri] = useState(params.imageUri ?? '');
  const [nutritionId, setNutritionId] = useState<number | null>(
    params.nutritionId ?? null,
  );
  const [menuText, setMenuText] = useState(
    params.menu ?? params.selectedMenu ?? '',
  );
  const [kcalText, setKcalText] = useState(String(params.selectedKcal ?? ''));

  const [rawNutrients, setRawNutrients] = useState<RawNutrient[]>(() =>
    params.rawNutrients && Array.isArray(params.rawNutrients)
      ? mergeNutrients(DEFAULT_NUTRIENTS, params.rawNutrients as any[])
      : DEFAULT_NUTRIENTS,
  );

  const [sheetVisible, setSheetVisible] = useState(false);

  // OCR + 카메라/갤러리 훅
  const { openCamera, openGallery } = useNutritionOcr({
    setImageUri,
    setKcalText,
    setNutritionId,
    setRawNutrients,
  });

  useEffect(() => {
    if (isEditMode) {
      setImageUri(params.imageUri ?? '');
      setMenuText(params.menu ?? params.selectedMenu ?? '');
      setKcalText(
        params.selectedKcal != null ? String(params.selectedKcal) : '',
      );
      if (params.nutritionId != null) setNutritionId(params.nutritionId);

      if (params.rawNutrients && Array.isArray(params.rawNutrients)) {
        setRawNutrients(
          mergeNutrients(DEFAULT_NUTRIENTS, params.rawNutrients as any[]),
        );
      }
    }
  }, [
    isEditMode,
    params.imageUri,
    params.menu,
    params.selectedMenu,
    params.selectedKcal,
    params.nutritionId,
    params.rawNutrients,
  ]);

  const handleNext = () => {
    if (!menuText.trim()) {
      Alert.alert('입력 오류', '메뉴를 입력해주세요!');
      return;
    }

    if (!isEditMode && nutritionId === null) {
      Alert.alert('오류', '영양 분석을 먼저 완료해주세요!');
      return;
    }

    const mode: 'create' | 'edit' = isEditMode ? 'edit' : 'create';

    const nextParams = {
      imageUri,
      rawNutrients,
      selectedMenu: menuText,
      selectedKcal: Number(kcalText),
      nutritionId: nutritionId ?? undefined,
      mode,
      mealId: params.mealId,
      mealType: params.mealType,
      memo: params.memo,
      location: params.location,
      mealDate: params.mealDate,
    };

    navigation.navigate('MealDetail', nextParams);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextBtn}>다음 {'>>'}</Text>
      </TouchableOpacity>

      <Header title="식사 기록" backgroundColor="#FAFAFA" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <TouchableOpacity
              style={styles.emptyCardWrapper}
              activeOpacity={0.8}
              onPress={() => setSheetVisible(true)}
            >
              <LinearGradient
                colors={['#EDEDED', '#EBF6E6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyCard}
              >
                <Image
                  source={require('../assets/images/nutritionPlaceholder.png')}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTextMain}>
                  아직 등록된 사진이 없어요.
                </Text>
                <Text style={styles.emptyTextSub}>
                  영양성분표를 찍고 성분을 기록해보아요!
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <ImagePickerSheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            onPickCamera={() => {
              setSheetVisible(false);
              openCamera();
            }}
            onPickGallery={() => {
              setSheetVisible(false);
              openGallery();
            }}
          />

          <View style={styles.contentBox}>
            <View>
              <CustomInput
                label="메뉴"
                placeholder="샐러드"
                value={menuText}
                onChangeText={setMenuText}
                labelColor="#17171B"
                helperColor="red"
                textColor="#17171B"
                borderColor="#ccc"
              />

              <CustomNumInput
                label="칼로리"
                placeholder="152"
                value={kcalText}
                onChangeText={setKcalText}
                labelColor="#17171B"
                helperColor="red"
                textColor="#17171B"
                borderColor="#ccc"
              />

              <View style={{ paddingHorizontal: 27, marginTop: 54 }}>
                <NutrientList
                  data={rawNutrients.map((item, index) => ({
                    key: index,
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
  emptyCardWrapper: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyCard: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 75,
    height: 65.77,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  emptyTextMain: {
    fontSize: 12,
    color: '#8E8E8E',
    marginBottom: 2,
  },
  emptyTextSub: {
    fontSize: 12,
    color: '#8E8E8E',
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flex: 1,
    position: 'relative',
    elevation: 2,
  },
});

export default MealRecordScreen;
