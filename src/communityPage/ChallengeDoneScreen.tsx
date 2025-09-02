import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import TabSwitcher from '../components/TabSwitcher';
import DietCard from '../components/DietCard';
import { useNavigation } from '@react-navigation/native';

// 챌린지 데이터 배열 (예시)
const challenges = [
  {
    id: 1,
    title: '커피 마시지 않기',
    imageSource: require('../assets/images/coffee.png'),
    state: '성공' as const,
  },
  {
    id: 2,
    title: '야식 줄이기',
    imageSource: require('../assets/images/coffee.png'),
    state: '실패' as const,
  },
  {
    id: 3,
    title: '물 하루 2L 마시기',
    imageSource: require('../assets/images/coffee.png'),
    state: '성공' as const,
  },
];

const ChallengeDoneScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'전체' | '성공'>('전체');
  const navigation = useNavigation<any>();

  // 탭에 따라 자동 필터링
  const filteredChallenges =
    selectedTab === '전체'
      ? challenges.filter(c => c.state === '성공' || c.state === '실패')
      : challenges.filter(c => c.state === '성공');

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="완료된 챌린지" backgroundColor="#FAFAFA" />

      <View style={styles.tabRow}>
        <Text style={styles.tabTitle}>
          총 {filteredChallenges.length}개의 챌린지
        </Text>
        <TabSwitcher
          tabs={['전체', '성공']}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
      </View>

      {/* 카드 리스트 */}
      <View style={styles.cardList}>
        {filteredChallenges.map(challenge => (
          <TouchableOpacity
            key={challenge.id}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ChallengeDetail', { state: challenge.state })
            }
          >
            <DietCard
              variant="challenge"
              challengeState={challenge.state}
              additionalMeal={{
                imageSource: challenge.imageSource,
                title: challenge.title,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  tabTitle: { fontSize: 18, fontWeight: '700', marginLeft: 2, marginTop: 41 },
  cardList: {
    marginTop: 20,
  },
});

export default ChallengeDoneScreen;
