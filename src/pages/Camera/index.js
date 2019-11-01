import React, {PureComponent} from 'react'
import {Icon, Button, Modal, DatePicker, TimePicker, message} from 'antd'
import './index.css'
import moment from 'moment';

export default class extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: false,
      cameraNum: 1,
      curCameraNum: 0,
      detailData: null,
      startTime: this.getOneHourBefore(),
      endTime: new Date(),
    }
  }

  getOneHourBefore() {
    const now = new Date();
    return new Date(now.getTime() - 60*60*1000)
  }

  showDetail(num) {
    this.setState({
      curCameraNum: num,
      isShowDetail: true,
      // 需要改
      detailData: {
        ipAddress: '1.1.1.1',
        imgUrls: [
          {
            url: require('../../imgs/camera1.png'),
            time: '2019-10-10 14:30:22',
          },
          {
            url: require('../../imgs/camera2.png'),
            time: '2019-10-20 13:00:34',
          }
        ]
      }
    })
  }

  toggleCamera() {
    console.log('toggle');
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
    this.updateImages();
  }

  updateImages() {
    console.log('update');
  }

  renderCamera(num) {
    return (
      <div className="camera-item">
        <Button size="large" className="my-button" onClick={() => {
          this.showDetail(num);
        }}>
          <Icon type="camera" theme="filled" className="my-icon"/>
        </Button>
        <div className="camera-desc">{num + '号'}</div>
      </div>
    )
  }

  renderDetail() {
    return this.state.isShowDetail && (
      <Modal
        visible={this.state.isShowDetail}
        title={this.state.curCameraNum + '号屏柜详情'}
        width="60%"
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
          })
        }}
      >
        <div className="camera-infor">
          <div className="camera-name" style={{fontWeight: 'bold'}}>{'摄像机' + this.state.cameraNum}</div>
          <div>{'IP: ' + String(this.state.detailData !== null ? this.state.detailData.ipAddress : '')}</div>
        </div>
        <Button type="primary" onClick={() => this.toggleCamera()} className="toggle-button">
          切换相机
        </Button>
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
          <div className="images">
            {
              this.state.detailData.imgUrls.map(img => (
                <div className="shelf-img" >
                  <img src={img.url} alt="屏柜图片"/>
                  <div className="img-desc">{img.time}</div>
                </div>
              ))
            }
          </div>
        </div>
      </Modal>
    )
  }

  render() {
    const cameraData = [
      [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}],
      [{id: '5'}, {id: '6'}, {id: '7'}, {id: '8'}],
      [{id: '9'}, {id: '10'}, {id: '11'}, {id: '12'}]
    ];
    return(
      <div className="camera">
        {
          cameraData.map((cameraRow) => (
            <div>
              {
                cameraRow.map((camera) => {
                  return this.renderCamera(camera.id);
                })
              }
            </div>
          ))
        }
        {this.renderDetail()}
      </div>
    )
  }
}