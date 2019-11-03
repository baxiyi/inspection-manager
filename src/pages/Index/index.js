import React, {PureComponent} from 'react'
import {Table, Modal} from 'antd'
import './index.css'

export default class extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: false,
      detailData: [],
      isShowPic: false,
      imgUrl: '',
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
    ]
    const data = id == '1' ? data1 : data2;
    let res = [];
    data.forEach((item, itemIndex) => {
      let devices = item.devices.map((dev, index) => {
        return Object.assign(dev, {
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
    })
  }

  showPic(devId) {
    // 需要改
    if (devId == 10) {
      this.setState({
        imgUrl: require('../../imgs/11.png'),
        isShowPic: true,
      });
    } else {
      this.setState({
        imgUrl: require('../../imgs/10.png'),
        isShowPic: true,
      });
    }
    console.log('show pic')
  }

  handleWarning(warningId) {
    console.log(warningId)
  }

  wrongWarning(warningId) {
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
        render: (value, record) => <a onClick={id => this.showPic(record.devId)}>查看图像</a>
      },
      {
        title: '',
        dataIndex: 'isHandle',
        key: 'isHandle',
        render: (value, record) => <a onClick={id => this.handleWarning(record.warningId)}>标记为已处理</a>
      },
      {
        title: '',
        dataIndex: 'wrongWarning',
        key: 'wrongWarning',
        render: (value, record) => <a onClick={id => this.wrongWarning(record.warningId)}>标记为误警告</a>
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
        {this.state.isShowPic && <img className="device-img" src={this.state.imgUrl} alt="设备图片"></img>}
      </Modal>
    )
  }
  render() {
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
        ></Table>
        {this.renderDetail()}
      </div>
    );
  }
}