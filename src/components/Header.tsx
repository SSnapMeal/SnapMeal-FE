import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title: string;
  backgroundColor?: string;
};

const Header = ({ title, backgroundColor = '#fff' }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/images/backArrow-black.png')}
          style={styles.backArrowImage}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  backArrowImage: {
    width: 53,
    height: 53,
    resizeMode: 'contain',
    marginLeft: 13,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

export default Header;
