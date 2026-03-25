import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { userProfileAtom } from './hooks/useCaffeineStore';
import { motion } from 'framer-motion';
import Dashboard from './pages/Dashboard/Dashboard';
import { AddDrink } from './pages/AddDrink/AddDrink';
import { Settings } from './pages/Settings/Settings';
import Onboarding from './pages/Onboarding/Onboarding';
import { History } from './pages/History/History'; 
import { Goals } from './pages/Goals/Goals';
import { Stats } from './pages/Stats/Stats';
import { HouseHeart, NotebookPen, Goal, ChartArea, Settings as SettingIcon } from 'lucide-react';


const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems =[
    { path: '/', icon: <HouseHeart size ={20}/>, label: '홈' },
    { path: '/history', icon: <NotebookPen size={20}/>, label: '기록' },
    { path: '/goals', icon: <Goal size={20}/>, label: '목표' },
    { path: '/stats', icon: <ChartArea size={20} />, label: '통계' },
    { path: '/settings', icon: <SettingIcon size={20}/>, label: '설정' },
  ];

  
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#3A312B] border-t border-gray-200 dark:border-white/5 pb-safe pt-2 px-6 flex justify-around items-center z-50 transition-color">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center p-3 transition-colors ${isActive ? 'text-[#E57B3E] drop-shadow-[0_0_8px_rgba(229,123,62,0.6)] scale-110 dark:text-[#D97706]' : 'text-gray-400 dark:text-[#A3978F]'}`}          
            >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

function App() {
  const userProfile = useAtomValue(userProfileAtom);
  const isDark = userProfile.isDarkMode;


  // 테마에 따른 배경색 정의
  const bgColor = isDark ? '#483C32' : '#FDFAF6';
  const textColor = isDark ? '#F5E8D3' : '#5C3D2E';

// 테마별 색상 정의
  const theme = isDark ? {
    bg: '#483C32',
    nav: '#3A312B', 
    text: '#F5E8D3',   
    navText: '#A3978F',
    active: '#E57B3E'  
  } : {
    bg: '#FDFAF6',
    nav: '#FFFFFF',
    text: '#5C3D2E',
    navText: '#94A3B8',
    active: '#E57B3E'
  };

  //테마가 바뀔 때마다 번갈아 작동
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);



 // 진단을 안 받았다면 무조건 온보딩 화면으로
  if (!userProfile.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* Framer Motion으로 배경색 전환 애니메이션 적용 */}
      <motion.div 
        key={isDark ? 'dark-mode-root' : 'light-mode-root'} 
        animate={{ backgroundColor: bgColor }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-screen font-sans transition-colors"
        style={{ color: textColor }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddDrink />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<History />} />
          <Route path="/goals" element={<Goals/>} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
        {/* 하단 바에 테마 전달 */}
        <nav 
          className="fixed bottom-0 left-0 w-full border-t border-opacity-10 flex justify-around items-center z-50 pb-safe pt-2 transition-colors"
          style={{ backgroundColor: theme.nav, borderColor: isDark ? '#FFFFFF' : '#000000' }}
        >
        <BottomNav />
        </nav>
      </motion.div>
    </BrowserRouter>
  );
}

export default App;