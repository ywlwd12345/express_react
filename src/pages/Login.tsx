import React, { useState } from 'react';
import { 
  LockOutlined, 
  UserOutlined, 
  SafetyCertificateOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

import { 
  LoginForm, 
  ProFormText, 
  ProFormSelect 
} from '@ant-design/pro-components';


import { 
  App, 
  Tabs, 
  Card, 
  theme, 
  Typography,
  ConfigProvider
} from 'antd';

const { Text } = Typography;

// 模拟登录接口
const loginApi = async (values: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // 这里模拟后端返回逻辑
  if (values.username === 'admin' && values.password === '123456') {
    return { success: true, role: values.role, token: 'fake_token_xxxxx' };
  }
  throw new Error('用户名或密码错误');
};

const LoginPage: React.FC = () => {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<'account'>('account');

  const handleSubmit = async (values: any) => {
    try {
      const res = await loginApi(values);
      message.success(`登录成功！欢迎回来，${res.role === 'admin' ? '管理员' : '普通用户'}`);
      
      // 这里处理跳转逻辑，例如:
      // localStorage.setItem('token', res.token);
      // navigate('/dashboard');
      
    } catch (error: any) {
      message.error(error.message || '登录异常');
    }
  };

  return (
    <div style={{ 
      backgroundColor: token.colorBgContainerMixed,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'radial-gradient(circle at 2px 2px, #ddd 1px, transparent 0)',
      backgroundSize: '32px 32px'
    }}>
      <div style={{ width: 400 }}>
        <LoginForm
          logo={<SafetyCertificateOutlined style={{ fontSize: 40, color: token.colorPrimary }} />}
          title="辛巴云管理系统"
          subTitle="高效、稳定的企业级 ERP 解决方案"
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: '进入系统',
            },
          }}
        >
          <Tabs
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as 'account')}
            centered
            items={[{ key: 'account', label: '账号密码登录' }]}
          />

          <ProFormSelect
            name="role"
            label="登录角色"
            placeholder="请选择您的角色"
            options={[
              { label: '系统管理员', value: 'admin' },
              { label: '财务经理', value: 'finance' },
              { label: '仓库主管', value: 'warehouse' },
              { label: '普通员工', value: 'staff' },
            ]}
            rules={[{ required: true, message: '请选择角色' }]}
          />

          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名: admin"
            rules={[{ required: true, message: '请输入用户名' }]}
          />

          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码: 123456"
            rules={[{ required: true, message: '请输入密码' }]}
          />

          <div style={{ marginBottom: 24, textAlign: 'right' }}>
            <Text type="secondary" style={{ cursor: 'pointer' }}>忘记密码？</Text>
          </div>
        </LoginForm>
      </div>
      
      <div style={{ marginTop: 24 }}>
        <Text type="secondary">© 2026 辛巴云软件 版权所有</Text>
      </div>
    </div>
  );
};

// 依然建议包裹 App 组件
export default () => (
  <App>
    <LoginPage />
  </App>
);