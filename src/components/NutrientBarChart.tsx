import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type ChartItem = {
  label: string;
  value: number;
  color: string;
};

interface NutrientBarChartProps {
  data: ChartItem[];
  customStyle?: ViewStyle;
}

const NutrientBarChart: React.FC<NutrientBarChartProps> = ({ data, customStyle }) => {
  return (
    <View style={[styles.container, customStyle]}>
      <View style={styles.dashedLine} />
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',     // ✅ 부모 기준 중앙 정렬
    marginTop: 50,
    paddingHorizontal: 0,    // ✅ 슬라이드 뷰에서 조절하니까 제거
    gap: 14,
    position: 'relative',
  },

  dashedLine: {
    position: 'absolute',
    right: 50,
    top: -12,
    bottom: -12,
    width: 3,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#9B9B9B',
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 15,
  },
  label: {
    width: 75,
    fontSize: 14,
    fontWeight: '700',
    color: '#10152C',
    lineHeight: 15,
  },
  barBg: {
    flex: 1,
    height: 15,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
});

export default NutrientBarChart;
