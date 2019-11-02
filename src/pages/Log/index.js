import React, {PureComponent} from 'react'
import {Table, DatePicker, TimePicker, Button, message, Input} from 'antd'
import moment from 'moment';
import './index.css'

const {Search} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startTime: this.getOneHourBefore(),
      endTime: new Date(),
      searchText: '',
    }
  }

  getOneHourBefore() {
    const now = new Date();
    return new Date(now.getTime() - 60*60*1000)
  }

  changeDateRange() {
    console.log('change date range');
    const start = this.state.startTime;
    const end = this.state.endTime;
    const now = new Date();
    if (start.getTime() > end.getTime()) {
      message.error('结束时间必须大于开始时间');
      return;
    }
    if (start.getTime() > now.getTime() || end.getTime() > now.getTime()) {
      message.error('开始时间和结束时间均须在当前时间之前');
    }
    this.updateLogs();
  }

  filterUsers(value) {
    this.setState({
      searchText: value,
    })
  }

  updateLogs() {
    console.log('update logs')
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
      },
      {
        title: '日期',
        dataIndex: 'date',
      },
      {
        title: '操作',
        dataIndex: 'handleDetail',
      },
      {
        title: '用户',
        dataIndex: 'user',
      }
    ];
    // 需获取
    const data = [
      {
        seq: '1',
        date: '2019-10-11',
        handleDetail: '操作1',
        user: '用户1',
      },
      {
        seq: '2',
        date: '2019-10-11',
        handleDetail: '操作2',
        user: '用户2',
      },
      {
        seq: '3',
        date: '2019-10-10',
        handleDetail: '操作3',
        user: '用户3',
      }
    ]
    return (
      <div className="log">
        <div className="date">
          <div className="start-date">
            开始时间：
            <DatePicker 
              placeholder="开始日期"
              value={moment(this.state.startTime, 'YYYY-MM-DD')}
              onChange={(date) => {
                if (date == null)
                  return;
                const newTime = date.toDate();
                const curTime = this.state.startTime;
                newTime.setHours(curTime.getHours())
                newTime.setMinutes(curTime.getMinutes())
                newTime.setSeconds(curTime.getSeconds())
                this.setState({
                  startTime: newTime,
                })
              }}
            />
            <TimePicker 
              placeholder="开始时间"
              value={moment(this.state.startTime, 'HH:mm')}
              format='HH:mm'
              onChange={(date) => {
                if (date == null)
                  return;
                const newTime = date.toDate();
                const curTime = this.state.startTime;
                newTime.setFullYear(curTime.getFullYear())
                newTime.setMonth(curTime.getMonth())
                newTime.setDate(curTime.getDate())
                this.setState({
                  startTime: newTime,
                })
              }}
            />
          </div>
          <div className="end-date">
            结束时间：
            <DatePicker 
              placeholder="结束日期"
              value={moment(this.state.endTime, 'YYYY-MM-DD')}
              onChange={(date) => {
                if (date == null)
                  return;
                const newTime = date.toDate();
                const curTime = this.state.endTime;
                newTime.setHours(curTime.getHours())
                newTime.setMinutes(curTime.getMinutes())
                newTime.setSeconds(curTime.getSeconds())
                this.setState({
                  endTime: newTime,
                })
              }}
            />
            <TimePicker 
              placeholder="结束时间"
              value={moment(this.state.endTime, 'HH:mm')}
              format='HH:mm'
              onChange={(date) => {
                if (date == null)
                  return;
                const newTime = date.toDate();
                const curTime = this.state.endTime;
                newTime.setFullYear(curTime.getFullYear())
                newTime.setMonth(curTime.getMonth())
                newTime.setDate(curTime.getDate())
                this.setState({
                  endTime: newTime,
                })
              }}
            />
          </div>
          <Button type="primary" onClick={() => this.changeDateRange()}>筛选</Button>
        </div>
        <div className="user-search">
          用户筛选：
          <Search 
            placeholder="请输入用户名"
            onSearch={(value) => this.filterUsers(value)}
            style={{width: 200}}
          />
        </div>
        <Table 
          columns={columns}
          dataSource={data}
          bordered
          className="log-table"
        />
      </div>
    )
  }
}