import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickGallery: () => void;
};

const ImagePickerSheet: React.FC<Props> = ({
  visible,
  onClose,
  onPickCamera,
  onPickGallery,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            paddingVertical: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
            onPress={onPickCamera}
          >
            <Icon name="camera-outline" size={24} color="#333" />
            <Text style={{ marginLeft: 12, fontSize: 16 }}>카메라로 촬영</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
            onPress={onPickGallery}
          >
            <Icon name="image-outline" size={24} color="#333" />
            <Text style={{ marginLeft: 12, fontSize: 16 }}>갤러리에서 선택</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 16, alignItems: 'center' }}
            onPress={onClose}
          >
            <Text style={{ fontSize: 16, color: '#666' }}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerSheet;