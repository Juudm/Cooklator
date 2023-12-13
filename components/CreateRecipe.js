import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Card, Checkbox} from 'react-native-paper';
import ModalWarning from './ModalWarning';
import ColorPicker from "./ColorPicker";
import config from "../config";
import {createCost} from "./ApiUtils";

const recipeApiUrl = config.recipeApiUrl;

const CreateRecipe = () => {

    const [textTitle, setTextTitle] = useState('');
    const [textObs, setTextObs] = useState('');
    const [hourValue, setHourValue] = useState('R$ 0.00');
    const hourValueChange = parseFloat(hourValue.replace('R$', '').trim());
    const [checked, setChecked] = useState(false);
    const navigation = useNavigation();
    const [nameError, setNameError] = useState('');
    const [hourValueError, setHourValueError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [selectedColor, setSelectedColor] = useState('#176B87');
    const route = useRoute();
    const user = route.params?.user;
    const applyToAllProjects = user?.applyToAllProjects || false;


    const handleNavigateToRecipesPage = () => {
        navigation.navigate('Recipes');
    };

    const getCurrentDate = () => {
        const currentDate = new Date();
        return currentDate.toISOString();
    };

    const handleAddRecipe = async () => {
        try {
            let isValid = true;
            setNameError('')
            setHourValueError('')

            if (textTitle.trim() === '') {
                setNameError('O nome da receita é obrigatório');
                isValid = false;
            }

            if (hourValueChange <= 0 && checked === false && !applyToAllProjects) {
                setHourValueError('Insira um valor ou marque o valor padrão');
                isValid = false;
            }

            if (isValid) {

                const chosenHourValue = checked || user.applyToAllProjects ? user.hourValue : hourValueChange;

                const newRecipe = {
                    name: textTitle,
                    hourValue: chosenHourValue,
                    appliesDefaultValue: checked,
                    comments: textObs,
                    color: selectedColor,
                    preparationTime: '',
                    startDate: getCurrentDate(),
                    isConcluded: false,
                    userId: user.id,
                    totalCost: 0
                };

                const responseRecipe  = await addRecipe(newRecipe);

                if (responseRecipe.status !== 201 && responseRecipe.status !== 200) {
                    console.error('Erro ao adicionar receita:', responseRecipe);
                    return;
                }

                    const recipeData = await responseRecipe.json();
                    const newCost = {
                        userId: user.id,
                        recipeId: recipeData.id,
                        totalMaterialCost: 0,
                        totalTimeValue: 0,
                        totalCost: 0,
                    };

                const responseCost = await createCost(newCost);

                if (responseCost.status !== 201 && responseCost.status !== 200) {
                    console.error('Erro ao criar custo:', responseCost);
                } else {
                    showModal('Receita adicionada com sucesso! Deseja cadastrar outra?');
                }
            }
        } catch
            (error) {
            console.error('Erro:', error);
        }
    };

    function addRecipe(newRecipe) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecipe),
        };

        return fetch(recipeApiUrl, requestOptions);
    }

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
        setModalMessage('');
    };

    const handleResetForm = () => {
        hideModal()

        setTextTitle("")
        setTextObs("")
        setHourValue('R$ 0.00')
        setChecked(false)
        setSelectedColor('#176B87')
        setNameError('');
        setHourValueError('');
    };

    const handleInputChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');

        const formattedValue = numericValue.replace(
            /(\d)(?=(\d{2})+(?!\d))/g,
            '$1.'
        );

        setHourValue(`R$ ${formattedValue}`);
    };

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <View style={styles.headerView}>
                            <Text style={styles.headerText}> Cadastrar Receita</Text>
                        </View>

                        <View style={styles.line}></View>
                        <Card style={styles.card} elevation={3}>
                            <TextInput
                                style={styles.input}
                                value={textTitle}
                                onChangeText={setTextTitle}
                                placeholder="Nome da receita"
                                keyboardType="default"
                                placeholderTextColor="#606b6a"
                            />
                            <Text style={styles.errorMessageName}>{nameError}</Text>

                            <TextInput
                                style={styles.inputObs}
                                value={textObs}
                                onChangeText={setTextObs}
                                placeholder="Observações"
                                keyboardType="default"
                                placeholderTextColor="#606b6a"

                            />
                            {!applyToAllProjects && (
                            <View style={styles.viewButtons}>
                                <View style={styles.viewValue}>
                                    <Text style={styles.textHourValue}> Valor da hora:</Text>
                                    <TextInput
                                        style={styles.inputValor}
                                        value={hourValue}
                                        onChangeText={handleInputChange}
                                        placeholder="R$ 0,00"
                                        keyboardType="numeric"
                                        placeholderTextColor="grey"
                                    />

                                </View>
                            </View>
                            )}
                            {!applyToAllProjects && (
                                <View style={styles.checkboxContainer}>
                                    <Checkbox.Android
                                        status={checked ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setChecked(!checked);
                                        }}
                                    />
                                    <Text style={styles.checkboxText}>Aplicar o valor cadastrado no Perfil</Text>
                                </View>
                            )}
                            <Text style={styles.errorMessageObs}>{hourValueError}</Text>
                        </Card>

                        <Card style={[styles.card, {minHeight: 10}]} elevation={3}>
                            <View style={styles.viewColors}>
                                <ColorPicker onColorSelect={handleColorSelect}/>
                            </View>
                        </Card>

                        <View style={styles.viewButtons}>
                            <View>
                                <TouchableHighlight
                                    style={[styles.buttonSave, {marginRight: 150, marginLeft: 30}]}
                                    onPress={handleNavigateToRecipesPage}
                                    underlayColor="#176B87"
                                >
                                    <Text style={styles.textStyle}>Cancelar</Text>
                                </TouchableHighlight>
                            </View>
                            <View>
                                <TouchableHighlight
                                    style={styles.buttonSave}
                                    onPress={handleAddRecipe}
                                    underlayColor="#176B87"
                                >
                                    <Text style={styles.textStyle}>Salvar</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <ModalWarning visible={modalVisible} message={modalMessage}
                                      onPrimaryButtonPress={handleResetForm}
                                      primaryButtonLabel={'Sim'}
                                      onSecondaryButtonPress={handleNavigateToRecipesPage}
                                      secondaryButtonLabel={"Não"}/>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        flexGrow: 1,
    },
    container: {
        width: 400,
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#C1C4C7',
        marginBottom: 10,
        alignSelf: 'stretch',
    },
    headerText: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    headerView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
    },
    input: {
        width: '90%',
        height: 40,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        borderRadius: 10,
        margin: 12,
        marginLeft: 20,
        padding: 10,
        backgroundColor: 'white'
    },
    inputObs: {
        width: '90%',
        height: 100,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        borderRadius: 10,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 5,
        padding: 10,
        backgroundColor: 'white'
    },
    inputValor: {
        width: 100,
        height: 40,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        borderRadius: 10,
        marginLeft: 20,
        padding: 10,
        backgroundColor: 'white'
    },
    errorMessageName: {
        color: 'red',
        marginLeft: 20,
    },
    errorMessageObs: {
        width: 300,
        height: 20,
        color: 'red',
        marginLeft: 30,
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
    textStyle: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        paddingTop: 7,
        color: 'white'
    },
    buttonSave: {
        width: 100,
        height: 40,
        backgroundColor: '#64CCC5',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    textStylePlus: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    viewButtons: {
        width: 220,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    textMaterialTitle: {
        fontSize: 20,
        marginBottom: 15,
        marginLeft: 20,
        marginTop: 12,
        fontWeight: '600',
    },
    textHourValue: {
        width: 100,
        textAlign: 'center',
        fontSize: 15,
        marginLeft: 20,
        fontWeight: '600',
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginLeft: 20,
    },
    viewValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        paddingTop: 7,
    },
    viewColors: {
        paddingBottom: 10
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
    viewMaterial: {
        width: 220,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    }
});

export default CreateRecipe;
