import { getNow } from '../../lib/utiles'
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { userProfileAtom, dailyGoalAtom } from '../../hooks/useCaffeineStore';
import { Emoji3D } from '../../components/Emoji3D';

const DSM5_QUESTIONS = [
  "카페인을 끊거나 줄이려고 시도했지만 번번이 실패했다.",
  "카페인을 마시지 않으면 두통, 피로, 우울감 등 금단 증상이 나타난다.",
  "금단 증상을 피하거나 없애기 위해 다시 카페인을 찾게 된다.",
  "위장장애, 불면증 등 신체/심리적 문제가 생겨도 계속 마신다.",
  "평소보다 더 많은 양을 마셔야 예전과 같은 각성 효과를 느낀다.",
  "카페인 섭취(커피 마시기 등)에 많은 시간과 돈을 소비한다.",
  "카페인 때문에 중요한 업무, 학업, 여가 활동에 지장을 받은 적이 있다.",
  "커피(카페인)에 대한 강한 갈망이나 욕구를 느낀다.",
  "직장, 학교, 가정에서 맡은 바 책임을 다하지 못할 정도로 의존한다."
];

const Onboarding = () => {
  const setUserProfile = useSetAtom(userProfileAtom);
  const setDailyGoal = useSetAtom(dailyGoalAtom);

  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');
  const [answers, setAnswers] = useState<boolean[]>(Array(9).fill(false));

  // 시스템 테마나 이전 다크모드 설정을 확인하여 배경색 유지
  const bgColor = "bg-[#FDFAF6] dark:bg-[#483C32]";
  const textColor = "text-[#5C3D2E] dark:text-[#F5E8D3]";
  const cardColor = "bg-white dark:bg-[#3A312B]";

  const toggleAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = !newAnswers[index];
    setAnswers(newAnswers);
  };

  const handleComplete = (isTapering: boolean) => {
    const score = answers.filter(Boolean).length;
    const safeGoal = Math.min(Number(weight || 60) * 6, 400); 

    setUserProfile((prev) => ({
      ...prev,
      nickname: nickname || '물괭이',
      weight: Number(weight || 60),
      gender,
      dsm5Score: score,
      isTapering,
      taperingWeek: isTapering ? 1 : 0,
      baseIntake: safeGoal,
      hasCompletedOnboarding: true,
      challengeStartedAt: getNow().format('YYYY-MM-DD'),
      sensitivity: 'NORMAL',
      preferredBedtime: '23:00',
    }));
    
    setDailyGoal(isTapering ? safeGoal * 0.75 : safeGoal);
  };

  const score = answers.filter(Boolean).length;
  const severity = score >= 6 ? '중증 🚨' : score >= 4 ? '중등도 ⚠️' : score >= 2 ? '경도 🌱' : '정상 🌿';

  return (
    <div className={`min-h-screen ${bgColor} p-6 flex flex-col items-center transition-colors duration-500`}>
      <div className="w-full max-w-lg">
        {step === 1 && (
          <div className="flex flex-col h-full animate-fade-in  items-center">
            <div className="text-6xl text-center mt-16 mb-10">
              <Emoji3D type="Coffee_3D" size={100} animate />
            </div>
            <h2 className="text-2xl font-black text-center text-[#5C3D2E] dark:text-[#F5E8D3] mb-2">환영해요!</h2>
            <p className="text-center text-gray-500 dark:text-[#A3978F] font-medium mb-10">안전한 커피 생활을 위해<br/>몇 가지 정보가 필요해요.</p>

            <div className="space-y-6 flex-1">
              <input 
                type="text" placeholder="이름이나 애칭을 적어주세요" value={nickname} onChange={(e) => setNickname(e.target.value)}
                className={`w-full p-5 ${cardColor} ${textColor} border-gray-100 dark:border-white/5 rounded-2xl font-bold shadow-sm outline-none focus:ring-4 focus:ring-[#E57B3E]/30`}
              />
              <div className="flex gap-4">
                <button onClick={() => setGender('F')} className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-sm ${gender === 'F' ? 'bg-[#E57B3E] text-white' : 'bg-white dark:bg-[#3A312B] text-gray-400'}`}>여성</button>
                <button onClick={() => setGender('M')} className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-sm ${gender === 'M' ? 'bg-[#E57B3E] text-white' : 'bg-white dark:bg-[#3A312B] text-gray-400'}`}>남성</button>
              </div>
              <div className="relative">
                <input 
                  type="number" placeholder="몸무게를 적어주세요" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                  className={`w-full p-5 ${cardColor} ${textColor} border-gray-100 dark:border-white/5 rounded-2xl font-bold shadow-sm outline-none focus:ring-4 focus:ring-[#E57B3E]/30`}
                />
                <span className="absolute right-5 top-5 font-bold text-gray-400">kg</span>
              </div>
            </div>
            
            <button onClick={() => setStep(2)} disabled={!nickname || !weight || !gender} className="w-full bg-[#E57B3E] disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white py-5 rounded-2xl font-bold text-lg mt-8 shadow-sm">
              다음으로
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="text-center mb-6 mt-6">
              <span className="text-sm font-bold text-[#E57B3E] bg-[#E57B3E]/10 px-3 py-1 rounded-full">스마트 진단</span>
            </div>
            <h2 className={`text-2xl font-black ${textColor} mb-2 leading-tight`}>최근 1년 동안의<br/>경험을 체크해주세요</h2>
            <p className="text-sm text-gray-500 dark:text-[#A3978F] font-medium mb-6">해당하는 항목을 모두 선택해주세요.</p>

            <div className="flex-1 overflow-y-auto space-y-3 pb-8 max-h-[60vh] no-scrollbar">
              {DSM5_QUESTIONS.map((q, idx) => (
                <button 
                  key={idx} onClick={() => toggleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-2xl transition-all shadow-sm border ${answers[idx] ? 'bg-[#FFF4ED] dark:bg-[#E57B3E]/20 border-[#E57B3E] text-[#5C3D2E] dark:text-[#F5E8D3]' : 'bg-white dark:bg-[#3A312B] border-transparent text-gray-600 dark:text-[#A3978F]'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${answers[idx] ? 'border-[#E57B3E] bg-[#E57B3E]' : 'border-gray-300 dark:border-white/10'}`}>
                      {answers[idx] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm font-bold leading-relaxed">{q}</span>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={() => setStep(3)} className="w-full bg-[#E57B3E] text-white py-5 rounded-2xl font-bold text-lg mt-4 shadow-sm shrink-0">
              진단 결과 보기
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col h-full animate-fade-in items-center ">
            <div className="text-6xl mb-6 ">
              {/* 3. 점수에 따라 아이콘 변경 (정상일 때 보라색 잔 노출) */}
              {score >= 6 ? (
                <span className="text-7xl">🤯</span> // 중증은 강렬하게 유지하거나 다른 아이콘
              ) : score >= 4 ? (
                <Emoji3D type="Pill_3D" size={100} animate /> // 중등도는 주의(전구) 아이콘
              ) : (
                <Emoji3D type="Coffee_3D" size={100} animate /> // 경도/정상은 이쁜 보라색 잔!
              )}
            </div>
            <h2 className="text-3xl font-black text-center text-[#5C3D2E] dark:text-[#F5E8D3] mb-2">진단 완료!</h2>
            
            <div className={`${cardColor} p-6 rounded-[30px] shadow-sm text-center my-6 border border-gray-100 dark:border-white/5`}>
              <p className="text-gray-500 dark:text-[#A3978F] font-medium mb-1">나의 카페인 사용 장애 수준</p>
              <div className="text-2xl font-black text-[#E57B3E] mb-3">{severity}</div>
              <p className={`text-sm font-medium bg-gray-50 dark:bg-[#29221e] p-3 rounded-xl ${textColor}`}>
                {score >= 4 ? '관리가 필요한 상태예요. 안전한 감량 계획을 추천합니다.' : '아직 괜찮은 편이지만, 안전한 루틴을 만들어봐요!'}
              </p>
            </div>

            <div className="space-y-4 mt-auto mb-8">
              <button onClick={() => handleComplete(true)} className="w-full bg-[#5C3D2E] dark:bg-[#E57B3E] text-white p-6 rounded-3xl text-left shadow-md transition-transform active:scale-95">
                <div className="font-black text-xl mb-1">👋 이별 트랙 시작하기</div>
                <div className="text-sm text-white/80 font-medium">4주 동안 천천히 건강하게 줄여볼래요</div>
              </button>
              <button onClick={() => handleComplete(false)} className={`w-full ${cardColor} border border-gray-200 dark:border-white/5 ${textColor} p-6 rounded-3xl text-left shadow-sm transition-transform active:scale-95`}>
                <div className="font-black text-xl mb-1">🌿 안전 트랙 유지하기</div>
                <div className="text-sm text-gray-500 dark:text-[#A3978F] font-medium">지금처럼 마시되 내 몸의 신호만 확인할래요</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;