import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import { fb as firebase } from '../../lib/firebase.js';
import { FirestoreProvider } from 'react-firestore';
import CreateList from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <FirestoreProvider firebase={firebase}>
      <BrowserRouter>
        <CreateList />
      </BrowserRouter>
    </FirestoreProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('snapshot on load', () => {
  const tree = TestRenderer.create(
    <FirestoreProvider firebase={firebase}>
      <BrowserRouter>
        <CreateList />
      </BrowserRouter>
    </FirestoreProvider>
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
