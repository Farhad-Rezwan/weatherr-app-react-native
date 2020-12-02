import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator, Platform} from 'react-native';
import * as Location from 'expo-location'
import {AppLoading} from 'expo';
import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import {colors} from './utils/index'
import {AntDesign} from '@expo/vector-icons';
import WeatherDetails from './components/WeatherDetails'

// API key for weatherAPI
const WEATHER_API_kEY = '524b195aaee3652d675ef4c745658124'
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'
const reloadIconName = 'ios-refresh'

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  // store the weather information in an state
  const [currentWeather, setCurrentWeather] = useState(null)
  /// create new state, at the begining we set as matric
  const [unitsSystem, setUnitSystem] = useState('metric')

  useEffect(() => {
    load()
    /// we can set [unitsSystem] to change and load automaatically, or we can do manualy
  }, [unitsSystem])
  async function load() {
    setCurrentWeather(null)
    /// setting error message to null everytime it loads even with picker
    setErrorMessage(null)
    try {
      // for loacation permission
      let {status} = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        setErrorMessage(`accessto location is needed to run the app`)
        return
      }
      const location = await Location.getCurrentPositionAsync()
      const {latitude, longitude} = location.coords

      const weatherURL = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_kEY}`

      /// make the request = we use same react native fetch function
      const response = await fetch(weatherURL)

      const result = await response.json()

      // to handle the api key, or request failure, ok is the utility
      if (response.ok) {
        setCurrentWeather(result)
      } else {
        setErrorMessage(result.message)
      }


    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  if (currentWeather) {
    /// two level
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <AntDesign onPress={load} name="reload1" size={24} color="black" style={styles.reloadIcon} color={colors.PRIMARY_COLOR} />
          <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitSystem} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails currentWeather={currentWeather} />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    flex: 1,
  },
  reloadIcon: {
    position: "absolute",
    top: 40,
    right: 20
  }
});
