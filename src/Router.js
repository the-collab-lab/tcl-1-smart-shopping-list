import React from 'react';
import { Switch, Route } from 'react-router';
import List from './Pages/List';
import AddItem from './Pages/AddItem';

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={List} />
      <Route exact path="/add-item" component={AddItem} />
    </Switch>
  );
};

export default Router;
