import React, { useState, useMemo, useRef, useEffect } from 'react';
const DataChart = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollContainerRef = useRef(null);

  // 安全获取数据
  const timeline = data?.timeline || [];

  // 计算所有有批注的关键年份索引
  const annotatedIndices = useMemo(() => {
    return timeline.reduce((acc, item, index) => {
      const hasAnnotation = item.summary || item.detailstory || item.higheventdesc || item.loweventdesc || item.high_event_desc || item.low_event_desc;
      if (hasAnnotation) {
        acc.push(index);
      }
      return acc;
    }, []);
  }, [timeline]);

  // 计算导航目标
  const prevAnnotatedIndex = useMemo(() => {
    // 找小于当前索引的最大值（最近的上一个）
    for (let i = annotatedIndices.length - 1; i >= 0; i--) {
      if (annotatedIndices[i] < selectedIndex) return annotatedIndices[i];
    }
    return -1;
  }, [selectedIndex, annotatedIndices]);

  const nextAnnotatedIndex = useMemo(() => {
    // 找大于当前索引的最小值（最近的下一个）
    for (let i = 0; i < annotatedIndices.length; i++) {
      if (annotatedIndices[i] > selectedIndex) return annotatedIndices[i];
    }
    return -1;
  }, [selectedIndex, annotatedIndices]);

  // 初始化默认选中第一个有批注的年份
  useEffect(() => {
    if (annotatedIndices.length > 0) {
      setSelectedIndex(annotatedIndices[0]);
    } else if (timeline.length > 0) {
      setSelectedIndex(0);
    }
  }, [annotatedIndices, timeline]);

  // 监听容器宽度
  useEffect(() => {
    const updateWidth = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
      }
    };

    // 初始延迟一下确保布局完成
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, []);
  
  // 计算统计信息
  const stats = useMemo(() => {
    if (!timeline.length) return null;
    
    const currentYear = new Date().getFullYear();
    let currentAge = null;
    let upCount = 0;
    let downCount = 0;
    let maxHigh = 0;
    let minLow = 100;
    
    timeline.forEach(item => {
      if (item.year === currentYear) currentAge = item.age;
      const open = Number(item.open) || 50;
      const close = Number(item.close) || 50;
      const high = Number(item.high) || 55;
      const low = Number(item.low) || 45;
      
      if (close >= open) upCount++;
      else downCount++;
      
      maxHigh = Math.max(maxHigh, high);
      minLow = Math.min(minLow, low);
    });
    
    // 稍微扩大范围，让图表更好看
    maxHigh = Math.min(100, maxHigh + 5);
    minLow = Math.max(0, minLow - 5);
    
    return {
      total: timeline.length,
      upCount,
      downCount,
      upRate: Math.round((upCount / timeline.length) * 100),
      maxHigh,
      minLow,
      currentAge
    };
  }, [timeline]);

  // 自动滚动到选中项 (仅在非紧凑模式下需要)
  useEffect(() => {
    if (scrollContainerRef.current && chartConfig.itemWidth > 20) {
      const container = scrollContainerRef.current;
      const targetScroll = selectedIndex * chartConfig.itemWidth - container.clientWidth / 2 + chartConfig.itemWidth / 2;
      
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  if (!timeline.length) {
    return (
      <div className="data-chart-empty">
        <div className="empty-icon">📊</div>
        <div className="empty-text">暂无数据显示</div>
        <div className="empty-desc">请检查数据源或重新生成</div>
      </div>
    );
  }

  const currentItem = timeline[selectedIndex] || timeline[0];

  // 动态计算图表配置
  const chartConfig = useMemo(() => {
    const totalItems = timeline.length || 1;
    // 预留一点边距
    const availableWidth = containerWidth > 0 ? containerWidth - 20 : 1000;
    
    // 计算自适应宽度：优先尝试在一屏内放下
    // 设定最小宽度为 6px，防止过密无法点击
    const calculatedItemWidth = Math.max(6, availableWidth / totalItems);
    
    // 蜡烛宽度占 itemWidth 的 70%，但至少 1px
    const candleWidth = Math.max(1, calculatedItemWidth * 0.7);

    return {
      height: 280,
      itemWidth: calculatedItemWidth,
      candleWidth: candleWidth,
      padding: { top: 20, bottom: 40 },
      // 根据宽度决定标签显示频率，避免重叠
      labelInterval: Math.ceil(40 / calculatedItemWidth)
    };
  }, [containerWidth, timeline.length]);

  // 计算 Y 轴坐标
  const getY = (val) => {
    const range = stats.maxHigh - stats.minLow;
    const percent = (val - stats.minLow) / range;
    // SVG 坐标系 Y 轴向下，所以要反转
    return chartConfig.height - chartConfig.padding.bottom - percent * (chartConfig.height - chartConfig.padding.top - chartConfig.padding.bottom);
  };

  return (
    <div className="data-chart">
      {/* 视图切换 - 简化为标题展示 */}
      <div className="view-controls justify-center border-b-0 bg-transparent">
        <div className="text-mystic-gold text-xl md:text-2xl font-serif tracking-widest drop-shadow-glow py-2">
          {data?.destiny_title || "流年运势 K线图"}
        </div>
      </div>

      {/* 图表视图 */}
      <div className="chart-view">
        {/* SVG K线图容器 */}
        <div className="svg-chart-container" ref={scrollContainerRef}>
            <svg 
              height={chartConfig.height} 
              width={timeline.length * chartConfig.itemWidth + 20}
              className="kline-svg"
            >
              <defs>
                {/* 发光滤镜 */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* 批注背景光柱渐变 */}
                <linearGradient id="annotation-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(230, 194, 120, 0.0)" />
                  <stop offset="20%" stopColor="rgba(230, 194, 120, 0.05)" />
                  <stop offset="80%" stopColor="rgba(230, 194, 120, 0.05)" />
                  <stop offset="100%" stopColor="rgba(230, 194, 120, 0.0)" />
                </linearGradient>
              </defs>

              {/* 背景网格线 */}
              <line x1="0" y1={getY(50)} x2="100%" y2={getY(50)} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
              <line x1="0" y1={getY(80)} x2="100%" y2={getY(80)} stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1={getY(20)} x2="100%" y2={getY(20)} stroke="rgba(255,255,255,0.05)" />

              {timeline.map((item, index) => {
                const x = index * chartConfig.itemWidth + chartConfig.itemWidth / 2;
                const openY = getY(item.open);
                const closeY = getY(item.close);
                const highY = getY(item.high);
                const lowY = getY(item.low);
                const isUp = item.close >= item.open;
                const color = isUp ? '#ff6b6b' : '#4ecdc4'; // 阳线红，阴线青
                const isSelected = index === selectedIndex;
                const isCurrent = item.age === stats.currentAge;
                
                // 判断是否有详细批注
                const hasAnnotation = item.summary || item.detailstory || item.higheventdesc || item.loweventdesc || item.high_event_desc || item.low_event_desc;
                
                // 视觉淡化逻辑：如果不是选中、不是当前、没有批注，则淡化
                const opacity = (isSelected || isCurrent || hasAnnotation) ? 1 : 0.4;

                return (
                  <g 
                    key={index} 
                    onClick={() => setSelectedIndex(index)}
                    className={`kline-group ${isSelected ? 'selected' : ''} ${hasAnnotation ? 'has-annotation' : ''}`}
                    style={{ cursor: 'pointer', opacity }}
                  >
                    {/* 选中背景高亮 */}
                    {isSelected && (
                      <rect 
                        x={index * chartConfig.itemWidth} 
                        y="0" 
                        width={chartConfig.itemWidth} 
                        height={chartConfig.height} 
                        fill="rgba(255,255,255,0.05)" 
                      />
                    )}

                    {/* 有批注的年份背景光柱 */}
                    {hasAnnotation && !isSelected && (
                      <rect 
                        x={index * chartConfig.itemWidth} 
                        y="10" 
                        width={chartConfig.itemWidth} 
                        height={chartConfig.height - 20} 
                        fill="url(#annotation-gradient)" 
                        opacity="0.6"
                      />
                    )}

                    {/* 当前年龄标记线 */}
                    {isCurrent && (
                      <line 
                        x1={x} y1="0" x2={x} y2={chartConfig.height} 
                        stroke="#e6c278" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" 
                      />
                    )}

                    {/* 影线 (High - Low) */}
                    <line 
                      x1={x} y1={highY} x2={x} y2={lowY} 
                      stroke={color} strokeWidth="1" 
                      filter={hasAnnotation ? "url(#glow)" : ""}
                    />

                    {/* 实体 (Open - Close) */}
                    <rect 
                      x={x - chartConfig.candleWidth / 2} 
                      y={Math.min(openY, closeY)} 
                      width={chartConfig.candleWidth} 
                      height={Math.max(1, Math.abs(closeY - openY))} 
                      fill={color} 
                      rx="1"
                      filter={hasAnnotation ? "url(#glow)" : ""}
                    />

                    {/* 有批注的年份底部标记点 */}
                    {hasAnnotation && (
                      <circle 
                        cx={x} 
                        cy={chartConfig.height - 25} 
                        r={isSelected ? 2.5 : 1.5} 
                        fill="#e6c278"
                        className="annotation-dot"
                      />
                    )}

                    {/* 年龄标签 (每5年显示一次，或者是选中项/当前项/有批注项) */}
                    {(index % 5 === 0 || isSelected || isCurrent || hasAnnotation) && (
                      <text 
                        x={x} 
                        y={chartConfig.height - 10} 
                        textAnchor="middle" 
                        fill={isSelected || hasAnnotation ? '#e6c278' : 'rgba(255,255,255,0.4)'}
                        fontSize="10"
                        fontWeight={isSelected || hasAnnotation ? "bold" : "normal"}
                      >
                        {item.age}
                      </text>
                    )}
                    
                    {/* 交互热区 */}
                    <rect 
                      x={index * chartConfig.itemWidth} 
                      y="0" 
                      width={chartConfig.itemWidth} 
                      height={chartConfig.height} 
                      fill="transparent" 
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 详情面板 */}
          <div className="detail-panel">
            <div className="detail-header-row">
              <div className="detail-main-info">
                <div className="detail-year-badge">{currentItem.year}年</div>
                <div className="detail-age-badge">{currentItem.age}岁</div>
                <div className="detail-ganzhi-badge">{currentItem.ganzhi}</div>
              </div>
              
              <div className="detail-nav-controls">
                <button
                  onClick={() => prevAnnotatedIndex !== -1 && setSelectedIndex(prevAnnotatedIndex)}
                  disabled={prevAnnotatedIndex === -1}
                  className="mini-nav-btn"
                  title="上一个关键年份"
                >
                  ←
                </button>
                <button
                  onClick={() => nextAnnotatedIndex !== -1 && setSelectedIndex(nextAnnotatedIndex)}
                  disabled={nextAnnotatedIndex === -1}
                  className="mini-nav-btn"
                  title="下一个关键年份"
                >
                  →
                </button>
              </div>
            </div>

            <div className="detail-content-grid">
              {/* 左侧：数值卡片 */}
              <div className="detail-metrics-card">
                <div className={`trend-indicator ${currentItem.close >= currentItem.open ? 'up' : 'down'}`}>
                  {currentItem.close >= currentItem.open ? '📈 运势上扬' : '📉 运势下行'}
                </div>
                <div className="kline-grid">
                  <div className="kline-cell">
                    <span className="label">开盘</span>
                    <span className="value">{currentItem.open}</span>
                  </div>
                  <div className="kline-cell">
                    <span className="label">收盘</span>
                    <span className="value">{currentItem.close}</span>
                  </div>
                  <div className="kline-cell">
                    <span className="label">最高</span>
                    <span className="value high">{currentItem.high}</span>
                  </div>
                  <div className="kline-cell">
                    <span className="label">最低</span>
                    <span className="value low">{currentItem.low}</span>
                  </div>
                </div>
              </div>

              {/* 右侧：文本详情 */}
              <div className="detail-text-card">
                {currentItem.summary && (
                  <div className="detail-section">
                    <h4>📜 流年批注</h4>
                    <p>{currentItem.summary}</p>
                  </div>
                )}
                
                {currentItem.detailstory && (
                  <div className="detail-section">
                    <h4>🔮 详细解读</h4>
                    <div className="detail-story-container">
                      <p className="detail-story">{currentItem.detailstory}</p>
                    </div>
                  </div>
                )}

                {/* 事件标签 */}
                <div className="detail-events-row">
                  {(currentItem.higheventdesc || currentItem.high_event_desc) && (
                    <div className="event-pill high">
                      <span className="icon">🔥</span>
                      <span className="text">{currentItem.higheventdesc || currentItem.high_event_desc}</span>
                    </div>
                  )}
                  {(currentItem.loweventdesc || currentItem.low_event_desc) && (
                    <div className="event-pill low">
                      <span className="icon">💧</span>
                      <span className="text">{currentItem.loweventdesc || currentItem.low_event_desc}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

    </div>
  );
};

export default DataChart;