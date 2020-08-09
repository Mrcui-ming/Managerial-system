import request from './request.js';

const reqUserList = () => {
  return request({
    method: "GET",
    url: "/api/manage/user/list"
  })
}

const reqDeleteUser = (data) => {
  return request({
    method: "POST",
    url: "/api/manage/user/delete",
    data: data
  })
}

const reqAddUpdateUser = (data) => {
  let url = "";
  if(data._id){
    url = "/api/manage/user/update"
  }else{
    url = "/api/manage/user/add"
  }
  return request({
    method: "POST",
    url: url,
    data: data
  })
}

export {
  reqUserList,
  reqDeleteUser,
  reqAddUpdateUser
}