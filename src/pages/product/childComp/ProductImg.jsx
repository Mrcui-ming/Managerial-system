import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from 'network/product.js';
import { PATH_IMAGE } from 'common/constants.js';
import PropTypes from 'prop-types';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class ProductImg extends Component {

  constructor(props){
    super(props);
    //初始化 当前产品对应已上传的产品图片
    let fileList = [];
    const { imgs } = this.props;
    if(imgs && imgs.length > 0){
      fileList = imgs.map((img,index) => {
        return {
          uid: -index,  //每个file都有自己的uid
          name: img,  // 图片名
          status: 'done', //图片状态  uploading上传中 done上传完成 error上传失败 removed以删除
          //图片地址 
          url: PATH_IMAGE + img,
        }
      })
    }
    this.state = {
      previewVisible: false,  //标识是否显示大图预览
      previewImage: '', //大图的地址
      fileList: fileList
    };
  } 

  //获取已上传图片数组
  getFileImg = () => {
    return this.state.fileList.map(value => value.name);
  }

  //隐藏大图预览
  handleCancel = () => this.setState({ previewVisible: false });

  //点击预览图片的回调
  handlePreview = async file => {
    //转base64
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    //显示指定图片对应的大图预览地址
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  //图片上传过程中回调函数 会一直执行,直到已上传
  handleChange = async({ file,fileList }) => {
    //file是当前这个图片文件信息 fieList是所有上传的图片文件信息数组

    //上传图片成功后回调
    if(file.status === 'done'){
      //file.response代表后端返回的响应数据
      const response = file.response;
      if(response.status === 0){
        message.success("上传图片成功");
        const result = response.data;
        //设置数组中当前这个图片的 名称/路径 原本是组件自动生成的. 应该改为后端返回的正确数据.
        //这不能直接改这个file 应该改那个所有已上传数组集合中的最后一条数据刚好就是上传的图片.
        //再照这个file之前 fileList里面已经存在这个file了 但是它的属性不正确.
        file = fileList[fileList.length - 1];
        file.name = result.name;
        file.url = result.url;
       }else{
         message.error("上传图片失败");
       }
    }
    //删除图片成功后回调
    else if(file.status === 'removed'){
      const res = await reqDeleteImg({name: file.name});
      if(res.status === 0){
        message.success("删除图片成功");
      }else{
        message.error("删除图片失败");
      }
      }
      //更新fileList
      this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/api/manage/img/upload" //上传图片的后端接口
          accept="image/*" //只接受图片格式的上传文件
          listType="picture-card" //上传图片区域的布局格式
          name="image" //请求参数名：后端根据这个参数名获取上传的图片
          fileList={fileList} //所有上传后的图片集合
          onPreview={this.handlePreview}  //预览图片
          onChange={this.handleChange} //发生改变：在上传过程中一直处于改变状态
        >
          {/* 最多可上传多少张图片 */}
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          //大图预览的状态 显示/隐藏
          visible={previewVisible}  
          //隐藏底部 取消/确认按钮
          footer={null}
          //隐藏大图预览
          onCancel={this.handleCancel}
        >
          {/* 图片地址 */}
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

ProductImg.propTypes = {
  imgs: PropTypes.array
}