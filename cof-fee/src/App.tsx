import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import { AddDrink } from './pages/AddDrink/AddDrink';
import { Settings } from './pages/Settings/Settings';

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
    /* 화면 끝에서 끝까지 꽉 차는 하단 바 (max-w 제한 해제) */
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
  return (
    <BrowserRouter>
      {/* 좁은 박스(칸)를 없애고 전체 화면을 사용하기. */}
      <div className="w-full min-h-screen bg-[#FDFAF6] text-gray-900 font-sans pb-28">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddDrink />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<div className="p-10 text-center mt-20 text-gray-400 font-bold">기록 페이지 준비중 🛠️</div>} />
          <Route path="/goals" element={<div className="p-10 text-center mt-20 text-gray-400 font-bold">목표 페이지 준비중 🛠️</div>} />
          <Route path="/stats" element={<div className="p-10 text-center mt-20 text-gray-400 font-bold">통계 페이지 준비중 🛠️</div>} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;