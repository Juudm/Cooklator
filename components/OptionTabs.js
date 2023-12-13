import * as React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Timer from "./Timer";
import { Card } from 'react-native-paper';
import CardValues from "./CardValues";
import config from "../config";
import { useState, useEffect } from "react";
import ModalWarning from "./ModalWarning";
import ModalWithInput from "./ModalWithInput";

const costsApiUrl = config.costsApiUrl;
const recipeApiUrl = config.recipeApiUrl;

const OptionsTabs = ({ route }) => {
    const [value, setValue] = React.useState('timer');
    const [suggestedPrice, setSuggestedPrice] = useState(0.00);
    const [totalMaterial, setTotalMaterial] = useState(0.00);
    const [totalValueHour, setTotalValueHour] = useState(0.00);
    const [recipeDate, setRecipeDate] = useState(0.00);
    const { recipe, hideOptions } = route.params;
    const [materialsArray, setMaterialsArray] = useState([]);
    const [recipeData, setRecipe] = useState(recipe);
    const [modalVisibleConfirmEdition, setModalVisibleConfirmEdition] = useState(false);
    const [modalMessageConfirmEdition, setModalMessageConfirmEdition] = useState('');
    const [modalVisibleEdition, setModalVisibleEdition] = useState(false);
    const [modalMessageEdition, setModalMessageEdition] = useState('');
    const [inputValue, setInputValue] = useState('');
    const navigation = useNavigation();


    const showModal = (message, typeModal) => {
        if (typeModal === "confirm") {
            setModalVisibleConfirmEdition(true);
            setModalMessageConfirmEdition(message);
        } else if (typeModal === "edit") {
            setModalVisibleEdition(true);
            setModalMessageEdition(message);
        }
    };

    const hideModal = (typeModal) => {
        if (typeModal === "confirm") {
            setModalVisibleConfirmEdition(false);
            setModalMessageConfirmEdition('');
        } else if (typeModal === "edit") {
            setModalVisibleEdition(false);
            setModalMessageEdition('');
        }

    };

    const handleConfirmCommentEdition = async () => {
        showModal('Deseja editar o comentário desta receita?', 'confirm')
    };

    const handleInputCommentEdition = async () => {
        showModal('Insira seu novo comentário?', 'edit')
    };

    const buttonStyle = (buttonValue) => {
        return {
            ...styles.button,
            backgroundColor: value === buttonValue ? '#64CCC5' : '#DAFFFB',
            borderColor: '#c4cfce',
        };
    };

    const getRecipeDate = async (recipe) => {
        return recipe.startDate ? recipe.startDate : "10/10/2023";
    }

    const fetchData = async () => {
        const fetchCostsByField = async (recipeId, field, defaultValue) => {
            try {
                const response = await fetch(`${costsApiUrl}`);
                const data = await response.json();

                if (response.status === 200) {
                    const matchingCost = data.find(cost => cost.recipeId === recipeId);
                    return matchingCost ? matchingCost[field] : defaultValue;
                } else {
                    console.error('Erro ao obter lista de custos', data);
                    return defaultValue;
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                return defaultValue;
            }
        };

        try {
            const [suggestedPriceData, totalMaterialData, totalValueHourData, starDateData] = await Promise.all([
                fetchCostsByField(recipe.id, 'totalCost', 0),
                fetchCostsByField(recipe.id, 'totalMaterialCost', 0),
                fetchCostsByField(recipe.id, 'totalTimeValue', 0),
                getRecipeDate(recipe),
            ]);

            setSuggestedPrice(suggestedPriceData);
            setTotalMaterial(totalMaterialData);
            setTotalValueHour(totalValueHourData);
            setRecipeDate(starDateData);
        } catch (error) {
            console.error('Erro ao obter dados:', error);
        }
    };

    useEffect(() => {
        if (value === 'values') {
            fetchData();
        }
    }, [value, recipe.id]);

    const formatarData = (dataString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const data = new Date(dataString);

        return data.toLocaleDateString('pt-BR', options).replace(/\//g, '/');
    }

    const getRecipeObs = () => {
        return recipeData.comments;
    }

    const labelStyle = () => {
        return {
            fontSize: 14,
            fontWeight: 'bold',
        };
    };

    const updateRecipe = async (recipeId, newCommets) => {
        try {
            const updatedRecipeData = {
                ...recipe,
                comments: newCommets,
            };

            const response = await makeRecipeUpdateRequest(recipeId, updatedRecipeData);

            if (response.status === 201 || response.status === 200) {
                setRecipe(updatedRecipeData)
                hideModal('edit');
                hideModal('confirm');
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    }

    const handleNavigateToMaterial = () => {
        localStorage.setItem("recipeId", recipe.id);
        navigation.navigate('CadastroMaterial');
    };
    useEffect(() => {
        const loadData = async () => {
            fetch(config.materialsUrl)
            .then((response) => response.json())
            .then((data) => {
                const filteredMaterials = data.filter(material => material.recipeId === recipe.id ||  Number(material.recipeId) === recipe.id);
                setMaterialsArray(filteredMaterials);
            })
            .catch((error) => console.error('Erro ao buscar as receitas:', error));
        };
    
        loadData();
    
      }, []); 

    function makeRecipeUpdateRequest(recipeId, updatedRecipeData) {
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
            <View style={styles.viewRecipeTitle}>
                <Text style={styles.title}>{recipe.name}</Text>
            </View>
            <SegmentedButtons
                value={value}
                onValueChange={setValue}
                buttons={[
                    {
                        value: 'timer',
                        label: 'Timer',
                        style: buttonStyle('timer'),
                        labelStyle: labelStyle('timer'),
                    },
                    {
                        value: 'materials',
                        label: 'Materiais',
                        style: buttonStyle('materials'),
                        labelStyle: labelStyle('timer'),
                    },
                    {
                        value: 'values',
                        label: 'Valores',
                        style: buttonStyle('values'),
                        labelStyle: labelStyle('timer'),
                    },
                    {
                        value: 'notes',
                        label: 'Notas',
                        style: buttonStyle('notes'),
                        labelStyle: labelStyle('timer'),
                    },
                ]}
                style={styles.group}
            />

            {!hideOptions && value === 'timer' && (
                <View style={styles.timeView}>
                    <Timer recipe={recipe} />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#9F6BA0" fill-opacity="1"
                            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </View>
            )}

            {hideOptions && value === 'timer' && (
                <View>
                    <CardValues
                        cardTitle={'Tempo de preparo:'} cardSubTitle={recipe.preparationTime} concatenateCurrency={false}
                        style={{ fontSize: 30 }}
                    />
                </View>
            )}

            {value === 'materials' && (
                <View>
                    <Card style={[styles.card, { minHeight: 10 }]} elevation={3}>
                        <View style={styles.viewMaterial}>
                            <Text style={styles.textMaterialTitle}>Materiais:</Text>
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={handleNavigateToMaterial}>
                                <Text style={styles.textStylePlus}>+</Text>
                            </Pressable>
                        </View>
                    </Card>
                    {value === 'materials' && materialsArray.map((material, index) => (
                        <Card key={index} style={[styles.card, { minHeight: 10 }]} elevation={3}>
                            <Text>{material.nome || material.name}</Text>
                            <Text>Valor: R${material.valor || material.price}</Text>
                            <Text>Quantidade: {material.quantidade || material.amount}</Text>
                        </Card>
                    ))}
                </View>

            )}
            {value === 'values' && (
                <View>
                    <Text style={styles.titleTopic}>Valores e precificação</Text>
                    <CardValues cardTitle={'Preço sugerido'} cardSubTitle={suggestedPrice} concatenateCurrency={true} />
                    <CardValues cardTitle={'Materiais'} cardSubTitle={totalMaterial} concatenateCurrency={true} />
                    <CardValues cardTitle={'Valor tempo de trabalho'} cardSubTitle={totalValueHour} concatenateCurrency={true} />
                </View>
            )}
            {value === 'notes' && (
                <View>
                    <Text style={styles.titleTopic}></Text>
                    <CardValues cardTitle={'Observações cadastradas:'} cardSubTitle={getRecipeObs()}
                        concatenateCurrency={false} subtitleFontSize={20}
                        showIcon={!hideOptions} onPressIcon={handleConfirmCommentEdition}
                        colorIcon="#04364A"
                        chosenIcon="lead-pencil" />
                    <CardValues cardTitle={'Data de registro da receita:'} cardSubTitle={formatarData(recipeDate)}
                        concatenateCurrency={false} />
                    <CardValues cardTitle={'Valor cadastrado por hora:'} cardSubTitle={recipe.hourValue}
                        concatenateCurrency={true} />
                </View>
            )}
            <ModalWarning
                visible={modalVisibleConfirmEdition}
                message={modalMessageConfirmEdition}
                onPrimaryButtonPress={() => handleInputCommentEdition()}
                primaryButtonLabel="Sim"
                onSecondaryButtonPress={() => hideModal('confirm')}
                secondaryButtonLabel={'Cancelar'}
            />
            <ModalWithInput
                visible={modalVisibleEdition}
                message="Insira o novo comentário: "
                inputValue={inputValue}
                onPrimaryButtonPress={(value) => {
                    updateRecipe(recipe.id, value)
                    setInputValue('');
                    hideModal('edit');
                    hideModal('confirm')
                }}
                primaryButtonLabel="Salvar"
                onSecondaryButtonPress={() => {
                    hideModal('edit')
                    hideModal('confirm');
                }}
                secondaryButtonLabel="Não salvar"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    containerScroll: {
        flexGrow: 1,
    },
    container: {
        marginVertical: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    titleTopic: {
        margin: 15,
        fontSize: 25,
        fontWeight: '400',
        textAlign: 'center',
    },
    titleTimer: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 15
    },
    button: {
        borderRadius: 20,
        elevation: 2,
    },
    buttonOpen: {
        width: 30,
        height: 30,
        backgroundColor: '#176B87',
        margin: 12,
        marginRight: 200,
        paddingLeft: 8,
    },
    group: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        paddingBottom: 8,
    },
    viewRecipeTitle: {
        flex: 1,
        width: 500,
        height: 400,
        marginTop: 25,
        marginBottom: 25,
        alignSelf: 'center'
    },
    timeView: {
        width: 400,
        height: 400,
        borderRadius: 10,
        backgroundColor: '#C880B7',
        alignSelf: 'center',
        marginTop: 100
    },
    card: {
        paddingBottom: 16,
        marginHorizontal: 8,
        width: '90%',
        minHeight: 150,
        alignSelf: 'center',
        backgroundColor: 'rgba(242, 250, 249, 0.9)',
        borderWidth: 1,
        borderColor: '#DAFFFB',
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
});

export default OptionsTabs;
