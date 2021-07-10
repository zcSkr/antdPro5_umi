import React from 'react';
import { Modal } from 'antd';

const GlobalModal = (props) => {
  const {
    onCancel: handleUpdateModalVisible,
    visible,
  } = props;

  return (
    <Modal
      width={640}
      footer={null}
      destroyOnClose
      {...props}
      visible={visible}
      onCancel={() => handleUpdateModalVisible()}
    >
      {props.children}
    </Modal>
  );
};

export default GlobalModal;
