import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ImageCheckScreen = ({ route, navigation }: any) => {
  const { imageUri, classNames, imageId } = route.params;

  const handleGoToPreview = () => {
    navigation.navigate('PhotoPreview', {
      imageUri,
      classNames,
      imageId,
    });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      {/* 다음 화면으로 이동 */}
      <TouchableOpacity style={styles.button} onPress={handleGoToPreview}>
        <Text style={styles.buttonText}>결과 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '90%',
    height: '60%',
    resizeMode: 'contain'
  },
  resultBox: {
    alignItems: 'center'
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  resultText: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#38B000',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default ImageCheckScreen;