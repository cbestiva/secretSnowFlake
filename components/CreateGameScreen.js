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

import * as firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';

export default class CreateGameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: '',
      name: '',
      charsString: '',
      missions: '',
      numOfPlayers: '5'
      
    };
    
    this.itemsRef = this.getRef().child('states')
  }
  
  static navigationOptions = {
    title: 'CreateGame'
  }
  
  getRef(){
    return FirebaseApp.database().ref();
  }
  
  makeRoomId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    
  this.itemsRef.child(text).on('value', (snapshot) => {
    if(snapshot.val()==null){
      this.setState({
    room: text
  })
    }else{
      this.makeRoomId()
    }
  })

}
  
  componentWillMount(){
     this.makeRoomId()

  }
  
  createGame(e) {
    e.preventDefault()
    // Add Game Room and player to firebase
    
    // Navigate to CameraScreen w/ game info params
    switch(this.state.numOfPlayers){
      case '5':
          this.state.charsString = '0,0,1,1,1'
          this.state.missions = '2,3,2,3,3'
          break;
      case '6':
          this.state.charsString = '0,0,1,1,1,1'
          this.state.missions = '2,3,4,3,4'
          break;
      case '7':
          this.state.charsString = '0,0,0,1,1,1,1'
          this.state.missions = '2,3,3,6,4'
          break;
      case '8':
          this.state.charsString = '0,0,0,1,1,1,1,1'
          this.state.missions = '3,4,4,7,5'
          break;
      case '9':
          this.state.charsString = '0,0,0,1,1,1,1,1,1'
          this.state.missions = '3,4,4,7,5'
          break;
      case '10':
          this.state.charsString = '0,0,0,0,1,1,1,1,1,1'
          this.state.missions = '3,4,4,7,5'
          break;
    }
//     alert(this.state.charsString + ' ' + this.state.missions)
    this.itemsRef.child(`${this.state.room}`).set({
      charsString: `${this.state.charsString}`,
      missions: `${this.state.missions}`,
      players: `${this.state.numOfPlayers}`,
      creatorName: `${this.state.name}`,
      createdDate: `${new Date().toISOString()}`
    })
    this.itemsRef.child(`${this.state.room}/readyFlag`).set({
      val: 0
    })
    this.props.navigation.navigate(
      'Camera', 
      {
        game: this.state.room, 
        player: this.state.name,
        creator: 1
      }
    )
  }
  
  render() {

    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Game Room Name
        </Text>
        <Text style={fontSize=25}>{this.state.room}</Text>
        {/*<TextInput
          style={styles.input}
          placeholder='Game Room Name'
          onChangeText={(room) => this.setState({room})}
          value={this.state.room}
        />*/}
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