import { useAtom, useAtomValue } from 'jotai';
import { userProfileAtom, caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import { motion } from 'framer-motion';
import { getReceptorRecovery } from '../../lib/utiles';

export const Goals = () => {
  const [user, setUser] = useAtom(userProfileAtom);
  const logs = useAtomValue(caffeineLogsAtom); 

  const updateWeek = (week: number) => {
    setUser({ ...user, taperingWeek: Math.max(1, Math.min(week, 4)) });
  };

  const recovery = getReceptorRecovery(logs);
  // 아낀 돈 계산 (사용자의 평소 섭취량 기반으로 안 마신 양만큼 계산)
  const savedMoney = user.isTapering ? (user.baseIntake > 0 ? 4500 * user.taperingWeek : 0) : 0;

  return (
    <div className="p-6 pb-28 max-w-2xl mx-auto bg-[#FDFAF6] dark:bg-transparent min-h-screen">
      <h2 className="text-3xl font-black text-[#5C3D2E] dark:text-[#F5E8D3] mb-8">목표 관리</h2>
      
      {/* 챌린지 카드 */}
      <div className="bg-white dark:bg-[#3A312B] p-8 rounded-[30px] shadow-sm  text-center">
        <p className="text-sm font-bold text-[#E57B3E] mb-2">4주 카페인 감량 챌린지</p>
        <h3 className="text-2xl font-black mb-6">{user.taperingWeek}주차 진행 중</h3>
        
        {/* 진행률 시각화 */}
        <div className="w-full h-4 border-gray-100 dark:border-white/5 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-[#E57B3E] transition-all" style={{ width: `${(user.taperingWeek / 4) * 100}%` }} />
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={() => updateWeek(user.taperingWeek - 1)} className="px-6 py-2 border-gray-100 dark:border-white/5 rounded-full font-bold">이전 주</button>
          <button onClick={() => updateWeek(user.taperingWeek + 1)} className="px-6 py-2 text-[#5C3D2E] dark:text-[#F5E8D3] rounded-full font-bold">다음 주</button>
        </div>
      </div>
        {/* 뇌 민감도 회복 카드 */}
          <div className="bg-[#F4F1EA] dark:bg-[#3A312B] p-6 rounded-[30px] mb-6 border border-white/10 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black dark:text-[#ECE0D1]">뇌 수용체 민감도 회복</h4>
              <span className="text-[#D97706] font-black text-xl">{recovery}%</span>
            </div>
            <div className="h-4 w-full bg-white/20 rounded-full overflow-hidden p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${recovery}%` }}
                className="h-full bg-gradient-to-r from-[#D97706] to-[#E57B3E] rounded-full"
              />
            </div>
            <p className="text-[11px] mt-3 opacity-60 leading-relaxed">
              카페인을 쉬면 뇌의 아데노신 수용체가 다시 정상으로 돌아와요. <br/>
              **현재 뇌 세포가 다시 예민해지는 중!** 🧠
            </p>
          </div>

          {/* 경제적 보상 카드 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#3A312B] p-5 rounded-[25px] shadow-sm border border-gray-50 dark:border-white/5">
                <p className="text-[10px] font-black opacity-40 uppercase mb-1">Saved Money</p>
                <p className="text-lg font-black text-green-600">₩{savedMoney.toLocaleString()}</p>
                <p className="text-[9px] opacity-50">커피 1잔값 절약 중</p>
            </div>
            <div className="bg-white dark:bg-[#3A312B] p-5 rounded-[25px] shadow-sm border border-gray-50 dark:border-white/5">
                <p className="text-[10px] font-black opacity-40 uppercase mb-1">Avoided Headache</p>
                <p className="text-lg font-black text-blue-500">85%</p>
                <p className="text-[9px] opacity-50">금단 두통 안전권</p>
            </div>
          </div>
        </div>
      );
};