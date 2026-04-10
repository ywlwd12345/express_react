import React, { useEffect, useState } from 'react';
import { Transfer, message, Spin } from 'antd';
import { userApi, permissionApi } from '../services/api'; // 假设你补充了对应的API

interface Props {
  targetType: 'role' | 'level';
  targetId: string | number;
}

const PermissionAssigner: React.FC<Props> = ({ targetType, targetId }) => {
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, currentRes]: any = await Promise.all([
        permissionApi.list(),
        permissionApi.getTargetIds(targetType, targetId)
      ]);

      // 转换数据格式适配Transfer组件
      setAllPermissions(listRes.data.map((p: any) => ({
        key: p.id.toString(),
        title: p.name,
        description: p.description
      })));

      setTargetKeys(currentRes.data.map((id: number) => id.toString()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [targetId]);

  const handleChange = async (nextTargetKeys: string[]) => {
    try {
      await permissionApi.assign(targetType, targetId, nextTargetKeys.map(Number));
      setTargetKeys(nextTargetKeys);
      message.success('权限更新成功');
    } catch (e) {
      message.error('保存失败');
    }
  };

  return (
    <Spin spinning={loading}>
      <Transfer
        dataSource={allPermissions}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={item => `${item.title} (${item.description})`}
        
        listStyle={{ width: 300, height: 400 }}
      />
    </Spin>
  );
};

export default PermissionAssigner;