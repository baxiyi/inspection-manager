import React, {PureComponent} from 'react'
import {Icon} from 'antd'
import './index.css'

export default class extends PureComponent {
  render() {
    return (
      <div className="top-bar">
        <div className="title">
          <Icon type="home" style={{marginRight: 5}}/>
          一键顺控系统
        </div>
      </div>
    )
  }
}