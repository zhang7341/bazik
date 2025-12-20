import React, { useMemo } from 'react';

const DataSummary = ({ data }) => {
  // 安全获取数据
  const timeline = data?.timeline || [];

  // 计算详细统计信息
  const analytics = useMemo(() => {
    if (!timeline.length) return null;

    const currentYear = new Date().getFullYear();
    let currentAge = null;
    let currentIndex = -1;
    
    // 基础统计
    let upCount = 0;
    let downCount = 0;
    let totalHigh = 0;
    let totalLow = 0;
    let maxHigh = 0;
    let minLow = 100;
    let maxHighAge = null;
    let minLowAge = null;
    
    // 事件统计
    let highEventCount = 0;
    let lowEventCount = 0;
    
    // 年龄段统计
    const ageGroups = {
      youth: { count: 0, upCount: 0, range: '1-18岁' },
      young: { count: 0, upCount: 0, range: '19-35岁' },
      middle: { count: 0, upCount: 0, range: '36-55岁' },
      senior: { count: 0, upCount: 0, range: '56岁以上' }
    };

    timeline.forEach((item, index) => {
      const age = Number(item.age);
      const open = Number(item.open) || 50;
      const close = Number(item.close) || 50;
      const high = Number(item.high) || 55;
      const low = Number(item.low) || 45;
      const isUp = close >= open;

      // 当前年龄
      if (item.year === currentYear) {
        currentAge = age;
        currentIndex = index;
      }

      // 趋势统计
      if (isUp) upCount++;
      else downCount++;

      // 极值统计
      totalHigh += high;
      totalLow += low;
      
      if (high > maxHigh) {
        maxHigh = high;
        maxHighAge = age;
      }
      if (low < minLow) {
        minLow = low;
        minLowAge = age;
      }

      // 事件统计
      if (item.higheventdesc || item.high_event_desc) highEventCount++;
      if (item.loweventdesc || item.low_event_desc) lowEventCount++;

      // 年龄段统计
      let group;
      if (age <= 18) group = 'youth';
      else if (age <= 35) group = 'young';
      else if (age <= 55) group = 'middle';
      else group = 'senior';

      ageGroups[group].count++;
      if (isUp) ageGroups[group].upCount++;
    });

    // 计算平均值和比例
    const avgHigh = Math.round(totalHigh / timeline.length);
    const avgLow = Math.round(totalLow / timeline.length);
    const upRate = Math.round((upCount / timeline.length) * 100);
    
    // 计算各年龄段上扬率
    Object.keys(ageGroups).forEach(key => {
      const group = ageGroups[key];
      group.upRate = group.count > 0 ? Math.round((group.upCount / group.count) * 100) : 0;
    });

    // 趋势分析
    let trendAnalysis = '';
    if (upRate >= 70) trendAnalysis = '整体运势强劲上扬';
    else if (upRate >= 55) trendAnalysis = '整体运势偏向积极';
    else if (upRate >= 45) trendAnalysis = '整体运势相对平衡';
    else if (upRate >= 30) trendAnalysis = '整体运势偏向谨慎';
    else trendAnalysis = '整体运势需要关注';

    return {
      total: timeline.length,
      upCount,
      downCount,
      upRate,
      maxHigh,
      minLow,
      maxHighAge,
      minLowAge,
      avgHigh,
      avgLow,
      volatility: maxHigh - minLow,
      highEventCount,
      lowEventCount,
      currentAge,
      currentIndex,
      ageGroups,
      trendAnalysis
    };
  }, [timeline]);

  if (!timeline.length || !analytics) {
    return (
      <div className="data-summary-empty">
        <div className="empty-icon">📈</div>
        <div className="empty-text">暂无概览数据</div>
      </div>
    );
  }

  return (
    <div className="data-summary">
      {/* 核心指标 */}
      <div className="summary-section">
        <h3 className="section-title">核心指标</h3>
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-value">{analytics.total}</div>
            <div className="metric-label">数据点数</div>
          </div>
          <div className="metric-card success">
            <div className="metric-value">{analytics.upRate}%</div>
            <div className="metric-label">上扬比例</div>
          </div>
          <div className="metric-card info">
            <div className="metric-value">{analytics.currentAge || '-'}</div>
            <div className="metric-label">当前年龄</div>
          </div>
          <div className="metric-card warning">
            <div className="metric-value">{analytics.volatility}</div>
            <div className="metric-label">波动范围</div>
          </div>
        </div>
      </div>

      {/* 趋势分析 */}
      <div className="summary-section">
        <h3 className="section-title">趋势分析</h3>
        <div className="trend-analysis">
          <div className="trend-summary">
            <div className="trend-text">{analytics.trendAnalysis}</div>
            <div className="trend-details">
              上扬 {analytics.upCount} 次，下行 {analytics.downCount} 次
            </div>
          </div>
          <div className="trend-chart">
            <div className="trend-bar">
              <div 
                className="trend-fill up" 
                style={{ width: `${analytics.upRate}%` }}
              ></div>
              <div 
                className="trend-fill down" 
                style={{ width: `${100 - analytics.upRate}%` }}
              ></div>
            </div>
            <div className="trend-labels">
              <span className="up-label">上扬 {analytics.upRate}%</span>
              <span className="down-label">下行 {100 - analytics.upRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 极值统计 */}
      <div className="summary-section">
        <h3 className="section-title">极值统计</h3>
        <div className="extremes-grid">
          <div className="extreme-card high">
            <div className="extreme-icon">📈</div>
            <div className="extreme-content">
              <div className="extreme-value">{analytics.maxHigh}</div>
              <div className="extreme-label">历史最高</div>
              <div className="extreme-age">{analytics.maxHighAge}岁时达到</div>
            </div>
          </div>
          <div className="extreme-card low">
            <div className="extreme-icon">📉</div>
            <div className="extreme-content">
              <div className="extreme-value">{analytics.minLow}</div>
              <div className="extreme-label">历史最低</div>
              <div className="extreme-age">{analytics.minLowAge}岁时达到</div>
            </div>
          </div>
          <div className="extreme-card avg">
            <div className="extreme-icon">📊</div>
            <div className="extreme-content">
              <div className="extreme-value">{analytics.avgHigh}</div>
              <div className="extreme-label">平均最高</div>
              <div className="extreme-age">整体水平</div>
            </div>
          </div>
          <div className="extreme-card avg">
            <div className="extreme-icon">📊</div>
            <div className="extreme-content">
              <div className="extreme-value">{analytics.avgLow}</div>
              <div className="extreme-label">平均最低</div>
              <div className="extreme-age">整体水平</div>
            </div>
          </div>
        </div>
      </div>

      {/* 年龄段分析 */}
      <div className="summary-section">
        <h3 className="section-title">年龄段分析</h3>
        <div className="age-groups">
          {Object.entries(analytics.ageGroups).map(([key, group]) => (
            group.count > 0 && (
              <div key={key} className="age-group-card">
                <div className="age-group-header">
                  <div className="age-group-range">{group.range}</div>
                  <div className="age-group-count">{group.count} 个数据点</div>
                </div>
                <div className="age-group-stats">
                  <div className="age-group-rate">
                    上扬率: <span className={group.upRate >= 50 ? 'positive' : 'negative'}>
                      {group.upRate}%
                    </span>
                  </div>
                  <div className="age-group-bar">
                    <div 
                      className="age-group-fill" 
                      style={{ width: `${group.upRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* 特殊事件统计 */}
      {(analytics.highEventCount > 0 || analytics.lowEventCount > 0) && (
        <div className="summary-section">
          <h3 className="section-title">特殊事件</h3>
          <div className="events-summary">
            {analytics.highEventCount > 0 && (
              <div className="event-stat high">
                <div className="event-icon">🔥</div>
                <div className="event-content">
                  <div className="event-count">{analytics.highEventCount}</div>
                  <div className="event-label">高光时刻</div>
                </div>
              </div>
            )}
            {analytics.lowEventCount > 0 && (
              <div className="event-stat low">
                <div className="event-icon">💧</div>
                <div className="event-content">
                  <div className="event-count">{analytics.lowEventCount}</div>
                  <div className="event-label">低谷时期</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSummary;