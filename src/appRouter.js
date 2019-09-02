import React from 'react';
import { Switch, Route } from 'react-router';
import List from './pageComponents/listPage';
import AddItem from './pageComponents/addItemPage';

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={List} />
      <Route exact path="/add-item" component={AddItem} />
    </Switch>
  );
};

export default Router;
