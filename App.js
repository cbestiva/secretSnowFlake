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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('secretSnowFlake', () => secretSnowFlake)