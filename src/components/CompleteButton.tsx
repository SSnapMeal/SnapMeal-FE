import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, GestureResponderEvent } from 'react-native';

interface CompleteButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
}

const CompleteButton = ({ onPress, title = '완료' }: CompleteButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    backgroundColor: '#38B000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
    position: 'absolute',
    bottom: 22,
    left: 18,
    right: 18,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    lineHeight: 52,
  }
});

export default CompleteButton;
