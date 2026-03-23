import { useAtom, useAtomValue } from 'jotai'; // useState는 사용하지 않으면 지워도 됩니다
import { caffeineLogsAtom, userProfileAtom  } from '../../hooks/useCaffeineStore';
import { calculateCurrentCaffeine, getDynamicHalfLife } from '../../lib/utiles';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export const History = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useAtom(caffeineLogsAtom);
  const user = useAtomValue(userProfileAtom);
 
   // 사용자의 현재 반감기 계산 (생리 모드 등 반영)
  const currentHalfLife = getDynamicHalfLife(user);

  // 삭제 함수 (로그 ID를 받아 필터링)
  const deleteLog = (id: string) => {
    if (confirm("이 기록을 삭제할까요?")) {
      setLogs(logs.filter((log) => log.id !== id));
    }
  };

  const groupedLogs = logs.reduce((acc, log) => {
    const date = dayjs(log.intakeTime).format('MM월 DD일 (ddd)');
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, typeof logs>);

  return (
    <div className="p-6 pb-28 max-w-2xl mx-auto bg-[#FDFAF6] dark:bg-transparent min-h-screen transition-colors">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-[#5C3D2E] dark:text-[#F5E8D3]">기록</h2>
        <p className="text-gray-500 dark:text-white/40 font-medium mt-1">내가 마신 커피가 몸속에 얼마나 남아있을까?</p>
      </header>

      {Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-bold">아직 기록된 음료가 없어요 ☕️</div>
      ) : (
        Object.entries(groupedLogs).reverse().map(([date, dateLogs]) => (
          <div key={date} className="mb-8">
            <h3 className="text-sm font-black text-[#5C3D2E] dark:text-[#F5E8D3] mb-4 bg-[#EFEBE4] dark:bg-[#3D2B1F] py-1 px-3 rounded-full inline-block">
              {date}
            </h3>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {/* 1. 정렬 후 map 시작 */}
              {dateLogs
                .sort((a, b) => dayjs(b.intakeTime).valueOf() - dayjs(a.intakeTime).valueOf())
                .map((log) => {
                  const currentAmount = calculateCurrentCaffeine(log.caffeineAmount, log.intakeTime, currentHalfLife);
                  
                  // 2. return 문으로 JSX 반환
                  return (
                    
                    <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50, scale: 0.95 }} // 오른쪽으로 슈슉- 사라지기
                        layout // 삭제 시 다른 아이템들이 스르륵 올라오는 마법
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-[#3A312B] p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex justify-between items-center group transition-colors"
                      >
                      <div>
                        <p className="font-bold text-gray-800 dark:text-[#F5E8D3]">{log.beverageName}</p>
                        <p className="text-xs text-gray-400 dark:text-white/30 font-medium">{dayjs(log.intakeTime).format('A HH:mm')} 섭취</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-black text-xl text-[#E57B3E]">{currentAmount}mg</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">잔존량</p>
                        </div>
                        
                        {/* 삭제 버튼 */}
                        <button 
                          onClick={() => deleteLog(log.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors text-xl font-light"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
            </div>
          </div>
        ))
      )}
      {/* 4. 🚀 음료 추가 플로팅 버튼 (FAB) */}
      <div className="fixed bottom-28 right-6 z-50">
        <button 
          onClick={() => navigate('/add')}
          className="w-16 h-16 bg-[#E57B3E] dark:bg-[#D97706] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <Plus size={32} strokeWidth={3} />
          {/* 버튼 옆에 살짝 뜨는 라벨 (선택 사항) */}
          <span className="absolute right-20 bg-[#5C3D2E] dark:bg-[#ECE0D1] text-white dark:text-[#3D3630] text-[10px] font-black px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
            음료 추가하기
          </span>
        </button>
      </div>
    </div>
  );
};