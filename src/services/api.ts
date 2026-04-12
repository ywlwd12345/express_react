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