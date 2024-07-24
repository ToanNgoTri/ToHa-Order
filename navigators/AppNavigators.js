import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import ForCooking from '../screens/ForCooking'
import ForOdering from '../screens/ForOdering'
import Home from '../screens/Home'

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
          name="Home"
          component={Home}
          options={{animationEnabled: false, header: () => null}}
        />

        <Stack.Screen
          name="ForCooking"
          component={ForCooking}
          // options={{animationEnabled: false, header: () => null}}
        />
        <Stack.Screen
          name="ForOdering"
          component={ForOdering}
          // options={{animationEnabled: false, header: () => null}}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
