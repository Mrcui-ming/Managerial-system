import React, { Component } from 'react'

export default class LinkButton extends Component {
  render() {
    return (
      //...this.props === {children: 退出,key:value} react标签上可以写children 相当于写在了标签内了
      <button style={{
        border: 0,
        color: "#00a5e4",
        backgroundColor: "transparent",
        outline: 'none'
      }}
      /* children= '' */
      {...this.props}>
      </button>
    )
  }
}
