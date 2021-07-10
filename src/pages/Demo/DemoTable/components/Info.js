import React, { useState } from 'react';
import { Radio, Switch, Space, InputNumber, Image } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import moment from 'moment';
import Field from '@ant-design/pro-field';

const Info = (props) => {
  const [state, setState] = useState('read');
  return (
    <>
      <Space>
        <Radio.Group onChange={e => setState(e.target.value)} value={state}>
          <Radio value="read">只读</Radio>
          <Radio value="edit">编辑</Radio>
        </Radio.Group>
      </Space>
      <br />
      <br />
      <ProDescriptions
        column={2}
        bordered
        title="详情展示示例"
      >
        <ProDescriptions.Item label="空字符串">
          <Field text="" mode={state} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="头像">
          <Field
            text="https://avatars2.githubusercontent.com/u/8186664?s=60&v=4"
            mode="read"
            // valueType="avatar"
            render={value => <Image width={100} height={100} src={value} />}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="文本">
          <Field text="这是一段文本" valueType="text" mode={state} tip='4567890' />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="金额">
          <Field text="100" valueType="money" mode={state} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="数字">
          <Field text="19897979797979" valueType="digit" mode={state} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="百分比">
          <Field text="100" valueType="percent" mode={state} 
            renderFormItem={() => <InputNumber style={{ width: '100%' }} min={1} precision={0} placeholder="请输入" />}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="选择框">
          <Field
            text="open"
            mode={state}
            valueEnum={{
              all: {
                text: '全部',
                status: 'Default',
              },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            }}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="远程选择框">
          <Field
            text="open"
            mode={state}
            request={() => [
              {
                label: '全部',
                value: 'all',
              },
              {
                label: '未解决',
                value: 'open',
              },
              {
                label: '已解决',
                value: 'closed',
              },
              {
                label: '解决中',
                value: 'processing',
              },
            ]}
          />
        </ProDescriptions.Item>

        <ProDescriptions.Item label="进度条">
          <Field text="40" valueType="progress" mode={state} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="百分比">
          <Space>
            <Field
              text={10}
              valueType={{
                type: 'percent',
                showSymbol: true,
                showColor: true,
              }}
              mode="read"
            />
            <Field
              text={0}
              valueType={{
                type: 'percent',
                showSymbol: true,
                showColor: true,
              }}
              mode="read"
            />
            <Field
              text={-10}
              valueType={{
                type: 'percent',
                showSymbol: true,
                showColor: true,
              }}
              mode="read"
            />
          </Space>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="日期时间">
          <Field
            text={moment('2019-11-16 12:50:26').valueOf()}
            valueType="dateTime"
            mode={state}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="日期">
          <Field
            text={moment('2019-11-16 12:50:26').valueOf()}
            valueType="date"
            mode={state}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="日期区间">
          <Field
            text={[
              moment('2019-11-16 12:50:26')
                .add(-1, 'd')
                .valueOf(),
              moment('2019-11-16 12:50:26').valueOf(),
            ]}
            valueType="dateRange"
            mode={state}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="日期时间区间">
          <Field
            text={[
              moment('2019-11-16 12:50:26')
                .add(-1, 'd')
                .valueOf(),
              moment('2019-11-16 12:50:26').valueOf(),
            ]}
            valueType="dateTimeRange"
            mode={state}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="时间">
          <Field
            text={moment('2019-11-16 12:50:26').valueOf()}
            valueType="time"
            mode={state}
          />
        </ProDescriptions.Item>
      </ProDescriptions>
    </>
  );
};

export default Info