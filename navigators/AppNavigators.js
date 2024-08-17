import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';

import MainLogin from '../screens/MainLogin';
import Home from '../screens/Home';
import SignUp from '../screens/SignUp';
import ManagerTab from '../screens/ManagerTab';
import OrderTab from '../screens/OrderTab';
import CookingTab from '../screens/CookingTab';
import {Alert, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMugSaucer} from '@fortawesome/free-solid-svg-icons/faMugSaucer';
import {faFireBurner} from '@fortawesome/free-solid-svg-icons/faFireBurner';
import {faSquarePollVertical} from '@fortawesome/free-solid-svg-icons/faSquarePollVertical';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigator = () => {
  // const [name, setName] = useState(null);

  // const getName = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('name');
  //     // console.log('jsonValue',jsonValue);
  //     return jsonValue != null ? jsonValue : null;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // useEffect(() => {
  //   getName().then(res => {setName(res);console.log('res',res);});

  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{animationEnabled: false, header: () => null}}
        />

        <Stack.Screen
          name="Boss"
          component={MainLogin}
          // options={{animationEnabled: false, header: () => null}}
        />

        <Stack.Screen
          name="Staff"
          component={MainLogin}
          // options={{animationEnabled: false, header: () => null}}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          // options={{animationEnabled: false, header: () => null}}
        />

        <Stack.Screen
          name="StaffScreen"
          component={StaffTabNavigators}
          options={
            // name != 'Boss' ?(

            {animationEnabled: false, header: () => null}

            // ):(
            //   {}
            // )
          }
        />

        <Stack.Screen
          name="BossScreen"
          component={BossTabNavigators}
          options={{animationEnabled: false, header: () => null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const StaffTabNavigators = ({navigation}) => {
  const [name, setName] = useState(null);

  const getName = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('name');
      // console.log('jsonValue',jsonValue);
      return jsonValue != null ? jsonValue : null;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getName().then(res => setName(res));
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        lazy: false, // khi app chạy thì sẽ sẽ chạy hết tất cả các tab đồng loạt chứ không phải nhấn vô mới load
      })}>
      <Tab.Screen
        name="CookingTab"
        component={CookingTab}
        options={() => ({
          title: '',
          headerRight: () => (
            <>
              {name != 'Boss' ? (
                <TouchableOpacity
                  // style={styles.iconInfoContainer}
                  onPress={() => {
                    // navigation.navigate('Home')
                    navigation.reset({index: 0, routes: [{name: 'Home'}]});
                    AsyncStorage.clear();
                  }}>
                  <Text>Log Out</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </>
          ),
          headerLeft: () => (
            <>
              {name == 'Boss' ? (
                <TouchableOpacity
                  // style={styles.iconInfoContainer}
                  onPress={() => {
                    // navigation.navigate('Home')
                    navigation.reset({index: 0, routes: [{name: 'Home'}]});
                    // AsyncStorage.clear()
                  }}>
                  <Text>Back</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </>
          ),
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={
                  focused ? {...styles.tabItemActive} : styles.tabItemInactive
                }>
                  <FontAwesomeIcon icon={faMugSaucer} style={
                    focused ? styles.IconActive : styles.IconInActive
                  }/>
                {/* <Ionicons
                  name="home-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons> */}
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        })}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrderTab}
        options={() => ({
          title: '',
          headerRight: () => (
            <>
              {name != 'Boss' ? (
                <TouchableOpacity
                  // style={styles.iconInfoContainer}
                  onPress={() => {
                    // navigation.navigate('Home')
                    navigation.reset({index: 0, routes: [{name: 'Home'}]});
                    AsyncStorage.clear();
                  }}>
                  <Text>Log Out</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </>
          ),
          headerLeft: () => (
            <>
              {name == 'Boss' ? (
                <TouchableOpacity
                  // style={styles.iconInfoContainer}
                  onPress={() => {
                    // navigation.navigate('Home')
                    navigation.reset({index: 0, routes: [{name: 'Home'}]});
                    // AsyncStorage.clear()
                  }}>
                  <Text>Back</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </>
          ),
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={
                  focused ? {...styles.tabItemActive} : styles.tabItemInactive
                }>
                  <FontAwesomeIcon icon={faFireBurner} style={
                    focused ? styles.IconActive : styles.IconInActive
                  }/>
                {/* <Ionicons
                  name="home-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons> */}
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        })}
      />
    </Tab.Navigator>
  );
};

export const BossTabNavigators = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        lazy: false, // khi app chạy thì sẽ sẽ chạy hết tất cả các tab đồng loạt chứ không phải nhấn vô mới load
      })}>
      <Tab.Screen
        name="CookingTab"
        component={CookingTab}
        options={() => ({
          title: '',
          headerRight: () => (
            <>
                <TouchableOpacity
                  // style={styles.iconInfoContainer}
                  onPress={() => {
                    // navigation.navigate('Home')
                    navigation.reset({index: 0, routes: [{name: 'Home'}]});
                    AsyncStorage.clear();
                  }}>
                  <Text>Log Out</Text>
                </TouchableOpacity>
               
            </>
          ),
          headerLeft: () => (
            <>
                <TouchableOpacity
                  // style={styles.iconInfoContainer}
                  onPress={() => {
                    // navigation.navigate('Home')
                    navigation.reset({index: 0, routes: [{name: 'Home'}]});
                    // AsyncStorage.clear()
                  }}>
                  <Text>Back</Text>
                </TouchableOpacity>
              
            </>
          ),
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={
                  focused ? {...styles.tabItemActive} : styles.tabItemInactive
                }>
                  <FontAwesomeIcon icon={faSquarePollVertical} style={
                    focused ? styles.IconActive : styles.IconInActive
                  }/>
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        })}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrderTab}
        options={() => ({
          title: '',
          headerRight: () => (
            <>
              <TouchableOpacity
                // style={styles.iconInfoContainer}
                onPress={() => {
                  navigation.reset({index: 0, routes: [{name: 'Home'}]});
                  AsyncStorage.clear();
                }}>
                <Text>Out</Text>
              </TouchableOpacity>
            </>
          ),
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={
                  focused ? {...styles.tabItemActive} : styles.tabItemInactive
                }>
                  <FontAwesomeIcon icon={faStar} style={
                    focused ? styles.IconActive : styles.IconInActive
                  }/>
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },

        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItemActive: {
    // backgroundColor:'red',
    width: '100%',
    // right:0,
    // left:100,
    height: '104%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'red',
    borderTopWidth: 4,
    overflow: 'hidden',
  },
  tabItemInactive: {
    position: 'relative',
    // width: '100%',
    height: '102%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconActive: {
    fontSize: 23,
    color: 'red',
    // transform:animatedValue
  },
  IconInActive: {
    fontSize: 23,
    color: 'black',
  },
});
export default StackNavigator;
