import React from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { getUnionuser } from '@/utils/config'

const AvatarDropdown = () => {
  const onMenuClick = ({ key }) => {
    console.log(key)
    if (key === 'logout') {
      sessionStorage.removeItem('unionuser')
      sessionStorage.removeItem('token')
      history.replace('/user/login')
    } else if (key === 'changePsd') {
      // handleUpdateModalVisible(true)
    }
  };

  const currentUser = getUnionuser();

  if (!currentUser) {
    return (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }

  


  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="changePsd">
        <SettingOutlined />
        修改密码
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} icon={<UserOutlined />} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.nickname || currentUser.account}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
