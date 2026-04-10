import React, { useEffect, useState } from 'react';

import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, Tag } from 'antd';

import {  UserRole, UserLevel } from '@/types/user';

import type { User } from '@/types/user';

import { userApi } from '@/services/api';

const UserList: React.FC = () => {
  
  const [data, setData] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await userApi.list({ page: 1, limit: 100 });

      setData(res.data.rows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (values: User) => {
    if (editingUser?.id) {
      await userApi.update(editingUser.id, values);
    } else {
      await userApi.create(values);
    }
    setIsModalOpen(false);
    loadData();
  };

  const columns = [
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { 
      title: '角色', 
      dataIndex: 'role', 
      render: (role: string) => <Tag color="blue">{role.toUpperCase()}</Tag> 
    },
    { 
      title: '等级', 
      dataIndex: 'level', 
      render: (lv: number) => ['普通', '黄金', '钻石'][lv - 1] + '会员' 
    },
    {
      title: '操作',
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" onClick={() => {
            setEditingUser(record);
            form.setFieldsValue(record);
            
            setIsModalOpen(true);
          }}>编辑</Button>
          <Popconfirm title="确定删除?" onConfirm={() => userApi.remove(record.id!).then(loadData)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => { setEditingUser(null); form.resetFields(); setIsModalOpen(true); }} style={{ marginBottom: 16 }}>
        新增用户
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal 
        title={editingUser ? "编辑用户" : "新增用户"} 
        open={isModalOpen} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色" initialValue={UserRole.MEMBER}>
            <Select options={[
              { label: '游客', value: UserRole.GUEST },
              { label: '会员', value: UserRole.MEMBER },
              { label: '管理员', value: UserRole.ADMIN },
            ]} />
          </Form.Item>
          <Form.Item name="level" label="等级" initialValue={UserLevel.NORMAL}>
            <Select options={[
              { label: '普通', value: UserLevel.NORMAL },
              { label: '黄金', value: UserLevel.GOLD },
              { label: '钻石', value: UserLevel.DIAMOND },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;