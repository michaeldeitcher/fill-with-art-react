import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.css'
import ApiClient from './utility/ApiClient'
import { ActionCableProvider } from 'react-actioncable-provider'

console.log('fill-with-art: env=' + process.env.NODE_ENV);

ReactDOM.render(
    <ActionCableProvider url={ApiClient.apiRoot + '/cable'}>
        <App />
    </ActionCableProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();