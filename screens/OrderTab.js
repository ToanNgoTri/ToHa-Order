import {
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {useState, useEffect, useContext, useRef} from 'react';
import database from '@react-native-firebase/database';
import RNPickerSelect from 'react-native-picker-select';
import {Picker} from '@react-native-picker/picker';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import axios from 'axios';
import NotificationSounds from 'react-native-notification-sounds';
import {useSelector, useDispatch} from 'react-redux';
import {select} from 'redux-saga/effects';

import {Cancel,Order,requestUserPermission,GetFCMToke,BackgroundMessageHandler,ForegroundMessageHandler,bootstrap,fetch} from'../notification/index'

import {useRoute} from '@react-navigation/native';


function OrderComponent({navigation}) {


  const {dataOrder, loading} = useSelector(state => state['read']);
  let foodObject = {}

  if(dataOrder){
    dataOrder['cost'].map((key,i)=>{
            if(key['display']){
              foodObject[key['foodName']] = key['cost']
            }
})
}

const route = useRoute();


// console.log(route.name);


















  const [data, setData] = useState(null);
  const [inputSearchTable, setInputSearchTable] = useState('');
  const [searchTableResult, setSearchTableResult] = useState([]);
  const [inputModal, setInputModal] = useState('');
  const [searchInputModalResult, setInputModalResult] = useState([]);
  const [cost, setCost] = useState(foodObject);
  const [orderInfor, setOrderInfo] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTableOrder, setCurrentTableOrder] = useState(null);
  const [SL, setSL] = useState([]); // cái này để phụ trợ để khi sử dụng Dropdown luôn được re-render

  const dispatch = useDispatch();

  // foodSum = Object.keys(cost);

  time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();

  let tableSum = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  //   tableSum = [' Bàn số 1','Bàn số 2','Bàn số 3','Bàn số 4','Bàn số 5']

  // console.log('Table',Table);
  // let foodSum = ['Món A', 'Món B', 'Món C', 'Món D', 'Món E'];
  let foodSum = Object.keys(cost);

  useEffect(() => {
    setSearchTableResult(
      tableSum &&
        tableSum.filter(item => {
          if (
            inputSearchTable.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\s?)/gim)
          ) {
            let inputSearchTableReg = inputSearchTable;
            if (inputSearchTable.match(/\(/gim)) {
              inputSearchTableReg = inputSearchTableReg.replace(/\(/gim, '\\(');
            }

            if (inputSearchTable.match(/\)/gim)) {
              inputSearchTableReg = inputSearchTableReg.replace(/\)/gim, '\\)');
            }
            if (inputSearchTable.match(/\//gim)) {
              inputSearchTableReg = inputSearchTableReg.replace(/\//gim, '.');
            }
            if (inputSearchTable.match(/\\/gim)) {
              inputSearchTableReg = inputSearchTableReg.replace(/\\/gim, '.');
            }
            if (inputSearchTable.match(/\./gim)) {
              inputSearchTableReg = inputSearchTableReg.replace(/\./gim, '\\.');
            }
            if (inputSearchTable.match(/\+/gim)) {
              inputSearchTableReg = inputSearchTableReg.replace(/\+/gim, '\\+');
            }
            if (inputSearchTable.match(/\?/gim)) {
              inputSearchTableReg = inputSearchTableReg.replace(/\?/gim, '\\?');
            }

            return String(item).match(new RegExp(inputSearchTableReg, 'igm'));
          }
        }),
    );
    // console.log(searchTableResult);
  }, [inputSearchTable]);

  useEffect(() => {
    setInputModalResult(
      foodSum &&
        foodSum.filter(item => {
          if (inputModal.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\s?)/gim)) {
            let inputModalReg = inputModal;
            if (inputModal.match(/\(/gim)) {
              inputModalReg = inputModalReg.replace(/\(/gim, '\\(');
            }

            if (inputModal.match(/\)/gim)) {
              inputModalReg = inputModalReg.replace(/\)/gim, '\\)');
            }
            if (inputModal.match(/\//gim)) {
              inputModalReg = inputModalReg.replace(/\//gim, '.');
            }
            if (inputModal.match(/\\/gim)) {
              inputModalReg = inputModalReg.replace(/\\/gim, '.');
            }
            if (inputModal.match(/\./gim)) {
              inputModalReg = inputModalReg.replace(/\./gim, '\\.');
            }
            if (inputModal.match(/\+/gim)) {
              inputModalReg = inputModalReg.replace(/\+/gim, '\\+');
            }
            if (inputModal.match(/\?/gim)) {
              inputModalReg = inputModalReg.replace(/\?/gim, '\\?');
            }

            return String(item).match(new RegExp(inputModalReg, 'igm'));
          }
        }),
    );
    // console.log(searchTableResult);
  }, [inputModal]);

  function prepareOrderValue(selectQuantity, food, table) {
    let date = new Date();

    let timeOrder = date.getTime(); // thoi gian bat dau goi (chua goi xong)

    let orderInforCopy = orderInfor;


    if (selectQuantity > 0) {
      if (!Object.keys(orderInforCopy).length) {
        orderInforCopy = {
          [food]: {
            ordering: timeOrder,
            cooking: false,
            finish: false,
            cancel: false,
            quantity: selectQuantity,
            table: table,
            steady: false,
          },
        };
      } else {
        if (orderInforCopy[food]) {
          orderInforCopy[food]['quantity'] = selectQuantity;
        } else {
          orderInforCopy[food] = {
            ordering: timeOrder,
            cooking: false,
            finish: false,
            cancel: false,
            quantity: selectQuantity,
            table: table,
            steady: false,
          };
        }
      }
    } else {
      if (orderInforCopy[food]) {
        delete orderInforCopy[food];
      }

      // let a =  orderInforCopy.filter((key, i) => {

      //   if (orderInforCopy[i][food]) {
      //     return  false
      //   }

      // });

      // orderInforCopy= a
    }

    setOrderInfo(orderInforCopy);
    // console.log('orderInfor', orderInfor);
    setSL(SL + 1);
  }

  useEffect(() => {
    database()
      .ref(`/`)
      .on('value', snapshot => {
        if(snapshot.val()['order']){
        setData(snapshot.val()['order'][year][month][day]);

      }
      });

  }, []);

  async function OrderPush(table) {
    // let a = await database() // thử xem chạy có đúng không
    //   .ref(`/order/${year}/${month}/${day}`)
    //   .once('value');
    // let b = a.val();
    console.log(2);

    let dataPushOrdinal;
    if (data) {
      dataPushOrdinal = data.length;
    } else {
      dataPushOrdinal = 0;
    }

    let date = new Date();

    let timeOrder = date.getTime();

    // console.log(timeOrder);

    let orderInforCopy = orderInfor;

    Object.keys(orderInforCopy).map((key,i)=>{

    })
    console.log('orderInforCopy',orderInforCopy);
    setOrderInfo({}); // de cuong ep re-render

    setOrderInfo(orderInforCopy);
    database()
      .ref(`/order/${year}/${month}/${day}/${dataPushOrdinal}`)
      .set(orderInforCopy);
  }

  function cancel(i1, food) {
    let date = new Date();
    let timeCancel = date.getTime()

    database()
      .ref(`/order/${year}/${month}/${day}/${i1}/${food}`)
      .update({
        cancel: timeCancel,
      })
      .then(() => console.log('Data updated.'));
  }

  function finish(i1, food) {
    let date = new Date();

    let timeFinish = date.getTime()

    database()
      .ref(`/order/${year}/${month}/${day}/${i1}/${food}`)
      .update({
        finish: timeFinish,
      })
      .then(() => console.log('Data updated.'));
  }

  function CashAll(table) {
    // let a = await database()                               // thử bỏ xem có hoạt động đúng không
    //   .ref(`/order/${year}/${month}/${day}`)
    //   .once('value');
    // let b = a.val();

    let totalFee = 0;
    let exist;

    let date = new Date();
    let timeFinish = date.getTime()


    let foodnames = [];
    let foodCancel = false;
    let foodFinish = false;
    let foodQuantity = [];

    let ordinal;

    if (data) {
      data.map((key, i) => {
        if (Object.entries(key)[0][1]['table'] == table) {
          Object.entries(key).map((info, i1) => {
            if (!info[1]['finish'] && !info[1]['cancel']) {
              foodnames = [...foodnames, info[0]];
              foodCancel = foodCancel ? true : info[1]['cancel'];
              foodFinish = foodFinish ? true : info[1]['finish'];
              foodQuantity = info[1]['quantity'];
              ordinal = i;
              exist = true;
              if (!totalFee) {
                totalFee = cost[info[0]] * foodQuantity;
              } else {
                totalFee = totalFee + cost[info[0]] * foodQuantity;
              }
            }
          });
        }
      });
    }

    function done(foodFinish, foodCancel, ordinal) {
      if (!foodFinish && !foodCancel) {
        foodnames.map((foodname, i) => {
          console.log(foodname);
          database()
            .ref(`/order/${year}/${month}/${day}/${ordinal}/${foodname}`)
            .update({
              finish:timeFinish,
            })
            .then(() => console.log('Data updated.'));
        });
      }
    }

    if (totalFee) {
      Alert.alert('Tính tiền', `Số tiền cần tính là ${totalFee}`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => done(foodFinish, foodCancel, ordinal)},
      ]);
    } else {
      Alert.alert('Thông báo', `Không có gì để thanh toán`, [{text: 'OK'}]);
    }
  }

  function showOrderModal(selectQuantity, food) {
    // let currentOrderCopy = currentOrder;
    // if (selectQuantity != -1) {
    //   setCurrentOrder({...currentOrder, [food]: selectQuantity});
    //   console.log(1);
    // } else if (currentOrder[food]) {
    //   // delete currentOrderCopy[food];
    //   // setCurrentOrder(null)
    //   setCurrentOrder({})
    //   delete currentOrderCopy[food];
    //   setCurrentOrder(currentOrderCopy);
    //   setSL(SL+1)
    // }
  }

  // useEffect(() => {
  //   console.log('currentOrder', currentOrder);
  // }, [currentOrder]);

  return (
    <>
      {loading && (
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
      )}

      {modalVisible && (
        <Modal
          presentationStyle="pageSheet"
          animationType="slide"
          visible={modalVisible}
          style={{backgroundColor: 'orange'}}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              setOrderInfo({});
              setCurrentTableOrder(null);
              // setCurrentOrder({});
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
          <TextInput
            onChangeText={text => setInputModal(text)}
            value={inputModal}
            style={inputModal ? styles.inputSearchArea : styles.placeholder}
            placeholder="Nhập món ..."
            placeholderTextColor={'gray'}
            keyboardAppearance=""></TextInput>

          <ScrollView style={{backgroundColor: 'orange'}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 60,
                // flex: 1,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                // height:'100%'
                // width:100
              }}>
              {foodSum &&
                (searchInputModalResult || foodSum).map((food, i) => (
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
                      }}>
                      {food}
                    </Text>
                    <Text>

                    </Text>
                    <View style={styles.PickerContainer}>
                      <RNPickerSelect
                        placeholder={{label: '0', value: -1}}
                        onValueChange={(selectQuantity, i) => {
                          // showOrderModal(food, selectQuantity);
                          prepareOrderValue(
                            selectQuantity,
                            food,
                            currentTableOrder,
                          );
                        }}
                        // value={
                        //   orderInfor[currentTableOrder - 1]
                        //     ? orderInfor[currentTableOrder - 1][food]
                        //       ? orderInfor[currentTableOrder - 1][food][
                        //           'quantity'
                        //         ]
                        //       : -1
                        //     : -1
                        // }
                        style={pickerSelectStyles}
                        items={[
                          // {label: 'none', value: -1},
                          {label: '1', value: 1},
                          {label: '2', value: 2},
                          {label: '3', value: 3},
                          {label: '4', value: 4},
                          {label: '5', value: 5},
                          {label: '6', value: 6},
                        ]}
                      />
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>
          <View
            style={{
              bottom: 0,
              // position: 'absolute',
              width: '100%',
              backgroundColor: 'yellow',
            }}>
            <View
              style={{
                width: '100%',
                // paddingBottom: 10,
                padding: 10,
                backgroundColor: 'BLACK',
              }}>
              <Text
                style={{
                  marginBottom: 5,
                }}>
                Các món đã đặt
              </Text>

              {orderInfor &&
                Object.entries(orderInfor).map((key, i) => {
                  if (key) {
                    let nameFood = Object.getOwnPropertyNames(key)[0];
                    // console.log('nameFood',nameFood);
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            backgroundColor: 'WHITE',
                          }}>
                          {key[0]}
                        </Text>
                        <Text
                          style={{
                            backgroundColor: 'WHITE',
                          }}>
                          X {key[1]['quantity']}
                        </Text>
                      </View>
                    );
                  }
                })}
            </View>

            <TouchableOpacity
              onPress={() => {
                OrderPush(currentTableOrder);
                setModalVisible(false);
                // setCurrentOrder({});
                setOrderInfo({});
                if(Object.keys(orderInfor).length){
                  Order(currentTableOrder)

                }
              }}
              style={{
                marginRight: 15,
                backgroundColor: 'black',
                left: 0,
                width: '100%',
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
          </View>
        </Modal>
      )}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View           style={{
            flexDirection: 'column',
            backgroundColor: 'blue',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            height: 50,
            // width: 100,
            padding:0
          }}>

        <Text
          style={{
            flexDirection: 'column',
            backgroundColor: 'yellow',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}>
          Bàn số
        </Text></View>
        <TextInput
          onChangeText={text => setInputSearchTable(text)}
          value={inputSearchTable}
          style={inputSearchTable ? styles.inputSearchArea : styles.placeholder}
          placeholder="Nhập số ..."
          placeholderTextColor={'gray'}
          keyboardAppearance="">

          </TextInput>
      </View>
      <ScrollView
      // style={{
      //   display: 'flex',
      //   flexDirection: 'collumn',
      //   alignItems: 'center',
      // }}
      >
        {tableSum &&
          (searchTableResult || tableSum).map((table, i) => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'collumn',
                alignItems: 'center',
              }}>
              <View
                style={{
                  // marginRight: 20,
                  marginTop: 20,
                  // width: 60,
                  // height: 60,
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'yellow',
                  // height:400
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    backgroundColor: 'red',
                    marginRight: 20,
                    width: 40,
                    height: 40,
                    // marginTop: 10,
                    textAlign: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  bàn số {table}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'collumn',
                    width: 200,
                    backgroundColor: 'blue',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: 10,
                    }}>
                    {data &&
                      data.map((key, i1) => {
                        if (Object.entries(key)[0][1]['table'] == table) {
                          {
                            return (
                              key &&
                              Object.entries(key).map((info, i2) => {
                                let foodname = info[0];
                                let foodCancel = info[1]['cancel'];
                                let foodCooking = info[1]['cooking'];
                                let foodFinish = info[1]['finish'];
                                let foodOrdering = info[1]['ordering'];
                                let foodSteady = info[1]['steady'];
                                let foodQuantity = info[1]['quantity'];
                                let foodTable = info[1]['table'];

                                if (!foodFinish && !foodCancel) {
                                  let statusColor;
                                  if (foodSteady) {
                                    statusColor = 'green';
                                  } else if (foodCooking) {
                                    statusColor = 'red';
                                  } else if (foodOrdering) {
                                    statusColor = 'blue';
                                  }

                                  return (
                                    <View
                                      style={{
                                        backgroundColor: statusColor,
                                        marginBottom: 10,
                                        display: 'flex',
                                        flexDirection: 'row',
                                      }}>
                                      <View>
                                        <Text>{foodname}</Text>
                                        <Text>Đơn Giá: {cost[foodname]}</Text>
                                        <Text>Số lượng: {foodQuantity}</Text>
                                      </View>

                                      <View
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: 'space-evenly',
                                          alignItems: 'center',
                                          display: 'flex',
                                          flex: 1,
                                        }}>
                                        <TouchableOpacity
                                          style={{
                                            width: 45,
                                            height: 45,
                                            backgroundColor: 'black',
                                            borderRadius: 40,

                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                          onPress={() => {
                                            cancel(i1, foodname);
                                            Cancel(foodTable)
                                          }}>
                                          <Text
                                            style={{
                                              color: 'white',
                                              textAlign: 'center',
                                            }}>
                                            Cancel
                                          </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                          style={{
                                            width: 45,
                                            height: 45,
                                            backgroundColor: 'black',
                                            borderRadius: 40,

                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                          onPress={() => {
                                            finish(i1, foodname);
                                          }}>
                                          <Text
                                            style={{
                                              color: 'white',
                                              textAlign: 'center',
                                            }}>
                                            Finish
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  );
                                }
                              })
                            );
                          }
                        }
                      })}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'green',
                    flex: 1,
                    height: 150,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                      setCurrentTableOrder(table);
                    }}
                    style={{
                      backgroundColor: 'orange',
                      height: 50,
                      width: 50,
                      // padding:20,
                      justifyContent: 'center',
                    }}>
                    <Text style={{textAlign: 'center'}}>Mở</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      CashAll(table);
                    }}
                    style={{
                      // marginRight: 15,
                      backgroundColor: 'black',
                      // padding: 5,
                      // marginTop: 5,
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
                      CashAll
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  borderTopWidth: 3,
                  borderTopColor: 'black',
                  borderStyle: 'solid',
                }}></View>
            </View>
          ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  PickerContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    // marginTop:20,
    // backgroundColor:'green',
    height: 40,
  },
  inputSearchArea: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18,
    color: 'black',
    width: '60%',
    alignItems: 'center',
    height: 50,
  },
  placeholder: {
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
    width: '85%',
    alignItems: 'center',
    height: 50,
  },
});

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
export default OrderComponent;
