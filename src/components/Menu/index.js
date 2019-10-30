import React, {PureComponent} from 'react'
import {Menu} from 'antd'
import {Link} from 'react-router-dom'
import './index.css'

export default class extends PureComponent {
  render() {
    return (
      <Menu defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key='1'>当前警告</Menu.Item>
          <Menu.Item key='2'>历史警告</Menu.Item>
        <Link to="/camera">
          <Menu.Item key='3'>摄像头查看</Menu.Item>
        </Link>
        <Link to="/log">
          <Menu.Item key='4'>日志系统</Menu.Item>
        </Link>
        <Link to="/about">
          <Menu.Item key='5'>关于</Menu.Item>
        </Link>
      </Menu>
    )
  }
}