import {
    Text
} from 'react-native'


import database from '@react-native-firebase/database';

function ForCooking(){

    const reference = database().ref('/Ton');
    reference.on('value', snapshot => {
      console.log(snapshot.val());
    });

    return(
        <Text> this is Cooking</Text>
    )
}

export default ForCooking