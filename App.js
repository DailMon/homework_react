import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Details from './Details';
import Chart from './Chart';
import Country from './Country';

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'COVID TRACKER'} component={Chart} />
          <Stack.Screen name={'Details'} component={Details} />
          <Stack.Screen name={'Country'} component={Country} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
