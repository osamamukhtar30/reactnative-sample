/**
 * @format
 */

// eslint-disable-next-line
import './shim';

// eslint-disable-next-line
import * as encoding from 'text-encoding';
import {AppRegistry} from 'react-native';

import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
