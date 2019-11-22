import React, {PureComponent} from 'react'
import {Form, Input, Icon, Button, message} from 'antd'
import {withRouter} from 'react-router-dom'
import {HOST} from '../../config';
import './index.css'

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoginPage: true,
      loginUserId: '',
      loginPassword: '',
      registerUserId: '',
      registerUserName: '',
      registerPassword: '',
    }
  }

  login(e) {
    e.preventDefault();
    console.log('login');
    if (this.state.loginUserId.trim().length === 0) {
      message.error('用户ID不能为空');
      return;
    }
    if (this.state.loginPassword.trim().length === 0) {
      message.error('密码不能为空');
      return;
    }
    fetch(`${HOST}/getLogIn.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `UsrId=${this.state.loginUserId}&UsrPassword=${this.state.loginPassword}`
    })
    .then(response => response.json())
    .then(response => {
      if (response.data.pageData.login == '成功登陆') {
        message.success('登录成功');
        const userId = response.data.pageData.usrId;
        const userName = response.data.pageData.usrName;
        let storage = window.sessionStorage;
        storage.setItem('isLogin', "true");
        storage.setItem('userId', userId);
        storage.setItem('userName', userName);
        this.props.history.push('/');
        window.location.reload();
      } else {
        message.error(response.data.pageData.login);
      }
    })
  }

  register(e) {
    e.preventDefault();
    console.log('register');
    if (this.state.registerUserId.trim().length === 0) {
      message.error('用户ID不能为空');
      return;
    }
    if (this.state.registerUserName.trim().length === 0) {
      message.error('用户名不能为空');
      return;
    }
    if (this.state.registerPassword.trim().length === 0) {
      message.error('密码不能为空');
      return;
    }
    fetch(`${HOST}/getRegister.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `UsrId=${this.state.registerUserId}&UsrName=${this.state.registerUserName}&UsrPassword=${this.state.registerPassword}`,
    })
    .then(response => response.json())
    .then(response => {
      if (response.data.pageData.success == "yes") {
        message.success('注册成功');
        this.setState({
          isLoginPage: true,
          loginUserId: '',
          loginPassword: '',
        })
      } else {
        message.error(response.data.pageData.message);
      }
    })
  }

  render() {
    return (
      <div className="background">
        <div className="login">
        <div className="login-title">
          智能巡检系统
        </div>
        {
          this.state.isLoginPage ? (
            <Form onSubmit={(e) => this.login(e)} className="my-form">
              <Form.Item>
                <Input 
                  prefix={<Icon type="user"/>}
                  value={this.state.loginUserId}
                  placeholder="输入用户ID"
                  onChange={(e) => {
                    this.setState({
                      loginUserId: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Input.Password 
                  prefix={<Icon type="lock" />}
                  value={this.state.loginPassword}
                  placeholder="输入密码"
                  onChange={(e) => {
                    this.setState({
                      loginPassword: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="form-button" size="large">
                  登录
                </Button>
                <div>
                  <span className="notice">暂无账号?</span> <a className="register-link"
                    onClick={() => {
                    this.setState({
                      isLoginPage: false,
                      registerUserId: '',
                      registerUserName: '',
                      registerPassword: '',
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
                  prefix={<Icon type="number" />}
                  value={this.state.registerUserId}
                  placeholder="输入用户ID"
                  onChange={(e) => {
                    this.setState({
                      registerUserId: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Input 
                  prefix={<Icon type="user"/>}
                  value={this.state.registerUserName}
                  placeholder="输入用户名"
                  defaultValue=""
                  onChange={(e) => {
                    this.setState({
                      registerUserName: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Input.Password 
                  prefix={<Icon type="lock" />}
                  value={this.state.registerPassword}
                  placeholder="输入密码"
                  onChange={(e) => {
                    this.setState({
                      registerPassword: e.target.value,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="form-button" size="large">
                  注册
                </Button>
              </Form.Item>
            </Form>
          )
        }
      </div>
      </div>
      
    )
  }
}

export default withRouter(Login)
