import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaffeine } from '../../hooks/useCaffeine';
import { useAtomValue } from 'jotai'; 
import { dailyGoalAtom , caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import dayjs from 'dayjs';
import relaxbeen from '../../assets/characters/relaxbeen.png';
import funnybeen from '../../assets/characters/funnybeen.png';
import composedbeen from '../../assets/characters/composedbeen.png';
import busybeen from '../../assets/characters/busybeen.png';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => { 
  const navigate = useNavigate();
  const { totalCaffeine, characterStatus, isTapering } = useCaffeine();
  const dailyGoal = useAtomValue(dailyGoalAtom);
  const logs = useAtomValue(caffeineLogsAtom); // 전체 기록 가져오기

  const [showRemaining, setShowRemaining] = useState(true); // 잔존량 vs 총량 상태

  // 오늘 마신 순수 총량 계산하기 (반감기 무시)
  const totalIntakeToday = logs
    .filter(l => dayjs(l.intakeTime).isAfter(dayjs().startOf('day')))
    .reduce((sum, l) => sum + l.caffeineAmount, 0);


    // 클릭할 때마다 보여줄 값과 제목을 결정하는 로직
  const displayAmount = showRemaining ? totalCaffeine : totalIntakeToday;
  const displayLabel = showRemaining ? "현재 잔존량" : "오늘 총 섭취량";
  const toggleView = () => setShowRemaining(!showRemaining);
  

 // 게이지 퍼센트도 이제 displayAmount(선택된 값)를 따라가게 수정!
  const percentage = Math.min((displayAmount / dailyGoal) * 100, 100);
  const radius = 85; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const characterImages: Record<string, string> = {
    DANGER: busybeen,
    WARNING: composedbeen,
    GOOD: relaxbeen,
    IDLE: funnybeen,
  };
  


  // 캐릭터 상태별 맞춤형 메시지 지도
  // showRemaining 조건까지 고려해서 두 배로 풍성하게!
  const characterMessages: Record<string, { remaining: string; total: string }> = {
    DANGER: {
      remaining: "🤯 나....야근했어....힘들다",
      total: "😵 오늘은 정말 많이 마셨어! 각성 완료!",
    },
    WARNING: {
      remaining: "🧐 조금 후면 집중력이 떨어질 것 같아. 주의해!",
      total: "🥤 권장량에 가까워졌어. 다음 잔은 신중하게!",
    },
    GOOD: {
      remaining: "🌿 아직 여유로워! 지금 상태 딱 좋아.",
      total: "☕️ 오늘 커피 라이프, 아주 안전하게 즐기고 있구나!",
    },
    IDLE: {
      remaining: "🥔 카페인 제로! 뇌가 아주 깨끗해.",
      total: "☀️ 오늘 첫 커피는 어디서 마실까?",
    },
  };  
  
  const currentMessage = showRemaining 
    ? characterMessages[characterStatus]?.remaining 
    : characterMessages[characterStatus]?.total;

  return (

    /* 1. 배경을 더 깨끗하게, 중앙 집중형 레이아웃 */
    <div className="flex flex-col min-h-screen items-center px-6 py-16 bg-[#FDFAF6] text-gray-900 font-sans max-w-lg mx-auto">
      
      {/* 로고 영역 (더 심플하게) */}
      <h1 className="text-4xl font-black text-[#5C3D2E] tracking-tighter mb-2">cof/fee</h1>
      
      {/* 2. 트랙 배지 (더 부드럽게) */}
      <div className="mb-6">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${isTapering ? 'bg-[#5C3D2E] text-white' : 'bg-green-100 text-green-700'}`}>
          {isTapering ? '👋 이별 트랙 진행 중' : '🌿 안전 트랙 유지 중'}
        </span>
      </div>

      {/* 3. 메인 인터랙티브 영역: 서클과 캐릭터 통합 */}
      <div 
        onClick={toggleView} 
        className="flex-1 w-full flex flex-col items-center justify-center cursor-pointer active:scale-[0.98] transition-all"
        title="클릭하여 잔존량/총량 전환"
      >
        {/* 라벨 (더 세련된 폰트와 컬러) */}
        <h2 className="text-sm font-black text-[#E57B3E] mb-8 bg-[#FFEAE8] py-1.5 px-4 rounded-full">
          {displayLabel}
        </h2>

        <p className="text-xs text-gray-400 mt-2 font-medium">
        반감기(5시간)를 적용한 실시간 잔존량
        </p>

        {/* 4. 메인 원형 게이지 & 섭취량 (더 큼직하게, 숫자 중심) */}
        <div className="flex justify-center items-center mb-16 relative">
          <svg className="w-72 h-72 transform -rotate-90">
            <circle cx="144" cy="144" r={100} fill="transparent" stroke="#EFEBE4" strokeWidth="20" />
            <circle
              cx="144" cy="144" r={100}
              fill="transparent"
              stroke={percentage > 80 ? '#E05252' : '#E57B3E'}
              strokeWidth="20" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-gray-800 tracking-tight">
              {Math.floor(displayAmount)}<span className="text-2xl font-bold ml-1 text-gray-400">mg</span>
            </span>
            <span className="text-sm text-gray-400 font-bold mt-1">
              / {Math.round(dailyGoal)}mg
            </span>
          </div>
        </div>


        {/* 5. 캐릭터 영역: 네가 만든 이미지로 교체! */}
        <div className="flex flex-col items-center justify-center mb-12">
          {/* 이미지 연동 (id 기반) */}
          <div className="w-32 h-32 mb-6">
            <img 
            // characterImages 지도에서 characterStatus 주소를 찾고, 없으면 relaxbeen을 보여줌
            src={characterImages[characterStatus] || relaxbeen} 
            alt="Cof/fee Character" 
            className="w-full h-full object-contain animate-bounce"
          />
          </div>
          
          {/* 3. [애니메이션 적용 ✨] */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-500 font-medium text-center bg-white py-2 px-5 rounded-full shadow-inner border border-gray-100"
            >
              {currentMessage}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* 6. 음료 추가 버튼 (더 크고 둥글게) */}
      <div className="w-full mt-auto mb-16">
        <button 
          onClick={() => navigate('/add')}
          className="w-full bg-[#E57B3E] hover:bg-[#d66b2d] text-white py-5 rounded-[25px] font-bold text-xl flex justify-center items-center gap-2 shadow-sm transition-colors"
        >
          <span className="text-2xl leading-none">+</span> 음료 추가
        </button>
      </div>
      
    </div>
  );
}

export default Dashboard;