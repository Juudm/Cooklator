import React from 'react';
import RecipesList from "../components/RecipesList";
import route from "../navigations/Route";
import {useRoute} from "@react-navigation/native";

const RecipesInProgress = () => {
    const route = useRoute();
    const user = route.params?.user;
    return <RecipesList isConcluded={false} hideOptions={false}/>;
};

export default RecipesInProgress;
