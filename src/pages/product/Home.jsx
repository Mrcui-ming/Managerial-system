import React, { Component } from 'react';
import { Card, Table, Select, Button, message, Input  } from 'antd';
import LinkButton from 'components/content/LinkButton';
import {
  PlusOutlined
} from '@ant-design/icons';
import { reqGoodsLists,reqSearchGoods,reqUpdateGoodsStatus } from 'network/product.js';
import { PAGE_ISZE } from 'common/constants.js';
const { Option } = Select;


export default class Home extends Component {

  state = {
    goodsList: [],
    total: "",
    searchType: "productName",
    searchValue: ""
  } 
  componentDidMount() {
    this.getGoodsList(1);
  }

  /*  纯前端获取分类列表 
      1.请求层分析：一次性获取所有分页数据，翻页不需要再发送请求了 
      2.请求参数分析：不需要指定请求参数
      
  */
  /* 
      后端获取分类列表
      1.请求层分析：每次只获取当前页的数据，翻页需要重新发送请求（比如antd table每页最多允许4条数据，那么我们就请求4条数据，刚刚好显示一页。）
      2.请求参数分析：需要指定参数 请求哪一页？pageNum 请求几条？pageSize
  */
  getGoodsList = async(pageNum) => {
    this.pageNum = pageNum;
    const { searchType,searchValue } = this.state;
    let res;
    if(searchValue){
      res = await reqSearchGoods({
        pageNum: pageNum,
        pageSize: PAGE_ISZE,
        [searchType]: searchValue
      })
    }else{
      res = await reqGoodsLists({
        pageNum: pageNum,
        pageSize: PAGE_ISZE
      });
    }
    if(res.status === 0){
      this.setState({
        goodsList: res.data.list,
        total: res.data.total
      })
    }else{
      message.error("请求出错");
    }
  }
  
  //搜索的内容关键字
  onChange = (e) => {
    e.persist();
    this.setState({
      searchValue: e.target.value
    })
  }

  //搜索的类型 按照商品名称/商品描述
  handleChange = (value) => {
    this.setState({
      searchType: value
    })
  }

  //更新产品状态 已下架/在售
  updateGoods = async(status,_id) => {
    const res = await reqUpdateGoodsStatus({
      productId: _id,
      status: status
    })
    if(res.status === 0){
      this.getGoodsList(this.pageNum);
    }else{
      message.error("请求出错");
    }
  }

  render() {
    const { searchValue,goodsList,total,searchType } = this.state;
    const title = (
    <div>
      <Select defaultValue="productName" value={searchType} style={{ width: 200 }} onChange={this.handleChange}>
        <Option value="productName">按产品名称搜索</Option>
        <Option value="productDesc">按产品描述搜索</Option>
      </Select>
      <Input
        placeholder="关键词"
        style={{ width: 200,margin: "0 15px" }}
        value={searchValue}
        onChange={this.onChange}
      ></Input>
      <Button type="primary" onClick={() => {this.getGoodsList(1)}}>搜索</Button>
    </div>
    )
    const extra = (
      <Button type="primary" onClick={() => {this.props.history.push("/product/goods/addupdate")}}>
        <PlusOutlined/>
        添加商品
      </Button>
    )
    
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => {
          return "￥" + price;
        }
      },
      {
        title: '状态',
        width: 100,
        render: (goodsListItem) => {
          const {status,_id} = goodsListItem;
          const newStatus = status === 1 ? 2 : 1;
          return(
            <>
            <Button type="primary" onClick={() => {this.updateGoods(newStatus,_id)}}>{status === 1 ? '下架' : '上架'}</Button>
            <span>{status === 1 ? '在售' : '已下架'}</span>
            </>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (goodsListItem) => {
          return(
            <>
            <div onClick={() => {this.props.history.push("/product/goods/detail",{goodsListItem})}}><LinkButton>详情</LinkButton></div>
            <LinkButton onClick={() => {this.props.history.push("/product/goods/addupdate",goodsListItem)}}>修改</LinkButton>
            </>
          )
        }
      }
    ];
    return (
      <Card title={title} extra={extra}>
        <Table 
          rowKey="_id"
          pagination = {{
            defaultPageSize: PAGE_ISZE,
            showQuickJumper: true,
            total: total,
            //点击分页器发送请求
            onChange:(pageNum) => {
             this.getGoodsList(pageNum); 
            }}} 
          dataSource={goodsList} 
          columns={columns} 
          bordered/>
      </Card>
    )
  }
}
