import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Web-specific: Set root styles
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root') || document.getElementById(appName);
  if (rootTag) {
    rootTag.style.height = '100%';
    rootTag.style.display = 'flex';
  }
  
  // Apply web-specific styles to body
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.height = '100%';
  document.body.style.overflow = 'auto';
  
  document.documentElement.style.height = '100%';
  document.documentElement.style.overflow = 'auto';
}

AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
