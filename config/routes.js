export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            locale: false,
            path: '/user/login',
            component: './User/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    component: './Welcome',
  },
  {
    name: '系统设置',
    locale: false,
    icon: 'setting',
    path: '/sys',
    routes: [
      {
        name: '模块管理',
        locale: false,
        path: '/sys/module',
        component: './Sys/ModuleManage',
      },
      {
        name: '角色管理',
        locale: false,
        path: '/sys/role',
        component: './Sys/RoleManage',
      },
      {
        name: '子管理员',
        locale: false,
        path: '/sys/manager',
        component: './Sys/ChildManage',
      },
      {
        name: '系统参数',
        locale: false,
        path: '/sys/params',
        component: './Sys/SysParams',
      },
      {
        name: '版本更新',
        locale: false,
        path: '/sys/app',
        component: './Sys/App',
      }
    ]
  },
  {
    name: '测试菜单',
    locale: false,
    icon: 'table',
    path: '/demo',
    routes: [
      {
        name: '查询表格',
        locale: false,
        path: '/demo/demoTable',
        component: './Demo/DemoTable',
      },
      {
        name: '三级分类',
        locale: false,
        path: '/demo/type',
        component: './Demo/Type',
      },
      {
        name: '帮助中心',
        locale: false,
        path: '/demo/helpCenter',
        component: './Demo/HelpCenter',
      },
      {
        name: '客服中心',
        locale: false,
        path: '/demo/customer',
        component: './Demo/CustomerService',
      }
    ]
  },
  {
    name: 'exception',
    locale: false,
    icon: 'warning',
    path: '/exception',
    hideInMenu: true,
    routes: [
      {
        name: '403',
        locale: false,
        path: '/exception/403',
        component: './Exception/403',
      },
      {
        name: '404',
        locale: false,
        path: '/exception/404',
        component: './Exception/404',
      },
      {
        name: '500',
        locale: false,
        path: '/exception/500',
        component: './Exception/500',
      }
    ],
  },
  {
    component: './Exception/404',
  },
];
