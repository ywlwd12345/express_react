import { Tree, Card, Button, Modal, Form, Input, TreeSelect } from 'antd';

const CategoryManager = ({ treeData }) => {
  return (
    <Card title="商品分类管理" extra={<Button type="primary">新增根分类</Button>}>
      <Tree
        showLine
        treeData={treeData}
        fieldNames={{ title: 'name', key: 'id' }}
        titleRender={(node: any) => (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
            <span>{node.name}</span>
            <Button type="link" size="small">添加子项</Button>
          </div>
        )}
      />
    </Card>
  );
};