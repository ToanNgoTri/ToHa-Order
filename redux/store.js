import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { applyMiddleware } from 'redux'
import { login } from './loginReducer'
import { read } from './loginReducer'

// export const store = configureStore({
//     reducer: login.reducer
//   })
  

import {all} from 'redux-saga/effects'
import {mySaga,saga} from './loginReducer'
import {loader,handle, run} from './loginReducer'

const sagaMiddleware = createSagaMiddleware()

export function* rootSaga(){
  yield all([saga()])
}


export const store = configureStore({
    reducer: read.reducer,
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck:false}).concat([sagaMiddleware])

    // middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat([sagaMiddleware])
    //applyMiddleware(...sagaMiddleware)
  })
  
  sagaMiddleware.run(rootSaga)

 