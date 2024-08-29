/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Cancel,Order,requestUserPermission,GetFCMToke,BackgroundMessageHandler,ForegroundMessageHandler,bootstrap,fetch} from'./notification/index'
// BackgroundMessageHandler()

AppRegistry.registerComponent(appName, () => App);
