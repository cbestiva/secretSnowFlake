import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ListView,
  TouchableOpacity
} from 'react-native';

import * as firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';

const groupByEveryN = require('groupByEveryN');

export default class PlayersScreen extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//     let gn = "STARTINGSET"
    this.state = {
      gameName: this.props.navigation.state.params.gameName,
      dataSource: ds,
      photos: [],
      playerCnt: null,
      playersNeeded: null,
      rolesArray: null,
      creator: this.props.navigation.state.params.creator,
      player: this.props.navigation.state.params.player,
      readyFlag: 0
    }
    
    this.itemsRef = this.getRef().child('photos')
    this.stateRef = this.getRef().child('states')
    this.renderRow = this.renderRow.bind(this)
    this.pressRow = this.pressRow.bind(this)
    
  }
//   constructor(){
//     super();
//     let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//     this.state = {
//       itemDataSource: ds
//     }
//     this.itemsRef = this.getRef().child('Images');
//     this.renderRow = this.renderRow.bind(this);
//     this.pressRow = this.pressRow.bind(this);
//   }
  
  getRef(){
    return FirebaseApp.database().ref();
  }
  
//   componentWillMount(){
//     this.getItems(this.itemsRef);
//   }
  
//   componentDidMount(){
//     this.getItems(this.itemsRef);
//   }
  
componentWillMount() {
  
  this.stateRef.child(`${this.state.gameName}/readyFlag/val`).on("value", (snapshot) => {
        this.setState({
          readyFlag : snapshot.val()
    })
  })
  this.stateRef.child(`${this.state.gameName}/players`).on("value", (snapshot) => {
        this.setState({
          playersNeeded : snapshot.val()
    })
  })
    this.itemsRef.child(`${this.state.gameName}`).on('value', (snapshot) =>{ 
       this.setState({
         playerCnt : snapshot.numChildren()
    })
    })
    this.stateRef.child(`${this.state.gameName}/charsString`).on('value', (snapshot) =>{
      this.setState({
      rolesArray: snapshot.val().split(',')
      }
        )
//       alert(this.state.gameName + ' ' +snapshot.val())
    })
       
//     alert(this.state.playersNeeded + ' ' + this.state.playerCnt)

  this.itemsRef.child(this.state.gameName).on('value', (snapshot) => {
    let dataArray = [];
    snapshot.forEach((child) => {
//       alert(child.val().img)
      console.log("child = ", child)
      dataArray.push({
        name: child.key,
        image: child.val().img
      })
    })
//     return dataArray
//     let dataObj = snapshot.val()
//     let dataArray = Object.keys(dataObj).map((key,i) => {
//     return {
//     name: key,
//     image: Object.values(dataObj)[i].img
//   }
//   })
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(groupByEveryN(dataArray,4)),
    photos: dataArray,
  })
  },
    (errObj) => console.log('The read failed: ', errObj.code)
         )
}
  
  componentDidUpdate() {
//     let playersNeeded = 0
//     let playersNeeded
//     let playerCnt
    
//     this.stateRef.child(`${this.state.gameName}/players`).on("value", (snapshot) => {
//         playersNeeded = snapshot.val()
//     })
//     this.itemsRef.child(`${this.state.gameName}`).on('value', (snapshot) =>{ 
//        playerCnt = snapshot.numChildren()
//     })
  
//     alert(this.state.playersNeeded + ' ' + this.state.playerCnt)
  }
  
//   getItems(itemsRef) {
//       itemsRef.on('value', (snap) => {
//         let items = [];
//         snap.forEach((child) => {
//           items.push({
//           img: child.val().img,
//           _key: child.key
//         });
//         });
//         this.setState({
//           itemDataSource: this.state.itemDataSource.cloneWithRows(groupByEveryN(items,3)),
//           photos: items
//         });
//       });
//   }

  pressRow(photo){
    console.log(photo)
    console.log(`${this.state.gameName}/photo.name`)
  this.itemsRef.child(`${this.state.gameName}/`+photo.name).remove();
}
  
  showChildrenCount(item){
    const db = FirebaseApp.database()
    const ref = db.ref(`photos/${this.state.gameName}`)
    ref.once('value', function(snapshot) { alert('Count: ' + snapshot.numChildren()); });
  }
  static navigationOptions = {
    title: 'Players'
  }
  
  setUpGame(){
    let mixedArray = []
    let rolesArray = this.state.rolesArray
    let photosArray = this.state.photos
    let playersArray = []
    // get the players array
//     alert(playersArray[0].name)
    for(i=0;i<photosArray.length;i++){
      playersArray.push(photosArray[i].name)
    }
    while (rolesArray.length > 0){
//       mixedArray.push(rolesArray.splice(Math.floor(Math.random() * rolesArray.length),1), playersArray.splice(Math.floor(Math.random() * playersArray.length),1).name)
      mixedArray.push(rolesArray.splice(Math.floor(Math.random() * rolesArray.length),1))
      }
    if(this.state.creator === 1){
      // set roles state => mixedArray in Firebase
      for(i=0;i<playersArray.length;i++){
        let roleVal = mixedArray[i]
        
        if(roleVal==0){
          this.stateRef.child(`${this.state.gameName}/evilPeople/${[playersArray[i]]}`).set({
              role : 1
              })
                      }
        
       this.stateRef.child(`${this.state.gameName}/${playersArray[i]}`).set({
       role: `${roleVal}`
    })
      }
      this.stateRef.child(`${this.state.gameName}/readyFlag`).set({
       val: 1
    })
    }
//     alert(mixedArray+ ' ' + `${this.state.creator}`)
  }
  
  revealChars(){
    this.props.navigation.navigate(
      'Reveal', 
      {
        gameName: `${this.state.gameName}`,
        player: `${this.state.player}`
        
      })
  }
  
//   generateRandomNumber()=>
//   {
//     var rolesArray = this.state.
//     var randomNumber = Math.floor(Math.random() * )
//   }
//   renderRow(item){
//    return(<View>
//       <Image style={{height: 100, width: 100}}
//         source={{uri: item.img}}/>
//     </View>);
//   }
  
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
    const waitingButton = this.state.playersNeeded == this.state.playerCnt ? (this.state.readyFlag == 0 ? ( <Button onPress={ () => {
          this.setUpGame()}} 
          title={"Set Up Game"}>
      </Button>
    
    ) :
    (
    <Button onPress={ () => {
          this.revealChars()}} 
          title={"Reveal Role"}>
      </Button>
    
    ))
    :
    (
    <Button title={"Waiting for More Players"}>
      </Button>
    )
    return(
      <View style={styles.container}>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}/>
        { waitingButton }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})