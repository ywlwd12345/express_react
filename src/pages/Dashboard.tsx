import React, { useEffect, useState, useCallback } from 'react';
// 核心组件从 'antd' 直接引入
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Descriptions, 
  Badge, 
  Skeleton, 
  Button, 
  App,        // 推荐使用 App 包裹器，解决静态方法调用问题
  Space,
  Typography,
  ConfigProvider
} from 'antd';
// 图标从单独的包引入

import { 
  SyncOutlined, 
  DashboardOutlined, 
  DatabaseOutlined, 
  GlobalOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

// --- 接口定义保持不变 ---
interface ServerInfo {
  status: 'online' | 'offline';
  host: string;
  ip: string;
  cpu: number;
  mem: number;
  disk: number;
  uptime: string;
}

const DashboardContent: React.FC = () => {
  // 从 App.useApp() 中解构 message, 不需要单独 import { message }
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ServerInfo | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 这里的 serverApi.details 替换为你真实的 API
      const res = await (window as any).serverApi.details(); 
      setData(res);
    } catch (err) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>服务器实时监控</Title>
        </Col>
        <Col>
          <Button 
            icon={<SyncOutlined spin={loading} />} 
            type="primary" 
            onClick={loadData}
          >
            刷新参数
          </Button>
        </Col>
      </Row>

      <Skeleton loading={loading} active round paragraph={{ rows: 8 }}>
        {data && (
          <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            {/* 第一行：状态卡片 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card hoverable>
                  <Statistic 
                    title="系统状态" 
                    value={data.status === 'online' ? '运行正常' : '异常'} 
                    valueStyle={{ color: data.status === 'online' ? '#52c41a' : '#ff4d4f' }}
                    prefix={<GlobalOutlined />}
                  />
                  <Badge status={data.status === 'online' ? 'processing' : 'error'} text="连接中" />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card hoverable>
                  <Statistic 
                    title="CPU 负载" 
                    value={data.cpu} 
                    suffix="%" 
                    prefix={<DashboardOutlined />} 
                  />
                  <Progress percent={data.cpu} size="small" status={data.cpu > 85 ? 'exception' : 'active'} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card hoverable>
                  <Statistic 
                    title="内存使用" 
                    value={data.mem} 
                    suffix="%" 
                    prefix={<DatabaseOutlined />} 
                  />
                  <Progress percent={data.mem} size="small" strokeColor={data.mem > 90 ? '#ff4d4f' : '#1677ff'} />
                </Card>
              </Col>
            </Row>

            {/* 第二行：详细参数 */}
            <Card title="服务器硬件及网络参数">
              <Descriptions bordered column={{ xs: 1, sm: 2, lg: 3 }}>
                <Descriptions.Item label="主机名">{data.host}</Descriptions.Item>
                <Descriptions.Item label="内网 IP">{data.ip}</Descriptions.Item>
                <Descriptions.Item label="运行时间">
                  <Text type="secondary">{data.uptime}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="磁盘占用" span={3}>
                  <Progress percent={data.disk} status="normal" />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        )}
      </Skeleton>
    </div>
  );
};

// 导出时建议包裹 App，确保 antd 的 Context 生效
const Dashboard = () => (
  <App>
    <DashboardContent />
  </App>
);

export default Dashboard;