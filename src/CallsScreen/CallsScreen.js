import { View, Text } from 'react-native'
import React from 'react'
import AppHeader from '../components/AppHeader'
import { useTranslation } from 'react-i18next'
const CallsScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={{flex:1,backgroundColor:'#FAF9F6',}}>
     <AppHeader title={t('Calls')}/>
    </View>
  )
}

export default CallsScreen