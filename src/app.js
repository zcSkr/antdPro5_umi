import React, { useState } from 'react';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import { getUnionuser } from '@/utils/config'
import { Spin } from 'antd';

export async function getInitialState() {
  return {
    settings: defaultSettings,
  };
}

export const layout = ({ initialState, ...rest }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // waterMarkProps: { //可以加水印玩
    //   content: '水印',
    // },
    // footerRender: () => <Footer />,
    // menuItemRender: (menuItemProps, defaultDom) => {
    //   if (menuItemProps.isUrl || !menuItemProps.path) {
    //     return defaultDom;
    //   }

    //   return <Link to={menuItemProps.path}>{defaultDom}</Link>;
    // },
    breadcrumbRender: (routers = []) => [
      {
        path: '/',
        breadcrumbName: '首页',
      },
      ...routers,
    ],
    itemRender: (route, params, routes, paths) => {
      const first = routes.indexOf(route) === 0;
      return first ? (
        <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
      ) : (
        <span>{route.breadcrumbName}</span>
      );
    },
    menuContentRender: (_, dom) => false ? <div style={{ textAlign: 'center', padding: '24px 0' }}><Spin tip="菜单加载中" /></div> : dom,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login
      if (!getUnionuser() && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    ...initialState?.settings,
  };
};
