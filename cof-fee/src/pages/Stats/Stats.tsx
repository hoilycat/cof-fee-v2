import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import { caffeineLogsAtom, symptomLogsAtom, userProfileAtom } from '../../hooks/useCaffeineStore';
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ComposedChart, Scatter } from 'recharts';
import { Activity, AlertCircle, Coffee, Moon, Sun } from 'lucide-react';
import { analyzeSymptomCorrelation, getFastingReport, getNow  } from '../../lib/utiles'; 
import dayjs from 'dayjs';


export const Stats = () => {
  const [isMounted, setIsMounted] = useState(false);
  const logs = useAtomValue(caffeineLogsAtom);
  const symptoms = useAtomValue(symptomLogsAtom);
  const user = useAtomValue(userProfileAtom);//user 객체를 가져오기
  const isDark = user.isDarkMode; 
  const fastingReport = getFastingReport(logs);


  useEffect(() => {
  const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);


  // 최근 7일 데이터 가공
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const dateStr = getNow().subtract(6 - i, 'day').format('MM/DD');
    const fullDate = getNow().subtract(6 - i, 'day').format('YYYY-MM-DD');
    
    const dailyLogs = logs.filter(l => dayjs(l.intakeTime).format('YYYY-MM-DD') === fullDate);
    const dailyCaffeine = dailyLogs.reduce((sum, l) => sum + l.caffeineAmount, 0);
    
    // 해당 날짜에 기록된 증상이 있는지 확인
    const dailySymptoms = symptoms.filter(s => dayjs(s.recordTime).format('YYYY-MM-DD') === fullDate);
    
    return { 
      date: dateStr, 
      total: dailyCaffeine,
      hasSymptom: dailySymptoms.length > 0,
      symptomCount: dailySymptoms.length,
      // 오후 3시(15시) 이후 섭취량 계산
      lateIntake: dailyLogs.filter(l => dayjs(l.intakeTime).hour() >= 15).length > 0,
       // 오전에만 마셨는지 여부
      onlyMorning: dailyLogs.length > 0 && dailyLogs.every(l => dayjs(l.intakeTime).hour() < 15)
    };
  });

 const chartDataWithSymptoms = chartData.map(d => ({
    ...d,
    symptomPoint: d.hasSymptom ? d.total : null 
  }));

  // 2. 인사이트 데이터 계산
  const avgCaffeine = Math.round(chartData.reduce((acc, curr) => acc + curr.total, 0) / 7);
  const lateDays = chartData.filter(d => d.lateIntake).length;
  const morningOnlyDays = chartData.filter(d => d.onlyMorning).length;
  const symptomDays = chartData.filter(d => d.hasSymptom).length;

  // 증상 상관관계 분석 텍스트
  const correlationText = analyzeSymptomCorrelation(logs, symptoms);


  // 증상 발생 빈도 계산
  const symptomFrequency = symptoms.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSymptom = Object.entries(symptomFrequency).sort((a, b) => b[1] - a[1])[0];



   return (
    <div className="p-6 pb-32 max-w-2xl mx-auto min-h-screen transition-colors font-sans">
      <header className="mb-10 px-2">
        <h2 className="text-3xl font-black text-[#5C3D2E] dark:text-[#F5E8D3]">{user.nickname}님의 분석 리포트</h2>
        <p className="text-gray-500 dark:text-white/40 font-medium mt-1">최근 7일간의 카페인과 몸의 반응입니다</p>
      </header>
      
      {/* 1. 공복 섭취 경고 카드 */}
      {fastingReport.isWarning && (
        <div className="bg-orange-50 dark:bg-orange-950/20 p-5 rounded-[30px] border border-orange-200 mb-8 flex items-start gap-4">
          <span className="text-2xl">🤢</span>
          <div>
            <h5 className="font-black text-sm text-orange-800 dark:text-orange-200">위장 건강 주의</h5>
            <p className="text-xs font-medium text-orange-700/70 dark:text-orange-400/70">{fastingReport.message}</p>
          </div>
        </div>
      )}

      {/* 메인 차트 카드 */}
      <div className="bg-white dark:bg-[#3A312B] p-6 rounded-[35px] shadow-sm border border-gray-100 dark:border-white/5 mb-8 relative">
        <div className="flex justify-between items-center mb-8 px-2">
          <h4 className="text-sm font-black dark:text-[#ECE0D1] flex items-center gap-2">
            <Activity size={16} className="text-[#E57B3E]" /> 주간 섭취 추이
          </h4>
          <span className="text-[10px] font-bold opacity-40 dark:text-white uppercase">Last 7 Days</span>
        </div>

        <div className="h-64 w-full" style={{ minHeight: '256px', width: '100%', height: '256px', position: 'relative' }}>
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartDataWithSymptoms} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} axisLine={false} tickLine={false} /> 
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : '#F4F1EA' }}
                  contentStyle={{ backgroundColor: isDark ? '#2C1B12' : '#FFFFFF', borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                {/* 권장량 가이드라인 */}
                <ReferenceLine y={400} stroke="#E05252" strokeDasharray="3 3" opacity={0.5} />
                
                <Bar dataKey="total" radius={[10, 10, 10, 10]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.total > 400 ? '#E05252' : entry.hasSymptom ? '#D97706' : '#E57B3E'} 
                      opacity={entry.total === 0 ? 0.2 : 1}
                    />
                  ))}
                </Bar>
                                {/* 증상이 있는 지점에 Scatter(점) 표시 */}
                <Scatter dataKey="symptomPoint" fill="#D97706" shape="circle" />
              </ComposedChart>
            </ResponsiveContainer>
            )}
        </div>   
             
        <p className="text-[10px] text-center text-gray-400 mt-4 font-bold">
           💡 <span className="text-[#D97706]">진한 주황색</span>은 신체 증상이 기록된 날입니다.
        </p>
      </div>

      {/* 데이터 분석 인사이트 카드 섹션 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-[#3A312B] p-5 rounded-[30px] border border-gray-100 dark:border-white/5">
          <p className="text-[10px] font-black opacity-40 uppercase mb-2 dark:text-white">일일 평균</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black dark:text-[#ECE0D1]">{avgCaffeine}</span>
            <span className="text-xs font-bold opacity-40">mg</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#3A312B] p-5 rounded-[30px] border border-gray-100 dark:border-white/5">
          <p className="text-[10px] font-black opacity-40 uppercase mb-2 dark:text-white">증상 발현</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#D97706]">{symptomDays}</span>
            <span className="text-xs font-bold opacity-40">일</span>
          </div>
        </div>
      </div>

      {/* 컨디션 분석 가이드 */}
      <div className="bg-[#F4F1EA] dark:bg-[#3A312B] p-6 rounded-[35px] border border-[#E57B3E]/10">
        <h3 className="font-black text-[#5C3D2E] dark:text-[#ECE0D1] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
          <AlertCircle size={18} className="text-[#E57B3E]" /> 오늘의 패턴 분석
        </h3>
        <ul className="space-y-4">
          {/* 평균 섭취량 분석 (Coffee 아이콘 사용!) */}
          <li className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#483C32] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Coffee size={14} className="text-[#E57B3E]" />
            </div>
            <p className="text-xs font-medium leading-relaxed dark:text-[#A3978F]">
              {avgCaffeine > 300 
                ? `평균 섭취량이 ${avgCaffeine}mg으로 권장량에 가깝습니다. 컨디션 기록을 통해 두통 여부를 체크해보세요.` 
                : `하루 평균 ${avgCaffeine}mg으로 아주 건강한 섭취량을 유지하고 계시네요!`}
            </p>
          </li>

          {/* 오전 섭취 강조 문구 추가 */}
          {morningOnlyDays > 0 && (
            <li className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#483C32] flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sun size={14} className="text-orange-400" />
              </div>
              <p className="text-xs font-medium leading-relaxed dark:text-[#A3978F]">
                지난 7일 중 <strong>{morningOnlyDays}일</strong>이나 오전에만 카페인을 즐기셨네요! 숙면을 위한 최고의 습관입니다.
              </p>
            </li>
          )}
          <li className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#483C32] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Moon size={14} className="text-indigo-400" />
            </div>
            <p className="text-xs font-medium leading-relaxed dark:text-[#A3978F]">
              오후 3시 이후 섭취는 <strong>{lateDays}일</strong>입니다. 
              {lateDays >= 3 ? " 저녁 카페인이 수면을 방해할 수 있으니 주의하세요!" : " 오후 섭취를 아주 잘 조절하고 계시네요!"}
            </p>
          </li>
        </ul>
      </div>
      {/*증상 발생 빈도*/}
      <div className="bg-white dark:bg-[#3A312B] p-5 mt-10 rounded-[30px] border border-gray-100 dark:border-white/5 mb-6">
        <p className="text-[10px] font-black opacity-40 uppercase mb-3 dark:text-white">가장 잦은 컨디션 변화</p>
        {topSymptom ? (
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">{topSymptom[0] === 'HEADACHE' ? '🤕 두통' : topSymptom[0] === 'FATIGUE' ? '😴 피로' : '🤔 기타'}</span>
            <span className="text-[#E57B3E] font-black">{topSymptom[1]}회 발생</span>
          </div>
        ) : (
          <p className="text-xs text-gray-400  dark:text-[#A3978F] font-medium">기록된 증상이 아직 없습니다.</p>
        )}
      </div>

      {/* 인과관계 분석 리포트 카드 */}
      <div className="bg-white dark:bg-[#3A312B] p-7 mt-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-white/5 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-black dark:text-[#ECE0D1] flex items-center gap-2 text-sm">
            <Activity size={18} className="text-[#E57B3E]" /> 인과관계 추적 리포트
          </h4>
        </div>
        <div className="p-5 bg-[#F4F1EA] dark:bg-[#483C32] rounded-[25px]">
          <p className="text-xs font-bold text-[#5C3D2E] dark:text-[#ECE0D1] leading-relaxed italic">
            "{correlationText}"
          </p>
        </div>
        <p className="text-[10px] text-gray-400  dark:text-[#A3978F] mt-4 px-2">
          * 이 분석은 회원님이 기록하신 카페인 섭취 시간과 신체 증상 기록을 대조하여 도출된 개인 맞춤형 결과입니다.
        </p>
      </div>
      {/* 팁 섹션 */}
      <div className="mt-8 px-4">
        <p className="text-[10px] text-gray-400  dark:text-[#A3978F] font-medium leading-relaxed italic text-center">
            * 증상 기록이 많아질수록 더 정확한 인과관계 분석이 가능해집니다. <br/>
            컨디션이 평소와 다를 때 꼭 기록해 주세요!
        </p>
      </div>
    </div>

  );
};