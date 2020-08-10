import React from 'react';
import {
  AppstoreOutlined,
  ToolOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  UserOutlined,
  SolutionOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';


const menuConfig = [
  {
    key: "/home",
    icon: <HomeOutlined />,
    title: '首页',
    isPublic: true //公开的路由权限
  },
  {
    key: "/product",
    icon: <AppstoreOutlined />,
    title: "商品",
    child: [
      {
        key: "/product/category",
        icon: <UnorderedListOutlined />,
        title: '品类管理'
      },
      {
        key: "/product/goods",
        icon: <ToolOutlined />,
        title: '商品管理'
      }
    ]
  },
  {
    key: "/user",
    icon: <UserOutlined />,
    title: '用户管理'
  },
  {
    key: "/role",
    icon: <SolutionOutlined />,
    title: "角色管理"
  },
  {
    key: "/charts",
    icon: <AreaChartOutlined />,
    title: "图形图表",
    child: [
      {
        key: "/charts/bar",
        icon: <BarChartOutlined />,
        title: "柱状图"
      },
      {
        key: "/charts/line",
        icon: <LineChartOutlined />,
        title: "折线图"
      },
      {
        key: "/charts/pie",
        icon: <PieChartOutlined />,
        title: "饼图"
      }
    ]
  }
  
]

export default menuConfig;