import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

console.log('🚀 [Index] React 应用开始初始化');

// 确保DOM完全加载
const initApp = () => {
  const container = document.getElementById('root');
  console.log('📦 [Index] 找到容器元素:', container);

  if (!container) {
    console.error('❌ [Index] 未找到 root 容器元素!');
    return;
  }

  try {
    const root = createRoot(container);
    console.log('✅ [Index] React Root 创建成功');

    root.render(<App />);
    console.log('🎨 [Index] App 组件渲染完成');
  } catch (error) {
    console.error('❌ [Index] 渲染失败:', error);
    // 显示错误信息
    container.innerHTML = `
      <div style="padding: 20px; color: #ff4d4f; background: #0a0a0a; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <h2>应用启动失败</h2>
        <p>${error.message}</p>
        <pre style="background: #141414; padding: 10px; border-radius: 4px; margin-top: 10px;">${error.stack}</pre>
      </div>
    `;
  }
};

// 确保DOM加载完成后再初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
