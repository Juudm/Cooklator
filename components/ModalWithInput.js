import React, {useEffect, useState} from 'react';
import { Modal, Text, View, Pressable, TextInput } from 'react-native';

const ModalWithInput = ({
                            visible,
                            message,
                            inputValue,
                            onPrimaryButtonPress,
                            primaryButtonLabel,
                            onSecondaryButtonPress,
                            secondaryButtonLabel,
                        }) => {
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        setInputText(inputValue);
    }, [inputValue]);

    const renderSecondaryButton = secondaryButtonLabel && onSecondaryButtonPress;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.messageText}>{message}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        value={inputText}
                        onChangeText={(text) => setInputText(text)}
                    />
                    <View style={styles.viewPressable}>
                        <Pressable
                            onPress={() => {
                                onPrimaryButtonPress(inputText);
                                setInputText(''); // Limpar o valor do input após pressionar salvar
                            }}
                            style={renderSecondaryButton ? styles.primaryButton : styles.singleButton}
                        >
                            <View style={styles.viewText}>
                                <Text>{primaryButtonLabel}</Text>
                            </View>
                        </Pressable>
                        {renderSecondaryButton && (
                            <Pressable onPress={onSecondaryButtonPress} style={styles.secondaryButton}>
                                <View style={styles.viewText}>
                                    <Text>{secondaryButtonLabel}</Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(218, 255, 251, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: 350,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#DAFFFB',
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
    },
    input: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        width: '80%',
        borderRadius: 5,
    },
    viewText: {
        height: 33,
        borderRadius: 20,
        backgroundColor: '#64CCC5',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#DAFFFB',
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    messageText: {
        fontSize: 17,
        fontWeight: '500',
        textAlign: 'center',
        paddingBottom: 10,
    },
    primaryButton: {
        width: 100,
        marginRight: 50,
    },
    secondaryButton: {
        width: 100,
    },
    singleButton: {
        width: 125,
    },
    viewPressable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
};

export default ModalWithInput;
