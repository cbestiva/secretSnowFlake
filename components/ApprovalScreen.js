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

import { NavigationActions } from 'react-navigation';

import * as firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';

const groupByEveryN = require('groupByEveryN');

export default class ApprovalScreen extends Component {
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
      missionTotal: this.props.navigation.state.params.missionTotal,
      rePick: 0,
      Play: 0,
      creator: '',
      chooserKey: null,
      totalPlayers: null,
      missionNumber: this.props.navigation.state.params.missionNumber
    }
    this.itemsRef = this.getRef().child('photos')
    this.stateRef = this.getRef().child('states')
    this.renderRow = this.renderRow.bind(this);
    this.renderRow2 = this.renderRow2.bind(this);
  }
    
  static navigationOptions = {
    title: 'Approval'
  }
  
  getRef(){
    return FirebaseApp.database().ref();
  }
  
  componentWillMount() {
    // putting totalplayers count on componentWillMount
    this.stateRef.child(`${this.state.gameName}/players`).on('value', (playersSnap) => {
        this.setState({
          totalPlayers: playersSnap.val()
        })
    })   
    // putting chooserKey load up here
    this.stateRef.child(`${this.state.gameName}/missionChooser/key`).on('value', (keySnap) =>{
      this.setState({
        chooserKey: keySnap.val()
      })
    })
    // load the number of approvals and rejections then check if either are at majority
      // if 5 then 3, 6 then 4, 7 then 4, 8 then 5, 9 then 5, 10 then 6
    this.stateRef.child(`${this.state.gameName}/creatorName`).on('value', (creatorSnap) => {
        this.setState({
          creator: creatorSnap.val()
        })
    })
    
    this.stateRef.child(`${this.state.gameName}/players`).on('value', (snapshot) => {
      this.stateRef.child(`${this.state.gameName}/votersApproval/approve`).on('value', (snapshot2) => {
        switch(snapshot.val()){
          case '5':
            if(snapshot2.numChildren() >= 3){
              this.setState({
                Play: 1
              })
            }
            break;
          case '6':
            if(snapshot2.numChildren() >= 4){
              this.setState({
                Play: 1
              })
            }
            break;
          case '7':
            if(snapshot2.numChildren() >= 4){
              this.setState({
                Play: 1
              })
            }
            break;
          case '8':
            if(snapshot2.numChildren() >= 5){
              this.setState({
                Play: 1
              })
            }
            break;
          case '9':
            if(snapshot2.numChildren() >= 5){
              this.setState({
                Play: 1
              })
            }
            break;
          case '10':
            if(snapshot2.numChildren() >= 6){
              this.setState({
                Play: 1
              })
            }
            break;
        }
      })
      
      //Same thing but for rejections
      this.stateRef.child(`${this.state.gameName}/votersApproval/reject`).on('value', (snapshot3) => {
        switch(snapshot.val()){
          case '5':
            if(snapshot3.numChildren() >= 3){
              this.setState({
                rePick: 1
              })
            }
            break;
          case '6':
            if(snapshot3.numChildren() >= 3){
              this.setState({
                rePick: 1
              })
            }
            break;
          case '7':
            if(snapshot3.numChildren() >= 4){
              this.setState({
                rePick: 1
              })
            }
            break;
          case '8':
            if(snapshot3.numChildren() >= 4){
              this.setState({
                rePick: 1
              })
            }
            break;
          case '9':
            if(snapshot3.numChildren() >= 5){
              this.setState({
                rePick: 1
              })
            }
            break;
          case '10':
            if(snapshot3.numChildren() >= 5){
              this.setState({
                rePick: 1
              })
            }
            break;
        }
      })
    })
    
    // load pictures of people in the approve and reject listviews
    this.stateRef.child(`${this.state.gameName}/votersApproval/approve`).on('value', (snapshot) => {
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
    
       this.stateRef.child(`${this.state.gameName}/votersApproval/reject`).on('value', (snapshot) => {
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
  
  rePickVoters(){
    
    //if creator reset all voters
    if(this.state.creator==this.state.playerName){
                  //Pass Total Players from beginning
      
        //reset ready state
        
         this.stateRef.child(`${this.state.gameName}/selectionReady`).set({
           val: 0
         })
      
      //Only Creator can change the chooserKey
    
          this.stateRef.child(`${this.state.gameName}/orderList/val`).on('value', (orderSnap) =>{
            let orderList = orderSnap.val().split(',')
            let newChooserKey = this.state.chooserKey + 1
            if(newChooserKey == this.state.totalPlayers){
              newChooserKey = 0
            }
            this.stateRef.child(`${this.state.gameName}/missionChooser`).set({
                                                                              key: newChooserKey,
                                                                              missionNumber: this.state.missionNumber,
                                                                              val: `${orderList[newChooserKey]}`
                                                                             })
                                                                        })
      
    this.stateRef.child(`${this.state.gameName}/voters`).remove()
    this.stateRef.child(`${this.state.gameName}/votersApproval/approve`).remove()
    this.stateRef.child(`${this.state.gameName}/votersApproval/reject`).remove()
    }
    // Go back to choosing screen with the new chooser
    // Delete the voters list 
     this.props.navigation.navigate(
      'Choosing', 
      {
        gameName: this.state.gameName, 
        player: this.state.playerName,
        missionTotal: this.state.missionTotal,
        missionNumber: this.state.missionNumber
        
      })
  }
  
  goToVotes(){
    
//     const resetAction = NavigationActions.reset({
//     index: 0,
//     key: null,
//     actions: [
//       NavigationActions.navigate({routeName: 'Voter', params: {gameName: this.state.gameName, player: this.state.playerName, missionTotal: this.state.missionTotal, missionNumber: this.state.missionNumber}})
//     ]
//   })
  
//   this.props.navigation.dispatch(resetAction);
    
    this.props.navigation.navigate(
    'Voter',
    {
      gameName: this.state.gameName,
      player: this.state.playerName,
      missionTotal: this.state.missionTotal,
      missionNumber: this.state.missionNumber
    })
  }
  
  render() {
    const NextButton = this.state.Play == 1 || this.state.rePick == 1 
      ? (this.state.rePick == 1 
         ? <Button title="Re-Pick" onPress={ () => {this.rePickVoters()}}/> 
         : <Button title="Play" onPress={ () => {this.goToVotes()}}/>) 
      : (<Button title="Waiting for Votes" onPress={ () => {}}/>)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          People who Approve the Voters {this.state.playerName}
        </Text>
        <ListView dataSource={this.state.dataSource} renderRow={this.renderRow} enableEmptySections={true}/>
        <Text style={styles.title}>
          People who Reject the Voters {this.state.playerName}
        </Text>
        <ListView dataSource={this.state.dataSource2} renderRow={this.renderRow2} enableEmptySections={true}/>
          {NextButton}
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