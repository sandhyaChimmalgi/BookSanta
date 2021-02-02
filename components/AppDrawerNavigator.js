import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import SettingScreen from '../screens/SettingScreen';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyDonationScreen from '../screens/MyDonationsScreen'
import NotificationScreen from '../screens/NotificationScreen'


export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator
    },
    MyDonations:{
      screen: MyDonationScreen
  },
  Notifications: {
    screen: NotificationScreen
  },
  Settings:{
    screen : SettingScreen
    }
    
  },
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })