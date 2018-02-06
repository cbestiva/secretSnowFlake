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

export default class VoterScreen extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds,
      playerName: this.props.navigation.state.params.player,
      voter: 0,
      gameName: this.props.navigation.state.params.gameName,
      missionTotal: this.props.navigation.state.params.missionTotal,
      totalVoters: null,
      missionNumber: this.props.navigation.state.params.missionNumber,
      orderNumber: 0,
      totalVotes: 0,
      allVotesIn: 0,
      missionText: '',
      creator: '',
      goodScore: 0,
      badScore: 0,
      revealed: 0,
      allRevealed: 0,
      numPlayers: 0,
      chooserKey: 0,
      gameOver: 0,
      gameOverText: '',
      alreadyVoted: 0,
      votedText: '',
      badGuysWin: 0,
      goodGuysWin: 0
    }
    this.itemsRef = this.getRef().child('photos')
    this.stateRef = this.getRef().child('states')
    this.renderRow = this.renderRow.bind(this)
  }
    
  static navigationOptions = {
    title: 'Voter'
  }
  
  getRef(){
    return FirebaseApp.database().ref();
  }
  
  componentWillMount() {

    this.stateRef.child(`${this.state.gameName}/revealedCount/val`).on('value', (revealedSnap) => {
      this.setState({
        revealedCount: revealedSnap.val()
      })
    })
    
    this.stateRef.child(`${this.state.gameName}/players`).on('value', (playersSnap) => {
      this.setState({
        numPlayers: playersSnap.val()
      })
    })
    
    this.stateRef.child(`${this.state.gameName}/Score/Good`).on('value', (goodScoreSnap) => {
        this.setState({
          goodScore: goodScoreSnap.val()
        })
    })
    
    this.stateRef.child(`${this.state.gameName}/Score/Bad`).on('value', (badScoreSnap) => {
        this.setState({
          badScore: badScoreSnap.val()
        })
    })
    
    this.stateRef.child(`${this.state.gameName}/creatorName`).on('value', (creatorSnap) => {
        this.setState({
          creator: creatorSnap.val()
        })
    })
    
    this.stateRef.child(`${this.state.gameName}/totalVotes/val`).on('value', (totalVotesSnap) => {
      if(this.state.missionTotal > 5){
        if(totalVotesSnap.val() == this.state.missionTotal-2){
        this.setState({
          allVotesIn: 1
        })
        }
      }else{
       if(totalVotesSnap.val() == this.state.missionTotal){
        this.setState({
          allVotesIn: 1
        }) 
      }
      }
        this.setState({
          totalVotes: totalVotesSnap.val()
        })
    })
    
    this.stateRef.child(`${this.state.gameName}/missionChooser/key`).on('value', (keySnap) =>{
      this.setState({
        chooserKey: keySnap.val()
      })
    })
    
    this.stateRef.child(`${this.state.gameName}/Score/Bad`).on('value', (badScoreSnap) => {
      if(badScoreSnap.val()>2){
        this.setState({
          gameOver: 1,
          badGuysWin: 1,
          gameOverText: 'Bad Guys Win!'
        })
        this.loadEvilPhotos()
      }
    })
    
    this.stateRef.child(`${this.state.gameName}/Score/Good`).on('value', (goodScoreSnap) => {
      if(goodScoreSnap.val()>2){
        this.setState({
          gameOver: 1,
          goodGuysWin: 1,
          gameOverText: 'Good Guys Win!'
        })
      this.loadGoodPhotos()
      }
    })
    
    this.stateRef.child(`${this.state.gameName}/missionChooser/key`).on('value', (keySnap) =>{
      this.setState({
        chooserKey: keySnap.val()
      })
    })
    
    const randomOrder = Math.round(Math.random())
    this.setState({
      orderNumber: randomOrder
    })
    // putting totalplayers count on componentWillMount TODO: change this to number of voters
    
    this.stateRef.child(`${this.state.gameName}/voters`).on('value', (snapshot) => {
      
        let dataArray = [];
    snapshot.forEach((child) => {
      dataArray.push(child.key)
    })
    if(dataArray.includes(this.state.playerName)){
      this.setState({voter: 1})
    }
    })
}
  
loadEvilPhotos(){
  this.stateRef.child(`${this.state.gameName}/evilPeople`).on("value", (snapshot) => {
      let evilList = []
     snapshot.forEach((child) => {
      evilList.push(child.key)
    })
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
  })
}
  
