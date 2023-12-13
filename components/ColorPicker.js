import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ColorPicker = ({ onColorSelect }) => {
    const [selectedColor, setSelectedColor] = useState(null);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);

    const colors = [
        '#FF6B6B', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#00CED1',
        '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b',
        '#FFB6C1', '#AED6F1', '#FFFACD', '#98FB98', '#E0BBE4', 'black',
    ];

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        onColorSelect(color);
    };

    const toggleColorPicker = () => {
        setColorPickerVisible(!colorPickerVisible);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Selecione uma cor</Text>
                <TouchableOpacity onPress={toggleColorPicker}>
                    <Icon name={colorPickerVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color="black" />
                </TouchableOpacity>
            </View>
            {colorPickerVisible && (
                <View style={styles.colorContainer}>
                    {colors.map((color, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleColorSelect(color)}
                            style={[
                                styles.colorOption,
                                { backgroundColor: color },
                                selectedColor === color && styles.selectedColorOption,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
    },
    colorContainer: {
        width: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    colorOption: {
        width: 25,
        height: 25,
        borderRadius: 25,
        margin: 8,
    },
    selectedColorOption: {
        borderColor: 'black',
        borderWidth: 2,
    },
    selectedColorText: {
        fontSize: 16,
    },
});

export default ColorPicker;
