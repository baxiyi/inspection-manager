import React, {PureComponent} from 'react'
import {Icon} from 'antd'
import {withRouter} from 'react-router-dom'
import './index.css'

class TopBar extends PureComponent {

  logout() {
    const storage = window.sessionStorage;
    storage.setItem('isLogin', 'false');
    storage.setItem('userId', '');
    storage.setItem('userName', '');
    this.props.history.push('/login');
    window.location.reload();
  }

  render() {
    const storage = window.sessionStorage;
    let userName = '';
    if (storage.getItem('userName')) {
      userName = storage.getItem('userName')
    }
    return (
      <div className="top-bar">
        <div className="title">
          <Icon type="home" style={{marginRight: 5}}/>
          智能巡检系统
        </div>
        <div className="logout">
          <span className="userid">用户: {userName}</span>
          <a className="logout-link" onClick={() => this.logout()}>
            退出登录 
            <Icon type="logout" />
          </a>
        </div>
      </div>
    )
  }
}

export default withRouter(TopBar)