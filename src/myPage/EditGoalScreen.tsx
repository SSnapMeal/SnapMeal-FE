import { StatusBar, StyleSheet, View } from "react-native";
import Header from '../components/Header';
import CustomNumInput from "../components/CustomNumInput";
import CompleteButton from "../components/CompleteButton";
import { useNavigation } from '@react-navigation/native';

const EditGoalScreen = () => {
    const navigation = useNavigation();

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
                    textColor="#000"
                    placeholder="2000"
                    helperText="* 칼로리를 입력해주세요"
                    helperColor="#F00"
                    labelColor="#000"
                    borderColor="#000"
                />
                <CustomNumInput
                    label="권장 운동량"
                    placeholder="5 (km)"
                    helperText="* 운동량을 입력해주세요"
                    helperColor="#F00"
                    labelColor="#000"
                    borderColor="#000"
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
