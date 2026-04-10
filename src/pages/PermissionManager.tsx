import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { permissionApi } from '@/services/api';

import type { Permission } from '@/types/permission';

const PermissionManager: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Permission[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form] = Form.useForm();

    // 获取数据列表
    const fetchList = async () => {
        setLoading(true);
        try {
            const res = await permissionApi.list();
            setData(res.data);
        } catch (error) {
            message.error('获取权限列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // 打开弹窗（新增或编辑）
    const showModal = (record?: Permission) => {
        if (record) {
            setEditingId(record.id!);
            form.setFieldsValue(record);
        } else {
            setEditingId(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    // 提交表单
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingId) {
                await permissionApi.update(editingId, values);
                message.success('修改成功');
            } else {
                await permissionApi.create(values);
                message.success('创建成功');
            }
            setIsModalVisible(false);
            fetchList();
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    // 删除权限
    const handleDelete = async (id: number) => {
        try {
            await permissionApi.remove(id);
            message.success('删除成功');
            fetchList();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '权限标识',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <code>{text}</code>,
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_: any, record: Permission) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除该权限吗？"
                        onConfirm={() => handleDelete(record.id!)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>权限管理</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    新增权限
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingId ? '编辑权限' : '新增权限'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="permissionForm">
                    <Form.Item
                        name="name"
                        label="权限标识符"
                        rules={[
                            { required: true, message: '请输入权限标识符（如 user:list）' },
                            { pattern: /^[a-z]+:[a-z]+$/, message: '格式建议为 模块:操作' }
                        ]}
                    >
                        <Input placeholder="例如: order:view" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="权限描述"
                    >
                        <Input.TextArea rows={3} placeholder="请简述该权限的作用" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PermissionManager;