/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Dimensions,
  ImageBackground
} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { dirPicutures } from './dirStorage';
const moment = require('moment');
const RNFS = require('react-native-fs');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
export default class App extends React.Component{
  state={
    camera:true,
    img:null,
    completeimg:null,
  }
  render(){
    if(this.state.camera){
        return(
          <View style={styles.container}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            defaultTouchToFocus
            mirrorImage={false}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
              console.log(barcodes);
            }}
          />
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
              <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
          </View>
        </View>
        )
      }
      else{
        return(
        <View style={{}}>
          <ImageBackground source={{isStatic: true,uri:'data:image/jpeg;base64,'+this.state.img}} style={{height:screenHeight,width:screenWidth,display:'flex',justifyContent:'space-between'}}>
    <View></View>
    <View style={{height:.2*screenWidth,width:screenWidth,backgroundColor:'black',color:'white',flexDirection:'row',justifyContent:'space-around'}}>
          <TouchableOpacity onPress={()=>{this.setState({camera:true,img:null,completeimg:null})}}><Text style={{color:'white',fontSize:30,marginTop:10}}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.saveImagetodisk()}}><Text style={{color:'white',fontSize:30,marginTop:10}}>Save</Text></TouchableOpacity>
    </View>
  </ImageBackground>
        </View>)
      }
  }
  takePicture = async() => {
    if (this.camera) {
      const options = { quality:1, base64: true };
      const data = await this.camera.takePictureAsync(options);
      this.setState({camera:false,img:data.base64,completeimg:data})
    }
  };
  saveImagetodisk =async()=>{
    saveImage(this.state.completeimg.uri)
    this.setState({camera:true,img:null,completeimg:null})
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
var saveImage = async filePath => {
  try {
    // set new image name and filepath
    const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
    const newFilepath = `${dirPicutures}/${newImageName}`;
    // move and save image to new filepath
    console.log('here in save image')
    requestCameraPermission()
    console.log('old',filePath)
    console.log('new',newFilepath)
    const imageMoved = await moveAttachment(filePath, newFilepath);
    console.log('image moved', imageMoved);
  } catch (error) {
    console.log(error);
  }
};
const moveAttachment = async (filePath, newFilepath) => {
console.log('here in moveattachment')  
console.log(dirPicutures)
  return new Promise((resolve, reject) => {
    RNFS.mkdir(dirPicutures)
      .then(() => {
        RNFS.moveFile(filePath, newFilepath)
          .then(() => {
            console.log('FILE MOVED', filePath, newFilepath);
            resolve(true);
          })
          .catch(error => {
            
            console.log('moveFile error', error);
            reject(error);
          });
      }) 
      .catch(err => {
        console.log('mkdir error', err);
        reject(err);
      });
  });
};
async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}