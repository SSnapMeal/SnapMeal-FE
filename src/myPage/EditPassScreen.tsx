import { StatusBar, StyleSheet, View } from "react-native";
import Header from '../components/Header';
import CompleteButton from "../components/CompleteButton";
import { useNavigation } from '@react-navigation/native';
import CustomInput from "../components/CustomInput";

const EditPassScreen = () => {
    const navigation = useNavigation();

    const handleComplete = () => {

        navigation.goBack();
    };

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Header title="비밀번호 수정" />
            <View style={styles.container}>
                <CustomInput
                    label="기존 비밀번호"
                    textColor="#17171B"
                    placeholder="snap12^^"
                    helperText="* 비밀번호가 일치하지 않습니다"
                    helperColor="#F00"
                    labelColor="#17171B"
                    borderColor="#17171B"
                />
                <CustomInput
                    label="새 비밀번호"
                    textColor="#17171B"
                    placeholder="snap12^^"
                    helperText="* 올바른 비밀번호가 아닙니다"
                    helperColor="#F00"
                    labelColor="#17171B"
                    borderColor="#17171B"
                />
                <CustomInput
                    label="새 비밀번호 확인"
                    textColor="#17171B"
                    placeholder="snap12^^"
                    helperText="* 비밀번호가 일치하지 않습니다"
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

export default EditPassScreen;
