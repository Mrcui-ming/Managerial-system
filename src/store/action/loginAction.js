import { LOGINERR,LOGINSUC,EXITLOGIN } from './action_type';
import { Login,getUser } from 'network/login.js';
import { message } from 'antd';

const login = (params) => {
  return async dispatch => {
    const response = await Login(params);
    if(response.status === 0){
      message.success('登陆成功');
      dispatch({
        type: LOGINSUC,
        payload: response.data
      })
    }else{
      message.error('用户名或密码错误！');
      dispatch({
        type: LOGINERR,
        payload: response.msg
      })
    }
  }
}

const voluntarilyLogin = () => {
  return async dispatch => {
    let response = await getUser();
    if(response.status === 0){
      dispatch({
        type: LOGINSUC,
        payload: response.data
      })
    }else{
      dispatch({
        type: LOGINERR,
        payload: response.msg
      })
    }
  }
}

const exitLogin = () => {
  return {
    type: EXITLOGIN
  }
}

export {
  login,
  voluntarilyLogin,
  exitLogin
}