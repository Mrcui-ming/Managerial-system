import React, { Component, Fragment } from 'react';
import 'assets/css/header/header.css';
import * as LoginAction from 'store/action/loginAction.js';
import Cookie from 'js-cookie';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Spin, Space,message } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import getWeather from 'network/weather.js';
import { formatDate, getTime } from 'common/until.js';
import menuconfig from 'config/menuconfig.js';
import { withRouter } from 'react-router-dom';
import LinkButton from 'components/content/LinkButton';

class Header extends Component {

  state = {
    date: "",
    tempe: "",
    img: "",
    location: "",
    summary: "",
    isLoading: true,
    time: ""
  }

  componentDidMount() {
    this.reqWeather();
    this.getTimer();
  }


  componentWillUnmount() {
    //清除定时器
    clearInterval(this.timer);
  }

  //获取天气
  reqWeather = () => {
    getWeather().then(res => {
      const date = res.data.calendars[0].events[0];
      const summary = date.summary;
      const temp = date.temp;
      const img = date.pic;
      const location = res.data.calendars[0].location;
      let time = date.start;
      const Ydate = new Date(time * 1000);
      const inittime = formatDate(Ydate, 'yyyy-MM-dd');
      this.setState({
        date: inittime,
        tempe: temp,
        img: img,
        location: location,
        summary: summary,
        isLoading: false
      })
    })
  }

  //获取当前时间
  getTimer = () => {
    this.timer = setInterval(() => {
      this.setState({
        time: getTime()
      })
    }, 1000)
  }

  //获取标题
  getTitle = (menuconfig) => {
    const pathname = this.props.location.pathname;
    let title;
    menuconfig.forEach(item => {
      /* console.log(item); */
      
      if(item.key === pathname){
        title = item.title;
      }
      else if(item.child){
        const cItem = item.child.find(cItem => pathname.indexOf(cItem.key) === 0);
        if(cItem){
          title = cItem.title;
        }
      }
    })
    return title;
  }

  exitLogin = () => {
    Cookie.remove("userid");
    this.props.Actions.exitLogin();
    message.success("退出成功");
  }

  confirm = () => {
    Modal.confirm({
      title: '退出',
      icon: <QuestionCircleTwoTone />,
      content: '确定退出?',
      okText: '退出',
      cancelText: '取消',
      onOk: this.exitLogin
    });
  }

  render() {
    const username = this.props.loginState.username;
    const title = this.getTitle(menuconfig);
    
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎&nbsp; {username}</span>
          <LinkButton onClick={this.confirm}>退出</LinkButton>
        </div>
        <div className="header-bottom">
        <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            {this.state.isLoading ?
              <Space size="middle" style={{ marginRight: 0 }}>
                <Spin size="small" />
                <Spin />
                <Spin size="large" />
              </Space> :
              <Fragment>
                <a href="https://github.com/Mrcui-ming/Managerial-system" target="_block">获取  （前端+后端）源码</a>
                <span>{this.state.location}</span>
                <span>{this.state.date}(气温：{this.state.tempe})</span>
                <span>{this.state.time}</span>
                <img src={this.state.img} alt="" />
                <span>{this.state.summary}</span>
              </Fragment>
            }
          </div>
        </div>
      </div>
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

export default withRouter(connect(mapStateToProps, mapDistpatchToProps)(Header));