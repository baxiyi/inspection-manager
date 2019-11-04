import React, {PureComponent} from 'react'
import {Icon} from 'antd'
import {withRouter} from 'react-router-dom'
import './index.css'

class TopBar extends PureComponent {

  logout() {
    const storage = window.sessionStorage;
    storage.setItem('isLogin', 'false');
    storage.setItem('userId', '');
    this.props.history.push('/login');
    window.location.reload();
  }

  render() {
    const storage = window.sessionStorage;
    let userId = '';
    if (storage.getItem('userId')) {
      userId = storage.getItem('userId')
    }
    return (
      <div className="top-bar">
        <div className="title">
          <Icon type="home" style={{marginRight: 5}}/>
          一键巡检系统
        </div>
        <div className="logout">
          <span className="userid">用户: {userId}</span>
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