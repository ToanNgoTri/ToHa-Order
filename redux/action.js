import { createSlice, configureStore } from '@reduxjs/toolkit'
// chỉ để tham khảo
const counterSlice = createSlice({
  name: 'counter',     
  initialState: {
    value: 0
  },
  reducers: {
    incremented: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decremented: state => {
      state.value -= 1
    }
  }
})

const interSlice = createSlice({
    name: 'inter',  // name này sử dụng khi ...
    initialState: {
      value: 4
    },
    reducers: {
      times(state,action)  {        
        state.value = state.value *action.payload;
        console.log('action',action); // log action này ra sẽ ra {"payload": 4, "type": "inter/times"}
                            // trong đó inter là name ở trên và times là tên reducer
      },
      divide: state => {
        state.value = state.value /2
      }
    }
  })
  

export const { incremented, decremented } = counterSlice.actions
export const { times, divide } = interSlice.actions


export const store1 = configureStore({
  reducer: {counter:counterSlice.reducer,
    inter:interSlice.reducer,
}
})

// console.log('counterSlice.reducer',counterSlice.reducer);

// // Can still subscribe to the store
// store.subscribe(() => console.log('sub',store.getState()))

// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented())
// // {value: 1}
// store.dispatch(incremented())
// // {value: 2}
// store.dispatch(decremented())
// // {value: 1}