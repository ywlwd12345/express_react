// src/layouts/MainLayout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { menuConfig } from '../config/menuConfig';
import { useUserStore } from '../store/useUserStore';

const MainLayout: React.FC = () => {
    const { roles, logout } = useUserStore();
    const navigate = useNavigate();

    // 过滤当前用户能看到的菜单
    // const authorizedMenu = menuConfig.filter(item =>
    //     !item.roles || item.roles.some(r => roles.includes(r))
    // );

    const authorizedMenu = menuConfig

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ width: 240, background: '#f0f2f5' }}>
                <ul>
                    {authorizedMenu.map(item => (
                        <li key={item.path}>
                            <Link to={item.path}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
                <button onClick={() => { logout(); navigate('/login'); }}>退出登录</button>
            </aside>
            <main style={{ flex: 1, padding: 20 }}>
                <Outlet /> {/* 这里渲染子路由页面 */}
            </main>
        </div>
    );
};

export default MainLayout;