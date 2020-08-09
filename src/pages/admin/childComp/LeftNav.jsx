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
    
    return  menuConfig.map(val => {
        if(val.child){
          //这里也是同理 默认子菜单项他是选中子路由的 但是子路由里面还有子路由 列表就默认不展开了
          //所以还是 如果当前路由里面存在 想要被高亮的列表key 那么就让默认选中菜单项 = 当前子菜单项的key
          const Citem = val.child.find(Citem => path.indexOf(Citem.key) === 0);
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
    //这个path现在是  /product/goods/detail 而我们config中没有对应的path 所以就造成不显示的缘故
    //解决 如果当前路由里面存在 想要被高亮的列表key 那么就让路由 = key
    if(path.indexOf('/product/goods') === 0){
      path = '/product/goods';
    }

    //只有在列表渲染完毕才能获取到openKeys
    const openKeys = this.openKeys;
    
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