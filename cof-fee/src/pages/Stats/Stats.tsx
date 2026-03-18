import { useAtomValue } from 'jotai';
import { caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

  return (
    <>
    <div className="p-6 pb-28 max-w-2xl mx-auto bg-[#FDFAF6] min-h-screen">
      <h2 className="text-3xl font-black text-[#5C3D2E] mb-8">통계</h2>
      
      <div className="bg-white p-6 rounded-[30px] shadow-sm h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis fontSize={12} axisLine={false} tickLine={false} /> 
            <Tooltip cursor={{fill: '#F4F1EA'}} />
            <Bar dataKey="total" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.total > 400 ? '#E05252' : '#E57B3E'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-center text-gray-400 font-medium mt-6 text-sm">
        빨간색 막대는 권장량(400mg)을 초과한 날이에요!
      </p>
    </div>
    <div className="mt-10 bg-white p-6 rounded-[30px] shadow-sm">
    <h3 className="font-black text-[#5C3D2E] mb-4">💡 카페인 배출 꿀팁</h3>
    <ul className="text-sm text-gray-600 font-medium space-y-2 list-disc pl-4">
        <li>물 많이 마시기 (커피 1잔당 물 2잔)</li>
        <li>가벼운 유산소 운동으로 신진대사 높이기</li>
        <li>십자화과 채소(브로콜리, 양배추) 챙겨 먹기</li>
        <li>단백질과 함께 섭취하여 위산 자극 줄이기</li>
    </ul>
    </div>
    </>
  );
};
