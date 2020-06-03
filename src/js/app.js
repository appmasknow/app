import React from 'react';
import ReactDOM from 'react-dom';
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';
import Framework7React from 'framework7-react';
import 'framework7/css/framework7.bundle.css';
import '../css/app.scss';
import '../css/utils.scss';
import App from '../app';

Framework7.use(Framework7React);

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app'),
);
