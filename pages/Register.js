import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Headline } from 'react-native-paper';
import Container from '../components/Container';
import Body from '../components/Body';
import Input from '../components/Input';
import Logo from '../components/Logo';

import { useNavigation } from '@react-navigation/native';

import {register} from '../services/auth.services';
import ModalWarning from "../components/ModalWarning";

const Register = () => {

  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hourValue, setHourValue] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = () => {

    register({
      name: name,
      email: email,
      password: password,
      hourValue: hourValue
    }).then( res => {
      console.log(res);

      if(res){
        showModal('Usuário cadastrado com sucesso!');
      }else{
        showModal('Erro ao cadastrar Usuário!');
      }
    });
  }

  const handleInputChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    const formattedValue = numericValue.replace(
        /(\d)(?=(\d{2})+(?!\d))/g,
        '$1.'
    );

    setHourValue(formattedValue);
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalMessage('');
    navigation.navigate('Login');
  };

  return (
    <Container>
      <View style={styles.header}>
        <Logo />
      </View>

      <Headline style={styles.textHeader}>Novo Usuario!</Headline>

      <Body>
      <Input
          label="Nome"
          value={name}
          onChangeText={(text) => setName(text)}
          left={<TextInput.Icon name="account" />}
        />
        <Input
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          left={<TextInput.Icon name="email" />}
        />
        <Input
          label="Senha"
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          left={<TextInput.Icon name="key" />}
        />
        <Input
            label="Valor da hora (você poderá alterar posteriormente)"
            value={hourValue}
            placeholder="R$ 0,00"
            onChangeText={handleInputChange}
            left={<TextInput.Icon name="key" />}
        />
        <Button
          style={styles.button}
          icon="account-multiple-plus"
          mode="contained"
          onPress={handleRegister}>
          REGISTRAR
        </Button>
        <ModalWarning visible={modalVisible} message={modalMessage} onPrimaryButtonPress={hideModal}
                      primaryButtonLabel={'OK'}/>
        <Button
          style={styles.button}
          icon="cancel"
          mode="contained"
          onPress={() => navigation.goBack()}>
          Cancelar
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
  button1: {
    backgroundColor:'#176B87',
    borderTopColor:'#000',
    marginBottom: 0,
    width:10,
    height:20,
    marginTop: 5,

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

export default Register;
