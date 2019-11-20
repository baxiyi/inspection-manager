import React, {PureComponent} from 'react'
import {Table, DatePicker, TimePicker, Button, message, Input} from 'antd'
import moment from 'moment';
import {HOST} from '../../config';
import './index.css'

const {Search} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startTime: this.getOneHourBefore(),
      endTime: new Date(),
      searchText: '',
      pageOffset: 0,
      totalPages: 0,
      tableData: [],
    }
  }

  componentDidMount() {
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    fetch(`${HOST}/getLogList.json?usrId=${this.state.searchText}&startTime=${startTime}
    &endTime=${endTime}&page=${this.state.pageOffset}&size=10`)
    .then(response => response.json())
    .then(response => {
      const {totalPages} = response.data;
      console.log(totalPages)
      const {pageData} = response.data;
      const tableData = pageData.map((item, index) => {
        return {
          logId: item.logId,
          seq: index + 1,
          date: item.logTime,
          handleDetail: item.content,
          user: item.usrByUsrId.usrName,
        }
      });
      this.setState({
        tableData,
        totalPages,
      })
    })
  }

  formatDate (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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
    }, () => this.updateLogs())
    
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
    // const data = [
    //   {
    //     seq: '1',
    //     date: '2019-10-11',
    //     handleDetail: '操作1',
    //     user: '用户1',
    //   },
    //   {
    //     seq: '2',
    //     date: '2019-10-11',
    //     handleDetail: '操作2',
    //     user: '用户2',
    //   },
    //   {
    //     seq: '3',
    //     date: '2019-10-10',
    //     handleDetail: '操作3',
    //     user: '用户3',
    //   }
    // ]
    const data = this.state.tableData;
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
          pagination={{
            current: this.state.pageOffset,
            total: this.state.totalPages*10,
            pageSize: 10,
            onChange: (page) => {
              this.setState({
                pageOffset: page,
              }, () => this.updateLogs())
            }
          }}
        />
      </div>
    )
  }
}