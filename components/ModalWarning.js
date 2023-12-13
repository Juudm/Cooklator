import React, {} from 'react';
import {Modal, Text, View, Pressable} from 'react-native';

const ModalWarning = ({
                          visible,
                          message,
                          onPrimaryButtonPress,
                          primaryButtonLabel,
                          onSecondaryButtonPress,
                          secondaryButtonLabel
                      }) => {

    const renderSecondaryButton = secondaryButtonLabel && onSecondaryButtonPress;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.messageText}>{message}</Text>
                    <View style={styles.viewPressable}>
                        <Pressable onPress={onPrimaryButtonPress}
                                   style={renderSecondaryButton ? styles.primaryButton : styles.singleButton}>
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
        width: 300,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#DAFFFB',
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
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
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    messageText: {
        fontSize: 17,
        fontWeight: '500',
        textAlign: 'center',
        paddingBottom: 30,
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
    }
};

export default ModalWarning;
