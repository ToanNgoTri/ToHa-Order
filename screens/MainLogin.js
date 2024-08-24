import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,StyleSheet
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import inAppMessaging from '@react-native-firebase/in-app-messaging';
import {useState, useEffect, useContext} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {dataUser} from '../App';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import axios from 'axios';
import NotificationSounds from 'react-native-notification-sounds';
// import database from '@react-native-firebase/database';

// import { createSlice, configureStore } from '@reduxjs/toolkit'

// import { incremented, decremented, times, divide } from '../redux/action'
// import { logIn } from '../redux/loginReducer';
// import { store } from '../redux/store'
import {useSelector, useDispatch} from 'react-redux';
// import {loader,handle, run} from '../redux/loginReducer'

// import firestore from '@react-native-firebase/firestore';

import {requestUserPermission, GetFCMToke} from '../notification';

function MainLogin({navigation}) {
  const route = useRoute();

  const dataUserContent = useContext(dataUser);

  // const [allUser, setallUser] = useState([]);

  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  const [oldUsername, setOldUsername] = useState('');
  const [oldPass, setOldPass] = useState('');

  // const [table, setTable] = useState('')

  // const storeUser = async username => {
  //   try {
  //     await AsyncStorage.setItem('username', username);
  //   } catch (e) {
  //     //error
  //   }
  // };

  // const storePass = async pass => {
  //   try {
  //     await AsyncStorage.setItem('pass', pass);
  //   } catch (e) {
  //     //error
  //   }
  // };

  async function storeInternal(name, username, pass) {
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('pass', pass);
  }

  const getName = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('name');
      // console.log('jsonValue',jsonValue);
      return jsonValue != null ? jsonValue : null;
    } catch (e) {
      console.log(e);
    }
  };

  
  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('username');
      // console.log('username',jsonValue);
      return jsonValue != null ? jsonValue : null;
    } catch (e) {
      console.log(e);
    }
  };

  const getPass = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('pass');
      // console.log('jsonValue',jsonValue);
      return jsonValue != null ? jsonValue : null;
    } catch (e) {
      console.log(e);
    }
  };


  getPass().then(res => {
    setOldPass(res);
  });

  getUser().then(res => {
    setOldUsername(res);
  });

  getName().then(res => {
    setName(res);
  });

  const dispatch = useDispatch();

  const {userInfo, loading} = useSelector(state => state['login']);
  // console.log('data', data);

  async function onDisplayNotification(iden, stt) {
    // notifee: dùng để gửi noti cả khi app đang chạy
    // Request permissions (required for iOS)
    // await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'order',
      name: 'đặt',
      sound: 'ey',
    });

    // Display a notification
    if (stt) {
      await notifee.displayNotification({
        title: 'Khách đã đặt món',
        body: `Có đơn tại bàn số ${iden}`,
        android: {
          channelId,
          sound: 'ey',
          // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'order',
          },
        },
      });
    } else {
      await notifee.displayNotification({
        title: 'Khách đã hủy món',
        body: `Khách hủy đơn tại bàn số ${iden}`,
        android: {
          channelId,
          sound: 'ey',

          // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'order',
          },
        },
      });
    }
    //   ,{
    //   title: 'Khách đã hủy món',
    //   body: `Hủy món tại bàn số ${iden}`,
    //   android: {
    //     channelId,
    //     // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    //     // pressAction is needed if you want the notification to open the app when pressed
    //     pressAction: {
    //       id: 'cancel',
    //     },
    //   },
    // },
  }

  async function fetch() {
    try {
      console.log('ád');
      const abc = await axios.get(`https://tohaorderserver.onrender.com/`);
      console.log('abc.data', abc.data);
    } catch (e) {
      console.log('error', e);
    }
  }

  async function Order(num) {
    try {
      const abc = await axios.get(
        `https://tohaorderserver.onrender.com/order/${num}`,
      );
      console.log('abc', abc.data);
      onDisplayNotification(num, true);
    } catch (e) {
      console.log('error', e);
    }
  }

  async function Cancel(num) {
    try {
      const abc = await axios.get(
        `https://tohaorderserver.onrender.com/cancel/${num}`,
      );
      console.log('abc', abc.data);
      onDisplayNotification(num, false);
    } catch (e) {
      console.log('error', e);
    }
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  }

  async function GetFCMToke() {
    let fcmtoken = await AsyncStorage.getItem('fcmtoken');
    // console.log('old token',fcmtoken);

    if (!fcmtoken) {
      try {
        fcmtoken = await messaging().getToken();
        if (fcmtoken) {
          await AsyncStorage.setItem('fcmtoken', fcmtoken);
          // console.log('new token',fcmtoken);
        }
      } catch {}
    }
  }

  function BackgroundMessageHandler() {
    // khi có noti đến thì xử lý khi app không chạy

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }

  function ForegroundMessageHandler() {
    // khi có noti đến thì xử lý khi app đang chạy
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('Thông báo', remoteMessage['notification']['body']);
      console.log(remoteMessage['notification']['body']);
      // onDisplayNotification();
    });

    return unsubscribe;
  }

  async function bootstrap() {
    await inAppMessaging().setMessagesDisplaySuppressed(true);
  }

  useEffect(() => {
    //     setallUser(dataUserContent.dataUserForApp[`${route.name}`])
    // console.log(dataUserContent.dataUserForApp[`${route.name}`]);

    // store.dispatch(logIn({username,pass}))

    requestUserPermission();
    GetFCMToke();
    BackgroundMessageHandler();
    ForegroundMessageHandler();
    bootstrap();
  }, []);
  // console.log(allUser);

  if (userInfo) {
    for (let a = 0; a < userInfo.length; a++) {
      if (route.name == 'Staff') {
        // console.log(Object.values(data[a])[0]['userName']);
        if (Object.values(userInfo[a])[0]['userName'] == oldUsername) {
          if (Object.values(userInfo[a])[0]['pass'] == oldPass) {
            console.log('đã login');
            navigation.navigate(`StaffScreen`);
            break;
          } else {
            console.log('chưa login');
          }
        } else {
          console.log('chưa login');
        }
      } else {
        // console.log('Object.keys(data[a])["Boss"]', data[a]['Boss']);
        if (userInfo[a]['Boss']) {
          if (userInfo[a]['Boss']['userName'] == oldUsername) {
            if (userInfo[a]['Boss']['pass'] == oldPass) {
              navigation.navigate(`BossScreen`);
              console.log('đã login');
              break;
            }
          } else {
            // console.log('chưa login');
          }
        } else {
          // console.log('chưa login');
        }
      }
    }
  }

  console.log(name, oldUsername, oldPass);

  function checkUser() {
    if (userInfo) {
      // console.log(data.length);
      for (let a = 0; a < userInfo.length; a++) {
        // if(data[a]['userName']){
        //  Object.keys(data[a])[0]
        // }

        if (route.name == 'Staff') {
          // console.log(Object.values(data[a])[0]['userName']);
          if (Object.values(userInfo[a])[0]['userName'] == username) {
            if (Object.values(userInfo[a])[0]['pass'] == pass) {
              console.log('đúng');
              storeInternal(Object.keys(userInfo[a])[0], username, pass);
              navigation.navigate(`StaffScreen`);
              break;
            } else {
              // console.log('sai mk');
            }
          } else {
            // console.log('chưa đk');
          }
        } else {
          console.log('Object.keys(data[a])["Boss"]', userInfo[a]['Boss']);
          if (userInfo[a]['Boss']) {
            if (userInfo[a]['Boss']['userName'] == username) {
              if (userInfo[a]['Boss']['pass'] == pass) {
                storeInternal('Boss', username, pass);
                navigation.navigate(`BossScreen`);
                // console.log('đúng boss');
                break;
              }
            } else {
              // console.log('sai mk boss');
            }
          } else {
            // console.log('chưa đk boss');
          }
        }
      }
    }
  }

  return (
    <>
      {/* {loading && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.7,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
          <ActivityIndicator size="large" color="#cc3333"></ActivityIndicator>
        </View>
      )} */}
      <Text>{` For ${route.name}`}</Text>

      <TextInput
        style={{backgroundColor: 'black', color: 'white', marginBottom: 9}}
        value={username}
        onChangeText={text => {
          setUsername(text);
        }}
        placeholder="username"
        placeholderTextColor={'gray'}></TextInput>
      <TextInput
        style={{backgroundColor: 'black', color: 'white'}}
        value={pass}
        onChangeText={text => {
          setPass(text);
        }}
        placeholder="pass"
        placeholderTextColor={'gray'}
        secureTextEntry={true}></TextInput>

      <TouchableOpacity
        onPress={() => {
          // storeInternal()
          // storeUser(username);
          // storePass(pass);
          checkUser();

          if (route.name == 'Staff') {
            // navigation.navigate(`StaffScreen`)
          } else {
            // navigation.navigate(`BossScreen`)
          }
          navigation.navigate(`StaffScreen`)
        }}
        style={{backgroundColor: 'orange', padding: 5, marginTop: 5}}>
        <Text>Push</Text>
      </TouchableOpacity>
      {route.name == 'Staff' && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(`SignUp`);
          }}
          style={{backgroundColor: 'orange', padding: 5, marginTop: 5}}>
          <Text>SignUp</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          onDisplayNotification();
        }}
        style={{backgroundColor: 'orange', padding: 5, marginTop: 5}}>
        <Text>noti</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          fetch();
        }}
        style={{backgroundColor: 'orange', padding: 5, marginTop: 5}}>
        <Text>fetch</Text>
      </TouchableOpacity>

      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            marginRight: 20,
            backgroundColor: 'red',
            marginTop: 5,
            borderRadius: 100,
            width: 60,
            height: 60,
            justifyContent: 'center',
          }}>
          <Text
            style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
            bàn 1
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            Order(1);
          }}
          style={{
            marginRight: 15,
            backgroundColor: 'black',
            padding: 5,
            marginTop: 5,
            borderRadius: 50,
            width: 50,
            height: 50,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 12,
            }}>
            Order
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Cancel(1);
          }}
          style={{
            marginRight: 15,
            backgroundColor: 'black',
            padding: 5,
            marginTop: 5,
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 12,
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}


const styles = StyleSheet.create({

  
});



export default MainLogin;
