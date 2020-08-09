const menuConfig1 = [
  {
    title: "平台权限",
    key: "/",
    children: [
      {
        key: "/home",
        title: '首页'
      },
      {
        key: "/product",
        title: "商品",
        children: [
          {
            key: "/product/category",
            title: '品类管理'
          },
          {
            key: "/product/goods",
            title: '商品管理'
          }
        ]
      },
      {
        key: "/user",
        title: '用户管理'
      },
      {
        key: "/role",
        title: "角色管理"
      },
      {
        key: "/charts",
        title: "图形图表",
        children: [
          {
            key: "/charts/bar",
            title: "柱状图"
          },
          {
            key: "/charts/line",
            title: "折线图"
          },
          {
            key: "/charts/pie",
            title: "饼图"
          }
        ]
      }
    ]
  }
]

export default menuConfig1;