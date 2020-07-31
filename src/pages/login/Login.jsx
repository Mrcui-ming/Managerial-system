import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import style from 'assets/css/login/login.module.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginAction from 'store/action/loginAction.js';

class Login extends Component {

  render() {
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const tailLayout = {
      wrapperCol: {
        offset: 8,
        span: 16,
      },
    };

    const onFinish = values => {
      delete values.remember;
      this.props.Acitons.login(values);
    };

    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    
    let loginState = this.props.loginState;
    if(loginState._id){
      this.props.history.replace("/");
    }

    return (
      <div id={style.login}>
        <div className={style.from}>
          <p className={style.title}>管理平台</p>
          <Form
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={style.from_from}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>记住用户名</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className={style.submit}>
              登录
            </Button>
            </Form.Item>
          </Form>
        </div>
          <p className={style.footer}>Made with <span> ❤ </span> by CM 
          <a href="http://beian.miit.gov.cn/">粤ICP备19121998号</a>
          </p>
      </div>
    )
  }
}
const mapStateToProps = ({stateOne}) => {
  return {
    loginState: stateOne
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    Acitons: bindActionCreators(loginAction,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);