import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import CadastroMaterial from "./components/CadastroMaterial";
import CreateRecipe from "./components/CreateRecipe";
import FloatingMenu from "./components/FloatingMenu";
import RecipesInProgress from "./pages/RecipesInProgress";
import CardRecipe from "./components/CardRecipe";
import {MD2Colors, PaperProvider} from "react-native-paper";
import Recipes from "./pages/Recipes";
import OptionsTabs from "./components/OptionTabs";
import Profile from "./components/Profile";
import LogoCooklator from "./components/LogoCooklator";
import FinishedRecipes from "./pages/FinishedRecipes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AppStack = createStackNavigator();

const App = () => {

    const [user, setUser] = useState(null);
    const [isLogado, setIsLogado] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const updateUser = async () => {
        try {
        const userData  = await AsyncStorage.getItem('@USER_DATA');
        const user = userData ? JSON.parse(userData) : null;
        setUser(user);

        setIsLogado(user !== null && user !== undefined);
        } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        updateUser();
    }, []);

    const loginComponent = () => <Login updateUser={updateUser} />;
    const initialRouteName = isLoading ? "Login" : (isLogado ? "Recipes" : "Login");

    if (isLoading) {
        return (
            <ActivityIndicator animating={true} color={MD2Colors.red800}/>
        );
    }
    return (
        <PaperProvider>
            <NavigationContainer>
                <View style={styles.container}>

                    <View style={styles.containerNavigator}>
                        <AppStack.Navigator initialRouteName={initialRouteName}>
                            <AppStack.Screen name="Login" component={loginComponent}
                                             options={{
                                                 headerStyle: {
                                                     backgroundColor: "#DAFFFB",
                                                     shadowOpacity: 0,
                                                     elevation: 0,
                                                 },
                                                 headerTitleStyle: {
                                                     color: "#04364A",
                                                     fontSize: 24,
                                                 },
                                             }}
                            />
                            <AppStack.Screen name="Register" component={Register}
                                             options={{
                                                 headerStyle: {
                                                     backgroundColor: "#DAFFFB",
                                                     shadowOpacity: 0,
                                                     elevation: 0,
                                                 },
                                                 headerTitleStyle: {
                                                     color: "#04364A",
                                                     fontSize: 24,
                                                 },
                                             }}
                            />
                            <AppStack.Screen name="Recipes" component={Recipes}
                                             options={({ route }) => ({
                                                 title: "Receitas",
                                                 headerStyle: {
                                                     backgroundColor: "#DAFFFB",
                                                     shadowOpacity: 0,
                                                     elevation: 0,
                                                 },
                                                 headerTitleStyle: {
                                                     color: "#04364A",
                                                     fontSize: 24,
                                                 },
                                                 headerLeft: () => {
                                                     return isLogado ? null : (
                                                         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                                             <Icon name="arrow-left" size={24} color="#04364A" />
                                                         </TouchableOpacity>
                                                     );
                                                 },
                                             })}
                            />
                            <AppStack.Screen
                                name="CadastrarReceita"
                                component={CreateRecipe}
                                options={{
                                    title: "Cadastrar Receita",
                                    headerStyle: {
                                        backgroundColor: "#64CCC5",
                                        shadowOpacity: 0,
                                        elevation: 0,
                                    },
                                    headerTitleStyle: {color: "white"},
                                    presentation: {
                                        color: "#64CCC5"
                                    },
                                    headerRight: () => (
                                        <View style={styles.headerRight}>
                                            <LogoCooklator width={100} height={30} isWithSubtitle={false}/>
                                        </View>
                                    ),
                                }}
                            />
                            <AppStack.Screen
                                name="RecipesInProgress"
                                component={RecipesInProgress}
                                options={{
                                    title: "Projetos em Andamento",
                                    headerStyle: {
                                        backgroundColor: "#64CCC5",
                                        shadowOpacity: 0,
                                        elevation: 0,
                                    },
                                    headerTitleStyle: {color: "white"},
                                    headerRight: () => (
                                        <View style={styles.headerRight}>
                                            <LogoCooklator width={100} height={30} isWithSubtitle={false}/>
                                        </View>
                                    ),
                                }}
                            />
                            <AppStack.Screen
                                name="CadastroMaterial"
                                component={CadastroMaterial}
                                options={{
                                    title: "Cadastrar Material",
                                    headerStyle: {
                                        backgroundColor: "#64CCC5",
                                        shadowOpacity: 0,
                                        elevation: 0,
                                    },
                                    headerTitleStyle: {color: "white"},
                                }}
                            />
                            <AppStack.Screen
                                name="MenuFlutuante"
                                component={FloatingMenu}
                            />
                            <AppStack.Screen name="CardRecipe" component={CardRecipe}/>
                            <AppStack.Screen
                                name="OptionsTabs"
                                component={OptionsTabs}
                                options={{
                                    title: "Continuar Receita",
                                    headerStyle: {
                                        backgroundColor: "#176B87",
                                        shadowOpacity: 0,
                                        elevation: 0,
                                    },
                                    headerTitleStyle: {color: "white"},
                                }}/>
                            <AppStack.Screen
                                name="Profile"
                                component={Profile}
                                options={{
                                    title: "Perfil",
                                    headerStyle: {
                                        backgroundColor: "#176B87",
                                        shadowOpacity: 0,
                                        elevation: 0,
                                    },
                                    headerTitleStyle: {color: "white"},
                                }}
                            />
                            <AppStack.Screen
                                name="FinishedRecipes"
                                component={FinishedRecipes}
                                options={{
                                    title: "Receitas Finalizadas",
                                    headerStyle: {
                                        backgroundColor: "#176B87",
                                        shadowOpacity: 0,
                                        elevation: 0,
                                    },
                                    headerTitleStyle: {color: "white"},
                                    headerRight: () => (
                                        <View style={styles.headerRight}>
                                            <LogoCooklator width={100} height={30} isWithSubtitle={false}/>
                                        </View>
                                    ),
                                }}
                            />
                        </AppStack.Navigator>
                    </View>
                    {isLogado && (
                        <View style={styles.floatingMenu}>
                            <FloatingMenu userProfile={user}/>
                        </View>
                    )}
                </View>

            </NavigationContainer>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerNavigator: {
        flex: 1,

    },
    floatingMenu: {
        alignSelf: "flex-end"
    },
    headerRight: {
        marginRight: 15
    }
});
export default App;
