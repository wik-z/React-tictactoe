import React from 'react';
import ReactDOM from 'react-dom';

import '../less/app.less';

import EventBus from './modules/EventBus';
window.bus = new EventBus();

import App from './components/App';

import { Provider } from 'react-redux'
import store from './store/store';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('app')
);