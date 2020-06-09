import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import UserHome from './pages/UserHome';
import UserSearch from './pages/UserSearch';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path='/' exact  />
      <Route component={CreatePoint} path='/create-point' />
      <Route component={UserHome} path='/user-home' />
      <Route component={UserSearch} path='/user-search' />
    </BrowserRouter>
  )
}

export default Routes;