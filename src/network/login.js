import request from './request.js';

const Login = (params) => {
  return request({
    method: "POST",
    data: params,
    url: "/api/login"
  })
}

const getUser = () => {
  return request({
    method: 'GET',
    url: '/api//user'
  })
}

export {
  Login,
  getUser
}