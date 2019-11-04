import React, {PureComponent} from 'react'
import Index from '../pages/Index'
import History from '../pages/History'
import Camera from '../pages/Camera'
import Log from '../pages/Log'
import About from '../pages/About'
import Menu from '../components/Menu'
import TopBar from '../components/TopBar'
import Login from '../pages/Login'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

export default class extends PureComponent {

  render() {
    let storage = window.sessionStorage;
    let isLogin = false;
    if (!storage.getItem('isLogin')) {
      storage.setItem('isLogin', "false");
    } else {
      isLogin = storage.getItem('isLogin') === 'true' ? true : false;
    }
    return (
      <BrowserRouter>
        <div>
          {isLogin && <TopBar />}
          {isLogin && <Menu />}
          <Switch>
            <Route 
              path='/'
              exact
              render={props => {
                return isLogin ? <Index /> : <Redirect to="/login"/>
              }}
            />
            <Route
              path='/history'
              render={props => {
                return isLogin ? <History /> : <Redirect to="/login"/>
              }}
            />
            <Route 
              path='/camera'
              render={props => {
                return isLogin ? <Camera /> : <Redirect to="/login"/>
              }}
            />
            <Route 
              path='/log'
              render={props => {
                return isLogin ? <Log /> : <Redirect to="/login"/>
              }}
            />
            <Route 
              path='/about'
              render={props => {
                return isLogin ? <About /> : <Redirect to="/login"/>
              }}
            />
            <Route 
              path="/login"
              render={props => {
                return isLogin ? <Redirect to="/"/> : <Login />
              }}
            />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}