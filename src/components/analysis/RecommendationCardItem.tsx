import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  title: string;
  description: string;
  image: any;
  tag?: string;
}

const RecommendationCardItem = ({ title, description, image, tag }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>
      {tag && (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      )}
      <Image source={image} style={styles.cardImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F1FBEF',
    width: 156,
    height: 137,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 21,
    borderRadius: 18,
    marginRight: 17,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#D8F3DC',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#3E8E41',
  },
  cardImage: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignSelf: 'center',
    bottom: 14,
    right: 15,
  },
});

export default RecommendationCardItem;
