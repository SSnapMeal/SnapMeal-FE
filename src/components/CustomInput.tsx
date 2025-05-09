import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

interface CustomInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  showButton?: boolean;
  onPressButton?: () => void;
  buttonText?: string;
  rightElement?: React.ReactNode;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label = '',
  placeholder = '',
  placeholderTextColor = '#9C9C9C',
  helperText = '',
  showButton = false,
  onPressButton,
  buttonText = '인증하기',
  rightElement,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label !== '' && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputRow}>
        <View style={styles.textAndTimer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            {...props}
          />
          {rightElement && (
            <View style={styles.rightElement}>
              {rightElement}
            </View>
          )}
        </View>

        {showButton && (
          <TouchableOpacity onPress={onPressButton} style={styles.button}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>


      {helperText !== '' && <Text style={styles.helper}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 26,
    paddingTop: 27.94,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  textAndTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  
  input: {
    flex: 1, // 최대 너비 차지
    fontSize: 16,
    color: 'white',
    paddingVertical: 8,
  },
  rightElement: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  button: {
    marginLeft: 14,
    backgroundColor: '#38B000',
    paddingVertical: 11,
    paddingHorizontal: 12.5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -2
  },
  helper: {
    marginTop: 3,
    color: 'white',
    fontSize: 12,
  },
});

export default CustomInput;
