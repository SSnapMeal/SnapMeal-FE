import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const Navigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const currentRoute = route.name;

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={
            currentRoute === 'Home'
              ? require('../assets/images/homeIcon-active.png')
              : require('../assets/images/homeIcon.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Analysis')}>
        <Image
          source={
            currentRoute === 'Analysis'
              ? require('../assets/images/analysisIcon-active.png')
              : require('../assets/images/analysisIcon.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Community')}>
        <Image
          source={
            currentRoute === 'Community'
              ? require('../assets/images/communityIcon-active.png')
              : require('../assets/images/communityIcon.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
        <Image
          source={
            currentRoute === 'MyPage'
              ? require('../assets/images/mypageIcon-active.png')
              : require('../assets/images/mypageIcon.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 67,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#EAEAEA',
    borderWidth: 1,
  },
  icon: {
    width: 35,
    height: 35,
  },
});

export default Navigation;
