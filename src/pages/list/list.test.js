import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import { fb as firebase } from '../../lib/firebase.js';
import { FirestoreProvider } from 'react-firestore';
import List from './index';
import { TokenProvider, ListProvider } from './../../contexts';

// NOTE: programatically "pushing" to our app's routing history
// means have to mock the history object and it's push function

// TODO: mock additional context values and expect the same tests to
// pass if it CAN see some sort of stored token -- see ListTest for an example

describe('list is only provided list context values, redirects', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ListProvider value={{ list: [] }}>
        <FirestoreProvider firebase={firebase}>
          <BrowserRouter>
            <List history={{ push: jest.fn() }} />
          </BrowserRouter>
        </FirestoreProvider>
      </ListProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('snapshot on load', () => {
    const tree = TestRenderer.create(
      <ListProvider value={{ list: [] }}>
        <FirestoreProvider firebase={firebase}>
          <BrowserRouter>
            <List history={{ push: jest.fn() }} />
          </BrowserRouter>
        </FirestoreProvider>
      </ListProvider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('list DOES NOT contain items', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <TokenProvider value={{ token: 'abc123' }}>
        <ListProvider value={{ list: [] }}>
          <FirestoreProvider firebase={firebase}>
            <BrowserRouter>
              <List history={{ push: jest.fn() }} />
            </BrowserRouter>
          </FirestoreProvider>
        </ListProvider>
      </TokenProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('snapshot on load', () => {
    const tree = TestRenderer.create(
      <TokenProvider value={{ token: 'abc123' }}>
        <ListProvider value={{ list: [] }}>
          <FirestoreProvider firebase={firebase}>
            <BrowserRouter>
              <List history={{ push: jest.fn() }} />
            </BrowserRouter>
          </FirestoreProvider>
        </ListProvider>
      </TokenProvider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('list DOES contain items', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      // <TokenContext.Provider value={{ token: 'abc123' }}>
      <ListProvider value={{ list: [] }}>
        <FirestoreProvider firebase={firebase}>
          <BrowserRouter>
            <List history={{ push: jest.fn() }} />
          </BrowserRouter>
        </FirestoreProvider>
      </ListProvider>,
      // </TokenContext.Provider>
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('snapshot on load', () => {
    const list = [
      { name: 'one', duration: 'soon', listToken: 'abc123' },
      { name: 'two', duration: 'soon', listToken: 'abc123' },
      { name: 'three', duration: 'soon', listToken: 'abc123' },
    ];

    const tree = TestRenderer.create(
      // <TokenContext.Provider value={{ token: 'abc123' }}>
      <ListProvider value={{ list }}>
        <FirestoreProvider firebase={firebase}>
          <BrowserRouter>
            <List history={{ push: jest.fn() }} />
          </BrowserRouter>
        </FirestoreProvider>
      </ListProvider>
      // </TokenContext.Provider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
