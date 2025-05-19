import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DayData {
  label: string;
  value: number;
  color: string;
}

interface WeeklyBarChartProps {
  data: DayData[];
  averageText?: string;
}

const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ data, averageText }) => {
  return (
    <>
      {averageText && <Text style={styles.avgText}>{averageText}</Text>}

      <View style={styles.barChart}>
        <View style={styles.barChartRow}>
          {data.map((item, index) => (
            <View key={index} style={styles.barItem}>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${item.value}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.dottedLine} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  avgText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  barChart: {
    height: 180,
    marginVertical: 0,
    position: 'relative',
    paddingHorizontal: 15,
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 12,
  },
  barItem: {
    alignItems: 'center',
    width: 31,
  },
  barBackground: {
    width: 31,
    height: 120,
    backgroundColor: '#F4F5F9',
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
  dottedLine: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    borderTopWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#9B9B9B',
  },
});

export default WeeklyBarChart;
