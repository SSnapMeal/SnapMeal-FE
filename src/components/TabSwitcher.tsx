import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TabSwitcherProps<T extends string> {
  tabs?: T[];
  selectedTab: T;
  onSelectTab: (tab: T) => void;
}

const TabSwitcher = <T extends string>({
  tabs = ['주간', '월간'] as unknown as T[],
  selectedTab,
  onSelectTab,
}: TabSwitcherProps<T>) => {
  return (
    <View style={styles.tabButtons}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            selectedTab === tab && styles.tabButtonActive,
          ]}
          onPress={() => onSelectTab(tab)}
        >
          <Text style={styles.tabButtonText}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabButtons: { flexDirection: 'row' },
  tabButton: {
    paddingHorizontal: 21,
    paddingVertical: 6,
    backgroundColor: '#DCDCDC',
    borderRadius: 17,
    marginLeft: 9,
    marginTop: 38,
    height: 34,
  },
  tabButtonActive: {
    backgroundColor: '#38B000',
  },
  tabButtonText: {
    color: '#FFF',
    marginBottom: 2,
  },
});

export default TabSwitcher;
