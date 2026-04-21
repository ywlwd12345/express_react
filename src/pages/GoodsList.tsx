import { Form, Input, Button, Table, Space, Divider, message, Card } from 'antd';
const GoodsList = () => {
  const columns = [
    { title: '商品名', dataIndex: 'spu_name' },
    { title: 'SKU 种类', dataIndex: 'sku_count' },
    { title: '总库存', dataIndex: 'total_stock' },
    { title: '操作', render: () => <Button type="link">管理</Button> }
  ];
  return (
    <Table
      columns={columns}
      dataSource={listData}
      expandable={{
        expandedRowRender: record => (
          <Table
            columns={[
              { title: 'SKU 编码', dataIndex: 'sku_code' },
              { title: '规格', dataIndex: 'specs_json' },
              { title: '价格', dataIndex: 'price' },
              { title: '当前库存', dataIndex: 'stock' }
            ]}
            dataSource={record.skus} // 后端通过联表查出的 sku 列表
            pagination={false}
          />
        ),
      }}
    />
  );
};

export default GoodsList;