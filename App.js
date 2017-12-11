/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  Button
} from 'react-native';
import MainNavigator from './Navigator'
import ImagePicker from 'react-native-image-crop-picker';

export default class secretSnowFlake extends Component {
  openPicker(){
  ImagePicker.openCamera({
    width: 300,
    height: 300,
    cropping: true
  })
}
  render() {
    return (
      <View style={styles.container}>
        <MainNavigator />
        <Button
          onPress={ () => this.openPicker() }
          title={ "Change Picture"}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('secretSnowFlake', () => secretSnowFlake)