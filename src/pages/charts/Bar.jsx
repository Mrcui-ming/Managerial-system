import React, { Component } from 'react';
import { Card,Button } from 'antd';
import ReactEcharts from "echarts-for-react";

export default class Bar extends Component {

  state = {
    source: [
      {product: '宁雀茶1', 销量: 55.3, 库存: 22.8},
      {product: '宁雀茶2', 销量: 83.1, 库存: 73.4},
      {product: '宁雀茶3', 销量: 86.4, 库存: 65.2},
      {product: '宁雀茶4', 销量: 72.4, 库存: 53.9},
      {product: '宁雀茶5', 销量: 66.4, 库存: 53.9},
      {product: '宁雀茶6', 销量: 102.4, 库存: 80.9}
  ]
  }

  updateSource = () => {
    this.setState(state => ({
      source: state.source.map(item => ({
        product: item.product, 
        销量: item.销量 + 2, 
        库存: item.库存 - 2
      }))
    })) 
  }

  getOption = (source) => {
    return {
      
      tooltip: {
        //触发方式 各种形状的这个值不同
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      legend: {
        textStyle: {
          fontSize: 14 
        }
      },
      grid: {
        left: "4%",
        top: "40px",
        right: "4%",
        bottom: "4%",
        containLabel: true 
      },
      dataset: {
          dimensions: ['product', '销量', '库存'],
          source: source
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: "#000",
          fontSize: "14"
          } 
      },
      
      yAxis: {
        axisLabel: {
        color: "#000",
        fontSize: "12"
        } 
      },
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
          {type: 'bar',barWidth: '15%',
          itemStyle: {
            //修改柱子圆角
            barBorderRadius: 2,
            color: ['#2f89cf']
          }
          },
          {type: 'bar',barWidth: '15%',
          itemStyle: {
            //修改柱子圆角
            barBorderRadius: 2,
            color: ['#9999']
          }
        }    
      ]
  }
  }

  render() {
    const {source} = this.state;

    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.updateSource}>更新</Button>
        </Card>
        <Card title="商品销量">
          <div style={{height: 30}}></div>
          <ReactEcharts option={this.getOption(source)} />
        </Card>
      </div>
    )
  }
}
