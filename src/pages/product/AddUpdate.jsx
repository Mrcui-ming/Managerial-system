import React, { Component } from 'react';
import { Form,Card,Input,Button,Cascader,message } from 'antd';
import { reqCategorys,reqAddOrUpdate } from 'network/product.js';
import ProductImg from './childComp/ProductImg';
import RichTextEidor from './childComp/RichTextEidor';
import {
  ArrowLeftOutlined
} from "@ant-design/icons";

export default class AddUpdate extends Component {

  constructor(props){
    super(props);
    this.state = {
      options: []
    };
    this.PimgRef = React.createRef();
    this.RtextRef = React.createRef();
  }
  componentWillMount() {
    const goodsListItem = this.props.location.state;
    //如果是goodsListItem代表是修改页面 如果是{}那么就是添加页面
    if(goodsListItem){
      this.goodsListItem = goodsListItem;
    }else{
      this.goodsListItem = {};
    } 
  }

  componentDidMount() {
    this.getCascaderDate("0");
  }

  //表单提交
  onFinish = async(value) => {
    const { name,desc,price,category } = value;
    const _id = this.goodsListItem._id;
    const imgs = this.PimgRef.current.getFileImg();
    const detail = this.RtextRef.current.getEditorState();
    let res;
    let categoryId;
    let pCategoryId;
    //判断产品所在分类列表 一级分类/二级分类产品
    if(category.length === 1){
      categoryId = category[0];
      pCategoryId = "0"
    }else{
      categoryId = category[1];
      pCategoryId = category[0];
    }
    //修改处理
    if(_id){
      res = await reqAddOrUpdate({
        _id: _id,
        name: name,
        desc: desc,
        price: price,
        detail: detail,
        imgs: imgs,
        categoryId: categoryId,
        pCategoryId: pCategoryId
      })
    }//添加处理
    else{
      res = await reqAddOrUpdate({
        name: name,
        desc: desc,
        price: price,
        detail: detail,
        imgs: imgs,
        categoryId: categoryId,
        pCategoryId: pCategoryId
      })
    }
    console.log(typeof res.status);
    if(res.status === 0){
      message.success(_id ? "修改成功" : "添加成功");
      this.props.history.goBack();
      this.getCascaderDate("0");
    }else{
      message.error(_id ? "修改失败" : "添加失败");
    } 
  }

  //获取联动菜单的子菜单数据 (如果是修改页面：自动获取二级联动菜单数据)
  getCascaderDate = async(parentId) => {
    const res = await reqCategorys({parentId: parentId});
    const { pCategoryId } = this.goodsListItem;
    
    if(res.status === 0){
      let data = res.data.map(value => {
        return {
          value: value._id,
          label: value.name,
          isLeaf: false
        }
      })
      //不论获取/不获取二级联动菜单数据 都需要在一级联动菜单数据加载完毕再做。
      //设置一级联动菜单数据
      if(parentId === "0"){
        this.setState({
          options: data
        })   
        //进入修改页面 (如果当前产品处于二级产品列表)自动加载二级联动菜单
        if(pCategoryId && pCategoryId !== "0"){
          const res = await reqCategorys({parentId: pCategoryId});
          if(res.status === 0){
            const subDate = res.data.map(value => {
              return {
                value: value._id,
                label: value.name,
                isLeaf: true
              }
            })
            //获取到当前当前产品的PCategoryId 给他添加children:把二级联动菜单数据绑定到以及联动菜单的某一个产品上。
            const targetOption = data.find(option => option.value === pCategoryId);
            targetOption.children = subDate;
            //重新加载options
            this.setState({
              options: [...this.state.options],
            });
          }else{
            message.error(res.msg)
          }  
        }
      }else{
        //async 返回一个promise
        return res.data;
      }
    }else{
      message.error(res.msg)
    }
  };

  //自定义校验规则
  validatorPrice = (role,value) => {
    //要求返回一个promise
    return new Promise((resolve,reject) => {
      //然后的话就判断成功或失败就行了
      if(value*1 <= 0){
        reject();
      }else{
        resolve();
      }
    })
  }

  //菜单项发生改变会来执行这个函数
  loadData = async selectedOptions => {
    //得到options对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    //设置点击状态为加载中
    targetOption.loading = true;
    //获取联动菜单的子菜单数据
    const res = await this.getCascaderDate(targetOption.value);
    //请求结束把点击状态加载中 隐藏
    targetOption.loading = false;
    //如果有二级菜单的数据 就把数据赋值给二级菜单。
    if(res && res.length > 0){
      const data = res.map(value => {
        return {
          value: value._id,
          label: value.name,
          isLeaf: true
        }
      })
      //配置二级下拉列表
      targetOption.children = data;
    }else{
      //如果没有二级菜单就把当前菜单项 图标改为 没有箭头
      targetOption.isLeaf = true;
    }
    //更新options
    this.setState({
      options: [...this.state.options],
    });
  };

  render() {
    const title = (
      <div style={{height: 30}}>
       <ArrowLeftOutlined 
         style={{marginRight: 15,
         color: "#00a5e4",
         fontSize: 22,
         marginLeft: 20,
         verticalAlign: "middle"}}
         onClick={() => {this.props.history.goBack()}}/>
       <span
       style={{
         verticalAlign: 'middle'
       }}>{this.goodsListItem._id ? "修改产品" : "添加产品"}</span>
      </div>
     )
    const layout = {
     labelCol: { span: 2 },
     wrapperCol: { span: 8 },
    };
    const tailLayout = {
      wrapperCol: { offset: 2, span: 16 },
    };
    const { name,desc,price,pCategoryId,categoryId,imgs,detail} = this.goodsListItem;
    const CascaderArray = !pCategoryId ? "" : pCategoryId !== "0" ? [pCategoryId,categoryId] : [categoryId];

    return (
      <Card title={title}>
      <Form
        {...layout}
        name="basic"
        onFinish={this.onFinish}
      >
        <Form.Item
        label="产品名称"
        name="name"
        rules={[{ required: true, message: '产品名称不能为空' }]}
        initialValue={name}
      >
        <Input placeholder="请输入产品名称"/>
      </Form.Item>
        <Form.Item 
        name="desc" 
        label="产品描述"
        rules={[{ required: true, message: '产品描述不能为空' }]}
        initialValue={desc}>
        <Input.TextArea autoSize={{minRows: 3,maxRows: 6}}placeholder="请输入产品描述"/>
      </Form.Item>
        <Form.Item
        label="产品价格"
        name="price"
        rules={[{
        required: true,
        message: '产品名称必须 非0非负非空'},
        {validator: this.validatorPrice}
        ]}
        initialValue={price}
      >
        <Input type="number" placeholder="请输入产品价格" addonAfter="元"/>
      </Form.Item>
        <Form.Item
          label="产品分类"
          name="category"
          initialValue={CascaderArray}
          rules={[{ required: true, message: '产品分类不能为空' }]}
        >
          <Cascader
            placeholder="请选择产品分类"
            options={this.state.options}
            loadData={this.loadData}
            changeOnSelect
          />
        </Form.Item>
        <Form.Item
        label="产品图片"
        name="imgs"
      >
        <ProductImg ref={this.PimgRef} imgs={imgs}/>
      </Form.Item>
        <Form.Item
        label="产品详情"
        name="detail"
        //单独设置某个item的宽高
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 18 }}
      >
        <RichTextEidor ref={this.RtextRef} detail={detail}/>
      </Form.Item>
        <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          确认
        </Button>
      </Form.Item>
      </Form>
      </Card>
    )
  }
}
