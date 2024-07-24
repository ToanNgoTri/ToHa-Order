import {
    Text,
    TouchableOpacity
} from 'react-native'


import database from '@react-native-firebase/database';

function Home({navigation}){

    const reference = database().ref('/Ton');
    reference.on('value', snapshot => {
      console.log(snapshot.val());
    });

    return(
        <>
        <TouchableOpacity 
        style={{padding:10,backgroundColor:'red'}}
        onPress={()=>{navigation.navigate(`ForOdering`)}}>

            <Text> ForOdering</Text>
        </TouchableOpacity>
        <TouchableOpacity 
                style={{padding:10}}
                onPress={()=>{navigation.navigate(`ForCooking`)}}>

        <Text> ForCooking</Text>
    </TouchableOpacity>
    </>
)
}

export default Home