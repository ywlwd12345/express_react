import React, { useState } from 'react';
import { Form, Input, Select, Table, Button, InputNumber, Card, Space, message, Divider } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
const OrderForm: React.FC = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<any[]>([]); // 存储已选中的 SKU 项

  // 计算总金额
  const calculateTotal = (currentItems: any[]) => {
    return currentItems.reduce((sum, item) => sum + (item.quantity * item.unit_price || 0), 0);
  };

  // 添加一行空商品
  const addItem = () => {
    const newItem = { key: Date.now(), sku_id: null, quantity: 1, unit_price: 0 };
    setItems([...items, newItem]);
  };

  // 处理保存草稿
  const onSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      if (items.length === 0) return message.error('请至少添加一个商品项');

      const payload = {
        ...values,
        total_amount: calculateTotal(items),
        items: items
      };

      // 调用接口保存
      // await api.post('/api/documents/draft', payload);
      message.success('草稿已保存，库存未变动');
    } catch (err) {
      console.log('校验失败', err);
    }
  };

  const columns = [
    {
      title: '商品SKU',
      dataIndex: 'sku_id',
      render: (_, __, index) => (
        <Select 
          placeholder="选择商品" 
          style={{ width: 200 }}
          onChange={(val) => {
            items[index].sku_id = val;
            setItems([...items]);
          }}
          options={[
            { value: 1, label: 'iPhone 15 - 黑色 - 256G' },
            { value: 2, label: 'iPhone 15 - 白色 - 512G' },
          ]}
        />
      ),
    },
    {
      title: '单价',
      dataIndex: 'unit_price',
      render: (_, __, index) => (
        <InputNumber 
          min={0} 
          precision={2} 
          onChange={(val) => {
            items[index].unit_price = val;
            setItems([...items]);
          }} 
        />
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      render: (_, __, index) => (
        <InputNumber 
          min={1} 
          onChange={(val) => {
            items[index].quantity = val;
            setItems([...items]);
          }} 
        />
      ),
    },
    {
      title: '金额小计',
      render: (_, record) => (record.quantity * record.unit_price).toFixed(2),
    },
    {
      title: '操作',
      render: (_, __, index) => (
        <Button danger type="link" onClick={() => {
          const newItems = [...items];
          newItems.splice(index, 1);
          setItems(newItems);
        }}>删除</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Form form={form} layout="vertical">
        <Card title="新建业务单据" extra={
          <Space>
            <Button icon={<SaveOutlined />} onClick={onSaveDraft}>保存草稿</Button>
            <Button type="primary">直接审核(扣库存)</Button>
          </Space>
        }>
          <Space size="large">
            <Form.Item name="type" label="单据类型" rules={[{ required: true }]} initialValue="SALE">
              <Select style={{ width: 160 }}>
                <Select.Option value="SALE">销售出库单 (减少库存)</Select.Option>
                <Select.Option value="PURCHASE">采购进货单 (增加库存)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="customer_vendor_name" label="往来单位" rules={[{ required: true }]}>
              <Input placeholder="输入客户或供应商名称" style={{ width: 250 }} />
            </Form.Item>
            <Form.Item label="总金额汇总">
              <span style={{ fontSize: 18, color: '#f5222d', fontWeight: 'bold' }}>
                ￥ {calculateTotal(items).toFixed(2)}
              </span>
            </Form.Item>
          </Space>

          <Divider orientation="left">商品明细项</Divider>
          
          <Table 
            dataSource={items} 
            columns={columns} 
            pagination={false} 
            footer={() => (
              <Button type="dashed" onClick={addItem} block icon={<PlusOutlined />}>
                添加商品项
              </Button>
            )}
          />

          <Form.Item name="remark" label="备注" style={{ marginTop: 20 }}>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};


export default OrderForm;