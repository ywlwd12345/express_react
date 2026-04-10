import { useUserStore } from '../store/useUserStore';
const HasPermission = ({ code, children }: { code: string, children: React.ReactNode }) => {

    //  const { permissions } = useUserStore(); // 比如 ['user_delete', 'inv_edit'] 坑比较多

    const permissions = useUserStore(state => state.permissions);

    return permissions.includes(code) ? <>{children}</> : null;
};

export default HasPermission;

// 使用
{/* <HasPermission code="user_delete">
  <Button>删除用户</Button>
</HasPermission> */}



// import { ReactNode } from 'react';

import type { ReactNode } from 'react'

import { useUserStore } from '../store/useUserStore';

// 定义你项目所有权限（可选，推荐）
type PermissionCode = 'user_delete' | 'inv_edit' | 'role_add' | 'dashboard_view';

const HasPermission = ({
  code,
  children,
}: {
  code: PermissionCode; // 严格约束权限值
  children: ReactNode;
}) => {
  // ✅ 正确：只订阅 permissions，性能最好
  const permissions = useUserStore(state => state.permissions);

  // ✅ 安全判断：防止 undefined 报错
  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  // ✅ 有权限 → 渲染；没权限 → 不渲染
  return permissions.includes(code) ? <>{children}</> : null;
};

export default HasPermission;


{/* <HasPermission code="user_delete">
  <button>删除用户</button>
</HasPermission> */}