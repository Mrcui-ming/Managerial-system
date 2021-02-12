import React, { Component, Fragment } from 'react';
import { Card, Button, Table, message, Modal, Form, Input, Alert  } from 'antd';
import {
  PlusOutlined,
  RightOutlined
} from "@ant-design/icons";
import LinkButton from 'components/content/LinkButton';
import { reqCategorys, reqUpdateCategory, reqAddCategory } from 'network/product.js';
import CategoryAdd from './childComp/CategoryAdd';
const Item = Form.Item;

//分类路由
export default class Category extends Component {

  constructor(props){
    super(props);
    this.state = {
      dataSource: [], //一级分类列表
      subDataSource: [],  //二级分类列表
      isLoading: true,  //table数据加载的状态
      parentId: "0",  //获取table列表所需的Id值 0表示一级分类 真实id表示二级分类
      parentName: "", // 当前处于列表的位置
      visible: true,   //0表示隐藏 1表示显示添加弹出框 2表示显示更新弹出框
      categoryId: "", //需要被修改的分类Id
      categoryName: "", // 修改分类框的默认文字(或)获取修改分类名的新名称
      newCategoryName: "",  //获取添加分类名的 新名称
      toCategoryId: "0", //需要被添加到哪个分类——的id
      showWait: false //显示修改列表名称 不能为空的提示
    }
    this.FormRef = React.createRef();
  }
  
  componentDidMount() {
    this.getCategorys(this.state.parentId);
  }

  //获取一/二级列表数据（动态传递parentId实现动态获取一/二级列表数据）
  async getCategorys(parentId) {
    const res = await reqCategorys({parentId:parentId});
    if(res.status === 0){
      //后台接口parentId是0就是在请求一级列表 是真实id就是在请求二级列表
      if(parentId === "0"){
        this.setState({
          dataSource: res.data,
          isLoading: false,
          parentName: '一级分类列表'
        })
      }else{
        this.setState({
          subDataSource: res.data,
          isLoading: false
        })
      }
    }else{
      message.error(res.msg);
    }
  }

  //获取二级分类列表
  getSubCategorys = (dataSource) => {
    this.setState({
      parentId: dataSource._id,
      parentName: dataSource.name,
      toCategoryId: dataSource._id
    },() => {
      this.getCategorys(this.state.parentId);
    })
  }

  //返回一级分类列表
  showSubCategorys = () => {
    this.setState({
      parentId: "0",
      subDataSource: [],
      toCategoryId: "0",
      parentName: '一级分类列表'
    })
  }

  //获取修改分类名的 新名称
  updateInputChange = (e) => {
    this.setState({
      categoryName: e.target.value
    })
  }

  //获取添加分类名的 新名称
  addInputChange = (e) => {
    this.setState({
      newCategoryName: e.target.value
    })
  }

  //你要往哪个分类里面添加 
  getCategoryName = (e) => {
    this.setState({
      toCategoryId: e
    })
  }

  //隐藏弹出框
  handleCancel = () => {
    if(this.state.visible === 1){
      this.FormRef.current.formRef.current.resetFields();
    }
    this.setState({
      visible: 0,
      showWait: false,
      newCategoryName: ""
    })
  }

  //添加分类
  addCategory = async() => {
    const {newCategoryName,toCategoryId,parentId} = this.state;
    
    if(newCategoryName.length <= 0){
      return;
    }
    const res = await reqAddCategory({
      parentId: toCategoryId,
      categoryName: newCategoryName
    });
    if(res.status === 0){
      message.success("添加成功")
    }else{
      message.error(res.msg);
    }
    //如果不是在当前的列表内添加数据 那么就没必要重新获取当前页面的数据
    if(toCategoryId === parentId){
      this.getCategorys(parentId)
      //这种情况是在二级列表里面向一级列表添加数据 
      //如果不获取数据 点击返回的时候一级列表的数据并没有准备好，所以也得重新获取数据
      //注意： 获取的是一级列表的数据 但是不需要改变parentId(parentId不改变，那么当前页面就不会改变)
    }else if(toCategoryId === '0'){      
      this.getCategorys("0")
    }
    this.FormRef.current.formRef.current.resetFields();
    this.setState({
      visible: 0,
      newCategoryName: ""
    })
  }
  //点击添加按钮
  showAddCategory = () => {
    this.setState({
      visible: 1
    })
  }

