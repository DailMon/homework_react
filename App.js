/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, FlatList} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import StackNavigator from '@react-navigation/stack/src/navigators/createStackNavigator';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Tracker from './Tracker';
import Chart from './Chart';

const Tab = createBottomTabNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Tracker" component={Tracker} />
          <Tab.Screen name="Chart" component={Chart} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({});

export default App;
