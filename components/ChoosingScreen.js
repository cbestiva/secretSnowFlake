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
      missionTotal: null,
      adjustedMissionTotal: null,
      ready: 0,
      missionNumber: 1,
      readyLabel: '',
      missions: [2,3,2,3,3]
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
   
     this.stateRef.child(`${this.state.gameName}/selectionReady/val`).on("value", (snapshot) =>{
      this.setState({
        ready: snapshot.val()
      })
    })
                                                              
    this.stateRef.child(`${this.state.gameName}/missions`).on("value", (snapshot) =>{
      let missions =  snapshot.val().split(',')
      this.setState({
        missions : missions
      })
      this.stateRef.child(`${this.state.gameName}/missionChooser/missionNumber`).on("value", (snapshot2) =>{
        let missionNumber = snapshot2.val()
        let missionTotal = this.state.missions[missionNumber]
        let adjustedMissionTotal
        if(missionTotal>5){
          adjustedMissionTotal = missionTotal - 2
        }else{
          adjustedMissionTotal = missionTotal
        }
        
        this.setState({
          missionNumber: missionNumber,
          missionTotal: missionTotal,
          adjustedMissionTotal: adjustedMissionTotal
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
          
          this.setState({
            chooser: 0
          })
          
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
    // add logic that makes it do this only if they're the chooser
    if(this.state.chooser==1){
        this.stateRef.child(`${this.state.gameName}/voters`).on('value', (snapshot) =>{ 
       if(this.state.adjustedMissionTotal == snapshot.numChildren()){
         this.setState({
           readyLabel: 'Ready to Go!'
         })
        this.setState({
          ready: 1
        })
       }else{
         this.setState({
           readyLabel:`Need ${this.state.adjustedMissionTotal} voters selected chooser flag ${this.state.chooser}`
         })
         this.stateRef.child(`${this.state.gameName}/selectionReady`).set({
           val: 0
         })
       }
        // change missionChooserParams to next key and next val  
    })
    }
  }
  
  goToApproval(){
    this.itemsRef.child(`${this.state.gameName}/${this.state.playerName}/img`).on('value', (snapshot) =>{
      this.stateRef.child(`${this.state.gameName}/votersApproval/approve/${this.state.playerName}`).set({
           img: snapshot.val()
         })
      })
   this.stateRef.child(`${this.state.gameName}/selectionReady`).set({
           val: 1
         })
    this.setState({
      chooser: 0
    })
     this.props.navigation.navigate('Approval',
          {
          gameName: this.state.gameName,
          player: this.state.playerName,
          missionNumber: this.state.missionNumber,
          missionTotal: this.state.missionTotal
          }                            
          )
    
  }
  
  approveVoters(){
    this.itemsRef.child(`${this.state.gameName}/${this.state.playerName}/img`).on('value', (snapshot) =>{
      this.stateRef.child(`${this.state.gameName}/votersApproval/approve/${this.state.playerName}`).set({
           img: snapshot.val()
         })
    })
    
    this.props.navigation.navigate('Approval',
          {
            gameName: this.state.gameName,
            player: this.state.playerName,
          missionNumber: this.state.missionNumber,
          missionTotal: this.state.missionTotal
          })
  }
  
    rejectVoters(){
      this.itemsRef.child(`${this.state.gameName}/${this.state.playerName}/img`).on('value', (snapshot) =>{
      this.stateRef.child(`${this.state.gameName}/votersApproval/reject/${this.state.playerName}`).set({
           img: snapshot.val()
         })
    })
      
    this.props.navigation.navigate('Approval',
          {
            gameName: this.state.gameName,
            player: this.state.playerName,
          missionNumber: this.state.missionNumber,
          missionTotal: this.state.missionTotal
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
      ( this.state.ready == 0 ?  
       (<View>
        <Text style={styles.title}>
          Choose {this.state.adjustedMissionTotal} people for the mission {this.state.playerName}
          {"\n"}{this.state.readyLabel}
        </Text>
        <ListView dataSource={this.state.dataSource} renderRow={this.renderRow} enableEmptySections={true}/>
        <ListView dataSource={this.state.dataSource2} renderRow={this.renderRow2} enableEmptySections={true}/>
          
          <Button title="Finalize" onPress={ () => {this.lockInPicks()}} />
      </View>) 
      :
      (
      <View>
        <Text style={styles.title}>
          Choose {this.state.adjustedMissionTotal} people for the mission {this.state.playerName}
        </Text>
        <ListView dataSource={this.state.dataSource} renderRow={this.renderRow} enableEmptySections={true}/>
        <ListView dataSource={this.state.dataSource2} renderRow={this.renderRow2} enableEmptySections={true}/>
          <Button title="Go" onPress={ () => {this.goToApproval()}} />
      </View>) 
      )
      :
    ( this.state.ready == 0 ?
     (<View>
        <Text style={styles.title}>
          Approve or Reject these Voters {this.state.playerName}
        </Text>
        <ListView dataSource={this.state.dataSource2} renderRow={this.renderRow2} enableEmptySections={true}/>
      </View>)
     :
      (<View>
        <Text style={styles.title}>
          Approve or Reject these Voters {this.state.playerName}
        </Text>
        <ListView dataSource={this.state.dataSource2} renderRow={this.renderRow2} enableEmptySections={true}/>
          <Button title="Approve" onPress={ () => {this.approveVoters()}}/>
          <Button title="Reject" onPress={ () => {this.rejectVoters()}}/>
      </View>)
    )
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