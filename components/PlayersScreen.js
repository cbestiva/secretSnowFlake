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
    let gn = this.props.navigation.state.params.gameName
    this.state = {
      gameName: gn,
      dataSource: ds,
      photos: []
    }
    
    this.itemsRef = this.getRef().child('photos')
    this.renderRow = this.renderRow.bind(this);
    this.pressRow = this.pressRow.bind(this);
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
  const db = FirebaseApp.database()
  const ref = db.ref(`photos/${this.state.gameName}`)
  ref.on('value', (snapshot) => {
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
    dataSource: this.state.dataSource.cloneWithRows(
    groupByEveryN(dataArray,4)),
    photos: dataArray
  })
  },
    (errObj) => console.log('The read failed: ', errObj.code)
         )
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
    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Players Screen
        </Text>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}/>
        <Button onPress={ () => {
          this.showChildrenCount()}} 
          title={"Check Children"}>
      </Button>
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