import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface CameraMenuProps {
  visible: boolean;
  onClose: () => void;
  onPickGallery: () => void;
  onOpenCamera: () => void;
}

const CameraMenu: React.FC<CameraMenuProps> = ({ visible, onClose, onPickGallery, onOpenCamera }) => {
  if (!visible) return null;

  return (
    <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onClose}>
      <View style={styles.menuWrapper}>
        <TouchableOpacity style={styles.menuItem} onPress={onPickGallery}>
          <Image source={require('../assets/images/picture-icon.png')} style={styles.icon} />
          <Text style={styles.menuText}>사진첩</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onOpenCamera}>
          <Image source={require('../assets/images/camera-icon.png')} style={styles.icon} />
          <Text style={styles.menuText}>카메라</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  menuWrapper: {
    position: 'absolute',
    bottom: 170,
    right: 20,
  },
  menuItem: {
    width: 134,
    height: 53,
    backgroundColor: '#fff',
    borderRadius: 26.5,
    marginVertical: 9,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 22,
  },
  icon: {
    width: 26,
    height: 26,
  },
  menuText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 13,
    lineHeight: 26,
  },
});

export default CameraMenu;
