import React, {useState, useEffect, useContext} from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import CardRecipe from '../components/CardRecipe';
import config from '../config';
import {useNavigation, useRoute} from "@react-navigation/native";
import {getRecipeCost, makeCostsUpdateRequest} from "./ApiUtils";

const RecipesList = ({ isConcluded, hideOptions }) => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const recipeApiUrl = config.recipeApiUrl;
    const navigation = useNavigation();
    const route = useRoute();
    const user = route.params?.user;

    const handleCardPress = (recipe, hideOptions) => {
        navigation.navigate('OptionsTabs', { recipe, hideOptions });
    };

    useEffect(() => {
        if (user) {
            const userRecipeApiUrl = `${recipeApiUrl}`;
            fetch(userRecipeApiUrl)
                .then((response) => response.json())
                .then((data) => {
                    const userRecipes = data.filter(recipe => user && recipe.userId === user);
                    setRecipes(userRecipes);
                })
                .catch((error) => console.error('Erro ao buscar as receitas:', error));
        }
    }, [user]);

    useEffect(() => {
        const filtered = recipes.filter((recipe) => recipe.isConcluded === isConcluded);
        setFilteredRecipes(filtered);
    }, [recipes, isConcluded]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {filteredRecipes.map((recipe) => (
                <TouchableRipple key={recipe.id} onPress={() => handleCardPress(recipe, hideOptions)}>
                    <CardRecipe
                        key={recipe.id}
                        recipeName={recipe.name}
                        recipeColor={recipe.color}
                        recipeId={recipe.id}
                        setRecipes={setRecipes}
                        hideOptions={hideOptions}
                        time={recipe.preparationTime || 'Sem timer rodado'}
                        totalCost={recipe.totalCost}
                    />
                </TouchableRipple>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
});

export default RecipesList;
