import { useAtom } from 'jotai'; // useState는 사용하지 않으면 지워도 됩니다
import { caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import { calculateCurrentCaffeine } from '../../lib/utiles';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export const History = () => {
  const [logs, setLogs] = useAtom(caffeineLogsAtom);

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
    <div className="p-6 pb-28 max-w-2xl mx-auto bg-[#FDFAF6] min-h-screen">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-[#5C3D2E]">기록</h2>
        <p className="text-gray-500 font-medium mt-1">내가 마신 커피가 몸속에 얼마나 남아있을까?</p>
      </header>

      {Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-bold">아직 기록된 음료가 없어요 ☕️</div>
      ) : (
        Object.entries(groupedLogs).reverse().map(([date, dateLogs]) => (
          <div key={date} className="mb-8">
            <h3 className="text-sm font-black text-[#5C3D2E] mb-4 bg-[#EFEBE4] py-1 px-3 rounded-full inline-block">
              {date}
            </h3>
            <div className="space-y-4">
              {/* 1. 정렬 후 map 시작 */}
              {dateLogs
                .sort((a, b) => dayjs(b.intakeTime).valueOf() - dayjs(a.intakeTime).valueOf())
                .map((log) => {
                  const currentAmount = calculateCurrentCaffeine(log.caffeineAmount, log.intakeTime);
                  
                  // 2. return 문으로 JSX 반환
                  return (
                    <div key={log.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-gray-800">{log.beverageName}</p>
                        <p className="text-xs text-gray-400 font-medium">{dayjs(log.intakeTime).format('A HH:mm')} 섭취</p>
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
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};