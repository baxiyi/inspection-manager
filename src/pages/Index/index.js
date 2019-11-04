import React, {PureComponent} from 'react'
import {Table, Modal} from 'antd'
import './index.css'

export default class extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: false,
      detailData: [],
      isShowPic: false,
      imgUrls: '',
    }
  }

  showDetail(id) {
    // detialData是获取的
    const data1 = [
      {
        warningId: 1,
        seq: '1',
        devices: [
          {
            devId: '10',
            devName: '设备1',
            devType: '类型1',
            shelf: '屏柜1',
            status: '开',
          },
          {
            devId: '12',
            devName: '设备2',
            devType: '类型2',
            shelf: '屏柜2',
            status: '关',
          }
        ],
        time: '2019-10-30 18:00:44',
      }
    ];
    const data2 = [
      {
        warningId: 2,
        seq: '1',
        devices: [
          {
            devId: '11',
            devName: '设备1',
            devType: '类型1',
            shelf: '屏柜1',
            status: '开',
          }
        ],
        time: '2019-10-20 18:00:19',
      }
    ];
    const data3 = [
      {
        warningId: 3,
        seq: '1',
        devices: [
          {
            devId: '11',
            devName: '设备1',
            devType: '类型1',
            shelf: '屏柜1',
            status: '开',
          }
        ],
        time: '2019-10-20 18:00:19',
      }, 
      {
        warningId: 4,
        seq: '2',
        devices: [
          {
            devId: '12',
            devName: '设备2',
            devType: '类型2',
            shelf: '屏柜2',
            status: '开',
          }
        ],
        time: '2019-10-20 18:00:20',
      },
      {
        warningId: 5,
        seq: '3',
        devices: [
          {
            devId: '13',
            devName: '设备3',
            devType: '类型3',
            shelf: '屏柜3',
            status: '关',
          }
        ],
        time: '2019-10-20 18:00:30',
      }
    ]
    let data = null;
    switch(id) {
      case '1':
        data = data1;
        break;
      case '2':
        data = data2;
        break;
      case '3':
        data = data3;
        break;
      default:
        break;
    }
    let res = [];
    let isHandledObj = {};
    data.forEach((item, itemIndex) => {
      isHandledObj[item.warningId] = false;
      let devices = item.devices.map((dev, index) => {
        return Object.assign(dev, {
          seq: itemIndex + 1,
          index: index,
          time: item.time,
          // 警告的id
          warningId: item.warningId,
          devLen: item.devices.length,
        })
      });
      res = res.concat(devices);
    });
    this.setState({
      isShowDetail: true,
      detailData: res,
      isHandledObj,
    })
  }

  showPic(warningId) {
    // 需要改
    this.setState({
      imgUrls: warningId == '1' ? [require('../../imgs/11.png'), require('../../imgs/10.png')] : [require('../../imgs/11.png')],
      isShowPic: true,
    });
    console.log('show pic')
  }

  handleWarning(warningId) {
    const {isHandledObj} = this.state;
    let newObj = isHandledObj;
    newObj[warningId] = true;
    this.setState({
      isHandledObj: newObj,
    })
    console.log(newObj)
    console.log(warningId)
  }

  wrongWarning(warningId) {
    const {isHandledObj} = this.state;
    let newObj = isHandledObj;
    newObj[warningId] = true;
    this.setState({
      isHandledObj: newObj,
    })
    console.log(warningId)
  }

  renderDetail() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
        render: (value, record) => {
          let obj = {
            children: record.seq,
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
            children: (<a onClick={id => this.showPic(record.warningId)}>查看图像</a>),
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
        dataIndex: 'isHandle',
        key: 'isHandle',
        render: (value, record) => {
          let obj = {
            children: this.state.isHandledObj[record.warningId]
            ?  <span className="unable">标记为已处理</span>
            :<a onClick={() => this.handleWarning(record.warningId)}>标记为已处理</a>,
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
        dataIndex: 'wrongWarning',
        key: 'wrongWarning',
        render: (value, record) => {
          let obj = {
            children: this.state.isHandledObj[record.warningId]
            ?  <span className="unable">标记为误告警</span>
            : (<a onClick={() => this.wrongWarning(record.warningId)}>标记为误警告</a>),
            props: {},
          };
          if (record.index == 0) {
            obj.props.rowSpan = record.devLen;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      }
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
            isShowPic: false,
            isHandledObj: {},
          })
        }}
        onCancel={() => {
          this.setState({
            isShowDetail: false,
            isShowPic: false,
            isHandledObj: {},
          })
        }}
      >
        <Table
          columns={columns}
          dataSource={this.state.detailData}
          bordered
        ></Table>
        {this.state.isShowPic ? (
          <div>
            {
              this.state.imgUrls.map((url) => (
                <img className="device-img" src={url} alt="设备图片"></img>
              ))
            }
          </div>
        ) : null}
      </Modal>
    )
  }
  render() {
    console.log('render')
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
      },
      {
        title: '告警信息',
        dataIndex: 'infor',
        key: 'infor',
      },
      {
        title: '出现次数',
        dataIndex: 'cnt',
        key: 'cnt',
      },
      {
        title: '最近时刻',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '',
        dataIndex: 'detail',
        key: 'detail',
        render: (value, record) => <a onClick={id => this.showDetail(record.id) }>查看详情</a>
      }
    ];
    // 需要获取
    const data = [
      {
        id: '1',
        seq: '1',
        infor: '告警信息1',
        cnt: '1',
        time: '2019-10-10 16:00:43',
        level: '1',
      },
      {
        id: '2',
        seq: '2',
        infor: '告警信息2',
        cnt: '1',
        time: '2019-10-12 15:00:43',
        level: '2',
      },
      {
        id: '3',
        seq: '3',
        infor: '告警信息3',
        cnt: '3',
        time: '2019-10-15 16:00:43',
        level: '3'
      },
    ];
    return (
      <div className="index">
        <div className="warning-count">
          {'当前警告数：' + data.length}
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowClassName={(record) => {
            switch(record.level) {
              case '1':
                return 'level-1';
              case '2':
                return 'level-2';
              case '3':
                return 'level-3';
              default:
                return;
            }
          }}
          bordered
          pagination={false}
        ></Table>
        {this.renderDetail()}
      </div>
    );
  }
}