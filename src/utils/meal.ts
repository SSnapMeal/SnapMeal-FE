import { StatusType, Nutrient } from '../types/meal';

export const mealTypeMap: Record<string, string> = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
};

export const pickTop2Nutrients = (item: any): Nutrient[] => {
  const labelMap: Record<string, string> = {
    protein: '단백질',
    carbs: '탄수화물',
    sugar: '당',
    fat: '지방',
  };

  const pairs = ([
    ['protein', item?.protein],
    ['carbs', item?.carbs],
    ['sugar', item?.sugar],
    ['fat', item?.fat],
  ] as [keyof typeof labelMap, number | undefined][])
    .filter(([, v]) => typeof v === 'number' && !isNaN(v as number))
    .sort((a, b) => (b[1]! - a[1]!))
    .slice(0, 2)
    .map(([key, v]) => ({ name: labelMap[key], value: `${v}g` }));

  return pairs;
};

export const getStatusByCalories = (calories: number): StatusType => {
  if (calories > 2000) return '과다';
  if (calories < 1400) return '부족';
  return '적정';
};

export const statusColorMap: Record<StatusType, string> = {
  과다: '#FA9E9E',
  적정: '#80DAA7',
  부족: '#FED77F',
};