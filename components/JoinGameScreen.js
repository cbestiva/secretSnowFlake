import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class JoinGameScreen extends Component {
  static navigationOptions = {
    title: 'CreateGame'
  }
  
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Join Game Screen
        </Text>
        <Button
          style={styles.title}
          onPress={() => this.props.navigation.navigate('Camera')}
          title='Join Game'
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