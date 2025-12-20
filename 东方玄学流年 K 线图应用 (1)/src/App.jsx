import React, { useState, useCallback } from 'react';
import InputLayer from './components/InputLayer';
import TheRitual from './components/TheRitual';
import DataChart from './components/DataChart';
import ShareModal from './components/ShareModal';
import ReportSection from './components/ReportSection';
import { runLifeKlineAnalysis } from './services/LifeKlineWorkflow';

console.log('📦 [App] 模块加载完成');

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 [ErrorBoundary] 捕获到渲染错误:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>组件渲染出错</h2>
          <p>{this.state.error?.message || '未知错误'}</p>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  console.log('🔄 [App] 组件初始化');
  
  // 简化的状态管理
  const [currentStep, setCurrentStep] = useState('input'); // input, loading, result
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  console.log('📊 [App] 当前状态:', {
    step: currentStep,
    hasChartData: !!chartData,
    hasError: !!error,
    isDataReady
  });

  // 处理用户输入完成
  const handleInputComplete = useCallback(async (birthData) => {
    console.log('🚀 [App] 开始处理用户输入:', birthData);

    // 启动加载状态
    setCurrentStep('loading');
    setError(null);
    setIsDataReady(false);
    setReportData(null);
    setIsReportLoading(true);

    try {
      console.log('📡 [App] 调用 Workflow 分析...');
      const data = await runLifeKlineAnalysis(birthData);
      
      console.log('✅ [App] Workflow 返回数据:', {
        hasTimeline: !!data?.timeline,
        timelineLength: data?.timeline?.length,
        dataKeys: data ? Object.keys(data) : []
      });

      if (data && data.timeline && data.timeline.length > 0) {
        // 检查是否有有效批注
        const hasAnnotation = data.timeline.some(item => 
          item.summary || item.detailstory || item.higheventdesc || item.loweventdesc || item.high_event_desc || item.low_event_desc
        );

        if (!hasAnnotation) {
          console.error('❌ [App] 数据验证失败：无有效批注');
          setError('天机晦涩，未解析到有效批注，请刷新重试');
          setIsDataReady(true);
          setIsReportLoading(false);
          return;
        }

        console.log('✅ [App] 数据验证通过');
        setChartData(data);
        setReportData(data.report);
        setIsDataReady(true);
        setIsReportLoading(false);
        setError(null);
      } else {
        console.error('❌ [App] 数据验证失败');
        setError('数据解析失败：未获取到有效的时间线数据');
        setIsDataReady(true);
        setIsReportLoading(false);
      }
    } catch (err) {
      console.error("❌ [App] Analysis failed", err);
      setError(err.message || "未知错误");
      setIsDataReady(true);
      setIsReportLoading(false);
    }
  }, []);

  // 处理仪式完成
  const handleRitualFinish = useCallback(() => {
    console.log('🎭 [App] TheRitual 完成，切换到结果页面');
    setCurrentStep('result');
  }, []);

  // 重试功能
  const handleRetry = useCallback(() => {
    setCurrentStep('input');
    setChartData(null);
    setError(null);
    setIsDataReady(false);
    setReportData(null);
    setIsReportLoading(false);
  }, []);

  // 分享功能
  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  // 关闭分享弹窗
  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  console.log('🎨 [App] 开始渲染，step:', currentStep);

  return (
    <ErrorBoundary>
      <div className="app-container">
        {currentStep === 'input' && (
          <InputLayer onComplete={handleInputComplete} />
        )}

        {currentStep === 'loading' && (
          <TheRitual isReady={isDataReady} onFinish={handleRitualFinish} />
        )}

        {currentStep === 'result' && (error || !chartData) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in">
            <div className="bg-mystic-bg border border-mystic-gold/30 rounded-2xl p-8 max-w-md w-full text-center shadow-glow mx-4">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl text-mystic-gold font-serif mb-4 tracking-widest">天机难测</h2>
              <p className="text-mystic-muted mb-8 leading-relaxed">{error || '数据获取失败，请重新尝试'}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-3 bg-mystic-gold text-black font-bold rounded-full hover:bg-white transition-colors shadow-lg"
              >
                刷新页面
              </button>
            </div>
          </div>
        )}

        {currentStep === 'result' && chartData && !error && (
          <div className="result-page">

            {/* Header */}
            <header className="app-header">
              <div className="flex items-center gap-3">
                <button onClick={handleRetry} className="retry-btn text-mode" title="新建测试">
                  <span>🔄</span>
                  <span>新建测试</span>
                </button>
                <button onClick={handleShare} className="retry-btn icon-mode" title="分享">
                  📤
                </button>
              </div>
              
              
              <div className="user-info">
                <div>{chartData.birth_year} 年</div>
                <div>当前 {chartData.current_age} 岁</div>
              </div>
            </header>

            {/* Chart Area */}
            <main className="chart-area">
              <ErrorBoundary>
                <DataChart data={chartData} />
              </ErrorBoundary>

              {/* Legend Section */}
              <div className="chart-legend-section">
                <div className="legend">
                  <div className="legend-item">
                    <span className="legend-dot up"></span>
                    <span>阳升</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot down"></span>
                    <span>阴沉</span>
                  </div>
                </div>
              </div>

              {/* Report Section */}
              <ErrorBoundary>
                <ReportSection
                  report={reportData}
                  isLoading={isReportLoading}
                />
              </ErrorBoundary>
            </main>
          </div>
        )}

        {/* 分享弹窗 */}
        <ShareModal
          isOpen={showShareModal}
          onClose={handleCloseShareModal}
          url={window.location.href}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;