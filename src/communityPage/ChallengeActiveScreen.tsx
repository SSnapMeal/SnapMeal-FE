// screens/ChallengeActiveScreen.tsx
import React from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Header from '../components/Header';
import DietCard from '../components/DietCard';
import { useNavigation } from '@react-navigation/native';

// TODO: 실제 앱에서는 공통 데이터소스(예: /data/challenges.ts)로 분리하세요.
const challenges = [
  {
    id: 1,
    title: '커피 마시지 않기',
    imageSource: require('../assets/images/coffee.png'),
    state: '참여중' as const,
  },
  {
    id: 2,
    title: '야식 줄이기',
    imageSource: require('../assets/images/coffee.png'),
    state: '참여중' as const,
  },
];

const ChallengeActiveScreen = () => {
  const navigation = useNavigation<any>();

  // 참여중만 필터링
  const activeChallenges = challenges.filter(c => c.state === '참여중');

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <Header title="참여 중인 챌린지" backgroundColor="#FAFAFA" />

      <View style={styles.topRow}>
        <Text style={styles.titleText}>
          총 {activeChallenges.length}개의 챌린지
        </Text>
      </View>

      {activeChallenges.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require('../assets/images/snap.png')}
            style={styles.snapImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>
            아직 참여 중인 챌린지가 없어요.{'\n'}마음에 드는 챌린지부터 시작해볼까요? 💚
          </Text>
        </View>
      ) : (
        <View style={styles.cardList}>
          {activeChallenges.map(challenge => (
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
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  titleText: { fontSize: 18, fontWeight: '700', marginLeft: 2, marginTop: 41 },
  cardList: {
    marginTop: 20,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 24,
  },
  snapImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChallengeActiveScreen;
