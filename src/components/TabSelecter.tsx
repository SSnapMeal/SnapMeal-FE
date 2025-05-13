import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabSelectorProps {
  labels: string[]; // 탭 이름 리스트
  selectedIndex: number; // 선택된 탭 인덱스
  onSelectIndex: (index: number) => void; // 탭 선택 시 호출
}

const TabSelector: React.FC<TabSelectorProps> = ({ labels, selectedIndex, onSelectIndex }) => {
  return (
    <View style={styles.tabWrapper}>
      {labels.map((label, index) => {
        const isActive = selectedIndex === index;
        return (
          <TouchableOpacity
            key={label}
            style={[styles.tabItem, isActive && { backgroundColor: '#FFFFFF' }]}
            onPress={() => onSelectIndex(index)}
          >
            <Text
              style={[
                styles.tabItemText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    backgroundColor: '#F1F1F3',
    marginHorizontal: 24,
    marginTop: 17,
    borderRadius: 4,
    flexDirection: 'row',
    padding: 5,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 3,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabItemText: {
    fontSize: 12,
  },
});

export default TabSelector;
