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
import Reveal from './components/RevealScreen';
import Choosing from './components/ChoosingScreen';
import Approval from './components/ApprovalScreen';
import Voter from './components/VoterScreen';

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
      headerTitle: 'Create Game'
    }
  },
  JoinGame: {
    screen: JoinGameScreen,
    navigationOptions: {
      headerTitle: 'Join Game'
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
      headerTitle: 'Waiting Room'
    }
  },
  Reveal: {
    screen: Reveal,
    navigationOptions: {
      headerTitle: 'Your Role'
    }
  },
  Choosing: {
    screen: Choosing,
    navigationOptions: {
      headerTitle: 'Players for Mission'
    }
  },
  Approval: {
    screen: Approval,
    navigationOptions: {
      headerTitle: 'Approvals and Rejections'
    }
  },
  Voter: {
    screen: Voter,
    navigationOptions: {
      headerTitle: 'Mission Votes'
    }
  }
});

export default MainNavigator;