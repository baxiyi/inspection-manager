import React, {PureComponent} from 'react'
import {Table, Modal, message, DatePicker, TimePicker, Button, Input} from 'antd'
import './index.css'
import moment from 'moment'
import Zmage from 'react-zmage'
import { HOST } from '../../config'

const {Search} = Input;

export default class extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: false,
      detailData: [],
      isShowPic: false,
      imgUrls: [],
      startTime: this.getOneHourBefore(),
      endTime: new Date(),
      searchText: '',
      pageOffset: 1,
      tableData: [],
      totalPages: 1,
    }
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

  componentDidMount() {
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    console.log(`startTime: ${startTime}`)
    fetch(`${HOST}/getHistoryWarnings.json?page=${this.state.pageOffset}&size=10&startTime=${startTime}&endTime=${endTime}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      console.log(response);
      const {pageData} = response.data;
      const tableData = pageData.map((item, index) => {
        return {
          id: item.warningId,
          seq: index + 1,
          infor: item.rulebaseByRulebaseId.warningInfo,
          time: item.occurTime,
          level: item.rulebaseByRulebaseId.importance,
          status: item.state == 1 ? '已处理' : '误告警',
          handler: item.usrByUsrId.usrName,
        }
      });
      const {totalPages} = response.data;
      this.setState({
        tableData,
        totalPages,
      })
    })
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
      return;
    }
    this.updateHistoryWarnings();
  }

  filterUsers(value) {
    this.setState({
      searchText: value,
    }, () => this.updateHistoryWarnings())
    
  }

  updateHistoryWarnings() {
    console.log('update history warnings')
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    fetch(`${HOST}/getHistoryWarnings.json?page=${this.state.pageOffset}&size=10&startTime=${startTime}&endTime=${endTime}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      console.log(response);
      const {pageData} = response.data;
      const tableData = pageData.map((item, index) => {
        return {
          id: item.warningId,
          seq: index + 1,
          infor: item.rulebaseByRulebaseId.warningInfo,
          time: item.occurTime,
          level: item.rulebaseByRulebaseId.importance,
          status: item.state == 1 ? '已处理' : '误告警',
          handler: item.usrByUsrId.usrName,
        }
      });
      const {totalPages} = response.data;
      this.setState({
        tableData,
        totalPages,
      })
    })
  }

  showDetail(id) {
    fetch(`${HOST}/getWarningDetail.json?warningId=${id}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(async response => {
      const warning = response.data.pageData;
      let res = {};
      res.warningId = warning.warningId;
      res.seq = 1;
      res.time = warning.occureTime;
      await fetch(`${HOST}/getWarningDetail.json?warningId=${warning.warningId}`)
        .then(response => response.json())
        .then(response => {
          const {pageData} = response.data;
          res.devices = pageData.unitStatuses.map((dev, index) => {
            let obj = {};
            if (dev.currentStatus.indexOf('b') !== -1) {
              const temp = dev.currentStatus.match(/b\((.)\)/);
              obj.status = temp[1] == 1 ? '开' : '关';
            } else {
              const temp = dev.currentStatus.match(/i\((.)\)/);
              obj.status = parseInt(temp[1]);
            }
            obj.devId = dev.unitByUnitId.unitId;
            obj.devName = dev.unitByUnitId.deviceByDeviceId.deviceName;
            obj.devType = dev.unitByUnitId.category;
            obj.shelf = dev.unitByUnitId.deviceByDeviceId.partByPartId.shelfByShelfId.shelfName;
            return obj;
          })
        })
      return res;
    }).then(data => {
        let devices = data.devices.map((dev, index) => {
          return Object.assign(dev, {
            seq: 1,
            index: index,
            time: data.time,
            // 警告的id
            warningId: data.warningId,
            devLen: data.devices.length,
          })
        });
        this.setState({
          isShowDetail: true,
          detailData: devices,
        })
      });
    // detialData是获取的
    // const data1 = [
    //   {
    //     warningId: 1,
    //     seq: '1',
    //     devices: [
    //       {
    //         devId: '10',
    //         devName: '设备1',
    //         devType: '类型1',
    //         shelf: '屏柜1',
    //         status: '开',
    //       },
    //       {
    //         devId: '12',
    //         devName: '设备2',
    //         devType: '类型2',
    //         shelf: '屏柜2',
    //         status: '关',
    //       }
    //     ],
    //     time: '2019-10-30 18:00:44',
    //   }
    // ];
    // const data2 = [
    //   {
    //     warningId: 2,
    //     seq: '1',
    //     devices: [
    //       {
    //         devId: '11',
    //         devName: '设备1',
    //         devType: '类型1',
    //         shelf: '屏柜1',
    //         status: '开',
    //       }
    //     ],
    //     time: '2019-10-20 18:00:19',
    //   }
    // ]
    // const data = id == '1' ? data1 : data2;
    // let res = [];
    // data.forEach((item, itemIndex) => {
    //   let devices = item.devices.map((dev, index) => {
    //     return Object.assign(dev, {
    //       index: index,
    //       time: item.time,
    //       // 警告的id
    //       warningId: item.warningId,
    //       devLen: item.devices.length,
    //     })
    //   });
    //   res = res.concat(devices);
    // });
    // this.setState({
    //   isShowDetail: true,
    //   detailData: res,
    // })
  }

  async showPic() {
    const devices = this.state.detailData;
    const imgUrls = await Promise.all(
      devices.map(dev => fetch(`${HOST}/getDeviceImg.json?warningId=${dev.warningId}&unitId=${dev.devId}`)
      .then(response => response.json())
      .then(response => {
        return {
          url: response.data.pageData,
          desc: dev.devName,
        }
      })
    ));
    this.setState({
      imgUrls,
      isShowPic: true,
    })
    // 需要改
    // if (devId == 10) {
    //   this.setState({
    //     imgUrl: require('../../imgs/11.png'),
    //     isShowPic: true,
    //   });
    // } else {
    //   this.setState({
    //     imgUrl: require('../../imgs/10.png'),
    //     isShowPic: true,
    //   });
    // }
    console.log('show pic')
  }

  renderDetail() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
        render: (value, record) => {
          let obj = {
            children: record.index + 1,
            props: {},
          };
          if (record.index == 0) {
            obj.props.rowSpan = record.devLen;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '设备名称',
        dataIndex: 'devName', 
        key: 'devName',
      },
      {
        title: '设备类型',
        dataIndex: 'devType',
        key: 'devType',
      },
      {
        title: '所属屏柜',
        dataIndex: 'shelf',
        key: 'shelf',
      },
      {
        title: '识别状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '出现时刻',
        dataIndex: 'time',
        key: 'time',
        render: (value, record) => {
          let obj = {
            children: record.time,
            props: {},
          };
          if (record.index == 0) {
            obj.props.rowSpan = record.devLen;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '',
        dataIndex: 'imgUrl',
        key: 'imgUrl',
        render: (value, record) => {
          let obj = {
            children: <a onClick={id => this.showPic()}>查看图像</a>,
            props: {},
          };
          if (record.index == 0) {
            obj.props.rowSpan = record.devLen;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      // {
      //   title: '',
      //   dataIndex: 'isHandle',
      //   key: 'isHandle',
      //   render: (value, record) => {
      //     let obj = {
      //       children: <span className="unable">标记为已处理</span>,
      //       props: {},
      //     };
      //     if (record.index == 0) {
      //       obj.props.rowSpan = record.devLen;
      //     } else {
      //       obj.props.rowSpan = 0;
      //     }
      //     return obj;
      //   }
      // },
      // {
      //   title: '',
      //   dataIndex: 'wrongWarning',
      //   key: 'wrongWarning',
      //   render: (value, record) => {
      //     let obj = {
      //       children: <span className="unable">标记为误警告</span>,
      //       props: {},
      //     };
      //     if (record.index == 0) {
      //       obj.props.rowSpan = record.devLen;
      //     } else {
      //       obj.props.rowSpan = 0;
      //     }
      //     return obj;
      //   }
      // }
    ];
    return (
      <Modal
        width="80%"
        title="警告详情"
        visible={this.state.isShowDetail}
        okText="确认"
        cancelText="取消"
        onOk={() => {
          this.setState({
            isShowDetail: false,
          })
        }}
        onCancel={() => {
          this.setState({
            isShowDetail: false,
            isShowPic: false,
          })
        }}
      >
        <Table
          columns={columns}
          dataSource={this.state.detailData}
          bordered
        ></Table>
        {this.state.isShowPic && (
          <div>
            {
              this.state.imgUrls.map((img) => (
                <div className="device-img-item">
                  <Zmage className="device-img" src={img.url} alt={img.desc} />
                  <div className="device-img-desc">{img.desc}</div>
                </div>
              ))
            }
          </div>
        )}
      </Modal>
    )
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
      },
      {
        title: '告警信息',
        dataIndex: 'infor',
      },
      {
        title: '出现时刻',
        dataIndex: 'time',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '处理人',
        dataIndex: 'handler',
      },
      {
        title: '',
        dataIndex: 'detail',
        render: (value, record) => <a onClick={(id) => this.showDetail(record.id)}>查看详情</a>
      }
    ];
    // const data = [
    //   {
    //     id: '1',
    //     seq: '1',
    //     infor: '告警信息1',
    //     time: '2019-10-10 19:00:34',
    //     status: '已处理',
    //     handler: '处理人1',
    //     level: '1',
    //   },
    //   {
    //     id: '2',
    //     seq: '2',
    //     infor: '告警信息2',
    //     time: '2019-10-11 14:00:00',
    //     status: '已处理',
    //     handler: '处理人2',
    //     level: '2',
    //   },
    //   {
    //     id: '3',
    //     seq: '3',
    //     infor: '告警信息3',
    //     status: '已处理',
    //     handler: '处理人3',
    //     time: '2019-10-13 14:00:01',
    //     level: '3',
    //   },{},{},{},{},{},{},{},{},{}
    // ]
    const data = this.state.tableData;
    return (
      <div className="history">
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
          className="history-table"
          rowClassName={(record) => {
            switch(record.level) {
              case 1:
                return 'level-1';
              case 2:
                return 'level-2';
              case 3:
                return 'level-3';
              default:
                return;
            }
          }}
          bordered
          pagination={{
            current: this.state.pageOffset,
            total: this.state.totalPages*10,
            pageSize: 10,
            onChange: (page) => {
              this.setState({
                pageOffset: page,
              }, () => this.updateHistoryWarnings())
            }
          }}
        ></Table>
        {this.renderDetail()}
      </div>
    )
  }
}