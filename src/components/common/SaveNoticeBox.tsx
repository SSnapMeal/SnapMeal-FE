import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SaveNoticeBoxProps {
  onSave: () => void;
}

const SaveNoticeBox: React.FC<SaveNoticeBoxProps> = ({ onSave }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          💡 기록하지 않으면 분석 결과가 저장되지 않아요!
        </Text>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>기록하고 저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 28,
    marginTop: 30,
  },
  noticeBox: {
    backgroundColor: '#F3F3F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 14,
  },
  noticeText: {
    fontSize: 13,
    color: '#555',
  },
  saveButton: {
    width: '100%',
    paddingHorizontal: 18,
    height: 52,
    backgroundColor: '#38B000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    lineHeight: 52,
  },
});

export default SaveNoticeBox;
