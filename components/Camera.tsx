import { CameraView, useCameraPermissions, CameraType, CameraCapturedPicture, CameraPictureOptions, BarcodeScanningResult } from "expo-camera"
import { useRef, useState, useEffect, SetStateAction } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview'
import { StyleSheet, Text } from "react-native";
import Constants from "expo-constants";


type Props = {
  setCameraMode: React.Dispatch<SetStateAction<boolean>>
}

export default function Camera({setCameraMode} : Props) : React.ReactElement {
  const [pictureMode, setPictureMode] = useState<boolean>(false)
  const ref = useRef<CameraView>(null)
  const [scanned, setScanned] = useState<boolean>(false)
  const [uri, setUri] = useState<string>('')

  const openUrl = (data : BarcodeScanningResult) => {
    setScanned(true)
    console.log(data.data)
    
    setUri(data.data)

  }


  const cameraView = () => {
    return (
      <CameraView 
        ref={ref} 
        style={styles.cameraView} 
        facing={'back'}
        barcodeScannerSettings={{
          barcodeTypes: ['qr']
        }}
        onBarcodeScanned={!scanned ? data => openUrl(data) : undefined}
        animateShutter={false}
      >
      </CameraView>
    )
  }

  const websiteRender = () => {
    return (
      <WebView 
        source={{uri}}
        style={styles.webView}
      />
    )
  }


  return (
    <SafeAreaProvider style={styles.container}>
      {!uri ? cameraView() : websiteRender()}
    </SafeAreaProvider>
  )
} 

// Remember to define width here - otherwise it won't show anything
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
  cameraView: {
    flex: 1,
    width: '100%',
    height: 400
  },
  webView: {
    marginTop: Constants.statusBarHeight
  }
})