import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function GetFCMToke() {
    let fcmtoken =await AsyncStorage.getItem('fcmtoken')
    console.log('old token',fcmtoken);

    if (!fcmtoken){
try{

        let fcmtoken = messaging().getToken()
    if(fcmtoken){
      await  AsyncStorage.getItem('fcmtoken',fcmtoken);
      console.log('new token',fcmtoken);
    }
        
        
    }catch{
        
    }
}

}