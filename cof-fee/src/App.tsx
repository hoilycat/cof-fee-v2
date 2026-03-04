import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import { AddDrink } from './pages/AddDrink/AddDrink'; // 아래에서 만들 예정
import { Settings } from './pages/Settings/Settings';


function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen pb-20 bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddDrink />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        {/* 하단 네비게이션 바 (임시) */}
        <nav className="fixed bottom-0 w-full bg-gray-800 border-t border-gray-700 p-4 flex justify-around">
          <Link to="/" className="text-sm font-bold">🏠 홈</Link>
          <Link to="/add" className="text-sm font-bold text-green-400">+ 기록</Link>
          <Link to="/settings" className="text-sm font-bold">⚙️ 설정</Link>
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;