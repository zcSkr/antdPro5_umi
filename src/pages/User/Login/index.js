import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import { setToken, setUnionuser } from '@/utils/config';
import * as services_login from '@/services/login';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const response = await services_login.login({ ...values });
    // console.log(response)
    if (response.code === 200) {
      setToken(response.data.user.token);
      setUnionuser(response.data.user);
      history.push('/');
    } else {
      setStatus('error')
      setErrorMsg(response.msg)
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
              <img alt="logo" className={styles.logo} src="/logo.svg" />
            <span className={styles.title}>{initialState.settings.title}后台管理系统</span>
          </div>
          <div className={styles.desc}>
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: '登录',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => handleSubmit(values)}
          >
            <Tabs>
              <Tabs.TabPane
                key="account"
                tab='账户密码登录'
              />
            </Tabs>

            {status === 'error' && <LoginMessage content={errorMsg || '账户或密码错误'} />}
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder='登录账号baba'
              rules={[
                {
                  required: true,
                  message: "请输入登录账号!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder='登录密码123456'
              rules={[
                {
                  required: true,
                  message: "请输入登录密码！",
                },
              ]}
            />
          </ProForm>

        </div>
      </div>

    </div>
  );
};

export default Login;
