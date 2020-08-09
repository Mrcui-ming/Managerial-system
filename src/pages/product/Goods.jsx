import React, { Component } from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';
import Home from './Home';
import Detail from './Detail';
import AddUpdate from './AddUpdate'

//商品路由
export default class Product extends Component {
  render() {
    return (
      <Switch>
        {/* 路由从上往下查找 发现匹配后俩个的过程中 先匹配到了第一个 因为后俩个符合第一个的路径
            解决办法： 精准匹配exact*/}
        <Route exact path="/product/goods" component={Home}></Route>  
        <Route path="/product/goods/detail" component={Detail}></Route>  
        <Route path="/product/goods/addupdate" component={AddUpdate}></Route> 
        <Redirect to="/product/goods"/>
      </Switch>
    )
  }
}
