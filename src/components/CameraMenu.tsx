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

interface CameraMenuProps {
  visible: boolean;
  onClose: () => void;
  onPickGallery: () => void;
  onOpenCamera: () => void;
}

const CameraMenu: React.FC<CameraMenuProps> = ({
  visible,
  onClose,
  onPickGallery,
  onOpenCamera,
}) => {
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
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onPickGallery}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Image source={require('../assets/images/picture-icon.png')} style={styles.icon} />
            <Text style={styles.menuText}>사진첩</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={onOpenCamera}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Image source={require('../assets/images/snap-icon.png')} style={styles.icon} />
            <Text style={styles.menuText}>카메라</Text>
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
    shadowColor: '#000',
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
    paddingLeft: 13,
    lineHeight: Platform.select({ ios: 20, android: 26 }) as number,
    color: '#111',
  },
});

export default CameraMenu;