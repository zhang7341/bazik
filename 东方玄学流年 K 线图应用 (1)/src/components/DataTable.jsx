import React, { useState, useMemo } from 'react';

const DataTable = ({ data }) => {
  const [sortField, setSortField] = useState('age');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterText, setFilterText] = useState('');

  // 安全获取数据
  const timeline = data?.timeline || [];

  // 排序和筛选数据
  const processedData = useMemo(() => {
    let filtered = timeline;

    // 筛选
    if (filterText) {
      filtered = timeline.filter(item => 
        item.age.toString().includes(filterText) ||
        item.year.toString().includes(filterText) ||
        (item.ganzhi && item.ganzhi.includes(filterText)) ||
        (item.summary && item.summary.includes(filterText))
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // 数字类型排序
      if (['age', 'year', 'open', 'close', 'high', 'low'].includes(sortField)) {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [timeline, sortField, sortDirection, filterText]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (!timeline.length) {
    return (
      <div className="data-table-empty">
        <div className="empty-icon">📋</div>
        <div className="empty-text">暂无表格数据</div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      {/* 工具栏 */}
      <div className="table-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索年龄、年份、干支或摘要..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="table-info">
          显示 {processedData.length} / {timeline.length} 条记录
        </div>
      </div>

      {/* 表格 */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('age')} className="sortable">
                年龄 {getSortIcon('age')}
              </th>
              <th onClick={() => handleSort('year')} className="sortable">
                年份 {getSortIcon('year')}
              </th>
              <th onClick={() => handleSort('ganzhi')} className="sortable">
                干支 {getSortIcon('ganzhi')}
              </th>
              <th onClick={() => handleSort('open')} className="sortable">
                开盘 {getSortIcon('open')}
              </th>
              <th onClick={() => handleSort('close')} className="sortable">
                收盘 {getSortIcon('close')}
              </th>
              <th onClick={() => handleSort('high')} className="sortable">
                最高 {getSortIcon('high')}
              </th>
              <th onClick={() => handleSort('low')} className="sortable">
                最低 {getSortIcon('low')}
              </th>
              <th>趋势</th>
              <th>摘要</th>
              <th>特殊事件</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, index) => {
              const isUp = Number(item.close) >= Number(item.open);
              const currentYear = new Date().getFullYear();
              const isCurrent = item.year === currentYear;
              
              return (
                <tr 
                  key={`${item.age}-${item.year}`}
                  className={`table-row ${isCurrent ? 'current-row' : ''} ${isUp ? 'up-row' : 'down-row'}`}
                >
                  <td className="age-cell">
                    {item.age}
                    {isCurrent && <span className="current-badge">当前</span>}
                  </td>
                  <td className="year-cell">{item.year}</td>
                  <td className="ganzhi-cell">{item.ganzhi || '-'}</td>
                  <td className="number-cell">{item.open}</td>
                  <td className="number-cell">{item.close}</td>
                  <td className="number-cell high-value">{item.high}</td>
                  <td className="number-cell low-value">{item.low}</td>
                  <td className={`trend-cell ${isUp ? 'up' : 'down'}`}>
                    <span className="trend-icon">{isUp ? '↑' : '↓'}</span>
                    <span className="trend-text">{isUp ? '上扬' : '下行'}</span>
                  </td>
                  <td className="summary-cell" title={item.summary}>
                    {item.summary ? (
                      <div className="summary-content">
                        {item.summary.length > 30 
                          ? item.summary.substring(0, 30) + '...' 
                          : item.summary
                        }
                      </div>
                    ) : '-'}
                  </td>
                  <td className="events-cell">
                    <div className="events-list">
                      {(item.higheventdesc || item.high_event_desc) && (
                        <span className="event-tag high-event" title={item.higheventdesc || item.high_event_desc}>
                          🔥 高光
                        </span>
                      )}
                      {(item.loweventdesc || item.low_event_desc) && (
                        <span className="event-tag low-event" title={item.loweventdesc || item.low_event_desc}>
                          💧 低谷
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 无搜索结果 */}
      {processedData.length === 0 && filterText && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <div className="no-results-text">未找到匹配的记录</div>
          <button 
            onClick={() => setFilterText('')}
            className="clear-filter-btn"
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;