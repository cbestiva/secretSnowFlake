import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './components/HomeScreen';
import CreateGameScreen from './components/CreateGameScreen';
import JoinGameScreen from './components/JoinGameScreen';
import CameraScreen from './components/CameraScreen';
import PlayersScreen from './components/PlayersScreen';

const MainNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home'
    }
  },
  CreateGame: {
    screen: CreateGameScreen,
    navigationOptions: {
      headerTitle: 'CreateGame'
    }
  },
  JoinGame: {
    screen: JoinGameScreen,
    navigationOptions: {
      headerTitle: 'JoinGame'
    }
  },
  Camera: {
    screen: CameraScreen,
    navigationOptions: {
      headerTitle: 'Camera'
    }
  },
  Players: {
    screen: PlayersScreen,
    navigationOptions: {
      headerTitle: 'Players'
    }
  }
});

export default MainNavigator;