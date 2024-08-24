
import {
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    View,
    PermissionsAndroid
} from 'react-native'
import database from '@react-native-firebase/database';
import {useState,useEffect,useContext} from 'react';
import {store} from '../redux/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {dataUser} from '../App';

// import {oldUser} from '../App';
import { useSelector, useDispatch } from 'react-redux';
import {loader,handle, run} from '../redux/loginReducer'


export function ManagerTab({navigation}) {
    const [data, setData] = useState(null);

    time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
  
    useEffect(() => {
        database()
          .ref(`/order/${year}/${month}/${day}`)
          .on('value', snapshot => {
            setData(snapshot.val());
          });
    
        // dispatch({type:'fetch'})
        // setData(dataOrder['order'][year][month][day]);
      }, []);
    return(
        <Text>
            Ddaay laf ManagerTab
        </Text>
    )
    
}

