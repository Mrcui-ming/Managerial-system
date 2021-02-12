import React, { Component } from 'react';
import { Card, Button, Table, message, Modal } from 'antd';
import { reqUserList,reqDeleteUser } from 'network/user.js';
import { formatDate } from 'common/until.js';
import LinkButton from 'components/content/LinkButton.jsx';
import UserForm from './childComp/UserForm';
import {
  QuestionOutlined
} from "@ant-design/icons";

//用户路由
export default class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      roles: [],
      visible: false
    };
    this.formRef = React.createRef();
  }

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getUser();
  }

  //获取用户列表
  getUser = async() => {
    const res = await reqUserList();
    if(res.status === 0){
      const {users, roles} = res.data;
      this.initRoleName(roles);
      this.setState({
        users,
        roles
      })
    }else{
      message.error(res.msg);
    }
  }

  //初始化所属角色列表的数据
  initRoleName = roles => {
    this.roleName = roles.reduce((pre,role) => {
      pre[role._id] = role.name;
      return pre
    },{})
  }

  //修改用户
  showUpdateBox = user => {
    this.user = user;
    //通过user判断当前处于修改还是添加的界面
    this.setState({visible: true});
  }

  //初始化tableColumns
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "电话",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: create_time => {
          let formDate_time = new Date(create_time);
          return formatDate(formDate_time,"yyyy-MM-dd hh:mm:ss")
        }
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        //代码优化 嫌麻烦可以使用find方法直接查找
        render: role_id => this.roleName[role_id]
      },
      {
        title: "操作",
        render: (user) => (
          <>
            <LinkButton onClick={() => {this.showUpdateBox(user)}}>修改</LinkButton>&nbsp;
            {/* 是modal的另一种用法 通过点机执行函数 在函数内配置modal */}
            <LinkButton onClick={(() => {this.showConfirm(user)})}>删除</LinkButton>
          </>
        )
      },
    ];
  }

  //删除用户
  showConfirm = user => {
    Modal.confirm({
      title: `您确定要删除用户：${user.username}吗？`,
      icon: <QuestionOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async() => {
        const {_id} = user;
        const res = await reqDeleteUser({userId: _id});
        if(res.status === 0){
          message.success("删除用户成功");
          //更新用户列表
          this.getUser();
        }else{
          message.error("删除用户失败");
        }
      }
    });
  }

  //创建用户
  createUser = () => {
    this.user = null;
    this.setState({visible: true})
  }

  //隐藏创建用户框
  hideAddRoleBox = () => {
    this.formRef.current.formRef.current.resetFields();
    this.setState({visible: false});
  }

  render() {
    const {users,visible,roles} = this.state;
    const user = this.user || {};
    const title = <Button type="primary" onClick={this.createUser}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
         bordered
         dataSource={users}
         columns={this.columns}
         //每行的key
         rowKey="_id"
         //table的其他配置 默认每页6条数据 有快速跳转按钮
         pagination = {{defaultPageSize: 6}}
        >   
        </Table>
          <Modal
            //销毁后/隐藏后 把内容清除
            destroyOnClose
            title={user._id ? "修改用户" : "创建用户"}
            okText="确认"
            cancelText="取消"
            visible={visible}
            onCancel={this.hideAddRoleBox}
            footer={false}
          >
            <UserForm 
            ref={this.formRef}
            getUser={this.getUser} 
            hideAddRoleBox={this.hideAddRoleBox}
            roles={roles}
            user={user}/>
          </Modal>
      </Card>
    )
  }
}
