import React, { Component } from 'react';
import { Card,Button } from 'antd';
import ReactEcharts from "echarts-for-react";

export default class Pie extends Component {

  getOption = () => {
    return {
      tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
          left: 'center',
          top: 'bottom',
          data: ['宁雀茶1', '宁雀茶2', '宁雀茶3', '宁雀茶4', '宁雀茶5', '宁雀茶6']
      },
      toolbox: {
          show: true,
          feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                  show: true,
                  type: ['pie', 'funnel']
              },
              restore: {show: true},
              saveAsImage: {show: true}
          }
      },
      series: [    
          {
              name: '产品销量',
              type: 'pie',
              radius: [30, 110],
              center: ['50%', '40%'],
              roseType: 'area',
              data: [
                  {value: 55.3, name: '宁雀茶1'},
                  {value: 83.1, name: '宁雀茶2'},
                  {value: 86.4, name: '宁雀茶3'},
                  {value: 72.4, name: '宁雀茶4'},
                  {value: 66.4, name: '宁雀茶5'},
                  {value: 102.4, name: '宁雀茶6'}
              ]
          }
      ]
  }
  }

  render() {

    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.updateSource}>更新</Button>
        </Card>
        <Card title="商品销量">
          <div style={{height: 50}}></div>
          <ReactEcharts option={this.getOption()} />
        </Card>
      </div>
    )
  }
}
