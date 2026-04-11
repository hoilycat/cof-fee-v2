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
import { SymptomModal } from '../../components/SymptomModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Activity, Coffee } from 'lucide-react';
import { getSleepActionTip, getArousalStage, getSmartRecommendation  } from '../../lib/utiles';

const Dashboard = () => { 
  const navigate = useNavigate();
  const { totalCaffeine, characterStatus, isTapering, isMenstruating, goal, sleepReadyTime, withdrawalInfo } = useCaffeine();
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const dailyGoal = useAtomValue(dailyGoalAtom);
  const logs = useAtomValue(caffeineLogsAtom); // 전체 기록 가져오기

  // 1. App.tsx에서 가져오는 대신, 전역 Atom에서 직접 다크모드 여부를 가져오기.
  const user = useAtomValue(userProfileAtom);
  const isDark = user.isDarkMode;
  const [showRemaining, setShowRemaining] = useState(true); // 잔존량 vs 총량 상태


  // 1. 테마 컬러 정의 (dark: 클래스 방식으로 App.tsx에서 배경을 처리하므로, 여기선 내부 요소 색상만)
  const theme = isDark ? {
    text: '#F5E8D3',      
    gaugeBg: '#3A312B',   
    accent: '#E57B3E',    
    card: '#3A312B',      
    border: 'rgba(255,255,255,0.05)'
  } : {
    text: '#5C3D2E', 
    gaugeBg: '#EFEBE4', 
    accent: '#E57B3E', 
    card: '#FFFFFF', 
    border: '#F3F4F6'
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
  
  // 수면 팁 가져오기
  const sleepTip = getSleepActionTip(totalCaffeine);
  const hour = dayjs().hour();

  const arousal = getArousalStage(totalCaffeine);


  // 캐릭터 상태별 맞춤형 메시지 지도
  const characterMessages: Record<string, { remaining: string; total: string }> = {
    DANGER: {
      remaining: hour >= 21 ? "🫨 지금 잠들기엔 뇌가 너무 깨어있어요!" : "🤯 나....야근해야 할듯...힘들다...",
      total: "😵 오늘은 정말 많이 마셨어! 물이 필요해! 도와줘!",
    },
    WARNING: {
      remaining: hour >= 21 ? "🫨 지금 잠들기엔 뇌가 너무 깨어있어요!" : "🧐 조금 후면 집중력이 떨어질 거야.",
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
  
  const currentMessage = withdrawalInfo?.isWarning 
  ? `🚨 ${withdrawalInfo.message}` // 금단 증상 구간일 때 최우선 메시지
  : (showRemaining ? characterMessages[characterStatus]?.remaining : characterMessages[characterStatus]?.total);

  
  //배경에 쓰일 색깔
  const auraColors: Record<string, string[]> = {
    DANGER: isDark 
      ? ['#7A3E3E', '#5C2C2C', '#8F4A4A']  
      : ['#FF4D4D', '#F43F5E', '#FFB020'], 
    WARNING: isDark 
      ? ['#855A30', '#66421F', '#9C6D3D']
      : ['#FF9800', '#F97316', '#FFD700'], 
    GOOD: isDark 
      ? ['#4A6B4E', '#354F38', '#5E8262'] 
      : ['#34D399', '#10B981', '#FDE047'], 
    IDLE: isDark 
      ? ['#4A3F35', '#3D332A', '#5C4E43']  
      : ['#FDE68A', '#FFEDD5', '#E2E8F0'], 
  };

  // 현재 상태에 맞는 옷(색상 3개)을 꺼내오는 코드
  const colors = auraColors[characterStatus] || auraColors.IDLE;

  const AURORA_LAYERS = [
    { w: '60%', h: '60%', x: ['-20%', '10%', '-20%'], y: ['-10%', '20%', '-10%'], scale: [1, 1.4, 1], dur: 8, pos: '-top-[10%] -left-[10%]' },
    { w: '65%', h: '65%', x: ['20%', '-10%', '20%'], y: ['-20%', '10%', '-20%'], scale: [1.2, 1, 1.2], dur: 10, pos: '-top-[10%] -right-[10%]' },
    { w: '60%', h: '60%', x: ['-10%', '20%', '-10%'], y: ['20%', '-10%', '20%'], scale: [1, 1.3, 1], dur: 11, pos: '-bottom-[10%] -left-[10%]' },
    { w: '70%', h: '70%', x: ['10%', '-20%', '10%'], y: ['10%', '-20%', '10%'], scale: [1.3, 1, 1.3], dur: 13, pos: '-bottom-[10%] -right-[10%]' },
  ];
  
  // 고정식 별빛 (큰별, 작은별 7개씩)
  const NIGHT_STARS = [
    { top: '15%', left: '20%', size: 3, dur: 3 },
    { top: '25%', left: '75%', size: 2, dur: 4 },
    { top: '40%', left: '10%', size: 4, dur: 2.5 },
    { top: '55%', left: '85%', size: 2, dur: 5 },
    { top: '75%', left: '30%', size: 3, dur: 3.5 },
    { top: '85%', left: '80%', size: 2, dur: 4.5 },
    { top: '10%', left: '50%', size: 4, dur: 3.2 },

    { top: '20%', left: '40%', size: 1.5, dur: 2.8 },
    { top: '65%', left: '15%', size: 2.5, dur: 4.2 },
    { top: '80%', left: '60%', size: 1.5, dur: 3.8 },
    { top: '35%', left: '90%', size: 3, dur: 5.5 },
    { top: '50%', left: '45%', size: 1.5, dur: 3.1 },
    { top: '5%',  left: '85%', size: 1.5, dur: 2.2 },
    { top: '90%', left: '20%', size: 2.5, dur: 4.8 },
    { top: '45%', left: '65%', size: 3.5, dur: 3.7 }
  ];

 const rec = getSmartRecommendation(user, totalCaffeine, goal);

 return (
    <div className="flex flex-col min-h-screen font-sans w-full px-6 pt-12 pb-36 relative overflow-hidden">

      {/* 역동적으로 움직이는 오로라 층 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="w-full h-full relative" style={{ filter: 'blur(90px)' }}> 
          {AURORA_LAYERS.map((layer, i) => (
            <motion.div
              key={`aura-${i}`}
              className={`absolute rounded-full ${layer.pos}`}
              style={{
                backgroundColor: colors[i % colors.length],
                // 가독성을 위해 라이트 모드일 때 투명도를 확 낮추기
                opacity: isDark ? 0.35 : 0.2, 
                width: layer.w,
                height: layer.h,
              }}
              animate={{ x: layer.x, y: layer.y, scale: layer.scale }}
              transition={{ duration: layer.dur, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>

      {/* 가독성을 살리는 중앙 보호막 (비네팅 마스크) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          // 가장자리는 투명하게 둬서 빛을 보여주고, 가운데는 배경색으로 덮어서 글씨를 뚜렷하게!
          background: isDark 
            ? 'radial-gradient(circle at center, rgba(72,60,50,0.7) 0%, transparent 70%)' 
            : 'radial-gradient(circle at center, rgba(253,250,246,0.8) 0%, transparent 70%)'
        }}
      />

      {/* 다크 모드 전용 반짝이는 별빛 */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {NIGHT_STARS.map((star, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute bg-white rounded-full shadow-[0_0_6px_white]"
              style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
              animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: star.dur, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      {/* 상단 헤더: 로고 + 테마토글 + 설정 */}
      <header className="flex justify-between items-center mb-10 z-20">
        <div className="w-full max-w-sm mx-auto flex justify-between items-center px-2 relative">
          <h1 className="text-2xl font-black tracking-tighter" style={{ color: theme.text }}>cof/fee</h1>
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
        </div>
      </header>

      {/* 트랙 표시 */}
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
              <span className="text-4xl font-black tracking-tighter" style={{ color: theme.text }}>{Math.floor(displayAmount)}</span>
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

        {/* 카페인 각성 단계 바 추가 */}
        <div className="w-full max-w-[280px] mt-4 mb-2 z-20 mx-auto">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black uppercase opacity-40 dark:text-white">Current State</span>
            <span className="text-xs font-bold" style={{ color: arousal.color }}>{arousal.label}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-[#4A423B] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalCaffeine / 200) * 100, 100)}%` }}
              style={{ backgroundColor: arousal.color }}
              className="h-full rounded-full"
            />
          </div>
          <p className="text-[10px] mt-2 font-medium opacity-60 text-center dark:text-white/60">{arousal.tip}</p>
        </div>

        {/* 말풍선 메시지: 테마 적용 (밤 시간 경고 강조)*/}
        <div className="mt-12 w-full max-w-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-5 rounded-[28px] shadow-sm border relative transition-colors duration-500 ${
                (hour >= 21 && totalCaffeine >= 50) 
                  ? 'bg-[#4A2D2D] border-[#E05252]/40' // 밤 시간 경고: 묵직한 레드 브라운
                  : 'bg-white dark:bg-[#3A312B] border-gray-100 dark:border-white/5' // 일반 상태
              }`}
            >
              {/* 💡 말풍선 꼬리: 몸체와 색깔을 완벽하게 맞춤 */}
              <div 
                className={`absolute -top-2 left-10 w-4 h-4 rotate-45 border-l border-t transition-colors duration-500 ${
                  (hour >= 21 && totalCaffeine >= 50)
                    ? 'bg-[#4A2D2D] border-[#E05252]/40' 
                    : 'bg-white dark:bg-[#3A312B] border-gray-100 dark:border-white/5'
                }`}
              />
              
              <p className={`text-sm font-bold text-center leading-relaxed ${
                (hour >= 21 && totalCaffeine >= 50) ? 'text-[#FFD1D1]' : 'dark:text-[#ECE0D1]'
              }`}>
                {isMenstruating && <span className="text-red-400 mr-1">🩸</span>}
                {currentMessage}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>        
      {/* 메시지 및 추가 정보 카드 영역 */}
      <div className="mt-12 w-full max-w-[320px] space-y-4 z-20">
        
        {/* 수면 예측 카드 (액션 플랜 포함) */}
        <div className="bg-white dark:bg-[#3A312B] p-6 rounded-[30px] shadow-sm border border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Sleep Safety Guide</span>
                  <span className="text-lg">🌙</span>
                </div>
                <p className="text-sm font-black mb-1">
                  {sleepReadyTime} 이후 숙면 가능
                </p>
                <p className="text-[11px] font-bold text-[#E57B3E] leading-relaxed">
                  💡 {sleepTip}
                </p>
        </div>  
           
        {/* 금단 증상 경고 (조건부 렌더링) */}
        {withdrawalInfo?.isWarning && (
          <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-[28px] border border-red-100 dark:border-red-900/30">
            <p className="text-xs font-bold text-red-500">{withdrawalInfo.message}</p>
          </div>
        )}

        {/* 몸 상태 기록 버튼 */}
        <button 
          onClick={() => setIsSymptomModalOpen(true)}
          className="w-full bg-[#F4F1EA] dark:bg-[#483C32] p-5 rounded-[28px] flex justify-between items-center group active:scale-95 hover:scale-105 transition-all"
        >
           <div className="flex items-center gap-3">
              <Activity size={18} className="text-[#E57B3E]" />
              <span className="text-sm font-bold dark:text-[#ECE0D1]">지금 컨디션 기록하기</span>
           </div>
           <span className="text-xs opacity-30 dark:text-white">GO</span>
        </button>
      </div>
      {/* 💡 실시간 추천 카드 섹션 */}
      <div className="mt-8 w-full max-w-[320px] z-20">
        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-4 mb-2 dark:text-white">Smart Recommendation</p>
        <div 
          onClick={() => navigate('/add')} // 추천 카드 누르면 바로 추가 페이지로!
          className="bg-[#E57B3E] dark:bg-[#D97706] p-6 rounded-[35px] shadow-lg text-white cursor-pointer active:scale-95 transition-all group"
        >
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-black text-lg group-hover:underline">{rec.title}</h5>
            <Coffee size={20} className="opacity-50" />
          </div>
          <p className="text-xs font-medium opacity-90 leading-relaxed">
            {rec.desc}
          </p>
        </div>
      </div>

      {/* 하단 추가 버튼: 아이콘 추가 */}
      <div className="mt-8 z-20 w-full max-w-md mx-auto">
        <button 
          onClick={() => navigate('/add')}
          className="w-full py-5 rounded-[30px] font-black text-xl shadow-xl transition-all active:scale-[0.97] hover:scale-105 flex items-center justify-center gap-2"
          style={{ backgroundColor: theme.accent, color: 'white' }}
        >
          <Plus size={24} strokeWidth={3} />
          음료 추가
        </button>
      </div>

      {/* 증상 모달 */}
      {isSymptomModalOpen && <SymptomModal onClose={() => setIsSymptomModalOpen(false)} />}
    </div>
  );
}

export default Dashboard;