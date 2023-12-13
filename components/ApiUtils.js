import config from '../config';
import axios from "axios";

const recipeApiUrl = config.recipeApiUrl;
const costsApiUrl = config.costsApiUrl;

export const makeCostsUpdateRequest = async (id, updatedData) => {
    try {
        const editUrl = `${costsApiUrl}/${id}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        };

        const response = await fetch(editUrl, requestOptions);

        if (response.status !== 201 && response.status !== 200) {
            console.error('Request failed:', response.data);
        }
    } catch (error) {
        console.error('Error making request:', error);
    }
};
export const getRecipeCost = async (recipeUserId, recipeId) => {
    try {
        const response = await axios.get(`${costsApiUrl}`);
        console.log(response.data)
        return  response.data.filter(cost =>
            cost.userId === recipeUserId && cost.recipeId === recipeId
        );
    } catch (error) {
        console.error('Error making request:', error);
    }
};

export const createCost = async (newCost) => {
    try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCost),
            };

        return await fetch(costsApiUrl, requestOptions);

    } catch (error) {
        console.error('Error making request:', error);
    }
};

