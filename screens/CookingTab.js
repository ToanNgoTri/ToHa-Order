import {
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import {useState, useEffect, useContext, useRef} from 'react';
import database from '@react-native-firebase/database';

import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import axios from 'axios';
import NotificationSounds from 'react-native-notification-sounds';
import {useSelector, useDispatch} from 'react-redux';
import {Cancel,Order,requestUserPermission,GetFCMToke,BackgroundMessageHandler,ForegroundMessageHandler,bootstrap,fetch} from'../notification/index'

function Cooking({navigation}) {
  const [data, setData] = useState([]);
  const {dataOrder, loading} = useSelector(state => state['read']);
  // const [SL, setSL] = useState([]); // cái này để phụ trợ để khi sử dụng Dropdown luôn được re-render
  const [foodSolved, setFoodSolved] = useState([]);
  const [foodSteady, setFoodSteady] = useState([]);
  time = new Date();
  const dispatch = useDispatch();
  const {width, height} = Dimensions.get('window');

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
    // ForegroundMessageHandler()
    BackgroundMessageHandler();
    // requestUserPermission();

  }, []);

  // console.log('data',data);

  let foodSolvedArray = [];
  let foodSteadyArray = [];

  function foodCooking(key, i) {
    // console.log(Object.entries(key));
    // console.log('Object.entries(key)[0][1]',Object.entries(key)[0][1]['table']);

    return Object.entries(key).map((info, i1) => {
      let foodname = info[0];
      let foodCancel = info[1]['cancel'];
      let foodCooking = info[1]['cooking'];
      let foodFinish = info[1]['finish'];
      let foodTable = info[1]['table'];
      let foodOrdering = info[1]['ordering'];
      let foodSteady = info[1]['steady'];
      let foodQuantity = info[1]['quantity'];
      // let foodTime = info[1]['timeOrder'];

      if (!foodFinish && !foodCancel && !foodSteady) {
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
              flexDirection: 'collumn',
              backgroundColor: statusColor,
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: statusColor,
                width: width - 20,
              }}>
              <View
                style={{
                  width: 200,
                }}>
                <Text style={{fontWeight: 700, fontSize: 17, color: 'black'}}>
                  Bàn số {foodTable}
                </Text>

                <Text>name : {foodname}</Text>
                <View>
                  <Text>số lượng: {foodQuantity}</Text>
                  <Text>
                    Thời gian đặt:{' '}
                    {`${new Date(foodOrdering).getHours()} : ${new Date(
                      foodOrdering,
                    ).getMinutes()} : ${new Date(foodOrdering).getSeconds()}`}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'orange',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  alignContent: 'center',
                  flex: 1,
                  // width: 200,
                }}>
                {!foodCooking && (
                  <TouchableOpacity
                    style={{
                      width: 45,
                      height: 45,
                      backgroundColor: 'black',
                      borderRadius: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 10,
                    }}
                    onPress={() => {
                      cooking(i, foodname);
                    }}>
                    <Text style={{color: 'white', textAlign: 'center'}}>
                      Nhận món
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{
                    width: 45,
                    height: 45,
                    backgroundColor: 'black',
                    borderRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 10,
                  }}
                  onPress={() => {
                    steady(i, foodname);
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Nấu xong
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{backgroundColor: 'white'}}></Text>
          </View>
        );
      } else if (foodFinish || foodCancel) {
        foodSolvedArray.push(info);
      } else if (foodSteady) {
        foodSteadyArray.push(info);
      }
    });
  }

  useEffect(() => {
    // console.log(12);

    foodSolvedArray.sort((a, b) => {
      if (a[1]['finish'] && b[1]['finish']) {
        // console.log("a[1]['finish']",a[1]['finish']);
        return b[1]['finish'] - a[1]['finish'];
      } else if (a[1]['cancel'] && b[1]['cancel']) {
        return b[1]['cancel'] - a[1]['cancel'];
      } else if (!a[1]['finish']) {
        return b[1]['finish'] - a[1]['cancel'];
      } else if (!b[1]['finish']) {
        // console.log("!b[1]['cancel']",b[1]['cancel']);
        return b[1]['cancel'] - a[1]['finish'];
      }
    });

    foodSteadyArray.sort((a, b) => {
      return !(b[1]['steady'] - a[1]['steady']);
    });

    setFoodSteady(foodSteadyArray);

    // console.log("foodSolvedArray",foodSolvedArray);
    setFoodSolved(foodSolvedArray);
  }, [data]);

  function foodCookingSolved(key, i) {
    let foodname = key[0];
    let foodCancel = key[1]['cancel'];
    let foodCooking = key[1]['cooking'];
    let foodFinish = key[1]['finish'];
    let foodTable = key[1]['table'];
    let foodOrdering = key[1]['ordering'];
    let foodSteady = key[1]['steady'];
    let foodQuantity = key[1]['quantity'];
    // let foodTime = key[1]['timeOrder'];

    // return key.map( (info,i1)=>{
    // console.log(key);

    return (
      <View
        style={{
          flexDirection: 'collumn',
          // backgroundColor: 'gray',
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: foodFinish || foodCancel ? 'gray' : 'green',
          }}>
          <View
            style={{
              width: 200,
            }}>
            <Text style={{fontWeight: 700, fontSize: 17, color: 'black'}}>
              Bàn số {foodTable}
            </Text>
            <Text>name : {key[0]}</Text>
            <View>
              <Text>số lượng: {foodQuantity}</Text>
              <Text>
                Thời gian {foodFinish||foodCancel?'': 'nấu'} xong:{' '}
                {`${new Date(
                  foodFinish  ? foodFinish : foodCancel? foodCancel : foodSteady?foodSteady:foodOrdering,
                ).getHours()} : ${new Date(
                  foodFinish
                    ? foodFinish
                    : foodCancel
                    ? foodCancel
                    : foodOrdering,
                ).getMinutes()} : ${new Date(
                  foodFinish  ? foodFinish : foodCancel? foodCancel : foodSteady?foodSteady:foodOrdering,
                ).getSeconds()}`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'orange',
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex',
              alignContent: 'center',
              // width: 200,
            }}>
            {/* <Pressable
                  style={{
                    width: 45,
                    height: 45,
                    backgroundColor: 'black',
                    borderRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 10,
                  }}
                  onPress={() => {
                    cooking(i, foodname);
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Nhận món
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    width: 45,
                    height: 45,
                    backgroundColor: 'black',
                    borderRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 10,
                  }}
                  onPress={() => {
                    steady(i, foodname);
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Nấu xong
                  </Text>
                </Pressable> */}
          </View>
        </View>
        <Text style={{backgroundColor: 'white'}}></Text>
      </View>
    );
  }

  function cooking(i1, food) {
    let date = new Date();
    let timeCooking = date.getTime();

    // if(!data[i1][food]['cooking'] ){
    database()
      .ref(`/order/${year}/${month}/${day}/${i1}/${food}`)
      .update({
        cooking: timeCooking,
      })
      .then(() => console.log('Data updated.'));
    console.log(31);
    // }
  }

  function steady(i1, food) {
    let date = new Date();
    let timeSteady = date.getTime();

    // console.log(41);
    // if(!data[i1][food]['steady']){

    database()
      .ref(`/order/${year}/${month}/${day}/${i1}/${food}`)
      .update({
        steady: timeSteady,
      })
      .then(() => console.log('Data updated.'));
  }
  // }

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

      <ScrollView>
        <Text>
          {
            // day de tao margin
          }
        </Text>
        <View
          style={{
            // backgroundColor: 'brown',
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            display: 'flex',
          }}>
          {data &&
            data.map((key, i) => (
              <View
                style={{
                  // do data render nhieu neen xay ra hien tuong bi du thua margin
                  // marginTop: 5,
                  backgroundColor: 'yellow',
                }}>
                <View style={{width: '100%'}}>{foodCooking(key, i)}</View>
              </View>
            ))}

          {foodSteady &&
            foodSteady.map((key, i) => (
              <View
                style={{
                  // do data render nhieu neen xay ra hien tuong bi du thua margin
                  // marginTop: 5,
                  backgroundColor: 'yellow',
                }}>
                <View style={{}}>{foodCookingSolved(key, i)}</View>
              </View>
            ))}

          {foodSolved &&
            foodSolved.map((key, i) => (
              <View
                style={{
                  // do data render nhieu neen xay ra hien tuong bi du thua margin
                  // marginTop: 5,
                  backgroundColor: 'yellow',
                }}>
                <View style={{}}>{foodCookingSolved(key, i)}</View>
              </View>
            ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});

export default Cooking;
