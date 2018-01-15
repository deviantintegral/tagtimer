import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { CookiesProvider } from 'react-cookie';

const root = (
  <CookiesProvider>
    <App OAuthProxy={process.env.REACT_APP_OAUTH_PROXY} freckleProxy={process.env.REACT_APP_FRECKLE_PROXY}/>
  </CookiesProvider>
);
ReactDOM.render(root, document.getElementById('root'));
registerServiceWorker();
