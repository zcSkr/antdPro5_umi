// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
export default defineConfig({
  base: '/',
  publicPath: '/',
  hash: true,
  history: { type: 'hash' },
  antd: {
    dark: false, // 开启暗色主题
    compact: false, // 开启紧凑主题
  },
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  headScripts: [ //需要头部引入的三方script配置
    'https://map.qq.com/api/js?v=2.exp&key=TUJBZ-GMTR4-FE7UG-XIRYO-IQM2F-TCF4X', //腾讯地图script
    'http://api.map.baidu.com/api?v=2.0&ak=GC2tQ11of0Kr8WLpYws4ySC3aPT7t4ly',//百度地图script
    'https://webapi.amap.com/maps?v=1.4.15&key=c070243f603d1206459ee7e2f8cbb191',//高德地图script
  ],
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  // openAPI: [
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     // 或者使用在线的版本
  //     // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
  //     schemaPath: join(__dirname, 'oneapi.json'),
  //     mock: false,
  //   },
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
  //     projectName: 'swagger',
  //   },
  // ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
