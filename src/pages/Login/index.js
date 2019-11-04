import React, {PureComponent} from 'react'
import {Form, Input, Icon, Button, message} from 'antd'
import {withRouter} from 'react-router-dom'
import './index.css'

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoginPage: true,
      userId: '',
      password: '',
    }
  }

  login(e) {
    e.preventDefault();
    console.log('login');
    message.info('登录成功');
    let storage = window.sessionStorage;
    storage.setItem('isLogin', "true");
    storage.setItem('userId', this.state.userId)
    this.props.history.push('/');
    window.location.reload();
  }

  register(e) {
    e.preventDefault();
    console.log('register');
    message.info('注册成功')
    this.setState({
      isLoginPage: true,
    })
  }

  render() {
    return (
      <div className="login">
        <div className="login-title">
          监控巡检系统
        </div>
        {
          this.state.isLoginPage ? (
            <Form onSubmit={(e) => this.login(e)} className="my-form">
              <Form.Item>
                <Input 
                  prefix={<Icon type="user"/>}
                  placeholder="输入用户ID"
                  onChange={(e) => {
                    this.setState({
                      userId: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Input.Password 
                  prefix={<Icon type="lock" />}
                  placeholder="输入密码"
                  onChange={(e) => {
                    this.setState({
                      password: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="form-button">
                  登录
                </Button>
                <div>
                  暂无账号? <a onClick={() => {
                    this.setState({
                      isLoginPage: false,
                    })
                  }}>
                    现在注册
                  </a>
                </div>
              </Form.Item>
            </Form>
          ) : (
            <Form onSubmit={(e) => this.register(e)} className="my-form">
              <Form.Item>
                <Input 
                  prefix={<Icon type="user"/>}
                  placeholder="输入用户ID"
                  onChange={(e) => {
                    this.setState({
                      userId: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Input.Password 
                  prefix={<Icon type="lock" />}
                  placeholder="输入密码"
                  onChange={(e) => {
                    this.setState({
                      password: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="form-button">
                  注册
                </Button>
              </Form.Item>
            </Form>
          )
        }
      </div>
    )
  }
}

export default withRouter(Login)
