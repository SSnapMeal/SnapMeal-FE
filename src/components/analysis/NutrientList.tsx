import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type NutrientItem = {
  key: number;
  label: string;
  value: number;
  grams: number;
  color: string;
};

interface NutrientListProps {
  data: NutrientItem[];
  editable?: boolean;
}

const NutrientList: React.FC<NutrientListProps> = ({ data, editable = false }) => {
  const [localData, setLocalData] = useState(data);
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChangeGrams = (index: number, newValue: string) => {
    const updatedData = [...localData];
    const parsedValue = newValue === '' ? 0 : parseFloat(newValue);
    if (!isNaN(parsedValue)) {
      updatedData[index].grams = parsedValue;

      const total = updatedData.reduce((sum, item) => sum + item.grams, 0);

      updatedData.forEach(item => {
        if (total === 0) {
          item.value = 0;
        } else {
          item.value = parseFloat(((item.grams / total) * 100).toFixed(1));
        }
      });

      setLocalData(updatedData);
    }
  };

  return (
    <View style={styles.container}>
      {localData.map((item, index) => (
        <View key={item.key} style={styles.row}>
          <View style={[styles.colorBox, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
          {editable ? (
            <View style={styles.inputWrapper}>
              <TextInput
                value={String(item.grams)}
                onChangeText={(text) => handleChangeGrams(index, text)}
                keyboardType="numeric"
                style={styles.input}
              />
              <Text style={styles.unit}>g</Text>
            </View>
          ) : (
            <Text style={styles.value}>
              {isNaN(item.value) ? 0 : item.value}% ({item.grams}g)
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23,
  },
  colorBox: {
    width: 17,
    height: 17,
    borderRadius: 3,
    marginRight: 15,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#17171B',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 60,
    height: 36,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    textAlign: 'right',
  },

  unit: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default NutrientList;
