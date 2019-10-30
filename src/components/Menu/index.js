import React, {PureComponent} from 'react'
import {Menu} from 'antd'
import {Link} from 'react-router-dom'
import './index.css'

export default class extends PureComponent {
  render() {
    return (
      <Menu defaultSelectedKeys={['1']}
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