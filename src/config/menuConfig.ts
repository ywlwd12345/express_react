// src/config/menuConfig.ts
export interface MenuItem {
  path: string;
  label: string;
  icon?: string;
  roles?: string[]; // 哪些角色可以看
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    path: '/dashboard',
    label: '控制台',
    roles: ['admin', 'editor'],
  },

  {
    path: '/users',
    label: '用户管理',
    roles: ['admin'], // 只有管理员能看
  },

  {
    path: '/PermissionManager',
    label: '权限',
    roles: ['admin'],
  },

  //等级权限管理 

  {
    path: '/LevelPermissionManager',
    label: '等级权限管理',
    roles: ['admin'],
  },


  {
    path: '/RolePermissionManager',
    label: '角色权限管理',
    roles: ['admin'],
  }


];