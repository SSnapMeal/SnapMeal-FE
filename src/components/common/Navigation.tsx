import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import LinearGradient from 'react-native-linear-gradient';

const Navigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() as any;
  const route = useRoute();
  const currentRoute = route.name;

  return (
    <LinearGradient
      colors={['#FFFFFF', '#EDF8E8', '#FFFFFF']}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.navContainer}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={
            currentRoute === 'Home'
              ? require('../../assets/images/homeIcon-active.png')
              : require('../../assets/images/homeIcon.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Analysis')}>
        <Image
          source={
            currentRoute === 'Analysis'
              ? require('../../assets/images/analysisIcon-active.png')
              : require('../../assets/images/analysisIcon.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Community')}>
        <Image
          source={
            currentRoute === 'Community'
              ? require('../../assets/images/communityIcon-active.png')
              : require('../../assets/images/communityIcon.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
        <Image
          source={
            currentRoute === 'MyPage'
              ? require('../../assets/images/mypageIcon-active.png')
              : require('../../assets/images/mypageIcon.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 67,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  icon: {
    width: 35,
    height: 35,
  },
});

export default Navigation;