import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, Headline } from 'react-native-paper';
import Container from '../components/Container';
import Body from '../components/Body';
import Input from '../components/Input';
import Logo from '../components/Logo';

import { useNavigation } from '@react-navigation/native';
import {useUser} from '../contexts/UserContext';
import {login} from '../services/auth.services';
import Recipes from "./Recipes";

const Login = ({ updateUser }) => {

  const navigation = useNavigation();
  const [signed, setSigned] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   const handleLogin= () => {

    login({
      email: email,
      password: password
    }).then( res => {

      if(res){
        updateUser(res);
        AsyncStorage.setItem('@USER_DATA', JSON.stringify(res)).then();
        AsyncStorage.setItem('@TOKEN_KEY', res.accessToken).then();
        navigation.navigate('Recipes', { user: res });
        setSigned(true);
        setName(res.name);
      }else{
         Alert.alert('Atenção', 'Usuário ou senha inválidos!');
      }

    });
    
  }

  return (
    <Container>
      <View style={styles.header}>
        <Logo />
      </View>

      <Headline style={styles.textHeader}>CookLaator</Headline>

      <Body>
        <Input
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          left={<TextInput.Icon name="account" />}
        />
        <Input
          label="Senha"
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          left={<TextInput.Icon name="key" />}
        />
        <Button
            style={styles.button}
            mode="contained"
            icon="login"
            onPress={handleLogin}>
          LOGIN
        </Button>
        <Button
          style={styles.button}
          icon="account-multiple-plus"
          mode="contained"
          onPress={() => navigation.navigate('Register')}>
          Registrar
        </Button>
      </Body>
    </Container>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor:'#176B87',
    borderTopColor:'#000',
    marginBottom: 8,
  
  },
  textHeader: {
    textAlign: 'center',
   
  },
  header: {
    alignItems: 'center',
   
    marginTop: 30,
    marginBottom: 12
  },
});

export default Login;
