import {createContext,useState} from 'react';
import Home from './screens/Home'
import AppNavigators from './navigators/AppNavigators'

const dataUser = createContext(); 
// const oldUser = createContext(); 
import { Provider } from 'react-redux';
import { store } from "./redux/store";

function App() {

  const [dataUserForApp,setDataUserForApp] = useState([]);
  const updateData = (data) =>{
    setDataUserForApp(data)
  } 
 

  return (
<Provider store={store}>
    <dataUser.Provider value={{dataUserForApp,updateData}}>
    <AppNavigators/>
    </dataUser.Provider>
    {/* </oldUser.Provider> */}
    </Provider>
);
}

export default App;
export {dataUser}
// export {oldUser}
