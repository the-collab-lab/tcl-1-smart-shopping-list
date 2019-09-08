import React from 'react';
import { Switch, Route } from 'react-router';
import List from './pages/list';
import AddItem from './pages/addItem';
import CreateList from './pages/createList';
import ItemDetail from './pages/itemDetail';

const Router = () => (
  // NOTE: by not passing a path to the List component, this
  // becomes the default path for any unrecognized URLs
  <Switch>
    <Route component={List} />
    <Route exact path="/add-item" component={AddItem} />
    <Route exact path="/create-list" component={CreateList} />
    <Route exact path="/item-detail" component={ItemDetail} />
  </Switch>
);

export default Router;
