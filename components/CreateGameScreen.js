import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Picker
} from 'react-native';

export default class CreateGameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: '',
      name: '',
      numOfPlayers: '5'
    };
  }
  
  static navigationOptions = {
    title: 'CreateGame'
  }
  
  createGame(e) {
    e.preventDefault()
    // Add Game Room and player to firebase
    
    // Navigate to CameraScreen w/ game info params
    this.props.navigation.navigate(
      'Camera', 
      {
        game: this.state.room, 
        player: this.state.name,
        numOfPlayers: this.state.numOfPlayers
      }
    )
  }
  
  render() {

    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Create a Room
        </Text>
        <TextInput
          style={styles.input}
          placeholder='Game Room Name'
          onChangeText={(room) => this.setState({room})}
          value={this.state.room}
        />
        <Text style={styles.title}>
          Enter Your Name
        </Text>
        <TextInput
          style={styles.input}
          placeholder={'Player\'s Name'}
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
        />
        <Text style={styles.title}>
          Number of Players
        </Text>
        <Picker
          style={styles.picker}
          selectedValue={this.state.numOfPlayers}
          onValueChange={(itemValue, itemIndex) => this.setState({numOfPlayers: itemValue})}>
          <Picker.Item label='5 Players' value='5' />
          <Picker.Item label='6 Players' value='6' />
          <Picker.Item label='7 Players' value='7' />
          <Picker.Item label='8 Players' value='8' />
          <Picker.Item label='9 Players' value='9' />
          <Picker.Item label='10 Players' value='10' />
        </Picker>
        <Button
          style={styles.title}
          onPress={(e) => this.createGame(e)}
          title='Create Game'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  input: {
    height: 50,
    width: 150,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10
  },
  picker: {
    width: 100
  }
})