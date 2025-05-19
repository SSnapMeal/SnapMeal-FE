import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    consumedKcal: number;
    recommendedKcal: number;
};

const CalorieProgress: React.FC<Props> = ({ consumedKcal, recommendedKcal }) => {
    const fillPercent = Math.min((consumedKcal / recommendedKcal) * 100, 100);

    let status: '부족' | '적정' | '과다';
    if (fillPercent < 60) {
        status = '부족';
    } else if (fillPercent < 100) {
        status = '적정';
    } else {
        status = '과다';
    }

    const statusColors: Record<typeof status, string> = {
        부족: '#FBE19A',
        적정: '#ABE88F',
        과다: '#F3B8B8',
    };

    return (
        <View style={styles.kcalRow}>
            <Text style={styles.kcalLabel}>칼로리</Text>
            <View style={styles.kcalBarBackground}>
                <View style={[styles.kcalBarFill, {
                    width: `${fillPercent}%`,
                    backgroundColor: statusColors[status],
                }]} />
            </View>
            <Text style={styles.kcalValue}>{consumedKcal}kcal</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    kcalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 45,
        paddingHorizontal: 42,
    },
    kcalLabel: {
        marginRight: 15,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    kcalBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#F1F1F3',
        borderRadius: 4,
        marginRight: 15,
    },
    kcalBarFill: {
        height: 8,
        borderRadius: 4,
    },
    kcalValue: {
        fontWeight: 'bold',
    },
});

export default CalorieProgress;
