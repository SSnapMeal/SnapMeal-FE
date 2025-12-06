export type StatusType = '과다' | '적정' | '부족';

export type Nutrient = {
  name: string;
  value: string;
};

export type CardData = {
  imageSource: any;
  title: string;
  mealTime: string;
  topNutrients: Nutrient[];
  tag: StatusType;
  mealId: number;
};