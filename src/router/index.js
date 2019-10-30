import React from 'react'
import Index from '../pages/Index'
import History from '../pages/History'
import Camera from '../pages/Camera'
import Log from '../pages/Log'
import About from '../pages/About'
import Menu from '../components/Menu'
import TopBar from '../components/TopBar'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

const App = () => (
  <BrowserRouter>
    <div>
      <TopBar />
      <Menu />
      <Switch>
        <Route 
          path='/'
          exact
          component={Index}
        />
        <Route
          path='/history'
          component={History}
        />
        <Route 
          path='/camera'
          component={Camera}
        />
        <Route 
          path='/log'
          component={Log}
        />
        <Route 
          path='/about'
          component={About}
        />
      </Switch>
    </div>
  </BrowserRouter>
);
export default App;