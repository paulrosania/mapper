import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { devTools } from 'redux-devtools';
import { Provider } from 'react-redux';
import reducer from './reducers/index';
import App from './containers/App';
import ipc from 'ipc-renderer';

const middleware = [thunkMiddleware];

const isDevelopment = process.env.NODE_ENV === 'development';
const appCreateStore = (isDevelopment
                        ? compose(applyMiddleware(...middleware), devTools())(createStore)
                        : applyMiddleware(...middleware)(createStore));
const store = appCreateStore(reducer);
const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

function parseQueryString(qs) {
  if (qs.length <= 1) {
    return {};
  }

  qs = qs.substring(1);
  return qs.split('&')
           .map(kv => kv.split('=').map(decodeURIComponent))
           .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
}

const params = parseQueryString(window.location.search);
if (params.path !== undefined) {
  // LOAD
}

ipc.on('save', (e, path) => {
  console.log('SAVE!', path)
  e.sender.send('saved');
});

ReactDOM.render(
  <div>
    <Provider store={store}>
      <App />
    </Provider>
    { isDevelopment && do {
      const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>;
    } }
  </div>,
  rootElement
);
