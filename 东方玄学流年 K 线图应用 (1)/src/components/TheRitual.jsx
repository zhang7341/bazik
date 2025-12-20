import React, { useEffect, useState } from 'react';
    import { motion } from 'framer-motion';

    const mantras = [
      "正在校对真太阳时...",
			"正在估计耗时...",
			"预计耗时80秒，请耐心等待...",
      "正在推演十年大运...",
      "正在连接紫微星垣...",
      "正在解析流年吉凶...",
      "正在生成人生 K 线...",
      "正在排布十二宫位...",
      "正在平衡五行能量...",
      "正在演算先天八卦...",
      "正在定位财帛机缘...",
      "正在测算红鸾星动...",
      "正在回溯前世因果...",
      "正在推导官禄运势...",
      "正在拨开命运迷雾...",
      "正在感应天道气机...",
      "好像有点卡...",		
      "别慌正在检查...",
      "发现问题...",
      "大模型太慢了...",
      "正在下载天机秘钥..."
    ];


    const TheRitual = ({ onFinish, isReady }) => {
      const [progress, setProgress] = useState(0);
      const [mantraIndex, setMantraIndex] = useState(0);

  useEffect(() => {
    // 随机生成 50s - 80s 的假进度时长
    const targetDuration = Math.floor(Math.random() * 30000) + 50000;
    console.log(`🔮 预计加载动画时长: ${targetDuration / 1000}秒`);
    
    let startTime = Date.now();
    let animationFrameId;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      // 计算理论进度，最大 99%
      let nextProgress = (elapsed / targetDuration) * 99;
      
      if (nextProgress >= 99) nextProgress = 99;
      
      setProgress(prev => {
        // 如果已经完成（100），就不再回退
        if (prev >= 100) return 100;
        // 确保进度单调递增
        return Math.max(prev, nextProgress);
      });

      if (nextProgress < 99) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

      // 监听 isReady 信号
      useEffect(() => {
        if (isReady) {
          // 数据已就绪，直接跳到 100%
          setProgress(100);
          const finishTimer = setTimeout(onFinish, 800); // 100% 后停留一小会儿
          return () => clearTimeout(finishTimer);
        }
      }, [isReady, onFinish]);

      useEffect(() => {
        const interval = setInterval(() => {
          setMantraIndex(prev => (prev + 1) % mantras.length);
        }, 1500);
        return () => clearInterval(interval);
      }, []);

      return (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 1 }}
        >
          {/* 背景层 */}
          <div className="absolute inset-0 bg-[#050508] z-0">
            <div className="absolute inset-0 bg-void-gradient opacity-80"></div>
          </div>

          {/* 核心动画容器 */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* 神秘符号动画 */}
            <div className="relative w-48 h-48 mb-16">
              {/* 外圈光环 */}
              <div className="absolute inset-0 border border-mystic-gold/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-0 border-t border-mystic-gold/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
              
              {/* 内圈 */}
              <div className="absolute inset-8 border border-mystic-accent/20 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
              <div className="absolute inset-8 border-b border-mystic-accent/40 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>

              {/* 中心太极/核心 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <span className="text-5xl text-mystic-gold animate-pulse drop-shadow-[0_0_15px_rgba(230,194,120,0.6)]">☯</span>
                  <div className="absolute inset-0 bg-mystic-gold/20 blur-xl animate-pulse"></div>
                </div>
              </div>
              
              {/* 粒子装饰 (模拟) */}
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-mystic-gold rounded-full shadow-[0_0_10px_#fff] animate-float"></div>
              <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-mystic-accent rounded-full shadow-[0_0_10px_#fff] animate-float" style={{animationDelay: '1s'}}></div>
            </div>

            {/* 进度条 */}
            <div className="w-80 h-[2px] bg-white/5 rounded-full overflow-hidden mb-8 relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-mystic-gold via-white to-mystic-gold shadow-[0_0_15px_#D4AF37]"
                style={{ width: `${progress}%` }}
                transition={{ type: 'tween', ease: 'linear' }}
              />
              {/* 进度光点 */}
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff] z-10"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* 轮播文案 */}
            <div className="h-12 overflow-hidden relative w-full text-center">
               <motion.p 
                 key={mantraIndex}
                 initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                 animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                 exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                 className="text-mystic-gold/90 font-serif tracking-[0.3em] text-base drop-shadow-md"
               >
                 {mantras[mantraIndex]}
               </motion.p>
            </div>
            
            <div className="mt-4 text-mystic-muted/60 text-xs font-serif tracking-widest">
              正在推演命运矩阵... {Math.floor(progress)}%
            </div>
          </div>
        </motion.div>
      );
    };

    export default TheRitual;
