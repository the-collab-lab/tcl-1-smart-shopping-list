import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import SmartLink from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <SmartLink className="test-class">this is a smart link</SmartLink>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('snapshot on load', () => {
  const tree = TestRenderer.create(
    <BrowserRouter>
      <SmartLink className="test-class">this is a smart link</SmartLink>
    </BrowserRouter>
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

describe('test content values', () => {
  it('content is type string', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class">this is a smart link</SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('content is an html element', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class">
          <h1>this is an h1 element</h1>
        </SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('content is a React element', () => {
    const FakeComponent = () => <span>this is a fake component</span>;

    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class">
          <FakeComponent />
        </SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('test routeTo values', () => {
  it('routeTo is set to known route', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class" routeTo="/add-item">
          this is a smart link
        </SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('routeTo is set to unknown route', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class" routeTo="/fake-link">
          this is a smart link
        </SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('routeTo is set to an external URL', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class" routeTo="http://google.com">
          this is a smart link
        </SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('routeTo is not set', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class">this is a smart link</SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('test visualState values', () => {
  it('visualState set to default', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class" visualState="default">
          this is a smart link
        </SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('visualState set to hidden', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class" visualState="hidden">
          this is a smart link
        </SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('visualState set to disabled', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class" visualState="disabled">
          this is a smart link
        </SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('visualState is not set', () => {
    const tree = TestRenderer.create(
      <BrowserRouter>
        <SmartLink className="test-class">this is a smart link</SmartLink>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
