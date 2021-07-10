import React from 'react';
import { Drawer } from 'antd';

const GlobalDrawer = (props) => {
  const {
    onCancel: handleUpdateModalVisible,
    visible,
  } = props;

  return (
    <Drawer
      width={1000}
      destroyOnClose
      {...props}
      visible={visible}
      onClose={() => handleUpdateModalVisible()}
    >
      {props.children}
    </Drawer>
  );
};

export default GlobalDrawer;
