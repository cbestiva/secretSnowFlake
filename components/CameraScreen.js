import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Vibration
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import * as firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';

export default class SignInScreen extends Component {
    constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      showLoader: false,
      creator: this.props.navigation.state.params.creator
    }
    
    this.itemsRef = this.getRef().child('photos')
  }
  
  static navigationOptions = {
    title: 'Camera'
  }
  
  getRef(){
    return FirebaseApp.database().ref();
  }
  
  openPicker(game, player, creator) {
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob

    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true
    }).then(image => {
      this.setState({
        showLoader: true
      })
      const imagePath = image.path
      let uploadBlob = null
      const imageRef =
      firebase.storage().ref().child(`${game}/${player}.jpg`)
//       firebase.storage().ref().child(`${this.state.game}/${this.state.player}.jpg`)
//       alert(imageRef)
      let mime = 'image/jpg'
      fs.readFile(imagePath, 'base64')
        .then((data) => {
          return Blob.build(data, {type: `${mime};BASE64`})
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, {contentType: mime})
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        this.itemsRef.child(`${game}`).child(`${player}`).set({
      img: url
      })
        this.props.navigation.navigate(
      'Players', 
      {
        gameName: `${game}`,
        creator: `${creator}`,
        player: `${player}`
      })
        Vibration.vibrate()
      })
      .catch(err => console.log('firebase upload error', err))    
    })
    .catch(err => console.log('image picker error'))
  }
  
  render() {
    const { state } = this.props.navigation
    console.log('GAME INFO = ', state.params.game, state.params.player)
    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Camera Screen
        </Text>
        <Button
          onPress={ () => this.openPicker(state.params.game, state.params.player, state.params.creator) }
          title='Add Photo'
        />
        <Button
          style={styles.title}
          onPress={() =>
      
          this.props.navigation.navigate('Players',
          {
            gameName: state.params.game,
            creator: state.params.creator,
            player: state.params.player
          })}
          title='Play'
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