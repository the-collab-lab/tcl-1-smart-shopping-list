import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import PageWrapper from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <PageWrapper>must have content</PageWrapper>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('snapshot on load', () => {
  const tree = TestRenderer.create(
    <BrowserRouter>
      <PageWrapper>must have content</PageWrapper>
    </BrowserRouter>
  );

  expect(tree.toJSON()).toMatchSnapshot();
});
