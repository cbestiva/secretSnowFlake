import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class CreateGameScreen extends Component {
  static navigationOptions = {
    title: 'CreateGame'
  }
  
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Create Game Screen
        </Text>
        <Button
          style={styles.title}
          onPress={() => this.props.navigation.navigate('Camera')}
          title='Create Game'
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