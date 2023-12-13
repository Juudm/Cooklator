import * as React from 'react';
import { StyleSheet } from 'react-native';
import {Card, IconButton} from 'react-native-paper';

const CardValues = ({ cardTitle, cardSubTitle, concatenateCurrency, subtitleFontSize, showIcon, onPressIcon, chosenIcon, colorIcon }) => {
    const formattedSubtitle = concatenateCurrency ? `R$ ${cardSubTitle}` : cardSubTitle;

    const subtitleStyle = {
        ...styles.subtitle,
        fontSize: subtitleFontSize || styles.subtitle.fontSize
    };

    const personalizeIcon = chosenIcon || "example-icon";

    const personalizeColorIcon = colorIcon || '#176B87';

    return (
        <Card style={styles.card}>
            <Card.Title
                titleStyle={styles.title}
                subtitleStyle={subtitleStyle}
                title={cardTitle}
                subtitle={formattedSubtitle}
            />
            {showIcon && (
                <IconButton
                    icon={personalizeIcon}
                    iconColor={personalizeColorIcon}
                    size={20}
                    onPress={onPressIcon}
                />
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '90%',
        minHeight: 150,
        alignSelf: 'center',
        backgroundColor: 'rgba(237, 247, 246, 0.9)',
        borderWidth: 1,
        borderColor: '#DAFFFB',
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    title: {
        color: '#04364A',
        fontSize: 20,
        marginBottom: 25,
        marginTop: 10,
        fontWeight: 'normal',
        alignSelf: 'center',
    },
    subtitle: {
        color: '#176B87',
        height: 50,
        fontSize: 35,
        alignSelf: 'center',
        fontWeight: '400',
        lineHeight: 44,
    },
});

export default CardValues;
