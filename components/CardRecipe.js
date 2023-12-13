import React, { useState, useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, Card, Menu, Paragraph, Title, useTheme } from 'react-native-paper';
import ModalWarning from "./ModalWarning";
import config from "../config";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const recipeApiUrl = config.recipeApiUrl;

const CardRecipe = ({ recipeName, recipeColor, recipeId, setRecipes, hideOptions,
    time, totalCost }) => {

    const [visible, setVisible] = useState({});
    const { isV3 } = useTheme();
    const [modalVisibleConfirmRemove, setModalVisibleConfirmRemove] = useState(false);
    const [modalMessageConfirmRemove, setModalMessageConfirmRemove] = useState('');
    const [modalVisibleConfirmFinish, setModalVisibleConfirmFinish] = useState(false);
    const [modalMessageConfirmFinish, setModalMessageConfirmFinish] = useState('');
    const [count, setCount] = useState(0);
    const navigation = useNavigation();

    const handleNavigateToOptions = () => {
        navigation.navigate('OptionsTabs');
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(config.materialsUrl);
            const data = await response.json();
            const filteredMaterials = data.filter(material => material.recipeId === recipeId || Number(material.recipeId) === recipeId);
            const count = filteredMaterials.length;
            setCount(count);
          } catch (error) {
            console.error('Erro ao buscar as receitas:', error);
          }
        };
    
        fetchData();
    
      }, []); 

    const showModal = (message, type) => {
        if (type === "exclude") {
            setModalVisibleConfirmRemove(true);
            setModalMessageConfirmRemove(message);
        } else if (type === "finish") {
            setModalVisibleConfirmFinish(true);
            setModalMessageConfirmFinish(message);
        }
    };

    const hideModal = (type) => {
        if (type === "exclude") {
            setModalVisibleConfirmRemove(false);
            setModalMessageConfirmRemove('');
        } else if (type === "finish") {
            setModalVisibleConfirmFinish(false);
            setModalMessageConfirmFinish('');
        }
    };

    const _toggleMenu = (name) => () => {
        setVisible({ ...visible, [name]: !visible[name] });
    };

    const removeRecipe = async (recipeId) => {

        try {
            const response = await deleteRecipe(recipeId);
            if (response.status === 201 || response.status === 200) {
                setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== recipeId));
            }

        } catch
        (error) {
            console.error('Erro:', error);
        }
    }

    const _getVisible = (name) => !!visible[name];

    const handleConfirmDeleteRecipe = () => {
        showModal('Tem cereteza que deseja excluir esta receita?', 'exclude')
    };

    function deleteRecipe(recipeId) {

        const deleteUrl = recipeApiUrl + '/' + recipeId;

        const requestOptions = {
            method: 'DELETE',
        };

        return fetch(deleteUrl, requestOptions);
    }

    const finishRecipe = async (recipeId) => {
        try {
            const originalRecipe = await getRecipe(recipeId);

            const updatedRecipeData = {
                ...originalRecipe,
                isConcluded: true,
            };

            const response = await updateRecipe(recipeId, updatedRecipeData);
            if (response.status === 201 || response.status === 200) {
                setRecipes((prevRecipes) => prevRecipes.map(recipe =>
                    recipe.id === recipeId ? { ...recipe, ...updatedRecipeData } : recipe
                ));
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    const handleConfirmRecipeFinalization = () => {
        showModal('Tem certeza que deseja finalizar esta receita?', 'finish')
    };

    const getTotalCost = (totalCost) => {
        const recipeCost = parseFloat(totalCost)
        if (recipeCost !== null && recipeCost !== undefined) {
            return recipeCost.toFixed(2);
        } else {
            return '0.00';
        }
    };

    const getRecipe = async (recipeId) => {
        try {
            const response = await fetch(`${recipeApiUrl}/${recipeId}`);
            const data = await response.json();

            if (response.status === 200) {
                return data;
            } else {
                console.error('Erro ao obter detalhes da receita:', data);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    function updateRecipe(recipeId, updatedRecipeData) {
        const editUrl = recipeApiUrl + '/' + recipeId;

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipeData),
        };

        return fetch(editUrl, requestOptions);
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Card.Cover style={{ ...styles.cardCover, backgroundColor: recipeColor }} />
                <Card.Content>
                    <View style={styles.cardContent}>
                        <View>
                            <Title style={styles.titleText}>{recipeName}</Title>
                            <Paragraph style={styles.titleContent}>
                                <View style={styles.iconContainer}>
                                    <Icon name="timer-outline" size={20} color="gray" />
                                    <Text style={styles.textIcon}>Tempo: {time}</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <Icon name="fruit-watermelon" size={20} color="gray" />
                                    <Text style={styles.textIcon}>Materiais: {count}</Text>
                                </View>
                                <Icon name="chart-line" size={20} color="gray" />
                                <Text style={styles.textIcon}>R$ {getTotalCost(totalCost)}</Text>
                            </Paragraph>
                        </View>

                        <View style={styles.containerMenu}>
                            <Appbar.Header style={{ backgroundColor: 'transparent', width: 45 }}>
                                <Menu
                                    visible={_getVisible('menu1')}
                                    onDismiss={_toggleMenu('menu1')}
                                    anchor={
                                        <Appbar.Action
                                            icon={MORE_ICON}
                                            onPress={_toggleMenu('menu1')}
                                            {...(!isV3 && { color: 'white' })}
                                        />
                                    }
                                >
                                    {!hideOptions && (
                                        <Menu.Item
                                            onPress={() => handleConfirmRecipeFinalization(recipeId)}
                                            title="Finalizar Projeto" />
                                    )}
                                    {!hideOptions && (
                                        <Menu.Item onPress={() => {
                                        }} title="Editar" />
                                    )}
                                    <Menu.Item onPress={() => handleConfirmDeleteRecipe(recipeId)}
                                        title="Remover" />
                                </Menu>
                            </Appbar.Header>
                        </View>
                    </View>
                </Card.Content>
            </Card>
            <ModalWarning
                visible={modalVisibleConfirmRemove}
                message={modalMessageConfirmRemove}
                onPrimaryButtonPress={() => hideModal('exclude')}
                primaryButtonLabel={'Cancelar'}
                onSecondaryButtonPress={() => removeRecipe(recipeId)}
                secondaryButtonLabel="Sim"
            />
            <ModalWarning
                visible={modalVisibleConfirmFinish}
                message={modalMessageConfirmFinish}
                onPrimaryButtonPress={() => hideModal('finish')}
                primaryButtonLabel={'Cancelar'}
                onSecondaryButtonPress={() => finishRecipe(recipeId)}
                secondaryButtonLabel="Sim"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {},
    card: {
        marginBottom: 16,
        height: 200,
        marginTop: 10,
    },
    cardCover: {
        height: 70,
    },
    titleText: {
        fontSize: 25,
        marginTop: 20
    },
    titleContent: {
        fontSize: 15,
        marginTop: 30
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    list: {
        marginTop: 48,
    },
    md3Divider: {
        marginVertical: 8,
    },
    containerMenu: {
        paddingRight: 40,
        marginRight: 30,
        alignItems: 'flex-end',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
    },
    textIcon: {
        marginLeft: 5,
    }
});

export default CardRecipe;
