import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaffeine } from '../../hooks/useCaffeine';
import { useAtomValue} from 'jotai'; 
import { caffeineLogsAtom, userProfileAtom } from '../../hooks/useCaffeineStore';
import dayjs from 'dayjs';
import relaxbeen from '../../assets/characters/relaxbeen.png';
import funnybeen from '../../assets/characters/funnybeen.png';
import composedbeen from '../../assets/characters/composedbeen.png';
import busybeen from '../../assets/characters/busybeen.png';
import { SymptomModal } from '../../components/SymptomModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Activity, Coffee, X, Moon } from 'lucide-react';
import { getSleepActionTip, getArousalStage, getSmartRecommendation, getNow  } from '../../lib/utiles';
import { Emoji3D } from '../../components/Emoji3D';



const Dashboard = () => { 
  const navigate = useNavigate();
  const { totalCaffeine, characterStatus, isTapering, isMenstruating, goal, sleepReadyTime, withdrawalInfo } = useCaffeine();
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  
  const logs = useAtomValue(caffeineLogsAtom); // 전체 기록 가져오기

  // 1. App.tsx에서 가져오는 대신, 전역 Atom에서 직접 다크모드 여부를 가져오기.
  const user = useAtomValue(userProfileAtom);
  const isDark = user.isDarkMode;
  const [showRemaining, setShowRemaining] = useState(true); // 잔존량 vs 총량 상태
  const [showSleepCard, setShowSleepCard] = useState(true);
  const [showRecCard, setShowRecCard] = useState(true);

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

// 🌌 1. 상태별 은하수(성운) 및 별빛 설정
  const galaxyConfig : Record<string, { colors: string[], starCount: number, speed: number, blur: string }> ={
    DANGER: {
      colors: ['rgba(224, 82, 82, 0.3)', 'rgba(150, 40, 40, 0.2)', 'rgba(255, 100, 100, 0.1)'],
      starCount: 40,
      speed: 0.5,
      blur: 'blur(100px)',
    },
    WARNING: {
      colors: ['rgba(217, 119, 6, 0.25)', 'rgba(180, 83, 9, 0.15)', 'rgba(251, 191, 36, 0.1)'],
      starCount: 30,
      speed: 2,
      blur: 'blur(80px)',
    },
    GOOD: {
      colors: ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(167, 243, 208, 0.05)'],
      starCount: 20,
      speed: 4,
      blur: 'blur(70px)',
    },
    IDLE: {
      colors: ['rgba(245, 232, 211, 0.15)', 'rgba(163, 151, 143, 0.1)', 'rgba(255, 255, 255, 0.05)'],
      starCount: 15,
      speed: 6,
      blur: 'blur(60px)',
    }
  };

  const config = galaxyConfig[characterStatus] || galaxyConfig.IDLE;

  // 별빛 생성 (한 번 생성 후 유지되도록 하거나, 상태 변경 시 재계산)
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      // 아주 큰 소수를 곱하고 사인(sin) 함수를 섞어서 패턴을 완전히 깨버립니다.
      const pseudoRandomTop = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const pseudoRandomLeft = Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1;
      const pseudoRandomSize = Math.abs(Math.sin(i * 45.123) * 43758.5453) % 1;

      return {
        id: i,
        top: `${pseudoRandomTop * 100}%`,
        left: `${pseudoRandomLeft * 100}%`,
        size: (pseudoRandomSize * 2) + 1, // 1px ~ 3px 사이
        duration: (pseudoRandomSize * 3) + 2, // 2s ~ 5s 사이
      };
    });
  }, []); // 초기 1회만 생성

  // 오늘 마신 순수 총량 계산하기 (반감기 무시)
  const totalIntakeToday = logs
    .filter(l => dayjs(l.intakeTime).isAfter(getNow().startOf('day')))
    .reduce((sum, l) => sum + l.caffeineAmount, 0);


    // 클릭할 때마다 보여줄 값과 제목을 결정하는 로직
  const displayAmount = showRemaining ? totalCaffeine : totalIntakeToday;
  const displayLabel = showRemaining ? "현재 잔존량" : "오늘 총 섭취량";
  

 // 게이지 퍼센트도 이제 displayAmount(선택된 값)를 따라가게 수정!
  const percentage = Math.min((displayAmount / goal) * 100, 100);
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
  const hour = getNow().hour();

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



  const rec = getSmartRecommendation(user, totalCaffeine, goal);

 
 return (
    <div className="flex flex-col min-h-screen font-sans w-full relative overflow-hidden transition-colors duration-1000 pb-44">

       {/* 동적 은하수(성운) 레이어 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatePresence>
          <motion.div 
            key={characterStatus}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="w-full h-full relative"
            style={{ filter: config.blur }}
          >
            {config.colors.map((color, idx) => (
              <motion.div
                key={`nebula-${idx}`}
                className="absolute rounded-full"
                style={{
                  backgroundColor: color,
                  width: `${60 + idx * 20}%`,
                  height: `${60 + idx * 20}%`,
                  top: idx % 2 === 0 ? '-10%' : '20%',
                  left: idx % 2 === 0 ? '10%' : '-10%',
                }}
                animate={{
                  x: [0, 30, -30, 0],
                  y: [0, -40, 40, 0],
                  scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                  duration: config.speed + idx * 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 동적 별빛 레이어 */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <AnimatePresence>
            {stars.map((star) => (
              <motion.div
                key={`${characterStatus}-star-${star.id}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute bg-white rounded-full"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  boxShadow: `0 0 ${star.size * 2}px white`,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                }}
                transition={{
                  duration: characterStatus === 'DANGER' ? 1 : star.duration, // Danger일 땐 미친듯이 반짝임
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

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


      {/* 상단 헤더: 로고 + 테마토글 + 설정 */}
      <header className="flex justify-between items-center mb-10 z-20">
        <div className="w-full max-w-sm mx-auto flex justify-between items-center px-2 relative">
          <h1 className="text-2xl font-black tracking-tighter" style={{ color: theme.text }}>cof/fee</h1>
           {/* --- 배경 하늘 요소 (해, 달, 별) --- */}
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="night-sky" className="absolute top-20 right-10 pointer-events-none">
                  <Emoji3D type="Moon_3D" size={80} isDark={true} className="drop-shadow-[0_10px_20px_rgba(165,180,252,0.5)]" />
                  <div className="absolute -top-4 -left-6">
                    <Emoji3D type="Sparkles_3D" size={30} isDark={true} className="drop-shadow-lg" />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="day-sky"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-20 right-10 pointer-events-none text-5xl drop-shadow-[0_0_20px_rgba(255,165,0,0.3)]"
                >
                 <Emoji3D type="Sun_3D" size={90}  isDark={false}  className="drop-shadow-2xl" />
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </header>

      {/* 트랙 표시 */}
      <div className="flex justify-center mb-8 z-20">
        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-colors bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/20"
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : (isTapering ? '#5C3D2E' : '#DCFCE7'), 
            color: isDark ? theme.text : (isTapering ? 'white' : '#15803D') 
          }}>
          {isTapering ? 'Tapering Track' : 'Safe Track'}
        </span>
        {/* 💡 생리 모드 활성화 시 배지 추가 */}
          {isMenstruating && (
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm bg-rose-500 text-white animate-pulse">
              Period Mode On 🩸
            </span>
          )}
      </div>

      {/* 메인 비주얼 스테이지 (캐릭터가 게이지를 안고 있는 형태) */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative flex justify-center items-center mb-8 cursor-pointer" onClick={() => setShowRemaining(!showRemaining)}>
          
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
            <div className="flex items-baseline justify-center">
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
              {/*  말풍선 꼬리: 몸체와 색깔을 완벽하게 맞춤 */}
              <div 
                className={`absolute -top-2 left-10 w-4 h-4 rotate-45 border-l border-t transition-colors duration-500 ${
                  (hour >= 21 && totalCaffeine >= 50)
                    ? 'bg-[#4A2D2D] border-[#E05252]/40' 
                    : 'bg-white dark:bg-[#3A312B] border-gray-100 dark:border-white/5'
                }`}
              />
              
              <div className={`text-sm font-bold text-center leading-relaxed ${
                (hour >= 21 && totalCaffeine >= 50) ? 'text-[#FFD1D1]' : 'dark:text-[#ECE0D1]'
              }`}>
                {isMenstruating && <span className="text-red-400 mr-1">🩸</span>}
                {currentMessage}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>        

      {/* 메시지 및 추가 정보 카드 영역 */}
      <div className="mt-12 w-full max-w-[320px] space-y-4 z-20">
           

        {/* 금단 증상 경고 (조건부 렌더링) */}
        {withdrawalInfo?.isWarning && (
          <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-[28px] border border-red-100 dark:border-red-900/30">
            <p className="text-xs font-bold text-red-500">{withdrawalInfo.message}</p>
          </div>
        )}


      </div>


      {/* 2. [지능형 플로팅 정보창] */}
      <div className="fixed bottom-32 left-0 lg:left-8 w-full lg:w-auto px-6 lg:px-0 flex flex-col gap-3 z-50 pointer-events-none">
        <AnimatePresence>
          
          {/* A. 수면 예측 팝업 */}
          {showSleepCard && (
            <motion.div 
              //상하단 애니메이션을 동일하게 맞춤 (좌측에서 슥- 나타나고 사라짐)
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -30, scale: 0.9 }} 
              key="sleep-status-card"
              className="pointer-events-auto w-full max-w-[320px] mx-auto lg:mx-0 bg-white/80 dark:bg-[#3A312B]/90 backdrop-blur-xl p-5 rounded-[30px] shadow-2xl border border-white/20 relative group transition-all"
            >
              {/* 닫기 버튼: 평소엔 0, 그룹 호버 시 100 */}
              <button 
                onClick={() => setShowSleepCard(false)}
                className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 p-1.5 bg-gray-100 dark:bg-white/10 rounded-full transition-all duration-300"
              >
                <X size={16} />
              </button>

              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Sleep Safety</span>
                {/* 아이콘: 그룹 호버 시 흐릿해짐 */}
                <Moon size={22} className="text-indigo-400 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-black dark:text-[#ECE0D1]">{sleepReadyTime.time} 이후 숙면 가능</p>
                <p className="text-[11px] font-bold text-[#A3978F] leading-tight">💡 {sleepTip}</p>
              </div>

              {totalCaffeine > 0 && (
                <p className="text-[12px] font-bold text-[#E57B3E] mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
                  배출까지 <span className="underline underline-offset-4">{sleepReadyTime.left}</span> 남음
                </p>
              )}
            </motion.div>
          )}

          {/* B. 스마트 추천 팝업 */}
          {showRecCard && (
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -30, scale: 0.9 }} 
              key="recommendation-card"
              className="pointer-events-auto w-full max-w-[320px] mx-auto lg:mx-0 bg-[#E57B3E] dark:bg-[#D97706] p-5 rounded-[30px] shadow-2xl text-white relative group cursor-pointer active:scale-95 transition-all"
              onClick={() => navigate('/add')}
            >
              {/* 닫기 버튼: stopPropagation으로 카드 클릭 이벤트 방지 */}
              <button 
                onClick={(e) => { e.stopPropagation(); setShowRecCard(false); }}
                className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 p-1.5 bg-black/10 rounded-full transition-all duration-300"
              >
                <X size={16} />
              </button>

              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Next Drink</span>
                {/* 💡 아이콘: 그룹 호버 시 흐릿해짐 */}
                <Coffee size={22} className="opacity-50 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              
              <h5 className="font-black text-sm mb-1">{rec.title}</h5>
              <p className="text-[12px] opacity-90 leading-relaxed">{rec.desc}</p>
            </motion.div>
          )}
          
        </AnimatePresence>
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
        
        {/* 몸 상태 기록 버튼 */}
        <div className="mt-8 z-20 w-full max-w-md mx-auto">  
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
      </div>

      {/* 증상 모달 */}
      {isSymptomModalOpen && <SymptomModal onClose={() => setIsSymptomModalOpen(false)} />}
    </div>
  );
}

export default Dashboard;