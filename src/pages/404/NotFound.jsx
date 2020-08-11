import React from 'react';
import notFoundImg from 'assets/img/404.jpg'

export default class NotFound extends React.Component{

  render() {
    return (
      <div style={{
        width: "100vw",
        height: "100vh"}}>  
        <img src={notFoundImg} 
        alt="" 
        style={{width: "100%", height: "100%"}}
        onClick={() => this.props.history.replace("/home")}/>
      </div>
    )
  }
}