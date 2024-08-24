import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Button,
  Modal,
  ScrollView,
} from 'react-native';
import database from '@react-native-firebase/database';
import {useState, useEffect, useContext} from 'react';
import {store} from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dataUser} from '../App';

import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelector, useDispatch} from 'react-redux';
import {loader, handle, run} from '../redux/loginReducer';

export function StatisticTab({navigation}) {
  const [startDate, setStateDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDate, setShowEndDate] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cost, setCost] = useState({});
  const [sumMoney, setSumMoney] = useState(0);
  const [foodStatistic, setFoodStatistic] = useState({});
  const [data, setData] = useState(null);

  time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();

  const [dayBetweenArray, setDayBetweenArray] = useState(new Date());

  useEffect(() => {
    database()
      .ref(`/`)
      .on('value', snapshot => {
        setData(snapshot.val()['order']);
        setCost(snapshot.val()['cost']);
      });

    // dispatch({type:'fetch'})
    // setData(dataOrder['order'][year][month][day]);
  }, []);

  const onStartDateChange = (e, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDate(false);
    // console.log(selectedDate.setDate(selectedDate.getDate()+1) );
    setStateDate(currentDate);
  };

  const onEndDateChange = (e, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDate(false);
    setEndDate(currentDate);
  };

  function formatDate(dateString) {
    let dateArray = dateString.split('/');

    // console.log(dateArray);
    return `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;
  }

  useEffect(() => {
    let countDayBetween =
      Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    // console.log("countDayBetween",countDayBetween);

    let dateArray = [];
    for (let a = 0; a < countDayBetween; a++) {
      let day = new Date(
        startDate.getTime() + a * (1000 * 60 * 60 * 24),
      ).toLocaleDateString();

      let dateComponent = day.split('/');

      dateArray[a] = dateComponent;
    }

    setDayBetweenArray(dateArray);
    // console.log(dayBetweenArray);
  }, [startDate, endDate]);

  function statictis() {
    let sumMoneyCopy = 0;

    let foodKind = {};

    Object.keys(cost).map((key, i) => {
      foodKind[key] = {
        money: 0,
        quantity: 0,
      };
    });

    // console.log('dayBetweenArray',dayBetweenArray);
    dayBetweenArray.map((key, i) => {
      if (data) {
        if (data[key[2]][key[0]][key[1]]) {
          data[key[2]][key[0]][key[1]].map((key1, i1) => {
            // console.log(key1);
            if (key1) {
              Object.entries(key1).map((key2, i2) => {
                if (key2[1]['finish']) {
                  // console.log(
                  //   "foodKind[key2[0]]['quantity']",
                  //   foodKind[key2[0]]['quantity'],
                  // );
                  foodKind[key2[0]]['quantity'] =
                    foodKind[key2[0]]['quantity'] + key2[1]['quantity'];

                  foodKind[key2[0]]['money'] =
                    foodKind[key2[0]]['money'] +
                    key2[1]['quantity'] * cost[key2[0]];

                  sumMoneyCopy += key2[1]['quantity'] * cost[key2[0]];
                }
              });
            }
          });
        }
      }
    });
    setFoodStatistic(foodKind);
    setSumMoney(sumMoneyCopy);
    // console.log('foodKind', foodKind);
    // console.log('sumMoneyCopy', sumMoneyCopy);
  }

  return (
    <>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          marginBottom: 50,
        }}>
        <View style={{marginBottom: 20}}>
          <Button
            title="Select State Date"
            onPress={() => setShowStartDate(true)}
          />
          {showStartDate && (
            <DateTimePicker
              value={startDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onStartDateChange}
              dateFormat="day month year"
              maximumDate={endDate}></DateTimePicker>
          )}
          <Text style={{textAlign: 'center'}}>
            {/* {`Bạn lựa chọn  ngày ${ formatDate(stateDate.toLocaleDateString(),'MM-DD-YYYY','DD MM YYYY')  }`} */}
            {`Bạn lựa chọn  ngày ${formatDate(startDate.toLocaleDateString())}`}
          </Text>
        </View>
        <View style={{marginBottom: 50}}>
          <Button
            title="Select End Date"
            onPress={() => setShowEndDate(true)}
          />
          {showEndDate && (
            <DateTimePicker
              value={endDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onEndDateChange}
              dateFormat="day month year"
              minimumDate={startDate}></DateTimePicker>
          )}
          <Text style={{textAlign: 'center'}}>
            {/* {`Bạn lựa chọn  ngày ${ formatDate(stateDate.toLocaleDateString(),'MM-DD-YYYY','DD MM YYYY')  }`} */}
            {`Bạn lựa chọn  ngày ${formatDate(endDate.toLocaleDateString())}`}
          </Text>
        </View>
        <Button
          title="Statistic"
          onPress={() => {
            setModalVisible(true);
            statictis();
          }}
          style={{marginTop: 30}}
        />
      </View>

      {modalVisible && (
        <Modal
          presentationStyle="pageSheet"
          animationType="slide"
          visible={modalVisible}
          style={{backgroundColor: 'orange'}}>
            <ScrollView style={{}}>
          <View style={{paddingTop:20}}>
            <View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 30,
                  fontWeight: 'bold',
                }}>
                Tổng Thành tiền {sumMoney}
              </Text>
            </View>
            <View>
              {Object.entries(foodStatistic).map((key, i) => (
                <View style={{textAlign: 'center', marginBottom: 30}}>
                  <Text style={{textAlign: 'center', marginBottom: 10}}>
                    Tên Sản phẩm {key[0]}
                  </Text>
                  <Text style={{textAlign: 'center', marginBottom: 10}}>
                    Số lượng đã đặt {key[1]['quantity']}
                  </Text>
                  <Text style={{textAlign: 'center', marginBottom: 10}}>
                    Thành tiền {key[1]['money']}
                  </Text>
                </View>
              ))}
            </View>
            </View>
          </View>
          </ScrollView>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={{padding: 10, backgroundColor: 'black',bottom:0}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: 'white',
                }}>
                Đóng
              </Text>
            </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}
