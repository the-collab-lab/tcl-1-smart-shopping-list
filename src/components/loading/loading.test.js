import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import Loading from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <Loading />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('snapshot on load', () => {
  const tree = TestRenderer.create(
    <BrowserRouter>
      <Loading />
    </BrowserRouter>
  );

  const loadingChildren = tree.toJSON().children;
  expect(loadingChildren.length).toBe(1);
  expect(loadingChildren[0]).toBe('Loading...');

  expect(tree.toJSON()).toMatchSnapshot();
});
