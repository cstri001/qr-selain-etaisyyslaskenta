import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Button } from 'react-native-paper'

const atmData = require('../json/automaatit.json')

type Atm = {
  distance: number | null,
  streetAddress: string, 
  zipCode: string, 
  city: string
}

export default function LocationDistance() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null)
  const [closestAtm, setClosestAtm] = useState<Atm>({
    distance: null, 
    streetAddress: '', 
    zipCode: '', 
    city: ''
  })


  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location.coords)
      }
    }
    
    getCurrentLocation()

  }, [])



  const calculateDistance = (data : any) => {
    if (!location) return undefined

    // Use a variable here to store the info for the duration of the for..of -loop, so we can 
    // avoid calling the setter one million times
    let shortestDistanceAtm : Atm = closestAtm;
    const R = 6371;

    for (let atm of data) {
      const distanceLat = ((atm.koordinaatti_LAT - location!.latitude) * Math.PI) / 180
      const distanceLon = ((atm.koordinaatti_LON - location!.longitude) * Math.PI) / 180
      const a = 
        Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
        Math.cos((location!.latitude * Math.PI) / 180) *
        Math.cos((atm.koordinaatti_LAT * Math.PI) / 180) *
        Math.sin(distanceLon / 2) * Math.sin(distanceLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = (R * c)

      if (shortestDistanceAtm.distance === null || distance < shortestDistanceAtm.distance) {
        shortestDistanceAtm = {
          distance: distance,
          streetAddress: atm.katuosoite,
          zipCode: atm.postinumero,
          city: atm.postitoimipaikka
        }
      }
    }
    
    setClosestAtm(shortestDistanceAtm)
  }

  const renderAtm = () => {
    return (
      <View>
        <Text>
          {closestAtm!.streetAddress}
        </Text>
        <Text>
          {closestAtm!.zipCode} 
        </Text>
        <Text>
          {closestAtm!.city} 
        </Text>
        <Text>
          Distance to ATM: {closestAtm.distance !== null ? closestAtm.distance.toFixed(2) : 'Not found.'} km.
        </Text>
      </View>
    )
  }

  
  return (
    <View>
      <Button
        onPress={() => calculateDistance(atmData)}
        mode='contained'
      >
        Etsi lähin Ottomaatti
      </Button>
      <Text>
        {closestAtm.distance ? renderAtm() : null}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({

})