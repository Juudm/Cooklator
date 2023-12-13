import React from 'react';
import {View, Image} from 'react-native';
import {StyleSheet} from 'react-native';

const LogoCooklator = ({width, height, isWithSubtitle}) => {

    const imageUrl = isWithSubtitle
        ? 'https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2023-2-e3-proj-mov-t1-cooklator/blob/8f9286df55d4da158552dcbeb831ec9b45da7077/docs/img/Logo2.png?raw=true'
        :  'https://raw.githubusercontent.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2023-2-e3-proj-mov-t1-cooklator/8f9286df55d4da158552dcbeb831ec9b45da7077/docs/img/Logosemsubtitulo2.png'


    return (
        <View>
            <Image
                source={{ uri: imageUrl }}
                style={{...styles.logoImage, width: width * 0.8, height: height * 0.8 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    logoImage: {
        resizeMode: 'contain',
    },
});


export default LogoCooklator;
