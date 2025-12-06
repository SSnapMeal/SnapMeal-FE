// components/QuitConfirmModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface QuitConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;   // 포기하기 눌렀을 때 실행
  onCancel: () => void;    // 계속하기 눌렀을 때 실행
}

const QuitConfirmModal: React.FC<QuitConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>챌린지를 포기하시나요?</Text>
          <Text style={styles.modalMessage}>
            스냅밀은 챌린지의 결과보다 과정에 집중해요.{'\n'}
            어떤 결과든 늘 당신의 도전을 응원해요!
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalBtnQuit]}
              onPress={onConfirm}
            >
              <Text style={styles.modalBtnQuitText}>포기하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.modalBtnContinue]}
              onPress={onCancel}
            >
              <Text style={styles.modalBtnContinueText}>계속하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.51)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    height: 226,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 18,
    marginTop: 2
  },
  modalMessage: {
    fontSize: 13,
    marginBottom: 48,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnQuit: { backgroundColor: '#E3E3E3', marginRight: 8, },
  modalBtnContinue: { backgroundColor: '#38B000', marginLeft: 8 },
  modalBtnQuitText: { color: '#fff', fontWeight: '700', lineHeight: 52, },
  modalBtnContinueText: { color: '#FFF', fontWeight: '700', lineHeight: 52, },
});

export default QuitConfirmModal;
