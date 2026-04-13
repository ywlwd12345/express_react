import React, { useEffect, useState } from 'react';
import { Tabs, Checkbox, Button, Row, Col, Card, message, Spin, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { permissionApi, levelPermissionApi } from '@/services/api';

import type { Permission } from '@/types/permission';
// import { levelPermissionApi } from './api/levelPermissionApi';

const LevelPermissionManager: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [activeLevel, setActiveLevel] = useState<string>('1');

    // 等级定义
    const levels = [
        { key: '1', label: '普通会员' },
        { key: '2', label: '黄金会员' },
        { key: '3', label: '钻石会员' },
    ];

    // 1. 初始化获取所有权限列表
    useEffect(() => {
        permissionApi.list().then(res => setAllPermissions(res.data));
    }, []);

    // 2. 切换等级或初始化时获取当前等级拥有的权限
    useEffect(() => {
        fetchLevelPerms(Number(activeLevel));
    }, [activeLevel]);

    const fetchLevelPerms = async (level: number) => {
        setLoading(true);
        try {
            const res = await levelPermissionApi.getPermissionsByLevel(level, 'level');
            // 假设后端返回的是权限 ID 数组 [1, 2, 5]
            setSelectedIds(res.data);
        } catch (err) {
            message.error('获取等级权限失败');
        } finally {
            setLoading(false);
        }
    };

    // 3. 提交保存
    const handleSave = async () => {
        try {
            await levelPermissionApi.saveLevelPermissions('level', Number(activeLevel), selectedIds);
            message.success(`${levels.find(l => l.key === activeLevel)?.label} 权限配置已更新`);
        } catch (err) {
            message.error('保存失败');
        }
    };
    return (
        <Card title="等级权限配置 (Level-Based RBAC)">
            <Tabs
                activeKey={activeLevel}
                onChange={(key) => setActiveLevel(key)}
                items={levels}
            />

            <Spin spinning={loading}>
                <div style={{ minHeight: '200px', padding: '20px 0' }}>
                    <Checkbox.Group
                        style={{ width: '100%' }}
                        value={selectedIds}
                        onChange={(checked) => setSelectedIds(checked as number[])}
                    >
                        <Row gutter={[16, 16]}>
                            {allPermissions.map((item) => (
                                <Col span={6} key={item.id}>
                                    <Card size="small" hoverable>
                                        <Checkbox value={item.id}>
                                            <span style={{ fontWeight: 'bold' }}>{item.description}</span>
                                            <div style={{ fontSize: '12px', color: '#999' }}>{item.name}</div>
                                        </Checkbox>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </div>
            </Spin>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Space>
                    <Button onClick={() => fetchLevelPerms(Number(activeLevel))}>重置</Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                    >
                        保存当前等级配置
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default LevelPermissionManager;