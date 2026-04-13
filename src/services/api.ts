import axios from 'axios';
import { message } from 'antd';

import type { User } from '@/types/user';
import type { Permission } from '@/types/permission';

const api = axios.create({ baseURL: ' http://localhost:3000' });

// 全局错误响应拦截
api.interceptors.response.use(
  response => response.data,
  error => {
    const msg = error.response?.data?.message || '网络错误';
    message.error(msg);
    return Promise.reject(error);
  }
);


export const userApi = {
  list: (params: any) => api.get('/users', { params }),
  create: (data: User) => api.post('/users', data),
  update: (id: number, data: User) => api.put(`/users/${id}`, data),
  remove: (id: number) => api.delete(`/users/${id}`),
};



export const permissionApi = {
  list: (params?: any) => api.get<Permission[]>('/permissions', { params }),
  create: (data: Permission) => api.post('/permissions', data),
  update: (id: number, data: Permission) => api.put(`/permissions/${id}`, data),
  remove: (id: number) => api.delete(`/permissions/${id}`),
};



// type Level = LevelPermission['level'];
// type PermissionId = LevelPermission['permission_id'];


// interface LevelPermissionApi<L, P> {
//   getPermissionsByLevel(level: L): Promise<P[]>;
//   saveLevelPermissions(level: L, permissionIds: P[]): Promise<void>;
// }

// export const levelPermissionApi: LevelPermissionApi<Level, PermissionId> = {
//   getPermissionsByLevel: (level) =>
//     api.get(`/level-permissions/${level}`),

//   saveLevelPermissions: (level, permissionIds) =>
//     api.post(`/level-permissions/${level}`, { permissionIds }),


//   listAllConfigs: () =>
//     api.get('/level-permissions'),


// };


export interface LevelPermission<L = number, P = number> {
  level: L;
  permission_id: P;
}

interface LevelPermissionApi<L, P, R> {
  getPermissionsByLevel(level: L, role: R): Promise<{ data: P[] }>;

  saveLevelPermissions(targetType: R, level: L, permissionIds: P[]): Promise<void>;

  /** 新增：查询所有配置 */
  listAllConfigs(): Promise<{ data: LevelPermission<L, P>[] }>;
}


type Level = number;
type PermissionId = number;
type targetType = 'role' | 'level'

// const { targetType, targetId, permissionIds }


// get<T = any, R = AxiosResponse<T>, D = any>(
//   url: string,
//   config?: AxiosRequestConfig<D>,
// ): Promise<R>;


// /target/:type/:id

export const levelPermissionApi: LevelPermissionApi<Level, PermissionId, targetType> = {

  getPermissionsByLevel: (level, role) =>
    api.get(`permissions/target/${role}/${level}`),

  saveLevelPermissions: (targetType, level, permissionIds) =>
    api.post(`/permissions/assign`, { targetType, level, permissionIds }),

  listAllConfigs: () =>
    api.get('/level-permissions'),
};


// export const levelPermissionApi = {
//   // 获取某个等级拥有的所有权限 ID 列表
//   getPermissionsByLevel: (level: number) =>
//     api.get<number[]>(`/level-permissions/${level}`),

//   // 保存某个等级的权限（通常是全量覆盖：先删后增）
//   saveLevelPermissions: (level: number, permissionIds: number[]) =>
//     api.post(`/level-permissions/${level}`, { permissionIds }),

//   // 如果需要获取所有等级的配置概览
//   listAllConfigs: () =>
//     api.get('/level-permissions'),
// };



export type RoleType = 'guest' | 'member' | 'admin';

export const rolePermissionApi = {
  // 获取某个角色拥有的权限 ID 列表
  getPermissionsByRole: (role: targetType,level:RoleType) =>
    api.get<number[]>(`/permissions/target/${role}/${level}`),

  // 保存某个角色的权限配置
  saveRolePermissions: (role: targetType,level:RoleType, permissionIds: number[]) =>
      api.post(`/permissions/assign`, { role, level, permissionIds }),
};