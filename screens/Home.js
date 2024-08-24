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
// import messaging from '@react-native-firebase/messaging';


function Home({navigation}){

    const dispatch = useDispatch()

    const {data,loading} = useSelector(state=>state['login'])


    
    // const {data,loading} = useSelector(state => state);


    // const [allUser, setallUser] = useState([])

// .then(getPass().then( res => {setOldPass(res);}))

const dataUserContent = useContext(dataUser);



    useEffect(() => {


        const listener = navigation.addListener("focus", () => {
            dispatch({type:'run'})
            dataUserContent.updateData(data)
            console.log('run2');
        
        });
        




        // const oldUserData = useContext(oldUser);

        // const reference = database().ref('/users');
        // reference.on('value', snapshot => {
        //     // dataUserContent.updateData(snapshot.val())
        //     console.log(snapshot.val());
        // })

        // listener()


        // dispatch({type:'run'})
        // if(isFocused){
            // dispatch({type:'run'})
            // dataUserContent.updateData(data)
            // console.log('run1');
        // }
        // console.log('run');
    }, [navigation])
        

        // console.log('data',data);

        const getUser = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('username');
                // console.log('username',jsonValue);
              return jsonValue != null ? jsonValue : null;
          } catch (e){
            console.log(e);
          }
        }
    
        const getPass = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('pass');
                // console.log('jsonValue',jsonValue);
                return jsonValue != null ?  (jsonValue) : null;
          } catch (e){
            console.log(e);
          }
        }
    
    
    return(
        <>
        { loading && (
        <View style={{position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:10
        }}>
        <ActivityIndicator size='large' color="#cc3333" >

        </ActivityIndicator>
        </View>
        )}
        <TouchableOpacity 
        style={{padding:10,backgroundColor:'red'}}
        onPress={()=>{navigation.navigate(`Staff`)}}>

            <Text> ForStaff</Text>
        </TouchableOpacity>
        <TouchableOpacity 
                style={{padding:10}}
                onPress={()=>{navigation.navigate(`Boss`)}}>

        <Text> ForBoss</Text>
        </TouchableOpacity>
    </>
)
}

export default Home