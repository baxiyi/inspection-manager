import React, {PureComponent} from 'react'
import {Icon, Button, Modal, DatePicker, TimePicker, message, Popover} from 'antd'
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
      shevesList: [],
      maxRow: 0,
      maxCow: 0,
    }
  }

  componentDidMount() {
    fetch(`../jsons/getShelvesList.json`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      const {maxRow} = response.data.pageData;
      const {maxCol} = response.data.pageData;
      const {shelves} = response.data.pageData;
      this.setState({
        maxRow,
        maxCol,
        shevesList: shelves,
      })
    })
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

  renderCamera(camera) {
    const hasShelf = camera == null ? false : true;
    return (
      <div className="camera-item">
        {
          hasShelf ? (
            <div>
              <Popover content={camera.shelfName}>
                <Button size="large" className="my-button" onClick={() => {
                  this.showDetail(camera.shelfId);
                }}>
                  <Icon type="camera" theme="filled" className="my-icon"/>
                </Button>
              </Popover>
              <div className="camera-desc">{camera.shelfId + '号'}</div>
            </div>
          ) : null
        }
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
    // const cameraData = [
    //   [
    //     {hasShelf: false,}, 
    //     {hasShelf: true, id: '1', detail: '1号屏柜'}, 
    //     {hasShelf: true, id: '2', detail: '2号屏柜'}, 
    //     {hasShelf: false,}],
    //   [
    //     {hasShelf: true, id: '3', detail: '3号屏柜'}, 
    //     {hasShelf: false, id: '4', detail: '4号屏柜'}, 
    //     {hasShelf: true, id: '5', detail: '5号屏柜'}, 
    //     {hasShelf: false}],
    //   [
    //     {hasShelf: true, id: '6', detail: '6号屏柜'}, 
    //     {hasShelf: false, id: '7', detail: '7号屏柜'}, 
    //     {hasShelf: false}, 
    //     {hasShelf: true, id: '8', detail: '8号屏柜'}]
    // ];
    const cameraData = this.state.shevesList;
    return(
      <div className="camera">
        {
          cameraData.map((cameraRow) => (
            <div>
              {
                cameraRow.map((camera) => {
                  return this.renderCamera(camera);
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