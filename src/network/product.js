import request from './request.js';

const reqCategorys = (params) => {
  return request({
    method: 'GET',
    url: '/api/manage/category/list',
    params: params
  })
}

const reqAddCategory = (data) => {
  return request({
    method: 'POST',
    url: '/api/manage/category/add',
    data: data
  })
}

const reqUpdateCategory = (data) => {
  return request({
    method: 'POST',
    url: '/api/manage/category/update',
    data: data
  })
}

const reqGoodsLists = (params) => {
  return request({
    method: "GET",
    url: "/api/manage/product/list",
    params: params
  })
}

const reqSearchGoods = (params) => {
  return request({
    method: "GET",
    url: "/api/manage/product/search",
    params: params
  })
}

const reqGetIdGoods = (params) => {
  return request({
    method: "GET",
    url: "/api/manage/category/info",
    params: params
  })
}

const reqUpdateGoodsStatus = (data) => {
  return request({
    method: "POST",
    url: "/api/manage/product/updateStatus",
    data: data
  })
}

const reqDeleteImg = (data) => {
  return request({
    method: "POST",
    url: "/api/manage/img/delete",
    data: data
  })
}

const reqAddOrUpdate = (data) => {
  let url = "";
  if(data._id){
    url = "/api/manage/product/update";
  }else{
    url = "/api/manage/product/add";
  }
  return request({
    method: "POST",
    url: url,
    data: data
  })
}

export{
  reqCategorys,
  reqAddCategory,
  reqUpdateCategory,
  reqGoodsLists,
  reqSearchGoods,
  reqGetIdGoods,
  reqUpdateGoodsStatus,
  reqDeleteImg,
  reqAddOrUpdate
}