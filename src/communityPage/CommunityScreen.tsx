import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ScrollView, Text } from 'react-native-gesture-handler';
import Navigation from '../components/Navigation';
import DietCard from '../components/DietCard';
import { useNavigation } from '@react-navigation/native';

const CommunityScreen = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabLabels = ['친구 커뮤니티', '챌린지'];
  const navigation = useNavigation<any>();

  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <View style={styles.screenContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* 상단 검색바 영역 */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Image
                source={require('../assets/images/profile.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <Text style={styles.nick}>스냅</Text>
            </View>
            <Text style={styles.top}>상위 11% (챌린지 7개 성공)</Text>
          </View>

          {/* 콘텐츠 영역 */}
          <View style={styles.container}>
            <Image
              source={require('../assets/images/challengeBanner.png')}
              style={styles.banner}
            />

            {/* 탭에 따른 콘텐츠 출력 */}
            {selectedTabIndex === 0 ? (
              <View style={styles.tabContent}>
                {/* 챌린지 제목 */}
                <Text style={styles.categoryTitle}>챌린지</Text>

                {/* 챌린지 아이콘 목록 */}
                <View style={styles.iconRow}>
                  <TouchableOpacity
                    style={styles.iconItem}
                    onPress={() => navigation.navigate('ChallengeExplorer')} // ✅ 이동
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      <Image
                        source={require('../assets/images/search.png')}
                        style={styles.iconImageSearch}
                      />
                    </View>
                    <Text style={styles.iconLabel}>전체</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconItem}
                    onPress={() => navigation.navigate('ChallengeActive')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      <Image
                        source={require('../assets/images/fire.png')}
                        style={styles.iconImageList}
                      />
                    </View>
                    <Text style={styles.iconLabel}>참여 중</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconItem}
                    onPress={() => navigation.navigate('ChallengeDone')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      <Image
                        source={require('../assets/images/note.png')}
                        style={styles.iconImageMessage}
                      />
                    </View>
                    <Text style={styles.iconLabel}>완료</Text>
                  </TouchableOpacity>
                </View>

                {/* 카테고리 제목 */}
                <Text style={styles.categoryTitle}>참여 중인 챌린지</Text>

                {/* 챌린지 */}
                <View style={{ marginHorizontal: -16 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ChallengeDetail')} // ✅ 이동
                  >
                    <DietCard
                      variant="challenge"
                      challengeState="참여중"   // ✅ 참여중
                      additionalMeal={{
                        imageSource: require('../assets/images/coffee.png'),
                        title: '커피 마시지 않기',
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ChallengeDetail')} // ✅ 이동
                  >
                    <DietCard
                      variant="challenge"
                      challengeState="참여중"   // ✅ 참여중
                      additionalMeal={{
                        imageSource: require('../assets/images/coffee.png'),
                        title: '야식 줄이기',
                      }}
                    />
                  </TouchableOpacity>
                </View>

              </View>
            ) : (
              <View style={styles.tabContent}>
                <View style={styles.emptyState}>
                  <Image
                    source={require('../assets/images/snap.png')}
                    style={styles.snapImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>
                    아직 준비 중이에요.{'\n'}더 좋은 모습으로 곧 만날게요! 조금만 기다려 주세요 💚
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView >
        <Navigation />
      </View >
    </>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingBottom: 60
  },
  scrollContainer: {
    paddingTop: 14,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderRadius: 21.5,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
  },
  nick: {
    fontSize: 16,
  },
  top: {
    fontSize: 16,
    fontWeight: 700,
  },
  nick: {
    fontSize: 16,
  },
  top: {
    fontSize: 16,
    fontWeight: 700,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D9E1E7',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  tabContent: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 15,
    marginLeft: 10
  },
  iconRow: {
    flexDirection: 'row',
    gap: 22,
    marginBottom: 36,
  },
  iconItem: {
    alignItems: 'center',
    width: 72,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconImageHeart: {
    width: 32,
    height: 32,
  },
  iconImageSearch: {
    width: 39,
    height: 39,
  },
  iconImageList: {
    width: 39,
    height: 39,
  },
  iconImageMessage: {
    width: 37,
    height: 37,
  },
  iconLabel: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
  writeButtonWrapper: {
    marginHorizontal: 15,
    marginBottom: 81,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
  },
  writeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    borderRadius: 16,
    paddingRight: 20,
  },
  writeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 18,
    marginRight: 12
  },
  writeIcon: {
    width: 20,
    height: 20,
  },

  writeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  snapImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.4
  },

  emptyText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center'
  },


});

export default CommunityScreen;
