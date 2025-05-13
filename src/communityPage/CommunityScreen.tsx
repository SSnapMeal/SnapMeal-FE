import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ScrollView, Text } from 'react-native-gesture-handler';
import Navigation from '../components/Navigation';
import TabSelector from '../components/TabSelecter';
import PostCard from '../components/PostCard';
import LinearGradient from 'react-native-linear-gradient';

const CommunityScreen = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabLabels = ['친구 커뮤니티', '챌린지'];

  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <View style={styles.screenContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* 상단 검색바 영역 */}
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="run! 챌린지 진행 중"
                placeholderTextColor="#B3B3B3"
              />
              <Image
                source={require('../assets/images/search-icon.png')}
                style={styles.searchIcon}
              />
            </View>

            <TouchableOpacity>
              <Image
                source={require('../assets/images/profile.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          {/* 콘텐츠 영역 */}
          <View style={styles.container}>
            <Image
              source={require('../assets/images/challengeBanner.png')}
              style={styles.banner}
            />

            {/* 탭 선택 */}
            <TabSelector
              labels={tabLabels}
              selectedIndex={selectedTabIndex}
              onSelectIndex={setSelectedTabIndex}
            />

            {/* 탭에 따른 콘텐츠 출력 */}
            {selectedTabIndex === 0 ? (
              <View style={styles.tabContent}>
                {/* 카테고리 제목 */}
                <Text style={styles.categoryTitle}>카테고리</Text>

                {/* 카테고리 아이콘 목록 */}
                <View style={styles.iconRow}>
                  <View style={styles.iconItem}>
                    <View style={styles.iconCircle}>
                      <Image source={require('../assets/images/heart.png')} style={styles.iconImageHeart} />
                    </View>
                    <Text style={styles.iconLabel}>친구 활동</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <View style={styles.iconCircle}>
                      <Image source={require('../assets/images/search.png')} style={styles.iconImageSearch} />
                    </View>
                    <Text style={styles.iconLabel}>친구 검색</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <View style={styles.iconCircle}>
                      <Image source={require('../assets/images/list.png')} style={styles.iconImageList} />
                    </View>
                    <Text style={styles.iconLabel}>친구 목록</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <View style={styles.iconCircle}>
                      <Image source={require('../assets/images/message.png')} style={styles.iconImageMessage} />
                    </View>
                    <Text style={styles.iconLabel}>메시지</Text>
                  </View>
                </View>

                {/* 게시물 작성 버튼 */}
                <TouchableOpacity style={styles.writeButtonWrapper}>
                  <LinearGradient
                    colors={['#DAF1CF', '#ABE88F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.writeButton}
                  >
                    <View style={styles.writeIconContainer}>
                      <Image source={require('../assets/images/pencil.png')} style={styles.writeIcon} />
                    </View>
                    <Text style={styles.writeText}>&gt;&gt; 게시물 작성하기</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* 카테고리 제목 */}
                <Text style={styles.categoryTitle}>🔥 HOT 게시물 🔥</Text>

                {/* 게시물 */}
                <PostCard
                  username="몽실"
                  date="04.02"
                  hashtags={['샐러드']}
                  kcal={152}
                  content={`요즘은 다이어트 한다고\n채소만 먹는 중 (>o<)\n다들 건강식 먹자!`}
                  image={require('../assets/images/salad.png')} // 이미지 경로에 따라 조정
                  likes={42}
                  comments={56}
                />
                <PostCard
                  username="몽실"
                  date="04.02"
                  hashtags={['샐러드']}
                  kcal={152}
                  content={`요즘은 다이어트 한다고\n채소만 먹는 중 (>o<)\n다들 건강식 먹자!`}
                  image={require('../assets/images/salad.png')} // 이미지 경로에 따라 조정
                  likes={42}
                  comments={56}
                />
              </View>
            ) : (
              <View style={styles.tabContent}>
                <View style={styles.emptyState}>
                  <Image
                    source={require('../assets/images/snap.png')} // 스냅 이미지 경로에 맞게 조정
                    style={styles.snapImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>아직 준비 중이에요.{"\n"}
                    더 좋은 모습으로 곧 만날게요! 조금만 기다려 주세요 💚</Text>
                </View>
              </View>

            )}

          </View>
        </ScrollView>
        <Navigation />
      </View>
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
    backgroundColor: '#fff',
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
    justifyContent: 'space-around',
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
