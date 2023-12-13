import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import config from "../config";
import axios from "axios";
import {getRecipeCost, makeCostsUpdateRequest} from './ApiUtils'


const recipeApiUrl = config.recipeApiUrl;
const costsApiUrl = config.costsApiUrl;

const Timer = ({ recipe }) => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [previousTimes, setPreviousTimes] = useState([]);

    const handleStart = () => {
        setIsActive(true);
    };

    const handleStop = () => {
        setIsActive(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(0);
    };

    function makeRecipeUpdateRequest(id, updatedRecipeData) {
        const editUrl = recipeApiUrl + '/' + id;

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipeData),
        };

        return fetch(editUrl, requestOptions);
    }

    const calculateSuggestedPrice = async (recipe, time) => {
        try {
            const matchingCosts = await getRecipeCost(recipe.userId, recipe.id);
            let timeRecipe;
            timeRecipe = time / 3600
            const newTimeValue = parseFloat(timeRecipe) * parseFloat(recipe.hourValue)

            const matchingCost = matchingCosts[0];
            const costDb = matchingCost.totalMaterialCost;
            const newTotalCost = costDb + newTimeValue;

            const updatedCostData = {
                ...matchingCost,
                totalTimeValue: newTimeValue.toFixed(2),
                totalCost: newTotalCost.toFixed(2),
            };

            const updatedRecipeData = {
                ...recipe,
                preparationTime: calculate(time),
                totalCost: newTotalCost.toFixed(2),
            };

            await makeRecipeUpdateRequest(recipe.id, updatedRecipeData);
            await makeCostsUpdateRequest(matchingCost.id, updatedCostData)

        } catch (error) {
            console.error('Erro ao buscar custo correspondente:', error);
        }
    }

    const handleSave = async () => {
        setPreviousTimes([...previousTimes, time]);
        console.log(calculate(time))

        await calculateSuggestedPrice(recipe, time);

        handleReset();
    };

    function calculate(time) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        const formattedHours = hours > 0 ? `${hours} Hora${hours > 1 ? 's' : ''}` : '';
        const formattedMinutes = minutes > 0 ? `${minutes} Minuto${minutes > 1 ? 's' : ''}` : '';
        const formattedSeconds = seconds > 0 ? `${seconds} Segundo${seconds > 1 ? 's' : ''}` : '';

        const timeSegments = [formattedHours, formattedMinutes, formattedSeconds].filter(Boolean);

        return timeSegments.join(' e ') || '0 Segundos';
    }

    useEffect(() => {
        let interval;

        if (isActive) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isActive]);

    return (
        <View style={styles.outerContainer}>
               <View style={styles.container}>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>Tempo decorrido: {calculate(time)}</Text>
                </View>
                {isActive ? (
                    <View style={styles.buttonContainer}>
                        <Button title="Parar" onPress={handleStop} />
                        <Button title="Finalizar" onPress={handleSave} />
                    </View>
                ) : (
                    <Button title="Começar" onPress={handleStart} />
                )}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    previousTimesTitle: {
        fontSize: 16,
        marginTop: 10,
    },
});


export default Timer;
