import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ListView,
  TouchableOpacity,
  Image
} from 'react-native';

import * as firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';

const groupByEveryN = require('groupByEveryN');

export default class RevealScreen extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//     let gn = "STARTINGSET"
    this.state = {
      playerName: this.props.navigation.state.params.player,
      photos: null,
      dataSource: ds,
      gameName: this.props.navigation.state.params.gameName,
      good: 1
    }
    this.itemsRef = this.getRef().child('photos')
    this.stateRef = this.getRef().child('states')
    this.renderRow = this.renderRow.bind(this);
  }
    
  static navigationOptions = {
    title: 'Reveal'
  }
  
  getRef(){
    return FirebaseApp.database().ref();
  }
  
  componentWillMount() {
    this.stateRef.child(`${this.state.gameName}/evilPeople`).on("value", (snapshot) => {
      let evilList = []
     snapshot.forEach((child) => {
      evilList.push(child.key)
    })
     if(evilList.includes(this.state.playerName)){
       this.state.good = 0
       this.itemsRef.child(this.state.gameName).on('value', (snapshot) => {
    let dataArray = [];
    snapshot.forEach((child) => {
      if(evilList.includes(child.key)){
      dataArray.push({
        name: child.key,
        image: child.val().img
      })
      }
    })
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(groupByEveryN(dataArray,2)),
    photos: dataArray,
  })
  },
    (errObj) => console.log('The read failed: ', errObj.code)
         )
     }else{
      this.itemsRef.child(this.state.gameName).on('value', (snapshot) => {
    let dataArray = [];
    snapshot.forEach((child) => {
      if(child.key == this.state.playerName){
      dataArray.push({
        name: child.key,
        image: child.val().img
      })
      }
    })
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(groupByEveryN(dataArray,2)),
    photos: dataArray,
  })
  },
    (errObj) => console.log('The read failed: ', errObj.code)
         )}
      
  })


}
  
  renderRow(rowData: Array<View>, sectionId: string, rowId: string) {
    let photos = rowData.map((photo, i) => {
      if (photo === null){
        return null
      }
      return (
      <View key={photo.name}>
        <TouchableOpacity activeOpacity = { .5 } 
          onPress={ () => { 
              this.pressRow(photo); 
            }}>
        <Image style={{height:90, width: 90}}
          source={{uri: photo.image}} />
          </TouchableOpacity>
          <Text>{photo.name}</Text>
        </View>
        )
    })
    return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      {photos}
      </View>)
  }
  
  render() {
    const playButton = ( <Button title="Play"
                              onPress={() => this.props.navigation.navigate('Choosing', 
      {
        gameName: this.state.gameName, 
        player: this.state.playerName
      }
                                                       )}/>)
    const headerTitle = this.state.good == 1 ? (<Text style={styles.title}>
          You're Good
        </Text>) 
         :
        (<Text style={styles.title}>
          You and your evil teammates >=)
        </Text>)
    
    return (
      <View style={styles.container}>
        { headerTitle }
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}/>
        { playButton }
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