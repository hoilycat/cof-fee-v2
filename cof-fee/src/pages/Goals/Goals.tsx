import { useAtom } from 'jotai';
import { userProfileAtom } from '../../hooks/useCaffeineStore';

export const Goals = () => {
  const [user, setUser] = useAtom(userProfileAtom);

  const updateWeek = (week: number) => {
    setUser({ ...user, taperingWeek: Math.max(1, Math.min(week, 4)) });
  };

  return (
    <div className="p-6 pb-28 max-w-2xl mx-auto bg-[#FDFAF6] min-h-screen">
      <h2 className="text-3xl font-black text-[#5C3D2E] mb-8">목표 관리</h2>
      
      {/* 챌린지 카드 */}
      <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 text-center">
        <p className="text-sm font-bold text-[#E57B3E] mb-2">4주 카페인 감량 챌린지</p>
        <h3 className="text-2xl font-black mb-6">{user.taperingWeek}주차 진행 중</h3>
        
        {/* 진행률 시각화 */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-[#E57B3E] transition-all" style={{ width: `${(user.taperingWeek / 4) * 100}%` }} />
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={() => updateWeek(user.taperingWeek - 1)} className="px-6 py-2 bg-gray-100 rounded-full font-bold">이전 주</button>
          <button onClick={() => updateWeek(user.taperingWeek + 1)} className="px-6 py-2 bg-[#5C3D2E] text-white rounded-full font-bold">다음 주</button>
        </div>
      </div>
    </div>
  );
};