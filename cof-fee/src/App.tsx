import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userProfileAtom } from './hooks/useCaffeineStore';

import Dashboard from './pages/Dashboard/Dashboard';
import { AddDrink } from './pages/AddDrink/AddDrink';
import { Settings } from './pages/Settings/Settings';
import Onboarding from './pages/Onboarding/Onboarding';
import { History } from './pages/History/History'; 
import { Goals } from './pages/Goals/Goals';
import { Stats } from './pages/Stats/Stats';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems =[
    { path: '/', icon: '🏠', label: '홈' },
    { path: '/history', icon: '📋', label: '기록' },
    { path: '/goals', icon: '🎯', label: '목표' },
    { path: '/stats', icon: '📊', label: '통계' },
    { path: '/settings', icon: '⚙️', label: '설정' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center p-3 transition-colors ${isActive ? 'text-[#E57B3E]' : 'text-gray-400 hover:text-gray-800'}`}
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

  // 진단을 안 받았다면 무조건 온보딩 화면으로!
  if (!userProfile.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#FDFAF6] text-gray-900 font-sans pb-28">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddDrink />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<History />} />
          <Route path="/goals" element={<Goals/>} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;