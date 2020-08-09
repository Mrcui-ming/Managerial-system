import React, { Component } from 'react';
import {Form, Select, Input} from 'antd';
const Item = Form.Item;
const Option = Select.Option;

export default class CategoryAdd extends Component {

  constructor(props){
    super(props);
    this.formRef = React.createRef();
  }

  onGenderChange = (value) => { 
    this.props.getCategoryName(value);
  }

  render() {
    const { dataSource,addInputChange,parentId} = this.props;
    
    return (
      <Form autoComplete="on" ref={this.formRef}>
        <div style={{marginBottom: 10,color: "#000"}}>所属分类</div>
        <Item>
          <Select 
          value={parentId}
          label="Select"
          placeholder="请选择分类"
          onChange={this.onGenderChange}>
            <Option value="0" key="0">一级分类列表</Option>
            {dataSource.map(val => {
              return <Option vlaue={val._id} key={val._id}>{val.name}</Option>
            })}
          </Select>
        </Item>
        <div style={{marginBottom: 10,color: "#000"}}>分类名称</div>
        <Item name="" rules={[{ required: true,message: "分类名称不能为空"}]}>
          <Input placeholder="请输入分类名称" onChange={addInputChange}/>
        </Item>
      </Form>
    )
  }
}