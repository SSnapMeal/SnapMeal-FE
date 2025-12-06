import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

interface CameraMenuProps {
  visible: boolean;
  onClose: () => void;
  onPickGallery: () => void;
  onOpenCamera: () => void;
}

// ⭐ MealRecord 타입에 완전히 맞춘 DEFAULT_NUTRIENTS
const DEFAULT_NUTRIENTS: {
  id: string;
  label: string;
  name: string;
  nutrientName: string;
  grams: number;
  color: string;
}[] = [
  {
    id: 'protein',
    label: '단백질',
    name: '단백질',
    nutrientName: '단백질',
    grams: 0,
    color: '#CDE8BF',
  },
  {
    id: 'carbs',
    label: '탄수화물',
    name: '탄수화물',
    nutrientName: '탄수화물',
    grams: 0,
    color: '#FFD794',
  },
  {
    id: 'sugar',
    label: '당',
    name: '당',
    nutrientName: '당',
    grams: 0,
    color: '#FFC5C6',
  },
  {
    id: 'fat',
    label: '지방',
    name: '지방',
    nutrientName: '지방',
    grams: 0,
    color: '#FFF7C2',
  },
  {
    id: 'sodium',
    label: '나트륨',
    name: '나트륨',
    nutrientName: '나트륨',
    grams: 0,
    color: '#A3C4FF',
  },
];

const CameraMenu: React.FC<CameraMenuProps> = ({
  visible,
  onClose,
  onPickGallery,
  onOpenCamera,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      hardwareAccelerated
      onRequestClose={onClose}
    >
      <View style={styles.root} pointerEvents="box-none">
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.menuWrapper}>

          {/* ⭐ MealRecord 이동 */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate('MealRecord', {
                imageUri: '',
                rawNutrients: DEFAULT_NUTRIENTS,
                selectedMenu: '',
                selectedKcal: 0,
                nutritionId: 0,
              })
            }
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Image source={require('../../assets/images/write-icon.png')} style={styles.icon} />
            <Text style={styles.menuText}>식사기록</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={onPickGallery}
            activeOpacity={0.7}
          >
            <Image source={require('../../assets/images/picture-icon.png')} style={styles.icon} />
            <Text style={styles.menuText}> 사진첩</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={onOpenCamera}
            activeOpacity={0.7}
          >
            <Image source={require('../../assets/images/snap-icon.png')} style={styles.icon} />
            <Text style={styles.menuText}> 카메라</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuWrapper: {
    position: 'absolute',
    right: 20,
    bottom: 170,
    zIndex: 2,
  },
  menuItem: {
    width: 134,
    height: 53,
    backgroundColor: '#fff',
    borderRadius: 26.5,
    marginVertical: 9,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 22,
    shadowColor: '#17171B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 10,
    lineHeight: Platform.select({ ios: 20, android: 26 }) as number,
    color: '#17171B',
  },
});

export default CameraMenu;