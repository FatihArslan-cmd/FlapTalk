import { View, Text } from 'react-native'
import React from 'react'
import AppHeader from '../components/AppHeader'

const CallsScreen = () => {
  return (
    <View style={{flex:1,       backgroundColor:'#FAF9F6'
      ,
    }}>
     <AppHeader title={'Calls'}/>
    </View>
  )
}

export default CallsScreen