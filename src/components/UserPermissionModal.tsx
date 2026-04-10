import React, { useEffect, useState } from 'react';
import { Table, Switch, Button, message, Space, Typography, Tag, Modal } from 'antd';

import { userApi, permissionApi } from '../services/api';

const { Text } = Typography;

interface UserPermissionModalProps {
  userId: number;
  nickname: string;
  open: boolean;
  onClose: () => void;
}

const UserPermissionModal: React.FC<UserPermissionModalProps> = ({ userId, nickname, open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [specialSettings, setSpecialSettings] = useState<Record<number, boolean>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, uRes]: any = await Promise.all([
        permissionApi.list(), // 获取系统所有权限定义
        userApi.getSpecialPermissions(userId) // 获取该用户已有的特殊设置
      ]);
      
      setAllPermissions(pRes.data);
      
      // 转换为 Map 结构方便查找: { permissionId: is_granted }
      const settingsMap = uRes.data.reduce((acc: any, curr: any) => {
        acc[curr.permission_id] = !!curr.is_granted;
        return acc;
      }, {});
      setSpecialSettings(settingsMap);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (open) loadData(); }, [open, userId]);

  const handleToggle = (permissionId: number, checked: boolean | null) => {
    const newSettings = { ...specialSettings };
    if (checked === null) {
      delete newSettings[permissionId]; // 移除特殊设置，恢复默认（遵循角色/等级）
    } else {
      newSettings[permissionId] = checked;
    }
    setSpecialSettings(newSettings);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = Object.entries(specialSettings).map(([id, is_granted]) => ({
        id: Number(id),
        is_granted
      }));
      await userApi.updateSpecialPermissions(userId, payload);
      message.success('用户权限覆盖成功');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '权限标识', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '特殊控制',
      key: 'control',
      render: (_: any, record: any) => {
        const state = specialSettings[record.id];
        return (
          <Space>
            {/* 三态控制：不设置(遵循默认) / 强制允许 / 强制禁止 */}
            <Button 
              size="small" 
              type={state === undefined ? 'primary' : 'default'}
              onClick={() => handleToggle(record.id, null)}
            >
              默认
            </Button>
            <Switch 
              checkedChildren="允许" 
              unCheckedChildren="禁止" 
              checked={state === true}
              disabled={state === undefined}
              onChange={(checked) => handleToggle(record.id, checked)}
            />
            {state !== undefined && (
              <Tag color={state ? 'green' : 'red'}>
                {state ? '强制授权' : '强制屏蔽'}
              </Tag>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <Modal
      title={`权限分配 - ${nickname}`}
      open={open}
      width={800}
      onOk={handleSave}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">提示：设置为“默认”将遵循该用户角色或等级的权限；设置“允许/禁止”将覆盖系统默认规则。</Text>
      </div>
      <Table 
        dataSource={allPermissions} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} 
        loading={loading}
      />
    </Modal>
  );
};

export default UserPermissionModal;