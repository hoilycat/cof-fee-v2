import { useNavigate } from 'react-router-dom';
import { useCaffeine } from '../../hooks/useCaffeine';
import { useAtomValue } from 'jotai'; 
import { dailyGoalAtom } from '../../hooks/useCaffeineStore';

const Dashboard = () => { 
  const navigate = useNavigate();
  const { totalCaffeine, sleepStatus, characterStatus } = useCaffeine();
  const dailyGoal = useAtomValue(dailyGoalAtom);

  const percentage = Math.min((totalCaffeine / dailyGoal) * 100, 100);

  // 게이지를 조금 더 큼직하게
  const radius = 85; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    /* 배경이나 테두리 칸 없이 내용물만 화면 중앙에 예쁘게 배치 */
    <div className="flex flex-col min-h-full px-6 py-12 max-w-2xl mx-auto">
      
      {/* 1. 상단 헤더 로고 영역 */}
      <header className="flex flex-col items-center mb-12">
        <h1 className="text-3xl font-black text-[#5C3D2E] tracking-tighter">
          cof/fee
        </h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">안전하게 즐기는 커피 생활</p>
      </header>

      {/* 2. 상태 메시지 */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {characterStatus === 'DANGER' ? '⚠️ 카페인이 좀 많아요!' : '🌿 오늘 카페인 아직 괜찮아요!'}
        </h2>
        <p className="text-base text-gray-500 font-medium">
          ✨ {sleepStatus === 'GOOD' ? '오늘 밤 꿀잠 예약!' : '조금 후면 푹 쉴 수 있어요'}
        </p>
      </div>

      {/* 3. 메인 원형 게이지 & 섭취량 */}
      <div className="flex justify-center items-center mb-12 relative">
        <svg className="w-64 h-64 transform -rotate-90">
          <circle cx="128" cy="128" r={radius} fill="transparent" stroke="#f3f4f6" strokeWidth="16" />
          <circle
            cx="128" cy="128" r={radius}
            fill="transparent"
            stroke={characterStatus === 'DANGER' ? '#ef4444' : '#10b981'}
            strokeWidth="16" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-gray-800 tracking-tight">
            {Math.floor(totalCaffeine)}<span className="text-xl font-bold ml-1 text-gray-400">mg</span>
          </span>
          <span className="text-base text-gray-400 font-bold mt-1">
            / {dailyGoal}mg
          </span>
        </div>
      </div>

      {/* 4. 음료 추가 버튼 */}
      <div className="w-full mb-16">
        <button 
          onClick={() => navigate('/add')}
          className="w-full bg-[#E57B3E] hover:bg-[#d66b2d] text-white py-5 rounded-2xl font-bold text-xl flex justify-center items-center gap-2 shadow-sm transition-colors"
        >
          <span className="text-2xl leading-none">+</span> 커피/음료 추가하기
        </button>
      </div>

      {/* 5. 캐릭터 영역 */}
      <div className="flex flex-col items-center justify-center mb-16">
        <div className="text-8xl animate-bounce mb-6">
          {characterStatus === 'DANGER' ? '🤯' : '🥔'} 
        </div>
        <p className="text-sm text-gray-500 font-medium">
          음료 마시기 전에 나 한번 보라구~!!!
        </p>
      </div>

      {/* 6. 하단 현재 체내 카페인 정보 */}
      <div className="flex flex-col items-center justify-center w-full">
        <p className="text-sm text-gray-500 mb-2 font-medium">현재 체내 카페인</p>
        <div className="text-3xl font-black text-gray-800">
          {Math.floor(totalCaffeine)}<span className="text-base font-bold ml-1 text-gray-400">mg</span>
        </div>
        <p className="text-xs text-gray-400 mt-2 font-medium">
          반감기(5시간)를 적용한 실시간 잔존량
        </p>
      </div>
      
    </div>
  );
}

export default Dashboard;