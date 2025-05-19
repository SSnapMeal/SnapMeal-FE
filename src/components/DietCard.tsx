import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type StatusType = '과다' | '적정' | '부족';

type CardData = {
  imageSource: any;
  title: string;
  mealTime: string;
  sugar: string;
  protein: string;
  tag: StatusType;
};

type DietCardProps = {
  additionalMeal?: CardData;
};

const statusColors: Record<StatusType, string> = {
  과다: '#F3B8B8',
  적정: '#ABE88F',
  부족: '#FBE19A',
};

const DietCard: React.FC<DietCardProps> = ({ additionalMeal }) => {
  const cardData: CardData[] = [
    {
      imageSource: require('../assets/images/food_sample.png'),
      title: '샐러드 (152kcal)',
      mealTime: '아침',
      sugar: '14g (14%)',
      protein: '14g (24%)',
      tag: '부족',
    },
    {
      imageSource: require('../assets/images/food_sample.png'),
      title: '닭가슴살 (220kcal)',
      mealTime: '점심',
      sugar: '2g (2%)',
      protein: '25g (45%)',
      tag: '적정',
    },
  ];

  const finalCardData = additionalMeal
    ? [additionalMeal, ...cardData]
    : cardData;

  return (
    <>
      {finalCardData.map((item, index) => (
        <View style={styles.card} key={index}>
          <View style={styles.imageWrapper}>
            <Image source={item.imageSource} style={styles.cardImage} />
          </View>

          <Text style={styles.cardMenu}>⋯</Text>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.mealTime}</Text>
            <Text style={styles.cardText}>당: {item.sugar}</Text>
            <Text style={styles.cardText}>단백질: {item.protein}</Text>
          </View>

          <View style={[styles.cardTag, { backgroundColor: statusColors[item.tag] || '#DDD' }]}>
            <Text style={styles.cardTagText}>{item.tag}</Text>
          </View>
        </View>
      ))}
    </>
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
    color: '#000',
    position: 'absolute',
    top: 6,
    right: 15,
    fontWeight: 'bold',
  },
  cardText: {
    marginTop: 2,
    fontSize: 12,
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
});

export default DietCard;
