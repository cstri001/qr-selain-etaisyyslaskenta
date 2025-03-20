import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, CameraType, CameraCapturedPicture, CameraPictureOptions } from "expo-camera"
import { Button, BottomNavigation } from 'react-native-paper';
import Camera from './components/Camera';
import { useState } from 'react';

export default function App() {

  const [permission, requestPermission] = useCameraPermissions()
  const [cameraMode, setCameraMode] = useState<boolean>(false)
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    {key: 'qr', title: 'QR skanneri', focusedIcon: 'camera', unfocusedIcon: 'camera-outline'},
    {key: 'distance', title: 'Etäisyys', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline'}
  ])

  const askPermission = async () => {
    await requestPermission()
    setCameraMode(permission?.granted!)

  }

  const qrCameraView = () => {
    return (
      <View style={styles.viewContainer}>
        {!cameraMode 
          ? <Button onPress={askPermission} mode='contained'>Skannaa QR koodi</Button> 
          : <Camera setCameraMode={setCameraMode} />
        }
      </View>
    )
  }

  // if the bottom navigation tab is changed to something other than QR camera (index 0), 
  // turn off camera
  // mode (otherwise the QR scan screen is black and doesn't work)
  const turnOffCameraMode = (index : number) => {
    setCameraMode(false)

    setIndex(index)
  }

  const distanceCalcView = () => {
    return (
      <View style={styles.viewContainer}>
        <Text>Mau</Text>
      </View>
    )
  }


  const renderScene = BottomNavigation.SceneMap({
    qr: qrCameraView,
    distance: distanceCalcView
  })

  return (
    <SafeAreaProvider>
      <BottomNavigation 
        navigationState={{index, routes}} 
        onIndexChange={index => index !== 0 ? turnOffCameraMode(index) : setIndex(index)} 
        renderScene={renderScene}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  viewContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
