import React, {PureComponent} from 'react'
import {Table, Modal, message} from 'antd'
import Zmage from 'react-zmage'
import './index.css'
import { HOST } from '../../config';

export default class extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: false,
      detailData: [],
      currentWarningsData: [],
      pageOffset: 1,
      totalPages: 0,
    }
  }

  fetchCurrentWarnings() {
    fetch(`${HOST}/getCurrentWarnings.json?page=${this.state.pageOffset}&size=10`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      if (response == null) {
        return;
      }
      console.log(response);
      const {pageData} = response.data;
      let data = pageData.map((item, index) => {
        return Object.assign(item, {
          id: item.ruleId,
          infor: item.info,
          seq: index + 1,
        });
      });
      const {totalPages} = response.data;
      if (data.length > this.state.currentWarningsData.length) {
        this.audioRef.play();
        if (!this.state.isShowDetail) {
          this.setState({
            currentWarningsData: data,
            totalPages,
          });
        }
      }
    });
  }

  componentDidMount() {
    fetch(`${HOST}/getCurrentWarnings.json?page=${this.state.pageOffset}&size=10`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      console.log(response);
      const {pageData} = response.data;
      let data = pageData.map((item, index) => {
        return Object.assign(item, {
          id: item.ruleId,
          infor: item.info,
          seq: index + 1,
        });
      });
      const {totalPages} = response.data;
      this.setState({
        currentWarningsData: data,
        totalPages,
      })
    });
    setInterval(() => {
      this.fetchCurrentWarnings();
    }, 10000);
  }

  updateCurrentWarnings() {
    fetch(`${HOST}/getCurrentWarnings.json?page=${this.state.pageOffset}&size=10`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      console.log(response);
      const {pageData} = response.data;
      let data = pageData.map((item, index) => {
        return Object.assign(item, {
          id: item.ruleId,
          infor: item.info,
          seq: index + 1,
        });
      });
      const {totalPages} = response.data;
      this.setState({
        currentWarningsData: data,
        totalPages,
      })
    })
    console.log('update');
  }

  showDetail(id) {
    fetch(`${HOST}/getCurrentSameWarnings.json?ruleId=${id}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(async response => {
      const {pageData} = response.data;
      let isHandledObj = {};
      const data = await Promise.all(
        pageData.map(async (warning, index) => {
          const warningId = warning.warningId;
          isHandledObj[warningId] = false;
          let res = {};
          res.warningId = warningId;
          res.seq = index + 1;
          res.time = warning.occurTime;
          res.isShowPic = false;
          res.imgUrls = [];
          await fetch(`${HOST}/getWarningDetail.json?warningId=${warningId}`)
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
        })
      )
      this.setState({
        isShowDetail: true,
        detailData: data,
        isHandledObj,
      })
    })
    //.then(data => {
    //   let res = [];
    //   let isHandledObj = {};
    //   data.forEach((item, itemIndex) => {
    //     isHandledObj[item.warningId] = false;
    //     let devices = item.devices.map((dev, index) => {
    //       return Object.assign(dev, {
    //         seq: itemIndex + 1,
    //         index: index,
    //         time: item.time,
    //         // 警告的id
    //         warningId: item.warningId,
    //         devLen: item.devices.length,
    //       })
    //     });
    //     res = res.concat(devices);
    //   });
    //   this.setState({
    //     isShowDetail: true,
    //     detailData: res,
    //     isHandledObj,
    //   })
    // })
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
    // ];
    // const data3 = [
    //   {
    //     warningId: 3,
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
    //   }, 
    //   {
    //     warningId: 4,
    //     seq: '2',
    //     devices: [
    //       {
    //         devId: '12',
    //         devName: '设备2',
    //         devType: '类型2',
    //         shelf: '屏柜2',
    //         status: '开',
    //       }
    //     ],
    //     time: '2019-10-20 18:00:20',
    //   },
    //   {
    //     warningId: 5,
    //     seq: '3',
    //     devices: [
    //       {
    //         devId: '13',
    //         devName: '设备3',
    //         devType: '类型3',
    //         shelf: '屏柜3',
    //         status: '关',
    //       }
    //     ],
    //     time: '2019-10-20 18:00:30',
    //   }
    // ]
    // let data = null;
    // switch(id) {
    //   case 1:
    //     data = data3;
    //     break;
    //   case 2:
    //     data = data1;
    //     break;
    //   case 3:
    //     data = data3;
    //     break;
    //   default:
    //     break;
    // }
    // let res = [];
    // let isHandledObj = {};
    // data.forEach((item, itemIndex) => {
    //   isHandledObj[item.warningId] = false;
    //   let devices = item.devices.map((dev, index) => {
    //     return Object.assign(dev, {
    //       seq: itemIndex + 1,
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
    //   isHandledObj,
    // })
  }

  async showPic(warningId) {
    const {detailData} = this.state;
    let warning = null;
    for (let item of detailData) {
      if (item.warningId == warningId) {
        warning = item;
        break;
      }
    }
    if (warning === null){
      return;
    }
    if (!warning.isShowPic) {
      const id = warning.warningId;
      const imgUrls = await Promise.all(
        warning.devices.map(dev => 
          fetch(`${HOST}/getDeviceImg.json?warningId=${id}&unitId=${dev.devId}`, {
            method: 'GET',
          }).then(response => response.json())
          .then(response => {
            return {
              url: response.data.pageData,
              desc: dev.devName,
            }
          })
        )
      )
      
      for (let item of detailData) {
        if (item.warningId == warningId) {
          item.isShowPic = true;
          item.imgUrls = imgUrls;
        }
      }
      // 需要改
      this.setState({
        detailData,
      });
    } else {
      for (let item of detailData) {
        if (item.warningId == warningId) {
          item.isShowPic = false;
        }
      }
      this.setState({
        detailData,
      })
    }
    console.log('show pic')
  }

  handleWarning(warningId) {
    const storage = window.sessionStorage;
    const userId = storage.getItem('userId');
    let form = new FormData();
    form.append("warningId", warningId);
    form.append("usrId", userId);
    form.append("type", "TP");
    fetch(`${HOST}/handleWarning.json`, {
      method: 'POST',
      body: form,
    }).then(response => response.json())
    .then(response => {
      if (response.message == 'success') {
        message.success('处理成功');
        const {isHandledObj} = this.state;
        let newObj = isHandledObj;
        newObj[warningId] = true;
        this.setState({
          isHandledObj: newObj,
        })
      } else {
        message.error('处理失败')
      }
    })
    console.log('handle warning');
  }

  wrongWarning(warningId) {
    const storage = window.sessionStorage;
    const userId = storage.getItem('userId');
    let form = new FormData();
    form.append("warningId", warningId);
    form.append("usrId", userId);
    form.append("type", "FP");
    fetch(`${HOST}/handleWarning.json`, {
      method: 'POST',
      body: form,
    }).then(response => response.json())
    .then(response => {
      if (response.message == 'success') {
        message.success('标为误告警成功');
        const {isHandledObj} = this.state;
        let newObj = isHandledObj;
        newObj[warningId] = true;
        this.setState({
          isHandledObj: newObj,
        })
      } else {
        message.error('标为误告警失败');
      }
    })
    console.log('wrong warning');
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
            children: (<a onClick={id => this.showPic(record.warningId)}>{record.isShowPic ? '收起图片' : '查看图片 '}</a>),
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
          window.location.reload();
        }}
        onCancel={() => {
          window.location.reload();
        }}
      >
        {
          this.state.detailData.map((data, index) => {
            let devices = data.devices.map((dev, devIndex) => {
              return Object.assign(dev, {
                seq: index + 1,
                index: devIndex,
                time: data.time,
                isShowPic: data.isShowPic,
                warningId: data.warningId,
                devLen: data.devices.length,
              })
            });
            return (
              <div>
                <Table
                  columns={columns}
                  dataSource={devices}
                  bordered
                  // showHeader={index == 0 ? true : false}
                  pagination={false}
                ></Table>
                {
                  data.isShowPic ? (
                    <div className="images">
                      {
                        data.imgUrls.map((img) => (
                          <div className="device-img-item">
                            <Zmage className="device-img" src={img.url} alt={img.desc} />
                            <div className="device-img-desc">{img.desc}</div>
                          </div>
                        ))
                      }
                    </div>
                  ) : null
                }
              </div>
            )
          })
        }
        {/* <Table
          columns={columns}
          dataSource={this.state.detailData}
          bordered
        ></Table>
        {this.state.isShowPic ? (
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
        ) : null} */}
      </Modal>
    )
  }
  render() {
    console.log('render');
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
    // const data = [
    //   {
    //     id: '1',
    //     seq: '1',
    //     infor: '告警信息1',
    //     cnt: '1',
    //     time: '2019-10-10 16:00:43',
    //     level: '1',
    //   },
    //   {
    //     id: '2',
    //     seq: '2',
    //     infor: '告警信息2',
    //     cnt: '1',
    //     time: '2019-10-12 15:00:43',
    //     level: '2',
    //   },
    //   {
    //     id: '3',
    //     seq: '3',
    //     infor: '告警信息3',
    //     cnt: '3',
    //     time: '2019-10-15 16:00:43',
    //     level: '3'
    //   },
    // ];
    const data = this.state.currentWarningsData;
    return (
      <div className="index">
        <audio src="http://data.huiyi8.com/2017/gha/03/17/1702.mp3" ref={(ele) => {this.audioRef = ele;}}></audio>
        <div className="warning-count">
          {'当前警告数：' + data.length}
        </div>
        <Table
          columns={columns}
          dataSource={data}
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
              }, () => this.updateCurrentWarnings())
            }
          }}
        ></Table>
        {this.renderDetail()}
      </div>
    );
  }
}