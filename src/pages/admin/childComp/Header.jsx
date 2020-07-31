import React, { Component } from 'react';
import 'assets/css/header/header.css';
import * as LoginAction from 'store/action/loginAction.js';
import Cookie from 'js-cookie';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Header extends Component {

   exitLogin = () => {
    Cookie.remove("userid");
    this.props.Actions.exitLogin();
  }

  render() {
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎&nbsp; admin</span>
          <a href="javascript:;" onClick={this.exitLogin}>退出</a>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">首页</div>
          <div className="header-bottom-right">
            <a href="https://github.com/Mrcui-ming/Managerial-system" target="_block">获取（前端+后端）源码</a>
            <span>2019-5-16 10:12:36</span>
            <img src="http://api.map.baidu.com/images/weather/day/duoyun.png" alt=""/>
            <span>晴天</span>
          </div>
        </div>
      </div>
    )
  }
}

const mapDistpatchToProps = (dispatch) => {
  return {
    Actions: bindActionCreators(LoginAction,dispatch)
  }
} 

export default connect(null,mapDistpatchToProps)(Header);