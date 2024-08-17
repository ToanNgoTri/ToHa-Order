import {
    Text,
    TextInput,
    TouchableOpacity,
    
} from 'react-native'


import {useState,useEffect,useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';

import {dataUser} from '../App';

import database from '@react-native-firebase/database';

function SignUp({navigation}){


  // const reference = database().ref('/users/Staff');


    const dataUserContent = useContext(dataUser);

    const [allUser, setallUser] = useState(dataUserContent.dataUserForApp)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [pass, setPass] = useState('')
    const [passAgain, setPassAgain] = useState('')
    // console.log('dataUserContent.dataUserForApp',dataUserContent.dataUserForApp);

    const {data,loading} = useSelector(state=>state)
useEffect(() => {
    // setallUser()
    setallUser(data)


    console.log('data',data);



}, [])


function push() {

  let duplicated = false
  if(allUser){
  if(pass == passAgain){

    allUser.map( (user,i)=>{
      if(username == user['userName']){

        duplicated = true
      }
      

    } )

    if(duplicated == true){
    
    console.log('Usename đã có người sử dụng');
  }else{

    firestore()
    .collection('users')
    .doc(name)
    .set({
      userName: username,
      pass: pass,
    })
    .then(() => {
      console.log('User added!');
    })
  
  
  //   reference.on('value', snapshot => {
  //     dataUserContent.updateData(snapshot.val())
  //     console.log(dataUserContent.dataUserForApp);
  // })

  navigation.navigate(`Home`)
  console.log('User added!');
  }
}else{
  console.log('mk k trùng');
}
  
}
}


    return(
        <>
              <Text>
              { ` Sign Up`}
      </Text>
      <TextInput
        style={{backgroundColor:'black', color:'white', marginBottom:9}}
        value={name}
        onChangeText={(text)=>{setName(text);}}
        placeholder='username'
        placeholderTextColor={'gray'}
        >

        </TextInput>

         <TextInput
        style={{backgroundColor:'black', color:'white', marginBottom:9}}
        value={username}
        onChangeText={(text)=>{setUsername(text);}}
        placeholder='username'
        placeholderTextColor={'gray'}
        >

        </TextInput>
        <TextInput
        style={{backgroundColor:'black', color:'white', marginBottom:9}}
        value={pass}
        onChangeText={(text)=>{setPass(text);}}
        placeholder='pass'
        placeholderTextColor={'gray'}
        secureTextEntry={true}
        >
</TextInput>
<TextInput
        style={{backgroundColor:'black', color:'white', marginBottom:9}}
        value={passAgain}
        onChangeText={(text)=>{setPassAgain(text);}}
        placeholder='pass'
        placeholderTextColor={'gray'}
        secureTextEntry={true}
        >
</TextInput>


<TouchableOpacity
onPress={()=>{push()}}
style={{backgroundColor:'orange',padding:5,marginTop:5}}
>
    
<Text>
    Push
</Text>
</TouchableOpacity>

        </>
    )
}

export default SignUp