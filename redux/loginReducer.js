import { createSlice } from '@reduxjs/toolkit'

import database from '@react-native-firebase/database';
// import {call,put,takeEvery} from 'redux-saga'

import firestore from '@react-native-firebase/firestore';
import { call,put,takeEvery } from 'redux-saga/effects';

let loading = true
let list ={}

// firestore()
//   .collection('users')
//   .get()
//   .then( Query => {
//     Query.forEach( (doc,i) => {
//       //  list[i] = doc.id    // để lấy tên documnet
//       list[doc.data()['userName']] = (    doc.data()['pass'] )   // để lấy data trong document

//     });
//   }
//   )


 

// export const login = createSlice({
//   name: 'login',     
//   initialState: {
//     username : '',
//     pass:'',
//     loading: false
//   },
//   reducers: {
//     logIn(state,action){
//         const {username,pass} = action.payload
//         // console.log('username',username);
//         // console.log('pass',pass);
//         // console.log('list',list);
//         console.log(list[username]);
//         if(list[username]){
//           console.log('có');
//         }else{
//           console.log('sai');
//         }
//     }
// }
// })

export const read = createSlice({
  name: 'read',     
  initialState: {
    data:null,
    loading: false
  },
  reducers: {
    loader: (state,action) => {
      state.data=action.payload;
      state.loading= true;
      // console.log('loader',state.loading);
    //  return {type:'do'}
    },

    handle: (state,action) => {
      state.data=action.payload;
      state.loading= false;
      // console.log('loader handle',state.loading);
    },
    // run: (state,action) => {
    //   state.data=action.payload;
    //   state.loading= false;
    //   console.log('loader run',state.loading);
    // },
}
})


export function* mySaga(action){
  try{
    yield put(loader())
    // let a = yield call( async()=>{
    //   const snap = await firestore().collection('users').get()
    //   return snap.docs.map(doc =>doc.data())
    // })


    // const b = yield call( async ()=> await database().ref('/users').once('value') )        // phải dùng once thì mới Promise (đặc trưng của call() ) được 
    let a = []
    const b = yield call( async ()=>{ 
      const snap = await firestore().collection('users').get()
      return snap.docs.map(doc => { a.push(  {[doc.id]:doc.data()})   }   )    // nếu là doc.id là để lấy tên document
    } )       
    
//   
//   .get()const a =   b.val()      
 

    yield put(handle(a))
  }catch(e){

  }
}

export function* saga(){
  yield takeEvery('run',mySaga)
}

  
export const {loader,handle,run} = read.actions;

// export const { logIn } = login.actions
