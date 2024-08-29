import { createSlice } from '@reduxjs/toolkit'

import database from '@react-native-firebase/database';

import firestore from '@react-native-firebase/firestore';
import { call,put,takeEvery } from 'redux-saga/effects';


time = new Date();
let year = time.getFullYear();
let month = time.getMonth() + 1;
let day = time.getDate();


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


 

export const read = createSlice({
  name: 'read',     
  initialState: {
    dataOrder:null,
    loading: true
  },
  reducers: {
    
    loading: (state,action) => {
      state.loading= true;
      // console.log(321);
    },

    get: (state,action) => {
      state.dataOrder=action.payload;
      // console.log('123');
    },
    noLoading: (state,action) => {
      state.loading= false;
      // console.log('12345');
    },

}
})

export const login = createSlice({
  name: 'login',     
  initialState: {
    userInfo:[],
    loading: false
  },
  reducers: {
    loader: (state,action) => {
      state.userInfo=action.payload;
      state.loading= true;
      // console.log('loader',state.loading);
    //  return {type:'do'}
    },

    handle: (state,action) => {
      state.userInfo=action.payload;
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



export function* mySaga1(action){
  try{
    
    yield put(loading())
    const b = yield call( async ()=> await database().ref(`/`).once('value') )
    const a =   b.val()      
    

yield put(get(a))
yield put(noLoading())

  }catch(e){

  }
}




export function* saga(){
  yield takeEvery('run',mySaga)
}

export function* saga1(){
  yield takeEvery('fetch',mySaga1)
  // yield takeEvery(handle1.type,mySaga1)

}

  
export const {loader,handle,run} = login.actions;
export const {loading,get,noLoading} = read.actions;

// export const { logIn } = login.actions
