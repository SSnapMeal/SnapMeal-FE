import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type TabOption = '주간' | '월간';

interface TabSwitcherProps {
  selectedTab: TabOption;
  onSelectTab: (tab: TabOption) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ selectedTab, onSelectTab }) => {
  const tabs: TabOption[] = ['주간', '월간'];

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
          <Text style={[styles.tabButtonText]}>{tab}</Text>
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
