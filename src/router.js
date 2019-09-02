import React from 'react';
import { Switch, Route } from 'react-router';
import List from './pages/list';
import AddItem from './pages/addItem';

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={List} />
      <Route exact path="/add-item" component={AddItem} />
    </Switch>
  );
};

export default Router;
