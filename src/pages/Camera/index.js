import React, {PureComponent} from 'react'
import {Icon, Button, Modal} from 'antd'
import './index.css'

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: false,
      imgUrls: [],
      cameraNum: 1,
    }
  }

  showDetail(num) {
    this.setState({
      curCameraNum: num,
      isShowDetail: true,
    })
    console.log(num)
  }

  renderCamera(num) {
    return (
      <div className="camera-item">
        <Button size="large" className="my-button" onClick={(num) => this.showDetail(num)}>
          <Icon type="camera" theme="filled" className="my-icon"/>
        </Button>
        <div className="camera-desc">{num + '号'}</div>
      </div>
    )
  }

  renderDetail() {
    return (
      <Modal
        visible={this.state.isShowDetail}
        title={this.state.curCameraNum + '号屏柜详情'}
        width="80%"
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