import React, { Component } from 'react';
import { Card,Form,message } from 'antd';
import {
  ArrowLeftOutlined,
  SwapRightOutlined
} from "@ant-design/icons";
import { PATH_IMAGE } from 'common/constants.js';
import { reqGetIdGoods } from 'network/product.js';
const Item = Form.Item;


export default class Detail extends Component {
  constructor(props){
    super(props);
    this.state = {
    pCatetoryName1: "",
    pCatetoryName2: ""
    }
  }

  async componentDidMount() {
    const { categoryId,pCategoryId } = this.props.location.state.goodsListItem;
    if(pCategoryId === "0"){
      const res = await reqGetIdGoods({
        categoryId: categoryId
      })  
      if(res.status === 0){
        this.setState({
          pCatetoryName1: res.data.name
        })
      }else{
        message.error("请求出错");
      }
    }else{
        const results = await Promise.all([reqGetIdGoods({
          categoryId: categoryId
        }),reqGetIdGoods({
          categoryId: pCategoryId
        })])
        const result1 = results[0];
        const result2 = results[1];
        if(result1.status === 0 && result2.status === 0){
          this.setState({
            pCatetoryName1: result2.data.name,
            pCatetoryName2: result1.data.name
          })
        }else{
          message.error("请求出错");
        }
    }
  }

  render() {
    const {name,price,desc,imgs,detail} = this.props.location.state.goodsListItem;
    const { pCatetoryName1,pCatetoryName2 } = this.state;
    const title = (
     <div style={{height: 30}}>
      <ArrowLeftOutlined 
        style={{marginRight: 15,
        color: "#00a5e4",
        fontSize: 22,
        verticalAlign: "middle"}}
        onClick={() => {this.props.history.goBack()}}/>
      <span
      style={{
        verticalAlign: 'middle'
      }}>商品详情</span>
     </div>
    )
    return (
      <Card size="small" 
      title={title}
      >
        <Item style={{borderBottom: "1px solid #ddd",paddingBottom: 15}}>
          <span 
            style={{marginRight: 15,
              fontSize: 17,
              fontWeight: 700
            }}>商品名称:</span>
          <span>{name}</span>
        </Item>
        <Item style={{borderBottom: "1px solid #ddd",paddingBottom: 15}}>
          <span 
            style={{marginRight: 15,
              fontSize: 17,
              fontWeight: 700
            }}>商品描述:</span>
          <span>{desc}</span>
        </Item>
        <Item style={{borderBottom: "1px solid #ddd",paddingBottom: 15}}>
          <span 
            style={{marginRight: 15,
            fontSize: 17,
            fontWeight: 700
            }}>商品价格:</span>
          <span>{price}元</span>
        </Item>
        <Item style={{borderBottom: "1px solid #ddd",paddingBottom: 15}}>
          <span 
            style={{marginRight: 15,
              fontSize: 17,
              fontWeight: 700
            }}>所属分类:</span>
            
          <span>{pCatetoryName1}{pCatetoryName2 ?  <span><SwapRightOutlined style={{margin: "0 5px"}}/>{pCatetoryName2}</span> : null}</span>
        </Item>
        <Item style={{borderBottom: "1px solid #ddd",paddingBottom: 15}}>
          <span 
            style={{marginRight: 15,
            fontSize: 17,
            fontWeight: 700
            }}>商品图片:</span>
          <span>
            {imgs.map(img => {
              return <img style={{width: 150,height: 150,marginRight: 10}} key={img} src={PATH_IMAGE + img} alt=""/>
            })}
          </span>
        </Item>
        <Item style={{borderBottom: "1px solid #ddd",paddingBottom: 15}}>
          <span 
            style={{marginRight: 15,
            fontSize: 17,
            fontWeight: 700
            }}>商品详情:</span>
          {/* 解析html的属性 */}
          <span 
            dangerouslySetInnerHTML={{__html: detail}}
          > 
          </span>
        </Item>
        
      </Card>
    )
  }
}
