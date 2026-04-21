import { Form, Input, Select, Table, Button, InputNumber, Card, Space } from 'antd';

const OrderEditor = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<any[]>([]); // 销售/进货明细

  const columns = [
    { title: 'SKU信息', dataIndex: 'sku_name' },
    { 
      title: '数量', 
      dataIndex: 'quantity', 
      render: (_, __, index) => (
        <InputNumber min={1} onChange={(val) => updateItem(index, 'quantity', val)} />
      )
    },
    { 
      title: '单价', 
      dataIndex: 'price', 
      render: (_, __, index) => (
        <InputNumber min={0} onChange={(val) => updateItem(index, 'price', val)} />
      )
    },
    { 
      title: '小计', 
      render: (_, record) => (record.quantity * record.price).toFixed(2) 
    }
  ];

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      items: items // 将主表和明细一起打包发送
    };
    // await api.post('/documents', payload);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="inline">
      <Card title="单据基础信息" style={{ width: '100%', marginBottom: 20 }}>
        <Space>
          <Form.Item name="type" label="单据类型" rules={[{required: true}]}>
            <Select style={{width: 150}}>
              <Select.Option value="PURCHASE">采购进货单</Select.Option>
              <Select.Option value="SALE">销售出库单</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="customer_vendor_name" label="往来单位">
            <Input placeholder="客户/供应商" />
          </Form.Item>
        </Space>
      </Card>

      <Card title="单据明细项" style={{ width: '100%' }}>
        <Table dataSource={items} columns={columns} pagination={false} />
        <Button 
          type="dashed" 
          onClick={() => setItems([...items, { key: Date.now(), quantity: 1, price: 0 }])}
          block 
          style={{marginTop: 10}}
        >
          + 添加商品项
        </Button>
        <div style={{textAlign: 'right', marginTop: 20}}>
          <Button type="primary" htmlType="submit" size="large">
            保存为草稿
          </Button>
        </div>
      </Card>
    </Form>
  );
};