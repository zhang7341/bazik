import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const ShareModal = ({ isOpen, onClose, url }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && url) {
      generateQRCode();
    }
  }, [isOpen, url]);

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#D4AF37',
            light: '#1A1A1A'
          }
        });
      }
    } catch (error) {
      console.error('生成二维码失败:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制网址');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in">
      <div className="bg-mystic-bg border border-mystic-gold/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-glow">
        {/* 关闭按钮 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-mystic-muted hover:text-mystic-gold transition-colors text-2xl leading-none"
            title="关闭"
          >
            ×
          </button>
        </div>

        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-xl text-mystic-gold font-serif tracking-widest mb-2">
            分享人生K线图
          </h2>
          <p className="text-mystic-muted text-sm">
            扫码或复制链接分享给朋友
          </p>
        </div>

        {/* 二维码区域 */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <canvas 
              ref={canvasRef}
              className="block"
            />
          </div>
        </div>

        {/* 网址显示区域 */}
        <div className="mb-6">
          <div className="bg-black/30 border border-mystic-gold/20 rounded-lg p-3 mb-3">
            <div className="text-mystic-muted text-sm break-all font-mono">
              {url}
            </div>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="w-full bg-mystic-gold text-black font-bold py-3 px-6 rounded-full hover:bg-white transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {copySuccess ? (
              <>
                <span>✅</span>
                <span>已复制网址</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>复制网址</span>
              </>
            )}
          </button>
        </div>

        {/* 提示文字 */}
        <div className="text-center text-mystic-muted text-xs">
          <p>扫描二维码或复制链接即可分享</p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;