import './action';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components';
import '../../frame/core/netcore'

window.onload = (e) => {
    let app = document.createElement('div');
    document.body.appendChild(app);
    ReactDOM.render(<App/>, app);
};
