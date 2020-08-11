import React, { Component } from 'react';
import 'assets/css/leftnav/left-nav.css';
import { Link, withRouter } from 'react-router-dom';
import header from "assets/img/logo.jpg";
import { Menu } from 'antd';
import menuConfig from 'config/menuconfig.js';
import { connect } from 'react-redux';

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

  //判断当前登录用户对item是否有权限
  hasAuth = (item) => {
    /* 
      1. admin是root用户 所以登陆用户是admin，那么就拥有所有权限
      2. 如果当前item(路由)是公开的 那么所有用户就可以拥有访问此路由的权限
      3. 当前用户有此item的权限: 当前用户的menus数组里有无包含当前路由的key
      4. 最后一种可能就是 当前用户更改自己所属角色的权限，那么自己的权限也跟着修改了。但是页面不刷新。想要做这一点。得去角色界面 让用户设置权限成功后重新登录
    */
    const { key, isPublic } = item;
    const userMenus = this.props.loginState.role.menus;
    const userName = this.props.loginState.username;
    if (userName === "cuiming" || isPublic || userMenus.indexOf(key) !== -1) {
      return true;
    }
    //如果当前用户有此item.child的权限(如果最外层key不匹配 那么里面的key也不会去查找了。所以这么做)，那么也应该有权限去显示
    else if (item.child) {
      return !!item.child.find(cItem => userMenus.indexOf(cItem.key) !== -1);
    }
    //不符合条件就是不显示当前item
    return false;
  }

  //map() + 递归
  menuList = (menuConfig) => {
    let path = this.props.location.pathname;
    return menuConfig.map(val => {
      //用户权限管理
      //如果当前用户 拥有当前遍历这一次的对应权限，才需要去显示对应的菜单项

      //这里主要思路：下拉菜单是根据menuConfig里面的每一个对象生成的。所以我们让某些对象跳过这次变美丽就做到了 不同用户显示不同权限的效果.
      if (this.hasAuth(val)) {
        if (val.child) {
          //这里也是同理 默认子菜单项他是选中子路由的 但是子路由里面还有子路由 列表就默认不展开了
          //所以还是 如果当前路由里面存在 想要被高亮的列表key 那么就让默认选中菜单项 = 当前子菜单项的key
          const Citem = val.child.find(Citem => path.indexOf(Citem.key) === 0);
          if (Citem) {
            this.openKeys = val.key
          }
          return (
            <SubMenu key={val.key} icon={val.icon} title={val.title}>
              {this.menuList(val.child)}
            </SubMenu>
          )
        } else {
          return (
            <Menu.Item key={val.key} icon={val.icon}>
              <Link to={val.key}>
                {val.title}
              </Link>
            </Menu.Item>
          )
        }
      }
    })
  }

  render() {
    let path = this.props.location.pathname;
    //这个path现在是  /product/goods/detail 而我们config中没有对应的path 所以就造成不显示的缘故
    //解决 如果当前路由里面存在 想要被高亮的列表key 那么就让路由 = key
    if (path.indexOf('/product/goods') === 0) {
      path = '/product/goods';
    }

    //只有在列表渲染完毕才能获取到openKeys
    const openKeys = this.openKeys;

    return (
      <div className="left_nav">
        <div className="left_nav_header">
          <div className="left_nav_img">
            <img src={header} alt="" />
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

const mapStateToProps = ({ stateOne }) => {
  return {
    loginState: stateOne
  }
}

export default withRouter(connect(mapStateToProps, null)(LeftNav));