import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { fb as firebase } from './lib/firebase.js';
import { FirestoreProvider } from 'react-firestore';
import App from './app';
import './index.css';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <FirestoreProvider firebase={firebase}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FirestoreProvider>
);
