import React, { Component } from 'react';
import 'assets/css/leftnav/left-nav.css';
import {Link,withRouter} from 'react-router-dom';
import header from "assets/img/logo.jpg";
import { Menu } from 'antd';
import menuConfig from 'config/menuconfig.js';

const { SubMenu } = Menu;

class LeftNav extends Component {

  openKeys = "";

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  //渲染leftNav列表只需要执行一次 不必每次render就渲染一次列表
  //这个方法不能放在Menu内部 会造成 Menu的defaultOpenKeys每次拿到都会是undefined 的错误
  componentWillMount() {
    this.menuList = this.menuList(menuConfig);
  }
  

  //map() + 递归
  menuList = (menuConfig) => {
    let path = this.props.location.pathname;
    console.log(menuConfig);
    return  menuConfig.map(val => {
        if(val.child){
          const Citem = val.child.find(Citem => Citem.key === path);
          if(Citem){
            this.openKeys = val.key
          }
          return (
            <SubMenu key={val.key} icon={val.icon} title={val.title}>
              {this.menuList(val.child)}
            </SubMenu>
          )
        }else{
          return (
            <Menu.Item key={val.key} icon={val.icon}>
              <Link to={val.key}>
                {val.title}
              </Link>
            </Menu.Item>
          )
        }
      })
  }

  render() {
    let path = this.props.location.pathname;
    //只有在列表渲染完毕才能获取到openKeys
    const openKeys = this.openKeys;
    
    console.log(openKeys);
    

    return (
      <div className="left_nav">
        <div className="left_nav_header">
          <div className="left_nav_img">
            <img src={header} alt=""/>
          </div>
          <h3>宁雀后台</h3>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          //默认的菜单项选中
          defaultSelectedKeys={[path]}
          //数据更新后 菜单项重新选中 （请求/路径的时候 没有对应/路径的 <Menu.Item key/>的key 
          //选中是根据item.key决定的）
          selectedKeys={[path]}
          //默认哪个SubMenu列表 展开
          defaultOpenKeys={[openKeys]}
        >
          {this.menuList}
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav);