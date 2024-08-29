import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import axios from 'axios';
import NotificationSounds from 'react-native-notification-sounds';
import inAppMessaging from '@react-native-firebase/in-app-messaging';
import {
  Alert
} from 'react-native';






export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
  }
}

export async function GetFCMToke() {
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

export function BackgroundMessageHandler() {
  // khi có noti đến thì xử lý khi app không chạy 

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
}

export function ForegroundMessageHandler() {
  // khi có noti đến thì xử lý (handle) khi app đang chạy
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert('Thông báo', remoteMessage['notification']['body']);
    console.log("remoteMessage['notification']['body']",remoteMessage['notification']['body']);
    // onDisplayNotification();
  });

  return unsubscribe;
}




export async function bootstrap() {
  await inAppMessaging().setMessagesDisplaySuppressed(true);
}

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

export async function fetch() {     // để lấy thông tin từ server về 
  try {
    console.log('ád');
    const abc = await axios.get(`https://tohaorderserver.onrender.com/`);
    console.log('abc.data', abc.data);
  } catch (e) {
    console.log('error', e);
  }
}

export async function Order(num) {
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

export async function Cancel(num) {
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
