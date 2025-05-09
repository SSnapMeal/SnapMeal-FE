import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, PanResponder, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

type SetDateType = React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;

interface CalendarProps {
  selectedDate: dayjs.Dayjs;
  setSelectedDate: SetDateType;
  isExpanded: boolean;
  toggleExpanded: () => void;
  marked: { [key: string]: string }; // dateStr → color
}

const CalendarSection = ({ selectedDate, setSelectedDate, isExpanded, toggleExpanded, marked }: CalendarProps) => {
  const currentMonth = selectedDate.startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const startDay = currentMonth.day();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -20) {
          setSelectedDate(prev => prev.add(1, 'month'));
        } else if (gestureState.dx > 20) {
          setSelectedDate(prev => prev.subtract(1, 'month'));
        }
      },
    })
  ).current;

  const renderCalendarCells = () => {
    const cells = [];

    for (let i = 0; i < startDay; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.cell} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = currentMonth.date(d);
      const dateStr = date.format('YYYY-MM-DD');
      const isSelected = selectedDate.isSame(date, 'date');
      const bgColor = marked[dateStr];

      cells.push(
        <TouchableOpacity key={dateStr} style={styles.cell} onPress={() => {
          setSelectedDate(date);
          if (isExpanded) toggleExpanded();
        }}
        >
          <View style={styles.cellInner}>
            {isSelected && <View style={styles.selectedBox} />}
            {bgColor && <View style={[styles.markCircle, { backgroundColor: bgColor }]} />}
            <Text style={styles.cellText}>{d}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return cells;
  };

  const renderSelectedWeek = () => {
    const startOfWeek = selectedDate.startOf('week');

    return (
      <View style={styles.calendarGrid} {...panResponder.panHandlers}>
        {[...Array(7)].map((_, i) => {
          const date = startOfWeek.add(i, 'day');
          const dateStr = date.format('YYYY-MM-DD');
          const isSelected = selectedDate.isSame(date, 'date');
          const bgColor = marked[dateStr];

          return (
            <TouchableOpacity key={dateStr} style={styles.cell} onPress={() => setSelectedDate(date)}>
              <View style={styles.cellInner}>
                {isSelected && <View style={styles.selectedBox} />}
                {bgColor && <View style={[styles.markCircle, { backgroundColor: bgColor }]} />}
                <Text style={styles.cellText}>{date.date()}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleExpanded} style={styles.dateRow}>
          <Text style={styles.date}>{selectedDate.format('YYYY.MM')}</Text>
          <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <Text key={d} style={styles.weekText}>{d}</Text>
        ))}
      </View>

      {isExpanded ? (
        <View style={styles.calendarGrid} {...panResponder.panHandlers}>
          {renderCalendarCells()}
        </View>
      ) : (
        renderSelectedWeek()
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 30,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
  arrow: {
    fontSize: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  weekText: {
    width: '14.2%',
    textAlign: 'center',
    color: '#B5BEC6',
    fontWeight: '400',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  cell: {
    width: '14.2%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  cellInner: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedBox: {
    position: 'absolute',
    width: 46,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#EDF8E8',
    zIndex: 0,
  },
  markCircle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    zIndex: 1,
  },
  cellText: {
    fontSize: 16,
    color: '#000',
    zIndex: 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
    width: 36,
    height: 36,
    lineHeight: 36,
  },
});

export default CalendarSection;
