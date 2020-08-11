import React, { Component } from 'react';
import Cookie from 'js-cookie';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginAction from 'store/action/loginAction.js';
import { Spin, Layout  } from 'antd';
import style from 'assets/css/admin/admin.module.css';
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from './childComp/Header';
import LeftNav from './childComp/LeftNav';
import Home from 'pages/home/Home';
import Category from 'pages/product/Category';
import Goods from 'pages/product/Goods';
import Role from 'pages/role/Role';
import User from 'pages/user/User';
import Bar from 'pages/charts/Bar';
import Line from 'pages/charts/Line';
import Pie from 'pages/charts/Pie';
import NotFound from 'pages/404/NotFound';

const { Footer, Sider, Content } = Layout;

class Admin extends Component {

  componentDidMount() {
    const cookie = Cookie.get("userid");
    const { _id } = this.props.loginState;
    if(cookie && !_id){
      this.props.Actions.voluntarilyLogin();
    }
  }

  render() {
    const cookie = Cookie.get("userid");
    if(!cookie){
      return <Redirect to="/login" />
    }
    const loginState = this.props.loginState;

    return (
      <div id={style.admin}>
        {loginState._id ? 
        <Layout style={{minHeight: "100%"}}>
          <Sider><LeftNav /></Sider>
          <Layout>
            <Header></Header>
            <Content style={{margin: 20,marginBottom: 0,backgroundColor: "#fff"}}>
              <Switch>
                <Redirect exact from="/" to="/home"/>
                <Route path="/home" component={Home}></Route>
                <Route path="/product/category" component={Category}></Route>
                <Route path="/product/goods" component={Goods}></Route>
                <Route path="/role" component={Role}></Route>
                <Route path="/user" component={User}></Route>
                <Route path="/charts/bar" component={Bar}></Route>
                <Route path="/charts/line" component={Line}></Route>
                <Route path="/charts/pie" component={Pie}></Route>
                <Route component={NotFound}></Route>
              </Switch>
            </Content>
            <Footer style={{textAlign: 'center',color: "#aaa"}}>推荐只用谷歌浏览器，可以获得更佳页面操作体验 ©</Footer>
          </Layout>
        </Layout>
        : <Spin className={style.spin}/>}
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
  return {
    Actions: bindActionCreators(loginAction,dispatch)
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Admin);