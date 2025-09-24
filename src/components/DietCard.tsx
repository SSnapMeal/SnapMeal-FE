import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export type StatusType = '과다' | '적정' | '부족';

// 챌린지 상태 추가
export type ChallengeState = '참여전' | '참여중' | '실패' | '성공';

export type Nutrient = {
  name: string;
  value: string;
};

export type CardData = {
  imageSource: any;
  title: string;
  mealTime?: string;
  topNutrients?: Nutrient[];
  tag?: StatusType;
  mealId: number;
  targetMenuName?: string;
  description?: string;
};

type DietCardProps = {
  additionalMeal?: CardData;
  variant?: 'default' | 'challenge';
  challengeState?: ChallengeState;
  onDeleted?: (mealId: number) => void;
};

const statusColors: Record<StatusType, string> = {
  과다: '#F3B8B8',
  적정: '#ABE88F',
  부족: '#FBE19A',
};

// 챌린지 상태별 스타일 매핑
const challengeStyles: Record<ChallengeState, any> = {
  참여전: {
    shadowColor: '#A9A9A9',
    label: '참여 전',
    labelColor: '#A9A9A9',
  },
  참여중: {
    shadowColor: '#38B000',
    label: '참여 중 (4/5)',
    labelColor: '#38B000',
  },
  실패: {
    shadowColor: '#E67373',
    label: '실패',
    labelColor: '#E67373',
  },
  성공: {
    shadowColor: '#38B000',
    label: '성공',
    labelColor: '#38B000',
  },
};

const DietCard: React.FC<DietCardProps> = ({
  additionalMeal,
  variant = 'default',
  challengeState,
  onDeleted,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); // 메뉴 위치
  const menuButtonRef = useRef<any>(null); // ✅ useRef로 메뉴 버튼 참조

  if (!additionalMeal) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>식단 정보가 없습니다.</Text>
      </View>
    );
  }

  const item = additionalMeal;
  const hasMealTime = !!item.mealTime;
  const hasNutrients = !!(item.topNutrients && item.topNutrients.length > 0);
  const showChallengeReplacement =
    variant === 'challenge' && !hasMealTime && !hasNutrients;

  // 챌린지 모드일 때 상태별 스타일 선택
  const currentChallenge =
    variant === 'challenge' && challengeState
      ? challengeStyles[challengeState]
      : null;

  const handleDelete = async (mealId: number) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const res = await fetch(`http://api.snapmeal.store/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}${msg ? ` - ${msg}` : ''}`);
      }

      Alert.alert('완료', '식사 기록을 삭제했어요.');
      // ✅ 부모에게 알리기(목록 리프레시용)
      onDeleted?.(mealId);
    } catch (err: any) {
      Alert.alert('삭제 실패', String(err?.message ?? err));
    }
  };

  return (
    <View
      style={[
        styles.card,
        variant === 'challenge' && styles.cardChallenge,
        currentChallenge && { shadowColor: currentChallenge.shadowColor },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image source={item.imageSource} style={styles.cardImage} />
      </View>

      {variant !== 'challenge' && (
        <TouchableOpacity
          style={styles.menuButton}
          ref={menuButtonRef}
          onPress={() => {
            menuButtonRef.current?.measureInWindow?.(
              (x: number, y: number, width: number, height: number) => {
                setMenuPosition({
                  x: x + width - 55,
                  y: y + height + 20,
                });
                setMenuVisible(true);
              }
            );
          }}
        >
          <Text style={styles.cardMenu}>⋯</Text>
        </TouchableOpacity>
      )}

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        {showChallengeReplacement ? (
          <>
            <Text style={styles.challengeInfoLine1}>• {item.targetMenuName}</Text>
            <Text style={styles.challengeInfoLine2}>• {item.description}</Text>
          </>
        ) : (
          <>
            {hasMealTime && <Text style={styles.cardText}>{item.mealTime}</Text>}
            {hasNutrients &&
              item.topNutrients!.map((nutrient, idx) => (
                <Text key={idx} style={styles.cardText}>
                  {nutrient.name}: {nutrient.value}
                </Text>
              ))}
          </>
        )}
      </View>

      {variant === 'challenge' ? (
        <Text
          style={[
            styles.challengeTagText,
            currentChallenge && { color: currentChallenge.labelColor },
          ]}
        >
          {currentChallenge?.label}
        </Text>
      ) : (
        item.tag && (
          <View
            style={[
              styles.cardTag,
              { backgroundColor: statusColors[item.tag] || '#DDD' },
            ]}
          >
            <Text style={styles.cardTagText}>{item.tag}</Text>
          </View>
        )
      )}

      {/* 메뉴 모달 */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)} // 바깥 터치 시 닫기
        >
          <View
            style={[
              styles.menuContainer,
              {
                position: 'absolute',
                top: menuPosition.y + 5,
                left: menuPosition.x - 80,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                console.log('수정하기 선택됨');
              }}
            >
              <Text style={styles.menuText}>수정하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert(
                  '삭제하기',
                  '이 식사 기록을 삭제할까요?',
                  [
                    { text: '취소', style: 'cancel' },
                    {
                      text: '삭제',
                      style: 'destructive',
                      onPress: () => handleDelete(item.mealId), // ✅ API 호출
                    },
                  ]
                );
              }}
            >
              <Text style={[styles.menuText, { color: '#FF0000' }]}>삭제하기</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#EDF8E8',
    marginHorizontal: 33,
    borderRadius: 18,
    marginBottom: 26,
    elevation: 2,
    height: 137,
    position: 'relative',
  },
  cardChallenge: {
    backgroundColor: '#FFF',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginLeft: 12,
  },
  cardImage: {
    width: 113,
    height: 113,
    borderRadius: 113,
  },
  cardContent: {
    marginLeft: 12,
    position: 'relative',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 25,
  },
  cardMenu: {
    fontSize: 24,
    color: '#17171B',
    position: 'absolute',
    top: 6,
    right: 15,
    fontWeight: 'bold',
  },
  cardText: {
    marginTop: 2,
    fontSize: 12,
  },
  challengeInfoLine1: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  challengeInfoLine2: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  challengeTagText: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
    bottom: 14,
    right: 17,
  },
  cardTag: {
    position: 'absolute',
    bottom: 14,
    right: 17,
    borderRadius: 8,
    width: 45,
    height: 19,
  },
  cardTagText: {
    fontSize: 10,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    width: 120,
    shadowColor: '#17171B',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 0.5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuText: {
    fontSize: 14,
    color: '#17171B',
  },
  menuButton: {
    position: 'absolute',
    top: 6,
    right: 15,
    padding: 8,
    zIndex: 10,
  },
});

export default DietCard;