  //修改分类
  updateCategory = async() => {
    const {categoryId,categoryName,parentId} = this.state;
    if(categoryName.length <= 0){
      this.setState({
        showWait: true
      })
      return;
    }
    const res = await reqUpdateCategory({
      categoryName: categoryName,
      categoryId: categoryId
    })
    if(res.status === 0){
      message.success("修改成功");
    }else{
      message.error(res.msg); 
    }
    this.getCategorys(parentId);
    this.setState({
      visible: 0,
      showWait: false
    })
  }
  //点击修改分类按钮
  showUpdateCategory = (dataSource) => {
    this.setState({
      visible: 2,
      categoryId: dataSource._id,
      categoryName: dataSource.name
    })
  }

  render() {
    const { dataSource,isLoading,parentId,parentName,subDataSource,visible,categoryName,showWait,newCategoryName,toCategoryId } = this.state; 
    const columns = [
      //dataIndex 意思是 这一列根据dataSource中的name属性数量来生成对应的行。
      {
        title: '分类的名称',
        dataIndex: 'name',
        key: '_id',
      },
      //不指定dataIndex 所以不关联dataSource
      {
        title: '操作',
        width: 300,
        //render接收的是对应这一行左侧列表的数据。
        render: (dataSource) => (
          <>
            <LinkButton onClick={() => {this.showUpdateCategory(dataSource)}}>修改分类</LinkButton>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {parentId === "0" ?  <LinkButton onClick={() => {this.getSubCategorys(dataSource)}}>查看子分类</LinkButton> : null}
          </>
        ),
      }
    ];
    const title = parentId === "0" ? 
      <LinkButton>一级分类列表</LinkButton> : 
      (<>
        <span 
        style={{cursor: 'pointer'}}
        onClick={this.showSubCategorys}>{parentName}</span>
        &nbsp;<RightOutlined/>&nbsp;
        <LinkButton>二级分类列表</LinkButton>
      </>);
    const extra = (
      <Button type="primary" onClick={this.showAddCategory}><PlusOutlined />添加</Button>
    )
    return (
      <Fragment>
        <Card title={title} extra={extra}>
          <Table
            bordered
            dataSource={parentId === "0" ? dataSource : subDataSource}
            columns={columns}
            //每行的key
            rowKey="_id"
            //加载中样式
            loading= {isLoading}
            //table的其他配置 默认每页5条数据 有快速跳转按钮
            pagination = {{defaultPageSize: 6,showQuickJumper: true}}
          />
          
          <Modal
          title="添加分类"
          visible={visible === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
          >
            <CategoryAdd 
            dataSource={dataSource} 
            parentId={toCategoryId} 
            addInputChange={this.addInputChange} 
            getCategoryName={this.getCategoryName}
            newCategoryName={newCategoryName}
            ref={this.FormRef}/>
          </Modal>

          <Modal
          title="修改分类"
          visible={visible === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
          >
            <Form>
              <Item>
                {/* 
                value要绑定categoryName 不能绑定初p始化的0值 
                原因：绑定categoryName每次render都会把正确的值放在input框 中  绑定初始化的0值得话 会造成每次在value里保存得都是上一次修改名称后得值。
                */}
                <div style={{marginBottom: 10,color: "#000"}}>分类名称</div>
                <Input value={categoryName} onChange={this.updateInputChange}/>  
              </Item>
                {showWait ? 
                <Alert message="分类名称不能为空" type="error" showIcon closable/>
                :null}
            </Form>
          </Modal>
        </Card>
      </Fragment>
    )
  }
}
