import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { DEFAULT_NUTRIENTS, RawNutrient } from '../utils/nutrition';

type Handlers = {
  setImageUri: (uri: string) => void;
  setKcalText: (text: string) => void;
  setNutritionId: (id: number | null) => void;
  setRawNutrients: (data: RawNutrient[]) => void;
};

export const useNutritionOcr = ({
  setImageUri,
  setKcalText,
  setNutritionId,
  setRawNutrients,
}: Handlers) => {
  const handleOcrFromImage = async (asset: Asset) => {
    if (!asset.uri) return;

    const formData = new FormData();
    formData.append('file', {
      uri: asset.uri,
      type: asset.type || 'image/jpeg',
      name: asset.fileName || 'photo.jpg',
    } as any);

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('로그인 필요', '다시 로그인 후 시도해주세요.');
        return;
      }

      const res = await axios.post(
        'http://api.snapmeal.store/nutrition/ocr',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('ocr data', res.data);

      const {
        calories,
        protein,
        carbs,
        sugar,
        fat,
        sodium,
        nutritionId: nid,
      } = res.data;

      setImageUri(asset.uri);
      setKcalText(String(calories));
      setNutritionId(nid ?? null);

      const updated: RawNutrient[] = DEFAULT_NUTRIENTS.map((n) => {
        switch (n.id) {
          case 'protein':
            return { ...n, grams: protein };
          case 'carb':
            return { ...n, grams: carbs };
          case 'fat':
            return { ...n, grams: fat };
          case 'sugar':
            return { ...n, grams: sugar };
          case 'sodium':
            return { ...n, grams: sodium };
          default:
            return n;
        }
      });

      setRawNutrients(updated);
    } catch (error: any) {
      console.log(
        'OCR 요청 실패:',
        JSON.stringify(error.response?.data || error, null, 2),
      );
      Alert.alert('오류', '영양성분 인식에 실패했어요. 다시 시도해주세요.');
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel || !result.assets || !result.assets[0]) return;

    await handleOcrFromImage(result.assets[0]);
  };

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel || !result.assets || !result.assets[0]) return;

    await handleOcrFromImage(result.assets[0]);
  };

  return { openCamera, openGallery };
};
