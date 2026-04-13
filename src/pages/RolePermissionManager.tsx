import React, { useEffect, useState } from 'react';
import { Layout, Menu, Checkbox, Button, Card, Row, Col, message, Spin, Alert, Divider } from 'antd';

import { ShieldCheckered, SaveOutlined, ReloadOutlined } from '@ant-design/icons';

import { permissionApi } from '@/services/api';
import { rolePermissionApi } from '@/services/api';

import type { RoleType } from '@/services/api';

import type { Permission } from '@/types/permission';

const { Sider, Content } = Layout;

const RolePermissionManager: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [activeRole, setActiveRole] = useState<RoleType>('guest');

    // 角色定义（对应数据库 ENUM）
    const roles = [
        { key: 'guest', label: '访客 (Guest)', color: '#8c8c8c' },
        { key: 'member', label: '正式会员 (Member)', color: '#1890ff' },
        { key: 'admin', label: '管理员 (Admin)', color: '#f5222d' },
    ];

    // 加载权限元数据
    useEffect(() => {
        permissionApi.list().then(res => setAllPermissions(res.data));
    }, []);

    // 切换角色时加载数据
    useEffect(() => {
        fetchRolePerms(activeRole);
    }, [activeRole]);

    const fetchRolePerms = async (role: RoleType) => {
        setLoading(true);
        try {
            const res = await rolePermissionApi.getPermissionsByRole('role', role);
            setSelectedIds(res.data);
        } catch (err) {
            message.error('加载角色权限失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await rolePermissionApi.saveRolePermissions('role', activeRole, selectedIds);
            message.success(`角色 [${activeRole}] 权限更新成功`);
        } catch (err) {
            message.error('保存失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="角色权限矩阵管理" bodyStyle={{ padding: 0 }}>
            <Layout style={{ background: '#fff' }}>
                <Sider width={250} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
                    <div style={{ padding: '16px', fontWeight: 'bold', color: '#888' }}>角色列表</div>
                    <Menu
                        mode="inline"
                        selectedKeys={[activeRole]}
                        onClick={({ key }) => setActiveRole(key as RoleType)}
                        items={roles.map(r => ({
                            key: r.key,
                            label: r.label,
                            icon: <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                        }))}
                    />
                </Sider>

                <Content style={{ padding: '24px', minHeight: 500 }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                                当前编辑：{roles.find(r => r.key === activeRole)?.label}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Button icon={<ReloadOutlined />} onClick={() => fetchRolePerms(activeRole)}>
                                重置
                            </Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
                                保存权限设置
                            </Button>
                        </div>
                    </div>

                    <Alert
                        message="提示"
                        description={`修改 [${activeRole}] 的权限将立即影响该角色下的所有用户。`}
                        type="info"
                        showIcon
                        style={{ marginBottom: 20 }}
                    />

                    <Spin spinning={loading}>
                        <Checkbox.Group
                            style={{ width: '100%' }}
                            value={selectedIds}
                            onChange={(checked) => setSelectedIds(checked as number[])}
                        >
                            <Row gutter={[16, 16]}>
                                {allPermissions.map((perm) => (
                                    <Col span={12} lg={8} key={perm.id}>
                                        <div style={{
                                            padding: '12px',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '4px',
                                            background: selectedIds.includes(perm.id!) ? '#e6f7ff' : '#fff'
                                        }}>
                                            <Checkbox value={perm.id}>
                                                <div style={{ fontWeight: 500 }}>{perm.description || '未命名权限'}</div>
                                                <code style={{ fontSize: '11px', color: '#999' }}>{perm.name}</code>
                                            </Checkbox>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Spin>
                </Content>
            </Layout>
        </Card>
    );
};

export default RolePermissionManager;