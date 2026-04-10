// src/components/AuthGuard.tsx
import { Navigate, useLocation } from 'react-router-dom';

import { useUserStore } from '../store/useUserStore';

interface Props {
  children: React.ReactNode;
  roles?: string[]; // 该页面需要的角色
}

export const AuthGuard: React.FC<Props> = ({ children, roles }) => {

  const { token, roles: userRoles } = useUserStore();

  const location = useLocation();

  console.log('用户角色:', token);

  // 1. 未登录，重定向到登录页，并记住当前想去的页面
  // if (!token) {
  //   return <Navigate to="/dashboard" state={{ from: location }} replace />;
  // }



  // 2. 已登录但没有权限
  // if (roles && !roles.some(r => userRoles.includes(r))) {
  //   return <Navigate to="/403" replace />;
  // }

  return <>{children}</>;
};