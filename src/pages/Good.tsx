import React, { useState } from 'react';
import { Form, Input, Button, Table, Space, Divider, message, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type {SkuItem} from '../types/good';
const GoodsForm: React.FC = () => {
  const [form] = Form.useForm();
  const [skus, setSkus] = useState<SkuItem[]>([]);

  // 笛卡尔积算法：将规格组合成 SKU
  const generateSkus = () => {
    const spuName = form.getFieldValue('spu_name');
    if (!spuName) return message.warning('请先输入商品名称');

    // 假设规格数据从表单动态获取（实际项目中可做成动态增减规格项）
    const specOptions = [
      { label: '颜色', values: ['红色', '黑色'] },
      { label: '配置', values: ['8+128G', '12+256G'] }
    ];

    // 计算笛卡尔积
    let result: any[] = [{}];
    specOptions.forEach(opt => {
      const next: any[] = [];
      result.forEach(prevItem => {
        opt.values.forEach(val => {
          next.push({ ...prevItem, [opt.label]: val });
        });
      });
      result = next;
    });

    // 转化为 SKU 格式
    const newSkus: SkuItem[] = result.map((s, index) => ({
      sku_code: `${spuName.toUpperCase()}-${index}`,
      specs: s,
      price: 99,
      stock: 0
    }));
    setSkus(newSkus);
  };

  const onFinish = async (values: any) => {
    // 提交数据：包含基础信息 + 生成的 SKU 列表
    const payload = {
      ...values,
      skuList: skus
    };
    console.log('提交给后端的数据:', payload);
    // await api.post('/goods', payload);
    message.success('商品及 SKU 批量创建成功');
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Card title="基础信息">
        <Form.Item name="spu_name" label="商品名称" rules={[{ required: true }]}>
          <Input placeholder="请输入商品名，如：辛巴 ERP 旗舰版" />
        </Form.Item>
      </Card>

      <Card title="规格配置" style={{ marginTop: 20 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<PlusOutlined />} onClick={generateSkus} type="primary" ghost>
            生成 SKU 矩阵
          </Button>
        </Space>

        <Table
          dataSource={skus}
          rowKey="sku_code"
          pagination={false}
          columns={[
            {
              title: '规格组合',
              dataIndex: 'specs',
              render: (specs) => Object.entries(specs).map(([k, v]) => `${k}:${v}`).join(' | ')
            },
            {
              title: 'SKU 编码',
              dataIndex: 'sku_code',
              render: (_, __, index) => (
                <Input defaultValue={skus[index].sku_code} onChange={e => {
                  skus[index].sku_code = e.target.value;
                  setSkus([...skus]);
                }} />
              )
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (_, __, index) => (
                <Input type="number" defaultValue={skus[index].price} onChange={e => {
                  skus[index].price = Number(e.target.value);
                  setSkus([...skus]);
                }} />
              )
            },
            {
                title: '初始库存',
                dataIndex: 'stock',
                render: (_, __, index) => <Input type="number" placeholder="初始库存" />
            }
          ]}
        />
      </Card>

      <div style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit" size="large" block>
          提交商品
        </Button>
      </div>
    </Form>
  );
};

export default GoodsForm;