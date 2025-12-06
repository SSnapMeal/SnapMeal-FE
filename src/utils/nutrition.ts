export type RawNutrient = {
  id: string;
  label: string;
  name: string;
  nutrientName: string;
  grams: number;
  color: string;
};

export const DEFAULT_NUTRIENTS: RawNutrient[] = [
  { id: 'protein', label: '단백질', name: '단백질', nutrientName: '단백질', grams: 0, color: '#B6E3A8' },
  { id: 'carb',    label: '탄수화물', name: '탄수화물', nutrientName: '탄수화물', grams: 0, color: '#FFD27F' },
  { id: 'fat',     label: '지방', name: '지방', nutrientName: '지방', grams: 0, color: '#FFB3B3' },
  { id: 'sugar',   label: '당', name: '당', nutrientName: '당', grams: 0, color: '#FFF2AE' },
  { id: 'sodium',  label: '나트륨', name: '나트륨', nutrientName: '나트륨', grams: 0, color: '#A3C4FF' },
];

export const mergeNutrients = (
  base: RawNutrient[],
  incoming: any[] | undefined,
): RawNutrient[] => {
  if (!incoming) return base;
  return base.map((item) => {
    const found = incoming.find(
      (n) =>
        n.id === item.id ||
        n.name === item.name ||
        n.nutrientName === item.nutrientName,
    );
    return found ? { ...item, grams: found.grams ?? item.grams } : item;
  });
};
