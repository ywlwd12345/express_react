// src/App.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // 引入我们刚才定义的路由配置文件

const App: React.FC = () => {
  return (
    <React.StrictMode>
      {/* RouterProvider 是路由的入口，它负责监听 URL 变化并渲染对应的组件 */}
      <RouterProvider router={router} />
    </React.StrictMode>
  );
  
};

export default App;