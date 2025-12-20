import React from 'react';

const ErrorFallback = ({ error, resetError, componentName = '组件' }) => {
  const handleCopyError = () => {
    const errorInfo = `
错误组件: ${componentName}
错误信息: ${error?.message || '未知错误'}
错误堆栈: ${error?.stack || '无堆栈信息'}
时间: ${new Date().toLocaleString()}
用户代理: ${navigator.userAgent}
    `.trim();

    navigator.clipboard.writeText(errorInfo).then(() => {
      alert('错误信息已复制到剪贴板');
    }).catch(() => {
      console.log('复制失败，错误信息：', errorInfo);
    });
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="error-fallback">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        
        <div className="error-header">
          <h2 className="error-title">{componentName}渲染出错</h2>
          <p className="error-subtitle">抱歉，遇到了一个意外的错误</p>
        </div>

        <div className="error-details">
          <div className="error-message">
            <strong>错误信息：</strong>
            <code>{error?.message || '未知错误'}</code>
          </div>
          
          {error?.stack && (
            <details className="error-stack">
              <summary>查看详细错误信息</summary>
              <pre className="stack-trace">{error.stack}</pre>
            </details>
          )}
        </div>

        <div className="error-actions">
          {resetError && (
            <button onClick={resetError} className="action-btn primary">
              重试
            </button>
          )}
          
          <button onClick={handleReload} className="action-btn secondary">
            刷新页面
          </button>
          
          <button onClick={handleCopyError} className="action-btn tertiary">
            复制错误信息
          </button>
        </div>

        <div className="error-tips">
          <h4>可能的解决方案：</h4>
          <ul>
            <li>刷新页面重新加载</li>
            <li>检查网络连接是否正常</li>
            <li>清除浏览器缓存后重试</li>
            <li>如果问题持续，请联系技术支持</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 高阶组件：为任何组件添加错误边界
export const withErrorBoundary = (WrappedComponent, componentName) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error(`[${componentName}] 组件错误:`, error, errorInfo);
      
      // 可以在这里添加错误上报逻辑
      // reportError(error, errorInfo, componentName);
    }

    render() {
      if (this.state.hasError) {
        return (
          <ErrorFallback
            error={this.state.error}
            resetError={() => this.setState({ hasError: false, error: null })}
            componentName={componentName}
          />
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

// Hook：在函数组件中使用错误边界
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error) => {
    console.error('捕获到错误:', error);
    setError(error);
  }, []);

  // 监听未捕获的Promise错误
  React.useEffect(() => {
    const handleUnhandledRejection = (event) => {
      handleError(new Error(`未处理的Promise错误: ${event.reason}`));
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleError]);

  return {
    error,
    resetError,
    handleError
  };
};

export default ErrorFallback;