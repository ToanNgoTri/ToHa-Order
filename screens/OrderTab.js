import {
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    View,
    Alert,
  } from 'react-native';
  import {useState, useEffect, useContext} from 'react';
  
  import messaging from '@react-native-firebase/messaging';
  import notifee from '@notifee/react-native';
  import axios from 'axios';
  import NotificationSounds from 'react-native-notification-sounds';
  import {useSelector, useDispatch} from 'react-redux';
  
  function Order({navigation}) {

    
    return (
      <>
    <Text>
        tôi là Order
    </Text>
  
      </>
    );
  }
  
  export default Order;
  