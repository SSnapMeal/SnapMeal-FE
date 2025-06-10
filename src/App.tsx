import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './startPage/WelcomeScreen';
import FindAccountScreen from './startPage/FindAccountScreen';
import SignUpScreen from './startPage/SignUpScreen';
import ProfileSettingScreen from './startPage/ProfileSettingScreen';
import SignupCompleteScreen from './startPage/SignupCompleteScreen';

import HomeScreen from './mainPage/HomeScreen';
import AnalysisScreen from './analysisPage/AnalysisScreen';
import ReportScreen from './analysisPage/ReportScreen';
import ImageCheckScreen from './analysisPage/ImageCheckScreen';
import PhotoPreviewScreen from './analysisPage/PhotoPreviewScreen';
import MealRecordScreen from './analysisPage/MealRecordScreen';
import FoodSearchScreen from './analysisPage/FoodSearchScreen';
import MealDetailScreen from './analysisPage/MealDetailScreen';

import MyPageScreen from './myPage/MyPageScreen';
import CommunityScreen from './communityPage/CommunityScreen';

import ProfileEditScreen from './myPage/ProfileEditScreen';
import EditGoalScreen from './myPage/EditGoalScreen';
import EditIdNickScreen from './myPage/EditIdNickScreen';
import EditPassScreen from './myPage/EditPassScreen';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="FindAccount" component={FindAccountScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ProfileSetting" component={ProfileSettingScreen} />
            <Stack.Screen name="SignupComplete" component={SignupCompleteScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Analysis" component={AnalysisScreen} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="ImageCheck" component={ImageCheckScreen} />
            <Stack.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
            <Stack.Screen name="MealRecord" component={MealRecordScreen} />
            <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
            <Stack.Screen name="MealDetail" component={MealDetailScreen} />
            <Stack.Screen name="MyPage" component={MyPageScreen} />
            <Stack.Screen name="Community" component={CommunityScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="EditGoal" component={EditGoalScreen} />
            <Stack.Screen name="EditIdNick" component={EditIdNickScreen} />
            <Stack.Screen name="EditPass" component={EditPassScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
