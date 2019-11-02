import React, {PureComponent} from 'react'
import {Menu} from 'antd'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

class MenuComp extends PureComponent {
  render() {
    const map = {
      '/': '1',
      '/history': '2',
      '/camera': '3',
      '/log': '4',
      '/about': '5',
    };
    const curPath = this.props.location.pathname;
    return (
      <Menu defaultSelectedKeys={[map[curPath]]}
        mode="inline"
        className="menu"
      >
        <Menu.Item key='1'>
          <Link to="/">当前警告</Link>
        </Menu.Item>
        <Menu.Item key='2'>
          <Link to="/history">历史警告</Link>
        </Menu.Item>
        <Menu.Item key='3'>
        <Link to="/camera">摄像头查看</Link>
        </Menu.Item>
        <Menu.Item key='4'>
          <Link to="/log">日志系统</Link>
        </Menu.Item>
        <Menu.Item key='5'>
          <Link to="/about">关于</Link>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(MenuComp);