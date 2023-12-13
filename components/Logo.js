import React from 'react';
import {StyleSheet, Image} from 'react-native';

const Logo = () =>{
  return <Image style={styles.image1} source={require('../assets/login.png')} />
};

const styles = StyleSheet.create({
 image1:{
    width: 130,
    height: 130,
    borderRadius: 50,
  },
});

export default Logo;