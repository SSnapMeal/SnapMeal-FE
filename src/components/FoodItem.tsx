import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";

const FoodItem = ({ name, kcal, onAdd }: { name: string; kcal: number; onAdd: () => void }) => (
    <View style={styles.itemBox}>
        <Text style={styles.itemText}>{name}</Text>
        <Text style={styles.kcalText}>{kcal}kcal</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Image
                source={require('../assets/images/plus.png')}
                style={styles.plusIcon}
            />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    itemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#D7D7D7',
        borderWidth: 1,
        height: 56,
        borderRadius: 16.5,
        marginBottom: 19,
        paddingLeft: 23,
        paddingRight: 16,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    kcalText: {
        position: 'absolute',
        right: 68,
        fontSize: 14,
        color: '#555',
    },
    addButton: {
        backgroundColor: '#38B000',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        width: 22,
        height: 22,
    }
});

export default FoodItem;
