import React from 'react';
import { Switch, Route } from 'react-router';
import List from './pages/list';
import AddItem from './pages/addItem';
import CreateList from './pages/createList/index';

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={List} />
      <Route exact path="/add-item" component={AddItem} />
      <Route exact path="/create-list" component={CreateList} />
    </Switch>
  );
};

export default Router;
