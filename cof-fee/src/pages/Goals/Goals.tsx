import { useAtom, useAtomValue } from 'jotai';
import { userProfileAtom, caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import { motion } from 'framer-motion';
import { getReceptorRecovery, getCleanStreak, checkDrankOnDate, getTotalSavedMoney, getNow } from '../../lib/utiles';
import { ChevronLeft, ChevronRight, Trophy, Heart, Calendar  } from 'lucide-react';
import dayjs from 'dayjs';
import { useState } from 'react';

export const Goals = () => {
  const [user, setUser] = useAtom(userProfileAtom);
  const logs = useAtomValue(caffeineLogsAtom); 

  // 1. 졸업 여부 확인 (주차가 4보다 크면 졸업으로 간주)
  const isGraduated = user.taperingWeek > 4;


  const updateWeek = (week: number) => {
    setUser({ ...user, taperingWeek: Math.max(1, Math.min(week, 5)) });
  };


  // 캘린더 날짜 관리를 위한 상태
  const [currentMonth, setCurrentMonth] = useState(getNow());

  const recovery = getReceptorRecovery(logs);
  const streak = getCleanStreak(logs, user.challengeStartedAt);

  // 아낀 돈 계산 (사용자의 평소 섭취량 기반으로 안 마신 양만큼 계산)
  const savedMoney = getTotalSavedMoney(logs, user.challengeStartedAt);

  // 챌린지 며칠째인지 계산 (D+Day)
  const startDate = dayjs(user.challengeStartedAt);
  const daysSinceStart = getNow().diff(startDate, 'day') + 1;


  // --- 캘린더 생성 로직 ---
  const startDay = currentMonth.startOf('month').day(); // 1일의 요일
  // const daysInMonth = currentMonth.daysInMonth();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = currentMonth.startOf('month').add(i - startDay, 'day');
    return day;
  });

  // 2. 각 주차별 실제 목표 수치 계산 (baseIntake 기준)
  const getTargetMg = (ratio: number) => Math.round(user.baseIntake * ratio);

  const TAPER_PHASES = [
    { week: 1, label: '적응기', ratio: 0.75, desc: '기존의 75%만 섭취하기', color: '#E57B3E' },
    { week: 2, label: '변화기', ratio: 0.50, desc: '기존의 50%만 섭취하기', color: '#D97706' },
    { week: 3, label: '회복기', ratio: 0.25, desc: '기존의 25%만 섭취하기', color: '#B45309' },
    { week: 4, label: '완성기', ratio: 0.125, desc: '최소량(12.5%) 유지하기', color: '#10B981' },
  ];

  return (
  
      <div className="p-6 pb-28 max-w-2xl mx-auto min-h-screen transition-colors">
        <header className="mb-10 px-2">
          <div>
            <h2 className="text-3xl font-black text-[#5C3D2E] dark:text-[#F5E8D3]">나의 여정</h2>
            <p className="text-gray-500 dark:text-white/40 font-medium mt-1">카페인과 거리를 두는 중</p>
          </div>
          {/* 시작일 표시 섹션 */}
          <div className="text-right pb-1">
            <p className="text-[10px] font-black opacity-30 uppercase dark:text-white">Started At</p>
            <p className="text-xs font-bold text-[#E57B3E]">{user.challengeStartedAt || '기록 없음'}</p>
          </div>
        </header>


      {/* 1. 무카페인 스트릭(연속 기록) 카드 */}
      <div className="bg-[#E57B3E] dark:bg-[#D97706] p-6 rounded-[35px] shadow-lg mb-6 text-white flex justify-between items-center relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-black">D+{daysSinceStart}</span>
          <p className="text-[11px] font-black opacity-80 uppercase tracking-widest mb-1">Clean Streak</p>
          </div>
          <h3 className="text-4xl font-black">{streak}일째</h3>
          <p className="text-xs font-bold opacity-90 mt-1">
            {streak > 0 ? "정말 대단해요! 뇌가 맑아지고 있어요 🧠" : "내일부터 다시 1일 시작해볼까요?"}
          </p>
        </div>
        <Trophy size={60} className="opacity-20 absolute -right-2 -bottom-2 rotate-12" />
      </div>    

           {/* 3. 챌린지 로드맵 혹은 졸업 카드 */}
      {isGraduated ? (
        // 🎓 졸업 카드 (4주 성공 시)
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#E57B3E] to-[#D97706] p-8 rounded-[40px] shadow-lg mb-8 text-white text-center relative overflow-hidden"
        >
          <Trophy size={100} className="mx-auto mb-4 opacity-50 absolute -top-4 -right-4 rotate-12" />
          <h3 className="text-2xl font-black mb-2">카페인 여정 졸업! 🎉</h3>
          <p className="text-sm opacity-90 leading-relaxed mb-6">
            4주간의 힘든 과정을 모두 마쳤습니다. <br/>
            이제 뇌세포는 아주 깨끗하고 민감해졌어요!
          </p>
          <button 
            onClick={() => setUser({...user, isTapering: false, taperingWeek: 0})}
            className="bg-white text-[#D97706] px-6 py-3 rounded-full font-black text-sm shadow-md active:scale-95 transition-transform"
          >
            새로운 여정 시작하기
          </button>
        </motion.div>
      ) : (
        // 🚩 진행 중인 로드맵
        <div className="bg-white dark:bg-[#3A312B] p-7 rounded-[40px] shadow-sm border border-gray-100 dark:border-white/5 mb-8">
          <div className="flex justify-between items-center mb-8 px-1">
            <h4 className="font-black dark:text-[#ECE0D1]">4주 감량 로드맵</h4>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-[#E57B3E] uppercase tracking-tighter">My Base</span>
               <span className="text-xs font-bold dark:text-[#A3978F]">{user.baseIntake}mg</span>
            </div>
          </div>
          
          <div className="space-y-6 relative mb-8">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-white/5 z-0" />
            {TAPER_PHASES.map((phase) => {
              const isCurrent = user.taperingWeek === phase.week;
              const isDone = user.taperingWeek > phase.week;
              const targetMg = getTargetMg(phase.ratio); // 💡 실제 수치 계산

              return (
                <div key={phase.week} className={`flex items-start gap-4 relative z-10 transition-all ${isCurrent ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    isDone ? 'bg-green-500 text-white' : isCurrent ? 'bg-[#E57B3E] text-white' : 'bg-gray-200 dark:bg-[#4A423B]'
                  }`}>
                    {isDone ? '✓' : phase.week}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex justify-between items-center">
                      <p className={`text-sm font-black ${isCurrent ? 'dark:text-[#F5E8D3]' : 'dark:text-[#A3978F]'}`}>
                        {phase.label} (목표: <span className="text-[#E57B3E]">{targetMg}mg</span>)
                      </p>
                      {isCurrent && (
                        <button onClick={() => updateWeek(user.taperingWeek + 1)} className="text-[10px] font-bold text-[#E57B3E] bg-[#E57B3E]/10 px-2 py-1 rounded-lg">다음 단계</button>
                      )}
                    </div>
                    <p className="text-[11px] font-medium opacity-60 dark:text-[#A3978F]">{phase.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
            {/*이번주 다음주 이동 버튼*/}
            <div className="flex justify-center gap-4">
              <button onClick={() => updateWeek(user.taperingWeek - 1)} className="px-6 py-2 border-gray-100 dark:border-white/5 rounded-full font-bold">이전 주</button>
              <button onClick={() => updateWeek(user.taperingWeek + 1)} className="px-6 py-2 text-[#5C3D2E] dark:text-[#F5E8D3] rounded-full font-bold">다음 주</button>
            </div>
        </div>
      )}


        {/* 뇌 민감도 회복 카드 */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white dark:bg-[#3A312B] p-6 rounded-[30px] shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-red-400 fill-red-400" />
                <h4 className="text-sm font-black dark:text-[#ECE0D1]">뇌 수용체 민감도 회복</h4>
              </div>
              <span className="text-[#D97706] font-black text-xl">{recovery}%</span>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${recovery}%` }}
                className="h-full bg-gradient-to-r from-[#E57B3E] to-[#D97706] rounded-full"
              />
            </div>
            
            {/*두 문구가 번갈아서 나오도록 조정*/}
            <p className="text-[11px] mt-4 opacity-50 dark:text-[#A3978F] leading-relaxed">
              {recovery > 80 
                ? "✨ 안전권입니다! 두통 없이 깨끗한 상태를 유지 중이에요." 
                : "🧠 카페인을 쉬면 뇌세포가 예민해져 적은 양으로도 각성 효과를 봅니다."}
            </p>
          </div>
        </div>

          {/* 이별 캘린더 */}
          <div className="bg-white dark:bg-[#3A312B] p-6 rounded-[35px] shadow-sm border border-gray-100 dark:border-white/5 mb-8">
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex items-center gap-2 text-[#5C3D2E] dark:text-[#F5E8D3]">
                <Calendar size={18} />
                <h4 className="font-black">이별 캘린더</h4>
              </div>
              <div className="flex items-center gap-4 bg-[#F4F1EA] dark:bg-[#4A423B] py-1 px-3 rounded-full">
                <button onClick={() => setCurrentMonth(prev => prev.subtract(1, 'month'))} className="dark:text-white"><ChevronLeft size={16}/></button>
                <span className="text-[11px] font-black dark:text-[#ECE0D1] min-w-[70px] text-center">{currentMonth.format('YYYY.MM')}</span>
                <button onClick={() => setCurrentMonth(prev => prev.add(1, 'month'))} className="dark:text-white"><ChevronRight size={16}/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-y-4 text-center">
              {['일','월','화','수','목','금','토'].map(d => (
                <span key={d} className="text-[10px] font-black opacity-30 dark:text-white uppercase">{d}</span>
              ))}
             {calendarDays.map((date, i) => {
              const isCurrentMonth = date.isSame(currentMonth, 'month');
              const hasCaffeine = checkDrankOnDate(logs, date);
              const isToday = date.isSame(getNow(), 'day');

              // 1. 챌린지 시작일 가져오기 (dayjs 객체로 변환)
              const challengeStartDate = user.challengeStartedAt ? dayjs(user.challengeStartedAt).startOf('day') : null;

              // 2. 이 날짜가 챌린지 기간에 포함되는지 확인 (시작일 이후 ~ 오늘까지)
              // 조건: 시작일이 존재함 && (시작일과 같거나 이후임) && (오늘과 같거나 이전임)
              const isChallengeDay = challengeStartDate && 
                (date.isSame(challengeStartDate, 'day') || date.isAfter(challengeStartDate, 'day')) &&
                (date.isSame(getNow(), 'day') || date.isBefore(getNow(), 'day'));


              return (
                <div key={i} className="flex flex-col items-center justify-center relative py-1">
                  {/* 날짜 숫자 표시 */}
                  <span className={`text-xs font-bold transition-colors ${
                    isToday ? 'text-[#E57B3E]' : isCurrentMonth ? 'dark:text-[#ECE0D1]' : 'opacity-10 dark:text-white'
                  }`}>
                    {date.date()}
                  </span>

                  {/* 3. 도장 로직 최적화 */}
                  <div className="h-1.5 w-1.5 mt-1.5 flex items-center justify-center">
                    {hasCaffeine ? (
                      // 카페인을 마셨다면 무조건 주황색 점
                      <div className="w-1.5 h-1.5 bg-[#E57B3E] rounded-full shadow-[0_0_4px_#E57B3E]" title="카페인 섭취" />
                    ) : (
                      // 안 마셨는데, 챌린지 기간(시작일~오늘)에 해당한다면 초록색 점 (클린 데이)
                      isChallengeDay && isCurrentMonth && (
                        <div className="w-1.5 h-1.5 bg-green-500/60 rounded-full" title="클린 데이" />
                      )
                    )}
                  </div>

          {/* 오늘 날짜 하단 인디케이터 */}
          {isToday && <div className="absolute -bottom-1 w-4 h-0.5 bg-[#E57B3E] rounded-full opacity-50" />}
            </div>
          );
          })}
          </div>
          <div className="mt-6 mb-6 flex justify-center gap-6 border-t border-gray-100 dark:border-white/5 pt-4">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#E57B3E] rounded-full" />
                  <span className="text-[10px] font-bold opacity-50 dark:text-white">카페인 섭취</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500/40 rounded-full" />
                  <span className="text-[10px] font-bold opacity-50 dark:text-white">클린 데이</span>
              </div>
            </div>


      {/* 4. 최종 보상 리포트 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#3A312B] p-6 rounded-[30px] shadow-sm border border-gray-100 dark:border-white/5">
            <p className="text-[10px] font-black opacity-40 uppercase mb-1 dark:text-white">절약된 커피값</p>
            <h4 className="text-xl font-black text-green-600 dark:text-green-400">₩{savedMoney.toLocaleString()}</h4>
            <p className="text-[9px] font-bold opacity-40 mt-1">지갑도 건강해지는 중</p>
        </div>
        <div className="bg-white dark:bg-[#3A312B] p-6 rounded-[30px] shadow-sm border border-gray-100 dark:border-white/5">
            <p className="text-[10px] font-black opacity-40 uppercase mb-1 dark:text-white">금단 증상 지수</p>
            <h4 className="text-xl font-black text-blue-500 dark:text-blue-300">{Math.max(0, 100 - recovery)}%</h4>
            <p className="text-[9px] font-bold opacity-40 mt-1">낮을수록 안전해요</p>
        </div>
      </div>
    </div>
  </div>
  );
};