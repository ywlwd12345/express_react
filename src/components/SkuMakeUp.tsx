import { Table, Input, Button, Form, Space, Card } from 'antd';
import { useState } from 'react';


/**
 * 笛卡尔积算法：将 [['红色','白色'], ['64G','128G']] 
 * 转换为 [['红色','64G'], ['红色','128G'], ...]
 */
const cartesianProduct = (arr: any[][]) => {
  return arr.reduce((a, b) => {
    return a.flatMap(d => b.map(e => [d, e].flat()));
  }, [[]]);
};

const SkuEditor = () => {
    
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);

  // 模拟规格输入变化时生成 SKU
  const generateSkus = () => {
    const attrValues = [['红色', '蓝色'], ['64G', '128G']]
    const products = cartesianProduct(attrValues); 
    const newData = products.map((p, index) => ({
      key: index,
      specs: p.join(' / '),
      price: 0,
      stock: 0,
      skuCode: `SN-${Date.now()}-${index}`
    }));
    setDataSource(newData);
  };

  const columns = [
    { title: '规格组合', dataIndex: 'specs', key: 'specs' },
    { 
      title: '售价', 
      dataIndex: 'price', 
      render: (_, record) => <Input type="number" defaultValue={record.price} /> 
    },
    { 
      title: '当前库存', 
      dataIndex: 'stock', 
      render: (val) => <strong>{val}</strong> // 库存通常不可在表格直接改，需通过入库单
    },
    { title: 'SKU 编码', dataIndex: 'skuCode', key: 'skuCode' },
  ];

  return (
    <Card title="商品规格配置">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert message="提示：输入规格后点击生成，系统将自动计算所有可能的 SKU 组合" type="info" />
        <Button onClick={generateSkus} type="dashed">生成 SKU 矩阵</Button>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Space>
    </Card>
  );
};

export default SkuEditor;