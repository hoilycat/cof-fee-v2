import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaffeine } from '../../hooks/useCaffeine';
import { useAtomValue} from 'jotai'; 
import { dailyGoalAtom , caffeineLogsAtom, userProfileAtom } from '../../hooks/useCaffeineStore';
import dayjs from 'dayjs';
import relaxbeen from '../../assets/characters/relaxbeen.png';
import funnybeen from '../../assets/characters/funnybeen.png';
import composedbeen from '../../assets/characters/composedbeen.png';
import busybeen from '../../assets/characters/busybeen.png';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const Dashboard = () => { 
  const navigate = useNavigate();
  const { totalCaffeine, characterStatus, isTapering, isMenstruating, goal } = useCaffeine();
  const dailyGoal = useAtomValue(dailyGoalAtom);
  const logs = useAtomValue(caffeineLogsAtom); // 전체 기록 가져오기

  // 1. App.tsx에서 가져오는 대신, 전역 Atom에서 직접 다크모드 여부를 가져오기.
  const user = useAtomValue(userProfileAtom);
  const isDark = user.isDarkMode;
  const [showRemaining, setShowRemaining] = useState(true); // 잔존량 vs 총량 상태


  // 1. 테마 컬러 정의 (dark: 클래스 방식으로 App.tsx에서 배경을 처리하므로, 여기선 내부 요소 색상만)
  const theme = isDark ? {
    text: '#F5E8D3', gaugeBg: '#3D2B1F', accent: '#D97706', card: '#3D2B1F', border: 'rgba(255,255,255,0.05)'
  } : {
    text: '#5C3D2E', gaugeBg: '#EFEBE4', accent: '#E57B3E', card: '#FFFFFF', border: '#F3F4F6'
  };


  // 오늘 마신 순수 총량 계산하기 (반감기 무시)
  const totalIntakeToday = logs
    .filter(l => dayjs(l.intakeTime).isAfter(dayjs().startOf('day')))
    .reduce((sum, l) => sum + l.caffeineAmount, 0);


    // 클릭할 때마다 보여줄 값과 제목을 결정하는 로직
  const displayAmount = showRemaining ? totalCaffeine : totalIntakeToday;
  const displayLabel = showRemaining ? "현재 잔존량" : "오늘 총 섭취량";
  

 // 게이지 퍼센트도 이제 displayAmount(선택된 값)를 따라가게 수정!
  const percentage = Math.min((displayAmount / dailyGoal) * 100, 100);
  const radius = 90; 
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
    <div className="flex flex-col min-h-screen font-sans max-w-lg mx-auto px-6 pt-12 pb-24 relative overflow-hidden
      /*별빛 추가*/
      dark:before:content-[''] dark:before:absolute dark:before:inset-0 
      dark:before:bg-stars dark:before:opacity-30 dark:before:pointer-events-none    
    ">
      
      {/* --- 배경 하늘 요소 (해, 달, 별) --- */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div 
            key="night-sky"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-20 right-10 pointer-events-none"
          >
            <span className="text-5xl drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">🌙</span>
            <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-4 -left-8 text-lg">✨</motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="day-sky"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-20 right-10 pointer-events-none text-5xl drop-shadow-[0_0_20px_rgba(255,165,0,0.3)]"
          >
            ☀️
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. 상단 헤더: 로고 + 테마토글 + 설정 */}
      <header className="flex justify-between items-center mb-10 z-20">
        <h1 className="text-2xl font-black tracking-tighter" style={{ color: theme.text }}>cof/fee</h1>
      </header>

      {/* 2. 트랙 표시 */}
      <div className="flex justify-center mb-8 z-20">
        <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-colors"
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : (isTapering ? '#5C3D2E' : '#DCFCE7'), 
            color: isDark ? theme.text : (isTapering ? 'white' : '#15803D') 
          }}>
          {isTapering ? 'Tapering Track' : 'Safe Track'}
        </span>
      </div>

      {/* 메인 비주얼 스테이지 (캐릭터가 게이지를 안고 있는 형태) */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative cursor-pointer" onClick={() => setShowRemaining(!showRemaining)}>
          
          {/* 게이지 아우라 (생리 모드 시 활성화) */}
          <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${isMenstruating ? 'shadow-[0_0_40px_rgba(248,113,113,0.2)] dark:shadow-[0_0_50px_rgba(251,113,133,0.4)]' : ''}`} />
          
          <svg className="w-80 h-80 transform -rotate-90">
            <circle cx="160" cy="160" r={radius} fill={isDark ? theme.card : 'white'} fillOpacity="0.5" stroke={theme.gaugeBg} strokeWidth="18" />
            <circle
              cx="160" cy="160" r={radius} fill="transparent"
              stroke={isMenstruating ? '#F87171' : (percentage > 80 ? '#E05252' : theme.accent)}
              strokeWidth="18" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            {/* 상단 궤도 점 (스케치 반영) */}
            {isMenstruating && (
              <circle cx="160" cy={160-radius} r="5" fill="#EF4444" className="animate-pulse" />
            )}
          </svg>

          {/* 중앙 수치 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black mb-1 uppercase tracking-widest opacity-60" style={{ color: theme.accent }}>{displayLabel}</span>
            <div className="flex items-baseline">
              <span className="text-6xl font-black tracking-tighter" style={{ color: theme.text }}>{Math.floor(displayAmount)}</span>
              <span className="text-xl font-bold opacity-30 ml-1">mg</span>
            </div>
            <span className="text-xs font-bold mt-2 opacity-40">/ {Math.round(goal)}mg</span>
          </div>

          {/* 캐릭터 배치: 게이지 왼쪽 하단을 안고 있는 느낌 */}
          <div className="absolute -bottom-6 -left-6 w-36 h-36 z-20">
            <img 
              src={characterImages[characterStatus]} 
              alt="character" 
              className={`w-full h-full object-contain animate-bounce ${isDark ? 'brightness-110 sepia-[0.1]' : ''}`}
              style={{ animationDuration: '4s' }}
            />
          </div>
        </div>

        {/* 4. 말풍선 메시지: 테마 적용 */}
        <div className="mt-12 w-full max-w-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-[28px] shadow-sm border relative transition-colors"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <div className="absolute -top-2 left-10 w-4 h-4 rotate-45 border-l border-t" style={{ backgroundColor: theme.card, borderColor: theme.border }} />
              <p className="text-sm font-bold text-center leading-relaxed" style={{ color: theme.text }}>
                {isMenstruating && <span className="text-red-400 mr-1">🩸</span>}
                {currentMessage}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 5. 하단 추가 버튼: 아이콘 추가 */}
      <div className="mt-8 z-20">
        <button 
          onClick={() => navigate('/add')}
          className="w-full py-5 rounded-[30px] font-black text-xl shadow-xl transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          style={{ backgroundColor: theme.accent, color: 'white' }}
        >
          <Plus size={24} strokeWidth={3} />
          음료 추가
        </button>
      </div>
    </div>
  );
}

export default Dashboard;