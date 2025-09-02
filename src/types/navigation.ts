export interface NutrientItem {
  key: number;
  grams: number;
  color: string;
  label: string;
}

export type Nutrient = {
  name: string;
  value: string;
};

export type RootStackParamList = {
  Welcome: undefined;
  FindAccount: undefined;
  SignUp: undefined;
  ProfileSetting: {
    userInfo?: {
      userId: string;
      password: string;
      name: string;
      email: string;
      age: number;
      gender: 'FEMALE' | 'MALE';
      type: string;
    };
  };
  SignupComplete: undefined;
  Home: undefined;

  Analysis: {
    imageSource: { uri: string } | any;
    title: string;
    mealTime: string;
    topNutrients: Nutrient[];
    tag: '과다' | '적정' | '부족';
  };


  Report: undefined;

  ImageCheck: {
    imageUri: string;
    classNames: string[];
    imageId: number;
  };

  PhotoPreview: {
    imageUri: string;
    classNames: string[];
    imageId: number;
    nutritionId: number;
  };

  MealRecord: {
    imageUri: string;
    rawNutrients: NutrientItem[];
    selectedMenu?: string;
    selectedKcal?: number;
    nutritionId: number;
  };

  FoodSearch: {
    imageUri: string;
    rawNutrients: NutrientItem[];
    selectedMenu?: string;
    selectedKcal?: number;
    nutritionId: number;
  };

  MealDetail: {
    imageUri: string;
    rawNutrients: NutrientItem[];
    selectedMenu?: string;
    selectedKcal?: number;
    nutritionId: number;
  };

  Community: undefined;
  ChallengeExplorer: undefined;
  ChallengeActive: undefined;
  ChallengeDone: undefined;
  ChallengeDetail: { id?: string; title?: string } | undefined;
  MyPage: undefined;
  ProfileEdit: undefined;
  EditGoal: undefined;
  EditIdNick: undefined;
  EditPass: undefined;
};