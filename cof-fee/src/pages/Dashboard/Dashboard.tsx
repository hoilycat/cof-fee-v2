import { useNavigate } from 'react-router-dom';
import { useCaffeine } from '../../hooks/useCaffeine';
import { useAtomValue } from 'jotai'; 
import { dailyGoalAtom } from '../../hooks/useCaffeineStore';


const Dashboard = () => { 
  const navigate = useNavigate();
  const { totalCaffeine, sleepStatus, characterStatus } = useCaffeine();
  const dailyGoal = useAtomValue(dailyGoalAtom);

  // 퍼센트 계산 (최대 100%)
  const percentage = Math.min((totalCaffeine / dailyGoal) * 100, 100);

  // 캐릭터 메시지 로직
  const getMessage = () => {
    if (characterStatus === 'IDLE') return "오늘 하루도 상쾌하게 시작해볼까요?";
    if (characterStatus === 'ACTIVE') return "집중력 최고! 무리하진 마세요.";
    if (characterStatus === 'ANXIOUS') return "잠깐, 손이 떨리지 않나요?";
    return "지금 더 마시면 위험해요! 🚨"; // DANGER 상태
  };

  return (
    <div className="p-6 flex flex-col items-center pt-12 w-full max-w-md mx-auto">
      {/* 1. 상태 메시지 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {totalCaffeine}<span className="text-xl">mg</span> 
          <span className="text-sm font-normal text-gray-400 ml-2">/ {dailyGoal}mg</span>
        </h1>
        <p className="text-green-400 font-medium min-h-[1.5rem]">{getMessage()}</p>
      </div>

      {/* 2. 캐릭터 영역 */}
      {/* border-green-500 색상이 게이지가 차오르는 느낌을 줍니다 */}
      <div className="relative w-64 h-64 bg-gray-800 rounded-full flex items-center justify-center mb-8 border-4 border-gray-700 overflow-hidden">
         
         {/* 배경 게이지 (차오르는 효과) */}
         <div 
           className="absolute bottom-0 w-full bg-green-900/50 transition-all duration-1000 ease-in-out"
           style={{ height: `${percentage}%` }} 
         />
         
         {/* 캐릭터 이모지 */}
         <div className="z-10 text-8xl animate-bounce drop-shadow-2xl">
           {characterStatus === 'DANGER' ? '🤮' : characterStatus === 'ANXIOUS' ? '😵‍💫' : characterStatus === 'ACTIVE' ? '🤩' : '☕️'}
         </div>
      </div>

      {/* 3. 정보 카드 */}
      <div className="w-full grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-xl text-center border border-gray-700">
          <div className="text-gray-400 text-xs mb-1">수면 예측</div>
          <div className={`text-lg font-bold ${sleepStatus === 'BAD' ? 'text-red-400' : sleepStatus === 'FAIR' ? 'text-yellow-400' : 'text-blue-400'}`}>
            {sleepStatus === 'GOOD' ? '꿀잠 가능 🌙' : sleepStatus === 'FAIR' ? '약간 위험 🥱' : '말똥말똥 👀'}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center border border-gray-700">
          <div className="text-gray-400 text-xs mb-1">현재 상태</div>
          <div className={`text-lg font-bold ${characterStatus === 'DANGER' ? 'text-red-500' : 'text-yellow-400'}`}>
            {characterStatus}
          </div>
        </div>
      </div>

      {/* 4. 기록 버튼 */}
      <button 
        onClick={() => navigate('/add')}
        className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-colors"
      >
        + 커피 마시기
      </button>
    </div>
  );
}

export default Dashboard;