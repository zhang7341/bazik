/** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {
          colors: {
            mystic: {
              bg: '#13132B', // 深邃蓝紫 (提亮背景)
              card: 'rgba(30, 30, 50, 0.4)', // 更通透的卡片背景
              text: '#F0F0F0', // 更亮的白色
              muted: '#A0A0B0', // 浅灰，提高可读性
              gold: '#FFD700', // 亮金 (更醒目)
              gold_dim: '#B8860B', // 暗金
              red: '#FF7875', // 珊瑚红 (更柔和)
              green: '#5CDBD3', // 明青色 (更清透)
              accent: '#B37FEB', // 亮紫
              dark: '#1F1F35'  // 深色背景辅助
            }
          },
          fontFamily: {
            serif: ['"Cinzel"', '"Noto Serif SC"', 'Georgia', 'serif'], // 建议引入 Google Fonts 或使用系统衬线
            sans: ['"Inter"', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          backgroundImage: {
            'void-gradient': 'radial-gradient(circle at 50% 0%, #2D2D55 0%, #13132B 70%)',
            'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
            'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
          },
          boxShadow: {
            'glow': '0 0 20px rgba(230, 194, 120, 0.15)',
            'glow-strong': '0 0 30px rgba(230, 194, 120, 0.3)',
            'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          },
          animation: {
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'float': 'float 6s ease-in-out infinite',
            'spin-slow': 'spin 12s linear infinite',
          },
          keyframes: {
            float: {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' },
            }
          }
        },
      },
      plugins: [],
    }
