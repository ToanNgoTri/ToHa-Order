import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  PermissionsAndroid,
  ScrollView,
  Button,
  Alert,
  Keyboard,
  Modal,
  StyleSheet
} from 'react-native';
import database from '@react-native-firebase/database';
import {useState, useEffect, useContext} from 'react';
import {store} from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dataUser} from '../App';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

// import {oldUser} from '../App';
import {useSelector, useDispatch} from 'react-redux';
import {loader, handle, run} from '../redux/loginReducer';

export function ManagerTab({navigation}) {
  const [foodData, setFoodData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [addFood, setaddFood] = useState('');
  const [addCost, setaddCost] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
const [tableTotal, setTableTotal] = useState(0)
  const [foodInputFix, setFoodInputFix] = useState('');
  const [costInputFix, setCostInputFix] = useState('');
  const [ordFix, setOrdFix] = useState('');

  const [ObjectFixFood, setObjectFixFood] = useState({});

  time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();

  const {dataOrder, loading} = useSelector(state => state['read']);

  let tableTotalChoosen = []

  for(let a = 0 ; a<30;a++){
    tableTotalChoosen[a] = {label: `${a+1}`, value: a+1}
  }


  async function getUserData() {
    let userDatacopy = [];
    const snap = await firestore().collection('users').get();
    snap.docs.map((doc,i) => {
      userDatacopy[i] = {[doc.id]:doc.data()};
    }); // nếu là doc.id là để lấy tên document
    setUserData(userDatacopy);


    // setUserData(userInfo)
    // console.log('userData', userData);
  }


  useEffect(() => {
    
    database()
      .ref(`/`)
      .on('value', snapshot => {
        setFoodData(snapshot.val()['cost']);
        setTableTotal(snapshot.val()['table'])
        // console.log('tableTotal',tableTotal);
      });
      // dispatch({type:'fetch'})
      // setFoodData(dataOrder['order'][year][month][day]);
      getUserData();
    }, []);

    
  async function addedHandle() {
    Keyboard.dismiss();
    // console.log(123);
    // if(addFood && addCost){
    // if(!data[addFood]){

    let dataPushOrdinal;
    if (foodData) {
      dataPushOrdinal = Object.keys(foodData).length;
    } else {
      dataPushOrdinal = 0;
    }

    await database()
      .ref(`/cost/${dataPushOrdinal}`)
      .set({foodName:addFood,cost: parseFloat(addCost),display:true});

    // }else{
    //   Alert.alert('đã có món đó rôi')
    // }
    // }
    setaddCost('');
    setaddFood('');
  }

  async function fixhandle(ord) {
    Keyboard.dismiss();
    // console.log(123);
    // if(addFood && addCost){
    // if(!data[addFood]){

    await database()
      .ref(`/cost/${ord}`)
      .set({foodName:[foodInputFix],cost:parseFloat(costInputFix),display:true});

    // }else{
    //   Alert.alert('đã có món đó rôi')
    // }
    // }

  }

  return (
    <>
      <ScrollView>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 40,
            }}>
            {foodData &&
              Object.keys(foodData).map((key, i) => {
                // console.log('foodData[key]',foodData[key]);
                if (foodData[key]['display']) {
                  return (
                    <View key={i}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginTop: 20,
                          alignItems: 'center',
                          backgroundColor: 'orange',
                        }}>
                        <Text
                          style={{
                            margin: 10,
                            padding: 8,
                            backgroundColor: 'yellow',
                          }}>
                          {foodData[key]['foodName']}
                        </Text>
                        <Text
                          style={{
                            margin: 10,
                            padding: 8,
                            backgroundColor: 'green',
                          }}>
                          {foodData[key]['cost'].toLocaleString('vi-VN')}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            // fixhandle(key);
                            setObjectFixFood({
                              [(foodData[key])['foodName']]: (foodData[key])['cost'],
                            });
                            setModalVisible(true);
                            setOrdFix(key)
                            setFoodInputFix(foodData[key]['foodName'])
                            setCostInputFix(foodData[key]['cost'].toString())
                          }}
                          style={{
                            backgroundColor: 'red',
                            padding: 10,
                            height: 40,
                            marginRight: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{textAlign: 'center'}}>Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={async () => {
                            await database().ref(`/cost/${key}`).update({display:false});
                          }}
                          style={{
                            backgroundColor: 'red',
                            padding: 10,
                            height: 40,
                            marginRight: 20,
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              backgroundColor: 'white',
                            }}>
                            Xóa
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }else{  // khi display:false
                  
                }
              })}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                alignItems: 'center',
                backgroundColor: 'orange',
                padding: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{margin: 10, padding: 8, backgroundColor: 'yellow'}}>
                  Món
                </Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    margin: 5,
                    paddingLeft: 7,
                    paddingRight: 7,
                  }}
                  placeholder="Nhập món..."
                  placeholderTextColor={'gray'}
                  onChangeText={text => setaddFood(text)}
                  value={addFood}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{margin: 10, padding: 8, backgroundColor: 'yellow'}}>
                  Giá:
                </Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    margin: 5,
                    paddingLeft: 7,
                    paddingRight: 7,
                  }}
                  placeholder="Nhập giá..."
                  placeholderTextColor={'gray'}
                  onChangeText={text => setaddCost(text)}
                  value={addCost}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={addedHandle}
              style={{
                backgroundColor: 'red',
                padding: 10,
                height: 40,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text style={{textAlign: 'center'}}>Thêm</Text>
            </TouchableOpacity>
          </View>




          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 40,
            }}>
            {userData &&
              (userData).map((key, i) => {
let banned = Object.values(key)[0]['banned']
                if(banned){
                  console.log('Object.getOwnPropertyNames(key)[0]',Object.getOwnPropertyNames(key)[0]);
                }
                return (
                    <View key={i}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginTop: 20,
                          alignItems: 'center',
                          backgroundColor: banned?'gray':'orange',
                        }}>
                        <Text
                          style={{
                            margin: 10,
                            padding: 8,
                            backgroundColor: 'yellow',
                          }}>
                          {Object.getOwnPropertyNames(key)[0]}
                        </Text>
                        <Text
                          style={{
                            margin: 10,
                            padding: 8,
                            backgroundColor: 'green',
                          }}>
                          {/* {Object.values(foodData[key])[0]} */}
                        </Text>
                        <TouchableOpacity
                          onPress={async () => {
                            firestore()
                            .collection('users')
                            .doc(Object.getOwnPropertyNames(key)[0])
                            .update({
                              banned:banned?false: true,
                            })

                            let userDatacopy = [];
                            const snap = await firestore().collection('users').get();
                            snap.docs.map((doc,i) => {
                              userDatacopy[i] = {[doc.id]:doc.data()};
                            }); // nếu là doc.id là để lấy tên document
                            setUserData(userDatacopy);
                        
                          }}
                          style={{
                            backgroundColor: 'red',
                            padding: 10,
                            height: 40,
                            marginRight: 20,
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              backgroundColor: 'white',
                            }}>
                            {banned ? 'Unbanned':'Banned'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
              })}
            {/* <TouchableOpacity
              onPress={addedHandle}
              style={{
                backgroundColor: 'red',
                padding: 10,
                height: 40,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text style={{textAlign: 'center'}}>Thêm</Text>
            </TouchableOpacity> */}
          </View>

          <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      backgroundColor: 'black',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      marginBottom: 40,
                    }}>
                    <Text
                      style={{
                        backgroundColor: 'red',
                        // height:40,
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        marginRight: 20,
                        marginLeft: 20,
                      }}>
                      Số lượng bàn hiện sử dụng {dataOrder['table']} bàn
                    </Text>

          <View style={styles.PickerContainer}>

          <RNPickerSelect
                        // placeholder={{label: `${tableTotal}`, value: tableTotal}}
                        onValueChange={async (selectQuantity, i) => {
                          await database()
                          .ref(`/table`)
                          .set(selectQuantity);
                    
                        }}
                        // value={tableTotal
                        // }
                        style={pickerSelectStyles}
                        items={
                          tableTotalChoosen                          
                        //   [
                        //   {label: '1', value: 1},
                        //   {label: '2', value: 2},
                        //   {label: '3', value: 3},
                        //   {label: '4', value: 4},
                        //   {label: '5', value: 5},
                        //   {label: '6', value: 6},
                        // ]
                      }
                      />

          </View>
          </View>

        </View>
      </ScrollView>

      {modalVisible && (
        <Modal
          presentationStyle="pageSheet"
          animationType="slide"
          visible={modalVisible}
          style={{backgroundColor: 'orange'}}>
                      <TouchableOpacity
            onPress={() => {
              setModalVisible(false)
              setCostInputFix('')
              setFoodInputFix('')

            }}
            style={{padding: 10}}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
                color: 'black',
              }}>
              Đóng
            </Text>
          </TouchableOpacity>

          <ScrollView style={{}}>
            <View style={{paddingTop: 20}}>
              <View>
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginBottom: 30,
                      fontWeight: 'bold',
                    }}>
                    {/* Tổng Thành tiền {sumMoney} */}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    
                    justifyContent: 'space-around',
                  }}>
                  <Text>Món hiện tại {Object.keys(ObjectFixFood)[0]}</Text>
                  <Text>Giá hiện tại {Object.values(ObjectFixFood)[0]}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'yellow',
                    justifyContent: 'space-around',
                  }}>
                  <TextInput
                               style={{color:'white',backgroundColor:'black'}}
                               value={foodInputFix}
                  onChangeText={(text=>setFoodInputFix(text))}
                  placeholder='nhập tên món sửa'
                  placeholderTextColor={'gray'}  
                  />
                  <TextInput
                  style={{color:'white',backgroundColor:'black'}}
                  value={costInputFix}
                  onChangeText={(text=>setCostInputFix(text))}
                  placeholder='nhập giá sửa'
                  placeholderTextColor={'gray'}
                  />
                </View>

              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              fixhandle(ordFix)
              setCostInputFix('')
              setFoodInputFix('')
            }}
            style={{padding: 10, backgroundColor: 'black', bottom: 0}}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
                color: 'white',
              }}>
              Sửa
            </Text>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );


  
  
}
const styles = StyleSheet.create({
  PickerContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    // marginTop:20,
    // backgroundColor:'green',
    height: 40,
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    // backgroundColor:'green',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
