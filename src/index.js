import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { CookiesProvider } from 'react-cookie';

const root = (
  <CookiesProvider>
    <App />
  </CookiesProvider>
);
ReactDOM.render(root, document.getElementById('root'));
registerServiceWorker();
