import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Recipes from '../pages/Recipes';

const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <Stack.Navigator initialRouteName="Recipes">
      <Stack.Screen
        name="Recipes"
        component={Recipes}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="******"
        component={Recipes}
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default Main;
