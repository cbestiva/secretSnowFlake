import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

export default class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Camera'
  }
  
  openPicker() {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true
    })
  }
  
  render() {
    const { state } = this.props.navigation
    console.log('GAME INFO = ', state.params.game, state.params.player, state.params.numOfPlayers)
    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Camera Screen
        </Text>
        <Button
          onPress={ () => this.openPicker() }
          title='Add Photo'
        />
        <Button
          style={styles.title}
          onPress={() => this.props.navigation.navigate('Players')}
          title='Play'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})