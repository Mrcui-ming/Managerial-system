import request from './request.js';

const reqRoleList = () => {
  return request({
    method: "GET",
    url: "/api/manage/role/list"
  })
}

const reqAddRole = (data) => {
  return request({
    method: "POST",
    url: "/api/manage/role/add",
    data: data
  })
}

const reqUpdateRole = (data) => {
  return request({
    method: "POST",
    url: "/api/manage/role/update",
    data: data
  })
}

export {
  reqRoleList,
  reqAddRole,
  reqUpdateRole
}