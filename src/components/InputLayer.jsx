import React, { useState } from 'react';
    import { motion } from 'framer-motion';

    const RollerSelect = ({ label, options, value, onChange }) => {
      return (
        <div className="flex flex-col items-center mx-1 md:mx-3">
          <span className="text-mystic-muted/80 text-xs mb-3 font-serif tracking-widest">{label}</span>
          <div className="relative h-36 w-16 md:w-20 overflow-hidden glass-panel-light rounded-xl border border-white/10 group hover:border-mystic-gold/30 transition-all duration-300 shadow-lg">
            {/* 简单的模拟滚轮效果，实际使用原生 select 覆盖以保证兼容性，但视觉上做处理 */}
            <select 
              value={value} 
              onChange={(e) => {
                const val = e.target.value;
                // 如果选项是数字类型，则转换回数字，否则保持字符串
                onChange(typeof options[0] === 'number' ? Number(val) : val);
              }}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            >
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-2xl font-serif text-mystic-gold font-bold drop-shadow-md">
                {typeof value === 'number' && value < 10 ? `0${value}` : value}
              </div>
            </div>
            
            {/* 装饰线 - 增强立体感 */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-mystic-dark/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-mystic-dark/80 to-transparent pointer-events-none" />
            
            {/* 中间高亮线 */}
            <div className="absolute top-1/2 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent -translate-y-5 pointer-events-none" />
            <div className="absolute top-1/2 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent translate-y-5 pointer-events-none" />
          </div>
        </div>
      );
    };

    const InputLayer = ({ onComplete }) => {
      const currentYear = new Date().getFullYear();
      const [year, setYear] = useState(1995);
      const [month, setMonth] = useState(6);
      const [day, setDay] = useState(15);
      const [hour, setHour] = useState(12);
      const [minute, setMinute] = useState(0);
      const [gender, setGender] = useState('男');
      const [topic, setTopic] = useState('整体命运格局');
      const [showOptions, setShowOptions] = useState(false);

      const predefinedTopics = ['爱情婚姻', '学业事业', '地位财富', '性格天赋', '健康寿命'];

      const years = Array.from({ length: 80 }, (_, i) => currentYear - i);
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const days = Array.from({ length: 31 }, (_, i) => i + 1);
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const minutes = Array.from({ length: 60 }, (_, i) => i);
      const genders = ['男', '女'];

      const handleSubmit = () => {
        onComplete({ year, month, day, hour, minute, gender, topic });
      };

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center min-h-screen p-6 relative z-20"
        >
          {/* 装饰背景光 */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-mystic-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="mb-16 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <h1 className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-mystic-gold via-mystic-gold to-mystic-gold_dim mb-4 tracking-[0.2em] drop-shadow-glow">
                命运 K 线
              </h1>
              <p className="text-mystic-muted text-xs tracking-[0.5em] opacity-60">一命二运三风水</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden max-w-4xl w-full"
          >
            {/* 卡片内光效 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent"></div>

            <div className="flex justify-center mb-10 flex-wrap gap-y-6">
              <RollerSelect label="年" options={years} value={year} onChange={setYear} />
              <RollerSelect label="月" options={months} value={month} onChange={setMonth} />
              <RollerSelect label="日" options={days} value={day} onChange={setDay} />
              <div className="w-4 md:w-8"></div> {/* 间隔 */}
              <RollerSelect label="时" options={hours} value={hour} onChange={setHour} />
              <RollerSelect label="分" options={minutes} value={minute} onChange={setMinute} />
              <div className="w-4 md:w-8"></div> {/* 间隔 */}
              <RollerSelect label="性别" options={genders} value={gender} onChange={setGender} />
            </div>

            {/* 分析主题选择 */}
            <div className="w-full max-w-md mx-auto mb-12 relative z-10">
              <div className="text-center mb-4">
                <span className="text-white/90 text-sm font-serif tracking-[0.2em] drop-shadow-md">请选择分析主题</span>
              </div>
              
              <div className="relative group mb-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onFocus={() => setShowOptions(true)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-center text-mystic-gold placeholder-white/20 focus:outline-none focus:border-mystic-gold/30 focus:bg-white/10 transition-all font-serif tracking-widest text-lg shadow-inner cursor-pointer"
                />
                {/* 输入框光效装饰 */}
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none group-hover:ring-white/10 transition-all" />
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-transparent via-mystic-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                {/* 下拉指示器 (可选，增强可交互感) */}
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-mystic-gold/80 transition-transform duration-300 pointer-events-none drop-shadow-glow ${showOptions ? 'rotate-180' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>
              
              {/* 选项区域 - 动画展开 */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  showOptions ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <div className="flex flex-wrap justify-center gap-3 px-2 pb-2">
                  {predefinedTopics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`px-5 py-2 rounded-full text-xs font-serif tracking-wider border transition-all duration-300 backdrop-blur-sm whitespace-nowrap ${
                        topic === t 
                          ? 'bg-mystic-gold/10 border-mystic-gold/40 text-mystic-gold shadow-[0_0_15px_rgba(230,194,120,0.15)] scale-105' 
                          : 'bg-white/5 border-white/5 text-mystic-muted/60 hover:bg-white/10 hover:text-mystic-muted hover:border-white/20 hover:scale-105'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={handleSubmit}
                className="group relative px-16 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-300"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-mystic-gold to-yellow-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <span className="relative text-black font-bold text-lg tracking-[0.5em] group-hover:tracking-[0.6em] transition-all">开启排盘</span>
                
                {/* 按钮光晕 */}
                <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 text-[10px] text-mystic-muted/30 font-serif tracking-widest"
          >
            * 仅供娱乐参考 · 天机不可泄露
          </motion.div>
        </motion.div>
      );
    };

    export default InputLayer;
