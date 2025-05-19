import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const mealTimes = ['아침', '아점', '점심', '점저', '저녁', '야식', '간식'];

interface MealTimeSelectorProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

const MealTimeSelector: React.FC<MealTimeSelectorProps> = ({ selectedTime, onSelectTime }) => {
  return (
    <>
      <Text style={[styles.label, styles.horizontalPadding]}>시간</Text>
      <View style={styles.timeContainer}>
        {mealTimes.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeButton,
              selectedTime === time && styles.timeButtonActive,
            ]}
            onPress={() => onSelectTime(time)}
          >
            <Text
              style={[
                styles.timeText,
                selectedTime === time && styles.timeTextActive,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 23,
  },
  horizontalPadding: {
    paddingHorizontal: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 24,
  },
  timeButton: {
    backgroundColor: '#E9F6E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  timeButtonActive: {
    backgroundColor: '#38B000',
  },
  timeText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20
  },
  timeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MealTimeSelector;
