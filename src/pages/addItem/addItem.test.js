import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import { fb as firebase } from '../../lib/firebase.js';
import { FirestoreProvider } from 'react-firestore';
import AddItem from './index';
import { TokenProvider, ListProvider } from './../../contexts';

// NOTE: programatically "pushing" to our app's routing history
// means have to mock the history object and it's push function

// TODO: mock additional context values and expect the same tests to
// pass if it CAN see some sort of stored token -- see ListTest for an example

describe('addItem is not provided any context values, redirects', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <FirestoreProvider firebase={firebase}>
        <BrowserRouter>
          <AddItem history={{ push: jest.fn() }} />
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
          <AddItem history={{ push: jest.fn() }} />
        </BrowserRouter>
      </FirestoreProvider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('addItem DOES NOT contain items', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <TokenProvider value={{ token: 'abc123' }}>
        <ListProvider value={{ list: [] }}>
          <FirestoreProvider firebase={firebase}>
            <BrowserRouter>
              <AddItem history={{ push: jest.fn() }} />
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
              <AddItem history={{ push: jest.fn() }} />
            </BrowserRouter>
          </FirestoreProvider>
        </ListProvider>
      </TokenProvider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('addItem DOES contain items', () => {
  const list = [
    { name: 'one', frequency: 'soon', listToken: 'abc123' },
    { name: 'two', frequency: 'soon', listToken: 'abc123' },
    { name: 'three', frequency: 'soon', listToken: 'abc123' },
  ];

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <TokenProvider value={{ token: 'abc123' }}>
        <ListProvider value={{ list: list }}>
          <FirestoreProvider firebase={firebase}>
            <BrowserRouter>
              <AddItem history={{ push: jest.fn() }} />
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
        <ListProvider value={{ list }}>
          <FirestoreProvider firebase={firebase}>
            <BrowserRouter>
              <AddItem history={{ push: jest.fn() }} />
            </BrowserRouter>
          </FirestoreProvider>
        </ListProvider>
      </TokenProvider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