loadGoodPhotos(){
  this.stateRef.child(`${this.state.gameName}/evilPeople`).on("value", (snapshot) => {
      let evilList = []
     snapshot.forEach((child) => {
      evilList.push(child.key)
    })
      this.itemsRef.child(this.state.gameName).on('value', (snapshot) => {
    let dataArray = [];
    snapshot.forEach((child) => {
      if(!evilList.includes(child.key)){
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
  })
}
  
votePass(){
  //Set Value to Pass
  if(this.state.alreadyVoted==0){
  this.stateRef.child(`${this.state.gameName}/votes/pass`).transaction(function(currentPassVotes) {return currentPassVotes + 1;});
  
  this.stateRef.child(`${this.state.gameName}/totalVotes/val`).transaction(function(currentVotes) {return currentVotes + 1;});
  
  this.setState({
    alreadyVoted: 1,
    votedText: "Vote Logged!"
  })
  }

  //make it render the Waiting for Votes until all other votes are in
}
  
voteFail(){
  //Set Value to Fail
  if(this.state.alreadyVoted==0){
  this.stateRef.child(`${this.state.gameName}/votes/fail`).transaction(function(currentFailVotes) {return currentFailVotes + 1;});
  
  this.stateRef.child(`${this.state.gameName}/totalVotes/val`).transaction(function(currentVotes) {return currentVotes + 1;});
  
this.setState({
    alreadyVoted: 1,
    votedText: "Vote Logged!"
  })
  }

}
  
rePick(){
  // Change the missionNumber if creator
  if(this.state.playerName==this.state.creator){
//     this.stateRef.child(`${this.state.gameName}/missionChooser/missionNumber`).transaction(function(missionNumber) {return missionNumber + 1;})
    this.stateRef.child(`${this.state.gameName}/votersApproval/approve`).remove()
    this.stateRef.child(`${this.state.gameName}/votersApproval/reject`).remove()
   this.stateRef.child(`${this.state.gameName}/selectionReady`).set({
     val: 0
   })
   this.stateRef.child(`${this.state.gameName}/totalVotes`).set({
     val: 0
   })
   this.stateRef.child(`${this.state.gameName}/votes`).set({
     fail: 0,
     pass: 0
   })
   this.stateRef.child(`${this.state.gameName}/revealedCount`).set({
     val: 0
   })
   this.stateRef.child(`${this.state.gameName}/orderList/val`).on('value', (orderSnap) =>{
            let orderList = orderSnap.val().split(',')
            let newChooserKey = this.state.chooserKey + 1
            if(newChooserKey == this.state.numPlayers){
              newChooserKey = 0
            }
            this.stateRef.child(`${this.state.gameName}/missionChooser`).set({
                                                                              key: newChooserKey,
                                                                              missionNumber: this.state.missionNumber + 1,
                                                                              val: `${orderList[newChooserKey]}`
                                                                             })
                                                                        })
   this.stateRef.child(`${this.state.gameName}/chooserRevealed`).set({
     val: 0
   })
  }else{
    this.stateRef.child(`${this.state.gameName}/revealedCount/val`).transaction(function(chooserCount) {return chooserCount + 1;})
  }
  
  //If not creator increment revealedCount
  
  
  // Get missionNumber and update the missionNumber field and pass it to the Choosing Screen
  
  this.stateRef.child(`${this.state.gameName}/missionChooser/missionNumber`).on('value', (missionSnap) =>{
    this.setState({
      missionNumber: missionSnap.val()
    })
  })
  // Go to Chooser Page
  const resetAction = NavigationActions.reset({
    index: 1,
    key: null,
    actions: [NavigationActions.navigate({routeName: 'Voter', params: {gameName: this.state.gameName, player: this.state.playerName, missionTotal: this.state.missionTotal, missionNumber: this.state.missionNumber}}),
      NavigationActions.navigate({routeName: 'Choosing', params: {gameName: this.state.gameName, player: this.state.playerName, missionNumber: this.state.missionNumber}})
    ]
  })
  
  this.props.navigation.dispatch(resetAction);
//   this.props.navigation.navigate('Choosing', 
//       {
//         gameName: this.state.gameName,
//         player: this.state.playerName,
//         missionNumber: this.state.missionNumber
//       }
//                                                        )
}
  
revealVotes(){
  this.stateRef.child(`${this.state.gameName}/votes/pass`).on('value', (passVotes) => {
    
    let missionText = ''
    let passedVotes = passVotes.val()
    
    if(this.state.missionTotal > 5){//handling 2 failed votes
    let failedVotes = this.state.missionTotal - 2 - passedVotes
    
    if(failedVotes > 1){
      if(this.state.creator == this.state.playerName && this.state.totalVotes == this.state.missionTotal - 2){
        this.stateRef.child(`${this.state.gameName}/Score/Bad`).transaction(function(badVotes) {return badVotes + 1;}); 
        this.stateRef.child(`${this.state.gameName}/totalVotes`).set({
          val: 0
        })
        this.stateRef.child(`${this.state.gameName}/chooserRevealed`).set({
     val: 1
   })
      }
      missionText = missionText + 'Mission FAILED \n NEED 2 FAILED VOTES\n'
    }else{
      if(this.state.creator == this.state.playerName && this.state.totalVotes == this.state.missionTotal - 2){
       this.stateRef.child(`${this.state.gameName}/Score/Good`).transaction(function(goodVotes) {return goodVotes + 1;}); 
       this.stateRef.child(`${this.state.gameName}/totalVotes`).set({
         val: 0
       })
       this.stateRef.child(`${this.state.gameName}/chooserRevealed`).set({
     val: 1
   })
      }
      missionText = missionText + 'Mission PASSED \n NEED 2 FAILED VOTES\n'
    }
      
       while(passedVotes > 0){
      missionText = missionText + 'PASS \n'
      passedVotes = passedVotes - 1
    }
    
    while(failedVotes > 0){
      missionText = missionText + 'FAIL \n'
      failedVotes = failedVotes - 1
    }
    
    // Get Scores and Add it to the Bottom of the Text
    this.setState({
      missionText: missionText,
      revealed: 1
    })

    }  else  {//handling 1 failed vote
  
    let failedVotes = this.state.missionTotal - passedVotes
    
    if(failedVotes > 0){
      if(this.state.creator == this.state.playerName && this.state.totalVotes == this.state.missionTotal){
        this.stateRef.child(`${this.state.gameName}/Score/Bad`).transaction(function(badVotes) {return badVotes + 1;}); 
        this.stateRef.child(`${this.state.gameName}/totalVotes`).set({
          val: 0
        })
        this.stateRef.child(`${this.state.gameName}/chooserRevealed`).set({
     val: 1
   })
      }
      missionText = missionText + 'Mission FAILED \n'
    }else{
      if(this.state.creator == this.state.playerName && this.state.totalVotes == this.state.missionTotal){
       this.stateRef.child(`${this.state.gameName}/Score/Good`).transaction(function(goodVotes) {return goodVotes + 1;}); 
       this.stateRef.child(`${this.state.gameName}/totalVotes`).set({
         val: 0
       })
       this.stateRef.child(`${this.state.gameName}/chooserRevealed`).set({
     val: 1
   })
      }
      missionText = missionText + 'Mission PASSED \n'
    }
      
     while(passedVotes > 0){
      missionText = missionText + 'PASS \n'
      passedVotes = passedVotes - 1
    }
    
    while(failedVotes > 0){
      missionText = missionText + 'FAIL \n'
      failedVotes = failedVotes - 1
    }
    
    // Get Scores and Add it to the Bottom of the Text
    this.setState({
      missionText: missionText,
      revealed: 1
    })
      
    }
    
    
    this.stateRef.child(`${this.state.gameName}/voters`).remove()
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
          onPress={ () => { }}>
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
    const voterView = this.state.orderNumber == 1 ? 
          (<View style={styles.container}>
              <Text>{this.state.votedText}</Text>
              <Button title="Pass" onPress={ () => {this.votePass()}}/>
              <Button title="Fail"onPress={ () => {this.voteFail()}}/>
              </View>) 
          : 
          (<View style={styles.container}>
              <Text>{this.state.votedText}</Text>
              <Button title="Fail" onPress={ () => {this.voteFail()}}/>
              <Button title="Pass" onPress={ () => {this.votePass()}}/>
              </View>) 
    const nonVoterView = ( <View><Button title="Waiting for Votes" onPress={()=>{}}/></View> )
    
    const nextButton = (this.state.revealedCount == (this.state.numPlayers - 1) && this.state.creator == this.state.playerName) || 
                       (this.state.revealed == 1 && (this.state.creator != this.state.playerName)) ? 
                       <Button title="Next Mission" onPress={ () => {this.rePick()}}></Button> 
                     : <Button title="Reveal Votes" onPress={ () => {this.revealVotes()}}></Button>
   
    const revealView = <View>
                        <Text> 
                        {this.state.missionText}
                        {"\n"}           Score
                        {"\n"}Good Guys: {this.state.goodScore} Bad Guys: {this.state.badScore}
                        </Text>
                        {nextButton}
                      </View>
          
    const gameOverView = <View>
                           <Text> GAME OVER {"\n"}{"\n"}{this.state.gameOverText}</Text>
                        <ListView
                          dataSource={this.state.dataSource}
                          renderRow={this.renderRow}/>
                        </View>
    const mainView = this.state.gameOver == 1 ? gameOverView : this.state.allVotesIn == 1 ? revealView : this.state.voter == 1 ? voterView : nonVoterView
    //Once reveal
    //Make 2 Options if a voter show vote buttons if not show waiting button with reveal after voters voted
      //Make 2 Buttons 1 for Pass and 1 for Fail and make the order of them random
      
    
      //Make Big Button saying Waiting for votes and it changes to reveal once votes are in
        //shows new
    

    return (
      <View style={styles.container}>
        { mainView }
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