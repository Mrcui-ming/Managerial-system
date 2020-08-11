import React, { Component } from 'react';
import { Card, Statistic, DatePicker, Timeline  } from 'antd';
import {
  QuestionCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import { Chart, LineAdvance, Interval, Tooltip } from 'bizcharts';
import LinkButton from 'components/content/LinkButton'
import 'assets/css/home/home.css';
const { RangePicker } = DatePicker;

//首页路由
export default class Home extends Component {

  state = {
    isBorder: false,
    data: [
      {
        month: "Jan",
        city: "Tokyo",
        temperature: 7
      },
      {
        month: "Jan",
        city: "London",
        temperature: 3.9
      },
      {
        month: "Feb",
        city: "Tokyo",
        temperature: 13
      },
      {
        month: "Feb",
        city: "London",
        temperature: 4.2
      },
      {
        month: "Mar",
        city: "Tokyo",
        temperature: 16.5
      },
      {
        month: "Mar",
        city: "London",
        temperature: 5.7
      },
      {
        month: "Apr",
        city: "Tokyo",
        temperature: 14.5
      },
      {
        month: "Apr",
        city: "London",
        temperature: 8.5
      },
      {
        month: "May",
        city: "Tokyo",
        temperature: 10
      },
      {
        month: "May",
        city: "London",
        temperature: 11.9
      },
      {
        month: "Jun",
        city: "Tokyo",
        temperature: 7.5
      },
      {
        month: "Jun",
        city: "London",
        temperature: 15.2
      },
      {
        month: "Jul",
        city: "Tokyo",
        temperature: 9.2
      },
      {
        month: "Jul",
        city: "London",
        temperature: 17
      },
      {
        month: "Aug",
        city: "Tokyo",
        temperature: 14.5
      },
      {
        month: "Aug",
        city: "London",
        temperature: 16.6
      },
      {
        month: "Sep",
        city: "Tokyo",
        temperature: 9.3
      },
      {
        month: "Sep",
        city: "London",
        temperature: 14.2
      },
      {
        month: "Oct",
        city: "Tokyo",
        temperature: 8.3
      },
      {
        month: "Oct",
        city: "London",
        temperature: 10.3
      },
      {
        month: "Nov",
        city: "Tokyo",
        temperature: 8.9
      },
      {
        month: "Nov",
        city: "London",
        temperature: 5.6
      },
      {
        month: "Dec",
        city: "Tokyo",
        temperature: 5.6
      },
      {
        month: "Dec",
        city: "London",
        temperature: 9.8
      }
    ],
    dataLine: [
      { year: '1951 年', sales: 22 },
      { year: '1952 年', sales: 52 },
      { year: '1956 年', sales: 61 },
      { year: '1957 年', sales: 45 },
      { year: '1958 年', sales: 48 },
      { year: '1959 年', sales: 38 },
      { year: '1960 年', sales: 38 },
      { year: '1962 年', sales: 100 },
    ]
  }

  callback = (value) => {

  }

  render() {
    const { isBorder, data, dataLine } = this.state;
    const title = (
      <>
        <span
          style={isBorder ? { borderBottom: "2px solid #00a5e4", paddingBottom: 10 } : null}
          onClick={() => this.setState({ isBorder: true })}
        >
          <LinkButton>访问量</LinkButton>
        </span>
        &nbsp;&nbsp;
        <span
          style={!isBorder ? { borderBottom: "2px solid #00a5e4", paddingBottom: 10 } : null}
          onClick={() => this.setState({ isBorder: false })}
        >
          <LinkButton>销售量</LinkButton>
        </span>
      </>
    )
    const dateFormat = 'YYYY/MM/DD';
    const extra = <RangePicker
      style={{ transform: "translateY(-4px)" }}
      defaultValue={[moment('2020/08/02', dateFormat), moment('2020/12/12', dateFormat)]}
      format={dateFormat}
    />

    return (
      <div id="home">
        <header>
          <div className="header-left">
            <Card title="商品总量" extra={<QuestionCircleOutlined />}>
              <h1
                style={{
                  fontSize: 24,
                  marginBottom: 20,
                  fontWeight: 700
                }}>1,128,163
              <span style={{ fontSize: 20 }}>
                  个
              </span>
              </h1>
              <Statistic
                value="周同比 15"
                precision={2}
                valueStyle={{ color: '#000', fontSize: 15 }}
                prefix={<ArrowUpOutlined style={{ color: "green" }} />}
                suffix="%"
              />
              <Statistic
                value="周同比 15"
                precision={2}
                valueStyle={{ color: '#000', fontSize: 15 }}
                prefix={<ArrowDownOutlined style={{ color: "red" }} />}
                suffix="%"
              />
            </Card>
          </div>
          <div className="header-right">
            <Chart padding={[10, 20, 50, 40]} autoFit height={250} data={data} >
              <LineAdvance
                shape="smooth"
                point
                area
                position="month*temperature"
                color="city"
              />
            </Chart>
          </div>
        </header>
        <main>
          <Card title={title} extra={extra}>
            <Card 
            title="销售趋势" 
            extra={<ReloadOutlined />} 
            style={{ width: "60%",float: "left" }}>
            <Chart
                height={300}
                border
                autoFit data={dataLine}
                interactions={['active-region']}
                padding={[30, 30, 30, 50]}
              >
                <Interval position="year*sales" />
                <Tooltip shared />
              </Chart>
            </Card>
            <Card 
            title="任务"  
            extra={<ReloadOutlined />}
            style={{ width: "30%",float: "right" }}
            >
              <Timeline>
                <Timeline.Item>新版本迭代会</Timeline.Item>
                <Timeline.Item>完成网站设计初版</Timeline.Item>
                <Timeline.Item color="red">
                  <p>联调接口</p>
                  <p>功能验收</p>
                </Timeline.Item>
                <Timeline.Item color="skyblue">
                  <p>登录功能设计</p>
                  <p>权限验证</p>
                  <p>页面排版</p>
                </Timeline.Item>
              </Timeline>,
            </Card>
          </Card>
        </main>
      </div>
    )
  }
}
