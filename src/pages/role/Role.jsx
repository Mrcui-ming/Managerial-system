import React, { Component } from 'react';
import { Card, Button, Table, Modal, Form, Input, message } from 'antd';
import { reqRoleList,reqAddRole,reqUpdateRole } from 'network/role.js';
import config1 from 'config/menuconfig1.js';
import RoleTree from './childComp/RoleTree';
import { connect } from 'react-redux';
import { formatDate } from 'common/until.js';
import { bindActionCreators } from 'redux';
import * as LoginAction from 'store/action/loginAction.js';
import Cookie from 'js-cookie';

const Item = Form.Item;

//角色路由
class Role extends Component {
  formRef = React.createRef();
  constructor(props){
    super(props);
    this.state = {
      roles: [],
      role: {},
      roleName: "",
      visible: false,
      isAuth: false,
      treeData: []
    };
    this.treeRef = React.createRef();
  }

  //调用获取列表的方法 初始化角色列表
  componentDidMount() {
    this.getRoleList();
    this.getTreeDate();
  }

  //获取Tree树形图的节点数据
  getTreeDate = () => {
    this.setState({
      treeData: config1
    })
  }

  //获取角色列表
  getRoleList = async() => {
    const res = await reqRoleList();
    if(res.status === 0){
      this.setState({
        roles: res.data
      })
    }
  }
  //点击行
  onRow = (row) => {
    return {
      onClick:() => { 
        //设置当前单选钮为选中
        this.setState({
          role: row
        })
      }
    }
  }

  //显示添加角色框
  showAddRole = () => {
    this.setState({
      visible: true
    })
  }

  //显示设置权限框
  showAuth = () => {
    this.setState({
      isAuth: true
    })
  }

  //添加角色
  addRole = async() => {
    const {roleName} = this.state;
    if(roleName.length <= 0) return;
    const res = await reqAddRole({roleName: roleName});
    if(res.status === 0){
      //如果更新state 不基于原本数据 可以直接用对象更新。
      //这里更新state 基于原本数据基础上更新 所以通过函数修改。 
      //函数修改接收俩个参数 state/props
      //react不建议获取到state里的某个状态对他进行数组追加。。。 最后赋值给state,例如：
      /* let roles = this.state.roles;
      roles.push({role: "111"}); 
      this.setSeate({roles:roles}) */
      this.setState(state => ({
        roles: [...state.roles,res.data],
        visible: false
      }))
      //清空input
      this.formRef.current.resetFields();
      message.success("添加角色成功");
      //更新角色列表
      this.getRoleList();
    }else{
      this.setState({visible: false});
      this.formRef.current.resetFields();
      message.error(res.msg)
    }
  }

  //设置用户权限
  editRoleAuth = async() => {
    let {role} = this.state;
    let roleId = this.props.loginState.role_id;
    let menus = this.treeRef.current.getMenus();
    role.menus = menus;
    role.auth_name = this.props.loginState.username;
    role.auth_time = Date.now();
    const res = await reqUpdateRole({
      role: role
    })
    if(res.status === 0){
      //俩种方式都可以 
      /* 1.重新获取角色列表进行展示
      this.getRoleList();
      2.因为改变了role.menus 而role是来源于每一行Row 最终指向的数组roles 所以改变role的属性 roles自然发生了改变 */
      if(roleId === role._id){
        this.props.history.replace("/login"); 
        Cookie.remove("userid");
        this.props.Actions.exitLogin();
      } 
      this.setState({
        roles: [...this.state.roles]
      })
      message.success(roleId === role._id ? "当前用户的权限更新了,请重新登录" : "设置角色权限成功");
    }else{
      message.error(res.msg);
    }
    this.setState({isAuth: false});
  }

  //获取添加角色 的名称
  updateInputChange = (e) => {
    e.persist(); 
    this.setState({
      roleName: e.target.value
    })
  }

  render() {
    const {roles,role,roleName,visible,isAuth} = this.state;
    const title = (
      <>
      <Button type="primary" style={{marginRight: 20}} onClick={this.showAddRole}>创建角色</Button>
      <Button type="primary" disabled={role._id ? false : true} onClick={this.showAuth}>设置角色权限</Button>
      </>
    )
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: create_time => {
          let date = new Date(create_time);
          return formatDate(date,"yyyy-MM-dd hh:mm:ss");
        }
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: auth_time => {
          let date = new Date(auth_time);
          return formatDate(date,"yyyy-MM-dd hh:mm:ss");
        }
      },
      {
        title: "授权人",
        dataIndex: "auth_name"
      }
    ];
    const layout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      },
    };
    return (
      <Card title={title}>
        <Table
         bordered
         //设置左侧显示radio单选钮 selectedRowKeys: [role._id]可以点击行选中单选钮(key与key对应)，但有小bug
         rowSelection={{
          type: "radio",
          selectedRowKeys: [role._id],
          //复选框点击事件
          onSelect: (role) => {
            this.setState({role:role})
          }
        }}
         //table行 发生改变
         onRow={this.onRow}
         dataSource={roles}
         columns={columns}
         //每行的key
         rowKey="_id"
         //table的其他配置 默认每页6条数据 有快速跳转按钮
         pagination = {{defaultPageSize: 6}}
        >
        </Table>
          <Modal
            title="添加角色"
            visible={visible}
            onOk={this.addRole}
            onCancel={() => {
              this.formRef.current.resetFields();
              this.setState({visible: false})
            }}
            okText="确认"
            cancelText="取消"
            >
              <Form 
              {...layout} 
              ref={this.formRef}
              name="control-ref"
              >
                <Item 
                label="角色名称" 
                name="" 
                rules={[{ required: true,message: "角色名称不能为空"}]}>
                  {/* 
                  value要绑定categoryName 不能绑定初p始化的0值 
                  原因：绑定categoryName每次render都会把正确的值放在input框 中  绑定初始化的0值得话 会造成每次在value里保存得都是上一次修改名称后得值。
                  */}
                  <Input type="text" value={roleName} onChange={this.updateInputChange}/>  
                </Item>
              </Form>
            </Modal>

          <Modal
            title="设置用户权限"
            visible={isAuth}
            onOk={this.editRoleAuth}
            onCancel={() => this.setState({isAuth: false})}
            okText="确认"
            cancelText="取消"
          >
            <Item label="角色名称" {...layout} >
              <Input type="text" value={role.name} disabled/>  
            </Item>
            <RoleTree ref={this.treeRef} role={role}/>
          </Modal>
      </Card>
    )
  }
}

const mapStateToProps = ({ stateOne }) => {
  return {
    loginState: stateOne
  }
}

const mapDistpatchToProps = (dispatch) => {
  return {
    Actions: bindActionCreators(LoginAction, dispatch)
  }
}

export default connect(mapStateToProps,mapDistpatchToProps)(Role);