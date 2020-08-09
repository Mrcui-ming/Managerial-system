import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { reqAddUpdateUser } from 'network/user.js';

export default class UserForm extends React.Component{

  constructor(props){
    super(props);
    this.formRef = React.createRef();
  }

  onFinish = async(user) => {
    const { getUser,hideAddRoleBox } = this.props;
    const res = await reqAddUpdateUser(user);
    if(res.status === 0){
      getUser();
      message.success("创建用户成功");
    }else{
      message.error("创建用户是失败");
    }
    this.formRef.current.resetFields();
    hideAddRoleBox();
  }

  render() {
    const {roles,hideAddRoleBox} = this.props;
    const layout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <div>
        <Form ref={this.formRef} {...layout} onFinish={this.onFinish}>
          <Form.Item name="username" label="用户名" rules={[{ required: true,message: "用户名不能为空"}]}>
            <Input type="text"/>
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true,message: "密码不能为空" }]}>
            <Input type="password" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true, len: 11, message: "手机号码必须是由11位数字组成" }]}>
            <Input type="number"/>
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: 'Email不符合规范'}]}>
          <Input type="email"/>
          </Form.Item>
          <Form.Item name="role_id" label="角色" rules={[{ required: true, message: "角色不能为空" }]}>
            <Select>  
              {roles.map(role => {
                return <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
              })}
            </Select>
          </Form.Item>
          <Button type="primary" style={{margin: "0 7px 0 330px"}} onClick={hideAddRoleBox}>取消</Button>
          <Button type="primary" htmlType="submit">确定</Button>
          </Form>
      </div>
    )
  }
}