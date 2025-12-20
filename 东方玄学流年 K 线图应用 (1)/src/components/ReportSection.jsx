import React, { useState, useEffect } from 'react';

const ReportSection = ({ report, isLoading }) => {
  const [renderedContent, setRenderedContent] = useState('');

  // 简单的 Markdown 渲染器
  const renderMarkdown = (markdown) => {
    if (!markdown || typeof markdown !== 'string') return '';

    // 清理调试内容和思考过程
    let cleanMarkdown = markdown
      // 增强版清理：移除 <details> 标签及其内容，支持带属性的情况
      .replace(/<details\b[^>]*>[\s\S]*?<\/details>/gi, '')
      // 移除可能存在的 <think> 标签
      .replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, '')
      .replace(/Thinking\.\.\./g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // 逐行处理以避免复杂的正则问题
    let html = cleanMarkdown
      // 标题
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 引用
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 列表
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>');

    // 处理段落：将双换行视为段落分隔
    html = html.split('\n\n').map(para => {
      para = para.trim();
      if (!para) return '';
      // 如果已经是 HTML 标签开头（如 h1, li, blockquote），则不包裹 p 标签
      if (para.match(/^<(h\d|li|blockquote)/)) {
        return para;
      }
      // 普通文本包裹 p 标签，并将内部换行转为 br
      return `<p>${para.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    return html;
  };

  useEffect(() => {
    if (report) {
      setRenderedContent(renderMarkdown(report));
    }
  }, [report]);

  if (isLoading) {
    return (
      <div className="report-section loading">
        <div className="report-header">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-mystic-gold border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-serif text-mystic-gold tracking-widest">
              天机解析中...
            </h2>
          </div>
        </div>
        <div className="report-content">
          <div className="space-y-3">
            <div className="h-4 bg-mystic-gold/20 rounded animate-pulse"></div>
            <div className="h-4 bg-mystic-gold/20 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-mystic-gold/20 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-section">
      <div className="report-header">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif text-mystic-gold tracking-widest">
            📜 运势分析报告
          </h2>
        </div>
      </div>

      <div className="report-content">
        {report ? (
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        ) : (
          <div className="empty-state">
            <p>暂无详细分析</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReportSection;