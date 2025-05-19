export interface NutrientItem {
  key: number;
  grams: number;
  color: string;
  label: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  FindAccount: undefined;
  SignUp: undefined;
  ProfileSetting: undefined;
  SignupComplete: undefined;

  Home: undefined;

  Analysis: {
    imageSource: { uri: string } | any;
    title: string;
    mealTime: string;
    sugar: string;
    protein: string;
    tag: '과다' | '적정' | '부족';
  };
  Report: undefined;
  PhotoPreview: { imageUri: string };
  MealRecord: {
    imageUri: string;
    rawNutrients: NutrientItem[];
    selectedMenu?: string;
    selectedKcal?: number;
  };
  FoodSearch: {
    imageUri: string;
    rawNutrients: NutrientItem[];
  };
  MealDetail: {
    imageUri: string;
  };

  Community: undefined;

  MyPage: undefined;
  ProfileEdit: undefined;
  EditGoal: undefined;
  EditIdNick: undefined;
  EditPass: undefined;
};
