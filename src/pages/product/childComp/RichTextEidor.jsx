import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';

export default class RichTextEidor extends Component {

  constructor(props) {
    super(props);
    const detail = this.props.detail;
    const html = detail;
    if(html && html.length > 0){
      //默认显示的时候要把HTML格式转 为文本格式
      //判断转化成功就显示 如果转化失败(转化成功/失败 根据detail数据的正确与否)就创建一个空本文显示。
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }else{
      this.state = {
        editorState: EditorState.createEmpty()
      };
    }
  }

  //富文本上传图片
  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/manage/img/upload');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  //相当于input onChanged事件 实时监听并赋值
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState:  editorState
    })
  };

  //获取当前富文本内的内容 已转HTML形式
  getEditorState = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
        editorState={editorState}
        //控制上部分样式
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        //控制下部分样式
        editorStyle={{border: "1px solid black",minHeight: 200,paddingLeft: 10}}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
        }}
        />
      </div>
    )
  }
}

RichTextEidor.propTypes = {
  detail: PropTypes.string
}
