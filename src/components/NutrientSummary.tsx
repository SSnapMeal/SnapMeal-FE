import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutrientItem {
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface NutrientSummaryProps {
  data: NutrientItem[];
  nutritionSummary?: string; // ✅ 서버에서 내려온 분석 문구
}

const NutrientSummary: React.FC<NutrientSummaryProps> = ({ data, nutritionSummary }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>평균적으로 다음과 같이 섭취했어요</Text>
      
      {data.map((item, idx) => {
        const percentage = maxValue === 0 ? 0 : (item.value / maxValue) * 100;
        return (
          <View key={idx} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  { width: `${percentage}%`, backgroundColor: item.color },
                ]}
              />
            </View>
            <Text style={styles.value}>
              {item.value}{item.unit}
            </Text>
          </View>
        );
      })}

      {/* ✅ nutritionSummary가 있으면 서버 내용 표시 */}
      {!!nutritionSummary && (
        <Text style={styles.note}>{nutritionSummary}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },
  label: {
    width: 70,
  },
  barWrapper: {
    flex: 1,
    height: 17,
    borderRadius: 3,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
  value: {
    width: 40,
    textAlign: 'right',
  },
  note: {
    fontSize: 12,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 16,
  },
});

export default NutrientSummary;
