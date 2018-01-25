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

export default class ChoosingScreen extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//     let gn = "STARTINGSET"
    this.state = {
      playerName: this.props.navigation.state.params.player,
      photos: null,
      photos2: null,
      dataSource: ds,
      dataSource2: ds2,
      gameName: this.props.navigation.state.params.gameName,
      chooser: 0,
      missionTotal: null
    }
    this.itemsRef = this.getRef().child('photos')
    this.stateRef = this.getRef().child('states')
    this.renderRow = this.renderRow.bind(this);
    this.renderRow2 = this.renderRow2.bind(this);
  }
    
  static navigationOptions = {
    title: 'Choosing'
  }
  
  getRef(){
    return FirebaseApp.database().ref();
  }
  
  componentWillMount() {
    this.stateRef.child(`${this.state.gameName}/missions`).on("value", (snapshot) =>{
      let missions = snapshot.val().split()
      let missionNumber
      this.stateRef.child(`${this.state.gameName}/missionChooser/missionNumber`).on("value", (snapshot2) =>{
        missionNumber = snapshot2.val()
        this.setState({
          missionTotal: missions[0][missionNumber][0]
        })
      })
    })
    
    this.stateRef.child(`${this.state.gameName}/missionChooser/val`).on("value", (snapshot) => {
      let chooser = snapshot.val()
        if(this.state.playerName == chooser){
          this.setState({
            chooser: 1
          })
         this.itemsRef.child(this.state.gameName).on('value', (snapshot) => {
    let dataArray = [];
    snapshot.forEach((child) => {

      dataArray.push({
        name: child.key,
        image: child.val().img
      })
      
    })
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(groupByEveryN(dataArray,4)),
    photos: dataArray,
  })
  },
    (errObj) => console.log('The read failed: ', errObj.code)
         )
        }else{
          this.itemsRef.child(this.state.gameName).on('value', (snapshot) => {
    let dataArray = [];
    snapshot.forEach((child) => {
      if(chooser == child.key){
      dataArray.push({
        name: child.key,
        image: child.val().img
      })
    }
    })
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(groupByEveryN(dataArray,4)),
    photos: dataArray,
  })
  },
    (errObj) => console.log('The read failed: ', errObj.code)
         )
        }
  })
    
    // code to load the set of players that are chosen
    this.stateRef.child(`${this.state.gameName}/voters`).on('value', (snapshot) => {
    let dataArray = [];
    snapshot.forEach((child) => {

      dataArray.push({
        name: child.key,
        image: child.val().img
      })
      
    })
  this.setState({
    dataSource2: this.state.dataSource2.cloneWithRows(groupByEveryN(dataArray,4)),
    photos2: dataArray,
  })
  },
    (errObj) => console.log('The read failed: ', errObj.code)
         )
    
}
  
  chooseVoter(photoName, photoImage){
    this.stateRef.child(`${this.state.gameName}/voters/${photoName}`).set({
       img: `${photoImage}`
    })
  }
  
  removeVoter(photoName){
    if(this.state.chooser == 1){
    this.stateRef.child(`${this.state.gameName}/voters/${photoName}`).remove();
    }
  }
  
  lockInPicks(){
        this.stateRef.child(`${this.state.gameName}/voters`).on('value', (snapshot) =>{ 
       if(this.state.missionTotal == snapshot.numChildren()){
          alert('Ready to Go!')
          this.stateRef.child(`${this.state.gameName}/selectionReady`).set({
           val: 1
         })
       }else{
         alert('Need ' +this.state.missionTotal+' voters selected')
         this.stateRef.child(`${this.state.gameName}/selectionReady`).set({
           val: 0
         })
       }
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
              this.chooseVoter(photo.name, photo.image); 
            }}>
        <Image style={{height:75, width: 75}}
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
  
  renderRow2(rowData: Array<View>, sectionId: string, rowId: string) {
    let photos = rowData.map((photo, i) => {
      if (photo === null){
        return null
      }
      return (
      <View key={photo.name}>
        <TouchableOpacity activeOpacity = { .5 } 
          onPress={ () => {
              this.removeVoter(photo.name);
            }}>
        <Image style={{height:75, width: 75}}
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
    const headerTitle = this.state.chooser == 1 ? 
      (<View style={styles.container}>
        <Text style={styles.title}>
          Choose {this.state.missionTotal} people for the mission
        </Text>
        <ListView dataSource={this.state.dataSource} renderRow={this.renderRow}/>
        <ListView dataSource={this.state.dataSource2} renderRow={this.renderRow2}/>
          <Button title="Finalize" onPress={ () => {this.lockInPicks()}} />
      </View>) 
      :
      (<View style={styles.container}>
        <Text style={styles.title}>
          Approve or Reject these Voters
        </Text>
        <ListView dataSource={this.state.dataSource2} renderRow={this.renderRow2}/>
          <Button title="Approve"/><Button title="Reject"/>
      </View>)
    
    return (
      <View style={styles.container}>
        { headerTitle }
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