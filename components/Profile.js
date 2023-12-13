import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Card, Checkbox, TextInput} from 'react-native-paper';
import config from "../config";
import {useRoute} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalWarning from "./ModalWarning";
import axios from "axios";
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// import AppBar from './AppBar'

const usersApiUrl = config.usersApiUrl;

const Profile = () => {

    const styles = StyleSheet.create({

        inputContainer: {
            flex: 1,
            justifyContent: 'top',
            alignItems: 'center',
            paddingHorizontal: 16,
        },
        input: {
            width: '100%',
            marginVertical: 10
        },
        invalidInput: {
            color: 'red'
        }
    });

    const route = useRoute();
    const user = route.params?.user;
    const [userProfile, setUserProfile] = React.useState(user);
    const [checked, setChecked] = React.useState(user.applyToAllProjects);
    const [name, setName] = React.useState(userProfile.name);
    const [isNameValid, setIsNameValid] = React.useState(true);
    const [email, setEmail] = React.useState(userProfile.email);
    const [isEmailValid, setIsEmailValid] = React.useState(true);
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [isNewPasswordValid, setIsNewPasswordValid] = React.useState(null);
    const [newPasswordConfirmation, setNewPasswordConfirmation] = React.useState("");
    const [isNewPasswordConfirmationValid, setIsNewPasswordConfirmationValid] = React.useState(null);
    const [isNewPasswordConfirmationEqualsValid, setIsNewPasswordConfirmationEqualsValid] = React.useState(null);
    const [valueHour, setValueHour] = React.useState(userProfile.hourValue);
    const [hideCurrentPassword, setHideCurrentPassword] = React.useState(true);
    const [hideNewPassword, setHideNewPassword] = React.useState(true);
    const [hideNewPasswordConfirmation, setHideNewPasswordConfirmation] = React.useState(true);
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false)
    const [applyToAllProjects, setApplyToAllProjects] = React.useState(false);

    useEffect(() => {
        if (user) {
            setUserProfile(user)
        }
    }, [user]);

    const currentPasswordChange = e => {
        const currentPassword = e.target.value;
        setCurrentPassword(currentPassword);
    }

    const newPasswordConfirmationChange = e => {
        const newPasswordConfirmation = e.target.value;
        setIsNewPasswordConfirmationValid(newPasswordConfirmation !== '' && newPasswordConfirmation.length === 8);
        setIsNewPasswordConfirmationEqualsValid(newPasswordConfirmation === newPassword);
        setNewPasswordConfirmation(newPasswordConfirmation);
    }

    const newPasswordChange = e => {
        const newPassword = e.target.value;
        setIsNewPasswordValid(newPassword !== '' && newPassword.length === 8)
        setNewPassword(newPassword);
    }

    const hideCurrentPasswordChange = () => {
        setHideCurrentPassword(!hideCurrentPassword);
    }

    const hideNewPasswordChange = () => {
        setHideNewPassword(!hideNewPassword);
    }

    const hideNewPasswordConfirmationChange = () => {
        setHideNewPasswordConfirmation(!hideNewPasswordConfirmation)
    }

    const nameChange = e => {
        const name = e.target.value;
        setIsNameValid(name !== '' && (name.length >= 5 && name.length <= 15));
        setName(name);
    }

    const emailChange = e => {
        const email = e.target.value;
        setIsEmailValid(validateEmail(email))
        setEmail(email);
    }

    const valueHourChange = e => {
        const valueHour = e.target.value;
        if (!isNaN(valueHour)) {
            setValueHour(valueHour);
        }
    }

    const updateCheckboxState = () => {
        setChecked(!checked);
        setApplyToAllProjects(!checked);
    };

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const updateUser = async () => {
        try {
            setIsLoading(true);
            if ((name !== '' && (name.length >= 5 && name.length <= 15)) && validateEmail(email) && !isNaN(valueHour)) {
                let userData = await verifyUserEmail();
                if (userData !== null && userData.id !== userProfile.id) {
                    showModal('E-mail já em uso!')
                } else {
                    const userUpdated = {
                        email: email,
                        name: name,
                        hourValue: valueHour,
                        password: userProfile.password,
                        applyToAllProjects: applyToAllProjects,
                    };

                    const response = await updateUserRequest(userUpdated);

                    if (response.status === 201 || response.status === 200) {
                        const data = await response.json();
                        AsyncStorage.setItem('@USER_DATA', JSON.stringify(data)).then();
                        showModal('Usuário editado com sucesso!');
                    }
                }
            } else {
                setIsNameValid(name !== '' && (name.length >= 5 && name.length <= 15));
                setIsEmailValid(validateEmail(email));
            }
            setIsLoading(false);

        } catch (error) {
            console.log(error);
        }
    }

    const updatePassword = async () => {
        try {
            setIsLoadingPasswordChange(true);
            if ((newPassword !== '' && newPassword.length === 8) && (newPasswordConfirmation !== '' && newPasswordConfirmation.length === 8 && newPasswordConfirmation === newPassword)) {
                let userData = await getUserData();
                if (userData.password !== currentPassword) {
                    showModal('Senha incorreta!')
                } else {
                    const userPasswordUpdated = {
                        email: userProfile.email,
                        name: userProfile.name,
                        hourValue: userProfile.hourValue,
                        password: newPassword
                    }

                    const response = await updateUserPasswordRequest(userPasswordUpdated);

                    if (response.status === 201 || response.status === 200) {
                        const data = await response.json();
                        AsyncStorage.setItem('@USER_DATA', JSON.stringify(data)).then();
                        showModal('Senha editada com sucesso!');
                    }
                }
            } else {
                setIsNewPasswordValid(newPassword !== '' && newPassword.length === 8);
                setIsNewPasswordConfirmationValid(newPasswordConfirmation !== '' && newPasswordConfirmation.length === 8 && newPasswordConfirmation === newPassword)
            }
            setIsLoadingPasswordChange(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function getUserData() {
        const response = await axios.get(`${usersApiUrl}`);

        const matchingUsers = response.data.filter(user =>
            user.id === userProfile.id
        );

        if (matchingUsers.length > 0) {
            return matchingUsers[0];
        } else {
            return null;
        }
    }

    async function verifyUserEmail() {
        const response = await axios.get(`${usersApiUrl}`);

        const matchingUsers = response.data.filter(user =>
            user.email === email
        );

        if (matchingUsers.length > 0) {
            return matchingUsers[0];
        } else {
            return null;
        }
    }

    function updateUserRequest(userUpdated) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userUpdated),
        };

        return fetch(usersApiUrl + '/' + userProfile.id, requestOptions);
    }

    function updateUserPasswordRequest(userPasswordUpdated) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPasswordUpdated),
        };

        return fetch(usersApiUrl + '/' + userProfile.id, requestOptions);
    }

    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
        setModalMessage('');
    };

    return (

        <ScrollView>
            <View style={{paddingTop: 16}}>
                <Card style={{paddingBottom: 16, marginHorizontal: 8}} elevation={3}>
                    <View style={styles.inputContainer}>

                        <Text style={{fontSize: 18, fontWeight: 'bold', paddingTop: 16}}>
                            Perfil
                        </Text>

                        <TextInput
                            style={styles.input}
                            outlineColor={isNameValid ? 'gray' : 'red'}
                            label="Nome"
                            value={name}
                            mode='outlined'
                            onChange={nameChange}
                        />
                        {!isNameValid &&
                            <Text style={styles.invalidInput}>O nome deve conter entre 5 e 15 caracteres </Text>}
                        <TextInput
                            style={styles.input}
                            outlineColor={isEmailValid ? 'gray' : 'red'}
                            label="E-mail"
                            value={email}
                            mode='outlined'
                            onChange={emailChange}
                            errorMessage={"Teste"}
                        />
                        {!isEmailValid && <Text style={styles.invalidInput}>Endereço de E-mail inválido</Text>}

                        <View style={styles.input}>
                            <TextInput
                                style={{width: '100%', paddingBottom: 0}}
                                label="Valor por Hora"
                                value={valueHour}
                                mode='outlined'
                                onChange={valueHourChange}
                            />
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 12}}>Fixar para todos os projetos</Text>
                                <Checkbox
                                    status={checked ? 'checked' : 'unchecked'}
                                    onPress={updateCheckboxState}
                                />
                            </View>
                        </View>

                        <Button icon="square-edit-outline"
                                mode="contained"
                                disabled={!isNameValid || !isEmailValid || isNaN(valueHour)}
                                onPress={updateUser}
                                loading={isLoading}>
                            Editar
                        </Button>
                        <ModalWarning visible={modalVisible} message={modalMessage} onPrimaryButtonPress={hideModal}
                                      primaryButtonLabel={'OK'}/>
                    </View>
                </Card>

                <Card style={{paddingBottom: 16, marginHorizontal: 8, marginVertical: 20}} elevation={3}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            label="Senha Atual"
                            value={currentPassword}
                            mode='outlined'
                            onChange={currentPasswordChange}
                            right={<TextInput.Icon icon={hideCurrentPassword ? "eye-off" : "eye"}
                                                   onPress={hideCurrentPasswordChange}/>}
                            secureTextEntry={hideCurrentPassword}
                        />
                        <TextInput
                            style={styles.input}
                            label="Nova Senha"
                            value={newPassword}
                            outlineColor={isNewPasswordValid === null || isNewPasswordValid ? 'gray' : 'red'}
                            mode='outlined'
                            onChange={newPasswordChange}
                            right={<TextInput.Icon icon={hideNewPassword ? "eye-off" : "eye"}
                                                   onPress={hideNewPasswordChange}/>}
                            secureTextEntry={hideNewPassword}
                        />
                        {isNewPasswordValid !== null && !isNewPasswordValid &&
                            <Text style={styles.invalidInput}>A nova senha deve conter 8 caracteres</Text>}
                        <TextInput
                            style={styles.input}
                            label="Confirmação Nova Senha"
                            value={newPasswordConfirmation}
                            outlineColor={isNewPasswordConfirmationValid === null || isNewPasswordConfirmationValid ? 'gray' : 'red'}
                            mode='outlined'
                            onChange={newPasswordConfirmationChange}
                            right={<TextInput.Icon icon={hideNewPasswordConfirmation ? "eye-off" : "eye"}
                                                   onPress={hideNewPasswordConfirmationChange}/>}
                            secureTextEntry={hideNewPasswordConfirmation}
                        />
                        {isNewPasswordConfirmationValid !== null && !isNewPasswordConfirmationValid &&
                            <Text style={styles.invalidInput}>A nova senha deve conter 8 caracteres</Text>}
                        {isNewPasswordConfirmationEqualsValid !== null && !isNewPasswordConfirmationEqualsValid &&
                            <Text style={styles.invalidInput}>Confirmação de nova senha inválida.</Text>}

                        <Button
                            disabled={currentPassword === '' || !isNewPasswordValid || !isNewPasswordConfirmationValid}
                            style={{marginVertical: 10}}
                            icon="square-edit-outline"
                            mode="contained"
                            onPress={updatePassword}
                            loading={isLoadingPasswordChange}>
                            Alterar Senha
                        </Button>

                    </View>
                </Card>

                {/*<SafeAreaProvider>*/}
                {/*    <AppBar />*/}
                {/*</SafeAreaProvider>*/}

            </View>
        </ScrollView>
    );

}

export default Profile;
