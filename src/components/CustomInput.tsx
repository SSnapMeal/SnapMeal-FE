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
  helperColor?: string;
  showButton?: boolean;
  onPressButton?: () => void;
  buttonText?: string;
  rightElement?: React.ReactNode;
  labelColor?: string;
  borderColor?: string;
  textColor?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label = '',
  placeholder = '',
  placeholderTextColor = '#9C9C9C',
  helperText = '',
  helperColor = 'white',
  showButton = false,
  onPressButton,
  buttonText = '인증하기',
  rightElement,
  labelColor = 'white',
  borderColor = 'white',
  textColor = 'white',
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label !== '' && (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}

      <View style={styles.inputRow}>
        <View style={[styles.textAndTimer, { borderBottomColor: borderColor }]}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={props.value}
            onChangeText={props.onChangeText}
          />
          {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
        </View>

        {showButton && (
          <TouchableOpacity onPress={onPressButton} style={styles.button}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {helperText !== '' && (
        <Text style={[styles.helper, { color: helperColor }]}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 26,
    paddingTop: 27.94,
  },
  label: {
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
  },
  input: {
    flex: 1,
    fontSize: 16,
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
    marginTop: -2,
  },
  helper: {
    marginTop: 3,
    fontSize: 12,
  },
});

export default CustomInput;
