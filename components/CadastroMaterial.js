import { StatusBar } from 'expo-status-bar';
import React from 'react';
import config from "../config";
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView, Alert } from 'react-native';
import {
    useFonts,
    Comfortaa_300Light,
    Comfortaa_400Regular,
    Comfortaa_500Medium,
    Comfortaa_600SemiBold,
    Comfortaa_700Bold,
} from '@expo-google-fonts/comfortaa';
import { useNavigation } from '@react-navigation/native';
import {getRecipeCost, makeCostsUpdateRequest} from "./ApiUtils";


const CadastroMaterial = () => {

    const navigation = useNavigation();
    const [materialValue, setMaterialValue] = React.useState('R$0,00');

    let [fontsLoaded] = useFonts({
        Comfortaa_300Light,
        Comfortaa_400Regular,
        Comfortaa_500Medium,
        Comfortaa_600SemiBold,
        Comfortaa_700Bold,
    });

    const [material, setMaterial] = React.useState({
        nome: '',
        quantidade: '',
        valor: '',
        observacoes: '',
    });

    const handleAdd = async () => {
        const recipeId = localStorage.getItem("recipeId");

        if (material.nome == '' || material.quantidade == '' || material.valor == '') {
            Alert.alert('Por favor', 'Informe os dados do material ')
        } else {
            const newMaterial = {...material, valor: materialValue, recipeId};
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMaterial),
            };
            setMaterial({
                nome: '',
                quantidade: '',
                valor: '',
                observacoes: '',
            });

            const response = await fetch(config.materialsUrl, requestOptions);

            if (response.ok) {
                const userDataString  = localStorage.getItem("@USER_DATA");
                const userData = JSON.parse(userDataString);
                const userId = userData.id;
                console.log(userId)
                await updateMaterialCost(recipeId, userId);
            } else {
                console.error('Erro ao adicionar material:', response.status, response.statusText);
            }
        }
    };

    const updateMaterialCost = async (recipeId, userId) => {
        const matchingCosts = await getRecipeCost(parseInt(userId, 10), parseInt(recipeId, 10));
        const matchingCost = matchingCosts[0];
        const costMaterialDb = matchingCost.totalMaterialCost;

        const formattedMaterialValue = materialValue.replace(/^R\$ /, '')
        const materialCost =  parseInt(formattedMaterialValue) * parseInt(material.quantidade);
        const totalMaterialCost = parseInt(costMaterialDb) + materialCost;

        const newTotalCost = parseInt(matchingCost.totalCost) + materialCost

        const updatedCostData = {
            ...matchingCost,
            totalMaterialCost: totalMaterialCost,
            totalCost: newTotalCost,
        };

        await makeCostsUpdateRequest(matchingCost.id, updatedCostData)
    };

    const handleInputChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');

        const formattedValue = numericValue.replace(
            /(\d)(?=(\d{2})+(?!\d))/g,
            '$1.'
        );

        setMaterialValue(`R$ ${formattedValue}`);
    };

    const handleSave = () => {
        console.log('Salvo');
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={[styles.headerText, { marginTop: 10 }]}>
                    Materiais
                </Text>
                <View style={styles.box1}>
                    <View style={styles.box2}>
                        <TextInput
                            maxLength={40}
                            value={material.nome}
                            style={styles.input}
                            placeholder='Nome do material'
                            onChangeText={(text) => setMaterial({ ...material, nome: text })}
                        />
                        <TextInput
                            keyboardType='numeric'
                            maxLength={40}
                            value={material.quantidade}
                            style={styles.input}
                            placeholder='Quantidade'
                            onChangeText={(text) => setMaterial({ ...material, quantidade: text })}
                        />
                        <TextInput
                            keyboardType='numeric'
                            maxLength={40}
                            value={material.valor}
                            style={styles.input}
                            placeholder='Valor'
                            onChangeText={(text) => {
                                setMaterial({ ...material, valor: text })
                                handleInputChange(text)
                            }}
                        />
                        <TextInput
                            maxLength={40}
                            value={material.observacoes}
                            style={styles.input}
                            placeholder='Notas e observações'
                            onChangeText={(text) => setMaterial({ ...material, observacoes: text })}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.buttonSave} onPress={handleAdd} >
                            <Text style={styles.saveText}>
                                Salvar
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <StatusBar style="auto" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
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
    saveText: {
        fontFamily: 'Comfortaa_600SemiBold',
        fontSize: 15,
        textAlign: 'center',
        margin: '0px',
        paddingTop: '5px',
        fontWeight: '500',
        color: 'white',
    },
    input: {
        fontFamily: 'Comfortaa_300Light',
        backgroundColor: 'white',
        borderColor: '#64CCC5',
        borderWidth: 1,
        borderRadius: 5,
        width: 274,
        height: 38,
        marginBottom: 10,
        marginTop: 8,
    },

    savedMaterialLabel: {
        fontWeight: 'bold',
        fontSize: '18px',
    },
    savedMaterialTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: 5,
        backgroundColor: '#D3D3D3',
    },
    savedMaterialText: {
        marginBottom: 10,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    savedMaterialContainer: {
        backgroundColor: '#e9e9e9'
    }
});


export default CadastroMaterial;
