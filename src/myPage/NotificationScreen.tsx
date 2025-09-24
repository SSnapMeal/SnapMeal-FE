import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const notifications = [
  {
    id: 1,
    title: '챌린지 성공🎉',
    description:
      "축하합니다! '커피 마시지 않기' 챌린지에 성공했어요. 나만의 후기를 남겨주세요⭐",
    date: '3일 전',
    read: false,
  },
  {
    id: 2,
    title: '챌린지 실패😢',
    description:
      "'커피 마시지 않기' 챌린지에 실패했어요. 다음엔 더 멋지게 성공할 수 있을거에요✏️",
    date: '3일 전',
    read: true,
  },
  {
    id: 3,
    title: '챌린지 업데이트💚',
    description:
      '새로운 주간 챌린지가 올라왔어요. 지금 바로 참여하고 멋진 도전을 시작해보세요🔥',
    date: '3일 전',
    read: true,
  },
  {
    id: 4,
    title: '오늘의 첫 식사를 기록해보세요🍽️',
    description:
      '오늘은 아직 식사 기록이 없어요. 식사를 기록하고 칼로리를 확인해보세요!🥗',
    date: '3일 전',
    read: true,
  },
];

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const [isEnabled, setIsEnabled] = useState(true);
  const translateX = useState(new Animated.Value(isEnabled ? 18 : 0))[0];

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    Animated.timing(translateX, {
      toValue: newValue ? 18 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="알림" backgroundColor="#FFFFFF" />

      {/* 알림 설정 커스텀 토글 */}
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>알림 설정</Text>
        <TouchableOpacity
          style={[styles.toggleContainer, isEnabled && styles.toggleOn]}
          activeOpacity={0.8}
          onPress={toggleSwitch}
        >
          <Animated.View
            style={[styles.circle, { transform: [{ translateX }] }]}
          />
        </TouchableOpacity>
      </View>

      {/* 알림 리스트 */}
      <View style={styles.notificationList}>
        {notifications.map(item => (
          <View
            key={item.id}
            style={[
              styles.notificationCard,
              !item.read && styles.unreadCard,
            ]}
          >
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationDescription}>{item.description}</Text>
            <Text style={styles.notificationDate}>{item.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 13,
    paddingVertical: 16,
  },
  settingText: {
    fontSize: 14,
    color: '#17171B',
    fontWeight: '400',
  },
  toggleContainer: {
    width: 37,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#ccc',
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#38B000',
  },
  circle: {
    width: 13,
    height: 13,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  notificationList: {},
  notificationCard: {
    paddingVertical: 20,
  },
  unreadCard: {
    backgroundColor: '#F5FBF3',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 13,
    color: '#17171B',
    paddingHorizontal: 23,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#17171B',
    marginBottom: 8,
    paddingHorizontal: 23,
  },
  notificationDate: {
    fontSize: 14,
    color: '#B2B2B2',
    textAlign: 'right',
    paddingHorizontal: 23,
  },
});

export default NotificationScreen;
