import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import { fb as firebase } from '../../lib/firebase.js';
import { FirestoreProvider } from 'react-firestore';
import Welcome from './index';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('snapshot on load', () => {
  const tree = TestRenderer.create(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
