import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { fb as firebase } from './lib/firebase.js';
import { FirestoreProvider } from 'react-firestore';
import Router from './appRouter';
import './index.css';

ReactDOM.render(
  <FirestoreProvider firebase={firebase}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </FirestoreProvider>,
  document.getElementById('root')
);
