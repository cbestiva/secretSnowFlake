import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home'
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Secret Snow Flake
        </Text>
        <Button
          style={styles.title}
          onPress={() => this.props.navigation.navigate('CreateGame')}
          title='Create a Game'
        />
        <Button
          style={styles.title}
          onPress={() => this.props.navigation.navigate('JoinGame')}
          title='Join a Game'
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