import { Card, Row, Col, Statistic } from 'antd';
import { Line, Pie } from '@ant-design/charts'; // 需安装 @ant-design/charts
const Dashboard = ({ trendData, pieData }) => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="近7天销售趋势">
            <Line 
              data={trendData} 
              xField="date" 
              yField="total" 
              smooth 
              point={{ size: 5, shape: 'diamond' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="类目销售占比">
            <Pie 
              data={pieData} 
              angleField="value" 
              colorField="type" 
              radius={0.8}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};