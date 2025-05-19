import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MealCardProps {
  backgroundColor?: string;
  title?: string;
  kcal?: string;
  nutrients?: string;
}

const MealCard: React.FC<MealCardProps> = ({
  backgroundColor = '#F0F0F0',
  title = '',
  kcal = '',
  nutrients = '',
}) => {
  return (
    <View style={[styles.card, { backgroundColor }]}> 
      {title !== '' && <Text style={styles.title}>{title}</Text>}
      {kcal !== '' && <Text style={styles.kcal}>{kcal}</Text>}
      {nutrients !== '' && <Text style={styles.nutrients}>{nutrients}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 115,
    borderRadius: 20,
    marginRight: 16,
    paddingLeft: 20,
    elevation: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10152C',
    marginBottom: 3,
  },
  kcal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10152C',
    marginBottom: 18,
  },
  nutrients: {
    fontSize: 10,
    color: '#7C7C7C',
    fontWeight: '600',
  },
});

export default MealCard;