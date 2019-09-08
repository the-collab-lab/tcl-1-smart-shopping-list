import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import Footer from './index';
import { SmartLink } from '../index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('snapshot on load', () => {
  const tree = TestRenderer.create(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('confirm the two expected links are present', () => {
  const tree = TestRenderer.create(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );

  const footerChildren = tree.toJSON().children;
  expect(footerChildren.length).toBe(2);
  expect(footerChildren[0].children[0]).toBe('My List');
  expect(footerChildren[1].children[0]).toBe('Add Item');

  expect(tree.toJSON()).toMatchSnapshot();
});
