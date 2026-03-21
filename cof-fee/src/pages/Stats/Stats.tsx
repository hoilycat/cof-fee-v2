import { useAtomValue } from 'jotai';
import { caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { userProfileAtom } from '../../hooks/useCaffeineStore';
import dayjs from 'dayjs';

export const Stats = () => {
  const logs = useAtomValue(caffeineLogsAtom);

  // 최근 7일 데이터 가공
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = dayjs().subtract(6 - i, 'day').format('MM/DD');
    const total = logs
      .filter(l => dayjs(l.intakeTime).format('MM/DD') === date)
      .reduce((sum, l) => sum + l.caffeineAmount, 0);
    return { date, total };
  });
  const isDark = useAtomValue(userProfileAtom).isDarkMode;

  return (
    <>
    <div className="p-6 pb-28 max-w-2xl mx-auto bg-[#FDFAF6] dark:bg-transparent min-h-screen">
      <h2 className="text-3xl font-black text-[#5C3D2E] dark:text-[#F5E8D3] mb-8">통계</h2>
      
      <div className="bg-white dark:bg-[#3A312B]/70 backdrop-blur-md p-6 rounded-[30px] shadow-sm h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis fontSize={12} axisLine={false} tickLine={false} /> 
            <Tooltip 
              cursor={{ 
                // 유령 기둥 색깔 바꾸기
                fill: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F4F1EA' 
              }} 
              contentStyle={{ 
                // 툴팁 상자 배경색 & 글자색 바꾸기
                backgroundColor: isDark ? '#2C1B12' : '#FFFFFF', 
                color: isDark ? '#F5E8D3' : '#5C3D2E',
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
              itemStyle={{ 
                // 툴팁 안의 숫자 색깔 바꾸기
                color: isDark ? '#E57B3E' : '#E05252',
                fontWeight: '900'
              }}
            />
            <Bar dataKey="total" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.total > 400 ? '#E05252' : '#E57B3E'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-center text-gray-400 dark:text-[#A3978F] font-medium mt-6 text-sm">
        빨간색 막대는 권장량(400mg)을 초과한 날이에요!
      </p>
    </div>
    <div className="mt-10 bg-white dark:bg-[#3D2B1F] p-6 rounded-[30px] shadow-sm">
    <h3 className="font-black text-[#5C3D2E] dark:text-[#F5E8D3] mb-4">💡 카페인 배출 꿀팁</h3>
    <ul className="text-sm text-gray-600 dark:text-[#A3978F] font-medium space-y-2 list-disc pl-4">
        <li>물 많이 마시기 (커피 1잔당 물 2잔)</li>
        <li>가벼운 유산소 운동으로 신진대사 높이기</li>
        <li>십자화과 채소(브로콜리, 양배추) 챙겨 먹기</li>
        <li>단백질과 함께 섭취하여 위산 자극 줄이기</li>
    </ul>
    </div>
    </>
  );
};
