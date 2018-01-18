import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput
} from 'react-native';

export default class JoinGameScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      room: '',
      name: '',
      numOfPlayers: 0,
      showLoader: false
    }
  
//   this.itemsRef = this.getRef().child('photos')
  }
  
  static navigationOptions = {
    title: 'JoinGame'
  }
  
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Join a Room
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
        <Button
          style={styles.title}
          onPress={() => this.props.navigation.navigate('Camera', 
      {
        game: this.state.room, 
        player: this.state.name,
        creator: 0
      }
                                                       )}
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