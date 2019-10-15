import React from 'react';
import { Switch, Route } from 'react-router';
import List from './pages/list';
import AddItem from './pages/addItem';
import CreateList from './pages/createList';
import ItemDetail from './pages/itemDetail';
import JoinList from './pages/joinList';


const Router = props => {
  const routes = [
    { view: AddItem, path: '/add-item' },
    { view: CreateList, path: '/create-list' },
    { view: JoinList, path: '/join-list' },
    { view: ItemDetail, path: '/item-detail/:itemId' },
    { view: List, path: undefined },
    // NOTE: by not passing a path to the List component, this
    // becomes the default path for any unrecognized URLs. BUT
    // this default route MUST be at the bottom of the list.
  ];

  return (
    <Switch>
      {routes.map((route, index) => (
        <Route
          component={route.view}
          exact={!!route.path}
          key={'route-' + index}
          path={route.path}
        />
      ))}
    </Switch>
  );
};

export default Router;
