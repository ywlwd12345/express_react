// src/router/index.tsx

import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { AuthGuard } from '@/components/AuthGuard';
import Dashboard from '@/pages/Dashboard';
import UserList from '@/pages/UserList';
import Login from '@/pages/Login';
import PermissionManager from '@/pages/PermissionManager';
import LevelPermissionManager from '@/pages/LevelPermissionManager';
import RolePermissionManager from '@/pages/RolePermissionManager';

export const router = createBrowserRouter([

    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <MainLayout />
            </AuthGuard>
        ),
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'users',
                element: (
                    <AuthGuard roles={['admin']}>
                        <UserList />
                    </AuthGuard>
                ),
            },

            {
                path: 'PermissionManager',
                element: (
                    <AuthGuard roles={['admin']}>
                        <PermissionManager />
                    </AuthGuard>
                ),
            },


            {
                path: 'LevelPermissionManager',
                element: (
                    <AuthGuard roles={['admin']}>
                        <LevelPermissionManager />
                    </AuthGuard>
                ),
            },


            
            {
                path: 'RolePermissionManager',
                element: (
                    <AuthGuard roles={['admin']}>
                        <RolePermissionManager />
                    </AuthGuard>
                ),
            },


            {
                path: '',
                element: <Navigate to="/dashboard" replace />,
            }
        ],
    },
]);