import { StatusBar, StyleSheet, View } from "react-native";
import Header from '../components/Header';
import CompleteButton from "../components/CompleteButton";
import { useNavigation } from '@react-navigation/native';
import CustomInput from "../components/CustomInput";
import { useEffect, useState } from "react";

const EditIdNickScreen = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState(1);

    const [password, setPassword] = useState('');
    const [newId, setNewId] = useState('');
    const [newNick, setNewNick] = useState('');

    const handleComplete = () => {
        if (step === 1) {
            setStep(2);
        } else {
            navigation.goBack();
        }
    };

    // ✅ step이 바뀔 때 이전 입력값 초기화
    useEffect(() => {
        if (step === 2) {
            setPassword('');
            setNewId('');
            setNewNick('');
        }
    }, [step]);

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Header title="아이디/닉네임 수정" />
            <View style={styles.container}>
                {step === 1 ? (
                    <CustomInput
                        label="본인 확인을 위해 비밀번호를 입력해주세요"
                        textColor="#000"
                        placeholder="snap12^^"
                        value={password}
                        onChangeText={setPassword}
                        helperText="* 올바른 비밀번호가 아닙니다"
                        helperColor="#F00"
                        labelColor="#000"
                        borderColor="#000"
                    />
                ) : (
                    <>
                        <CustomInput
                            label="새 아이디"
                            textColor="#000"
                            placeholder="snap12"
                            value={newId}
                            onChangeText={setNewId}
                            helperText="* 사용 중인 아이디입니다"
                            helperColor="#F00"
                            labelColor="#000"
                            borderColor="#000"
                        />
                        <CustomInput
                            label="새 닉네임"
                            textColor="#000"
                            placeholder="스냅이"
                            value={newNick}
                            onChangeText={setNewNick}
                            helperText="* 이미 존재하는 닉네임입니다"
                            helperColor="#F00"
                            labelColor="#000"
                            borderColor="#000"
                        />
                    </>
                )}
            </View>
            <CompleteButton onPress={handleComplete} title={step === 1 ? "다음" : "완료"} />
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

export default EditIdNickScreen;
