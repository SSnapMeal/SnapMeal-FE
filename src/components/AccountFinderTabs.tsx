import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  selectedTab: 'id' | 'password';
  setSelectedTab: (tab: 'id' | 'password') => void;
};

const AccountFinderTabs: React.FC<Props> = ({ selectedTab, setSelectedTab }) => {
  return (
    <View style={styles.selecter}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('id')}>
          <Text style={[styles.tabText, selectedTab === 'id' && styles.activeText]}>
            아이디 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('password')}>
          <Text style={[styles.tabText, selectedTab === 'password' && styles.activeText]}>
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            selectedTab === 'id' ? { left: 0 } : { left: '50%' },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selecter: {
    marginHorizontal: 26,
    marginTop: 32,
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9C9C9C',
  },
  activeText: {
    color: '#fff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#9C9C9C',
    marginTop: 10,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#38B000',
  },
});

export default AccountFinderTabs;
