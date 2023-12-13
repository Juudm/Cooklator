import React from 'react';
import RecipesList from "../components/RecipesList";

const FinishedRecipes = () => {
    return <RecipesList isConcluded={true} hideOptions={true}/>;
};

export default FinishedRecipes;