import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const Exception500 = () => (
  <Result
    status="500"
    title="500"
    subTitle="抱歉，服务器出错了"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

export default Exception500;
