import { StatusBar, StyleSheet, View } from "react-native";
import Header from '../components/Header';
import CustomNumInput from "../components/CustomNumInput";
import CompleteButton from "../components/CompleteButton";
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";

const EditGoalScreen = () => {
    const navigation = useNavigation();
    // 하드코딩 부분
    const age = 28;
    const gender = 'female';

    const [recommendedCalorie, setRecommendedCalorie] = useState<number>(0);
    const [recommendedKm, setRecommendedKm] = useState<number>(0);

    const calculateRecommendedCalorie = (age: number, gender: string) => {
        if (gender === 'male') {
            if (age < 30) return 2600;
            else if (age < 50) return 2500;
            else return 2300;
        } else {
            if (age < 30) return 2000;
            else if (age < 50) return 1900;
            else return 1800;
        }
    };

    // 권장 운동량 추천 부분
    const calculateRecommendedKm = (calorie: number) => {
        return Math.round((calorie / 60) * 10) / 10;
    };

    useEffect(() => {
        const calorie = calculateRecommendedCalorie(age, gender);
        setRecommendedCalorie(calorie);
        setRecommendedKm(calculateRecommendedKm(calorie));
    }, [age, gender]);

    const handleComplete = () => {
        navigation.goBack();
    };

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Header title="권장 칼로리/운동량 수정" />
            <View style={styles.container}>
                <CustomNumInput
                    label="권장 칼로리"
                    textColor="#17171B"
                    placeholder="2000"
                    helperText="* 칼로리를 입력해주세요"
                    helperColor="#F00"
                    labelColor="#17171B"
                    borderColor="#17171B"
                />
                <CustomNumInput
                    label="권장 운동량"
                    placeholder="5 (km)"
                    helperText="* 운동량을 입력해주세요"
                    helperColor="#F00"
                    labelColor="#17171B"
                    borderColor="#17171B"
                />
            </View>
            <CompleteButton onPress={handleComplete} />
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 46,
        backgroundColor: '#fff',
    },
});

export default EditGoalScreen;
