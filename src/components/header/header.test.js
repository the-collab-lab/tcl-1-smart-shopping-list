import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import Header from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('snapshot on load', () => {
  const tree = TestRenderer.create(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

describe('different showBackLink values', () => {
  it('showBackLink === true', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <Header showBackLink={true} />
      </BrowserRouter>
    );

    const headerChildren = tree.toJSON().children;
    expect(headerChildren.length).toBe(3);
    expect(headerChildren[0].props.visualstate).toBe('default');
    expect(headerChildren[1].props.visualstate).toBe('default');
    expect(headerChildren[2].props.visualstate).toBe('default');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('showBackLink === false', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <Header showBackLink={false} />
      </BrowserRouter>
    );

    const headerChildren = tree.toJSON().children;
    expect(headerChildren.length).toBe(3);
    expect(headerChildren[0].props.visualstate).toBe('hidden');
    expect(headerChildren[1].props.visualstate).toBe('default');
    expect(headerChildren[2].props.visualstate).toBe('default');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('showBackLink not set', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const headerChildren = tree.toJSON().children;
    expect(headerChildren.length).toBe(3);
    expect(headerChildren[0].props.visualstate).toBe('hidden');
    expect(headerChildren[1].props.visualstate).toBe('default');
    expect(headerChildren[2].props.visualstate).toBe('default');

    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('different whichRoute values', () => {
  it('whichRoute === "/add-item"', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <Header whichRoute="/add-item" />
      </BrowserRouter>
    );

    const headerChildren = tree.toJSON().children;
    expect(headerChildren.length).toBe(3);
    expect(headerChildren[0].props.href).toBe('/add-item');
    expect(headerChildren[1].props.href).toBe('/');
    expect(headerChildren[2].props.href).toBe('http://app.ineedtobuy.xyz/');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('whichRoute === "/"', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <Header whichRoute="/" />
      </BrowserRouter>
    );

    const headerChildren = tree.toJSON().children;
    expect(headerChildren.length).toBe(3);
    expect(headerChildren[0].props.href).toBe('/');
    expect(headerChildren[1].props.href).toBe('/');
    expect(headerChildren[2].props.href).toBe('http://app.ineedtobuy.xyz/');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('whichRoute not set', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const headerChildren = tree.toJSON().children;
    expect(headerChildren.length).toBe(3);
    expect(headerChildren[0].props.href).toBe('/');
    expect(headerChildren[1].props.href).toBe('/');
    expect(headerChildren[2].props.href).toBe('http://app.ineedtobuy.xyz/');

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
