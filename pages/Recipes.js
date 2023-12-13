import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {MD2Colors, Text} from 'react-native-paper';
import {useFocusEffect, useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import LogoCooklator from "../components/LogoCooklator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Recipes = () => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [user, setUser] = useState(null);

    const fetchUserFromLocalStorage = useCallback(async () => {
        try {
            const userDataString = await AsyncStorage.getItem('@USER_DATA');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                setUser(userData);
                console.log(user)
            }
        } catch (error) {
            console.error('Erro ao buscar usuário do localStorage:', error);
        }
    }, []);

    useEffect(() => {
        fetchUserFromLocalStorage();
    }, [isFocused]);

    if (!user) {
        return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Bem vindo(a), {user.name} </Text>
            <LogoCooklator width={350} height={200} isWithSubtitle={true} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => navigation.navigate('RecipesInProgress', { user: user.id })}
                >
                    <Text style={styles.buttonText}>PROJETOS EM ANDAMENTO</Text>
                </TouchableOpacity>

                <View style={styles.buttonSpacer}/>

                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => navigation.navigate('FinishedRecipes', { user: user.id })}
                >
                    <Text style={styles.buttonText}>PROJETOS FINALIZADOS</Text>
                </TouchableOpacity>

                <View style={styles.buttonSpacer}/>

                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => navigation.navigate('CadastrarReceita', { user: user })}
                >
                    <Text style={styles.buttonText}>CADASTRAR NOVA RECEITA</Text>
                </TouchableOpacity>

                <View style={styles.buttonSpacer}/>

                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => navigation.navigate('Profile', { user : user })}
                >
                    <Text style={styles.buttonText}>PERFIL</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 200,
        backgroundColor: '#fff'
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    buttonContainer: {
        width: '80%',
        paddingHorizontal: 16,
    },
    buttonSpacer: {
        height: 16,
    },
    customButton: {
        width: '90%',
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#176B87',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        letterSpacing: 2,
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: "bold",
        paddingTop: 7
    },
    welcomeText: {
        color: '#64CCC5',
        letterSpacing: 2,
        justifyContent: 'center',
        fontSize: 25,
        fontWeight: "700",
        paddingTop: 7
    },
    logoImage: {
        width: 350,
        height: 200,
        resizeMode: 'contain',
    },
});

export default Recipes;
