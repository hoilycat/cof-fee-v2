import { useState,useRef } from 'react'; 
import { useAtom} from 'jotai';
import { dailyGoalAtom, userProfileAtom, caffeineLogsAtom, symptomLogsAtom, type CaffeineLog } from '../../hooks/useCaffeineStore';
import { RotateCcw, Download, Upload, AlertTriangle }  from 'lucide-react';
import { analyzeSymptomCorrelation } from '../../lib/utiles';
import dayjs from "dayjs";


export const Settings = () => {
    // userProfileAtom을 사용하여 전체 유저 정보를 가져오기.
    const [userProfile, setUserProfile] = useAtom(userProfileAtom);
    const [dailyGoal, setDailyGoal] = useAtom(dailyGoalAtom);
    const [ logs, setLogs ] = useAtom(caffeineLogsAtom);
    const [ symptomLogs, setSymptomLogs ] = useAtom(symptomLogsAtom);
    const [debugOffset, setDebugOffset] = useState(Number(localStorage.getItem('debug-date-offset') || 0));


    const saveOffset = (val: number) => {
        localStorage.setItem('debug-date-offset', String(val));
        setDebugOffset(val);
        window.location.reload(); // 시간 기준 변경 시 앱 새로고침
    };


    
    // 재진단 및 여정 초기화 함수
    const handleRediagnosis = () => {
        const message = "여정을 초기화하고 다시 진단하시겠습니까?\n\n현재 진행 중인 감량 주차와 진단 점수가 초기화되며, 첫 화면으로 이동합니다.";
        
        if (confirm(message)) {
            setUserProfile((prev) => ({
                ...prev,
                hasCompletedOnboarding: false, // 이 값이 false가 되면 App.tsx에 의해 온보딩으로 이동함
                dsm5Score: 0,
                taperingWeek: 0,
                isTapering: false,
                challengeStartedAt: '', 
            }));
        }
    };


    // 닉네임만 따로 업데이트하기 위한 함수
    const setNickname = (newName: string) => {
        setUserProfile((prev) => ({ ...prev, nickname: newName }));
    };


    const handleExportData = () => {
    const data = {
        userProfile,
        logs,
        caffeineLogs: JSON.parse(localStorage.getItem('caffeine-logs') || '[]'),
        symptomLogs: JSON.parse(localStorage.getItem('symptom-logs') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cof-fee-backup-${dayjs().format('YYYY-MM-DD')}.json`;
    link.click();
    URL.revokeObjectURL(url); //메모리 해제
    };

     // 1. 커피 기록만 삭제 (이름/설정 유지)
    const handleClearLogsOnly = () => {
        if (confirm("마신 음료와 신체 증상 기록만 삭제할까요?\n이름과 목표 설정은 그대로 유지됩니다.")) {
            setLogs([]);
            setSymptomLogs([]);
            alert("기록이 깔끔하게 비워졌습니다! ✨");
        }
    };

    // 2. 앱 전체 초기화 (공장 초기화)
    const handleFactoryReset = () => {
        if (confirm("정말로 모든 데이터를 삭제하고 초기화할까요?\n이름, 설정을 포함한 모든 정보가 사라지며 처음부터 다시 시작해야 합니다.")) {
            // 로컬 스토리지 싹 비우기
            localStorage.clear();
            // 페이지 새로고침하여 초기 상태로 복구
            window.location.href = "/";
        }
    };



    // 파일 업로드를 위한 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. [가져오기] JSON 파일 읽기 및 백업 복구
    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                
                if (confirm("백업 파일을 불러올까요? 현재 기록이 모두 교체됩니다.")) {
                    if (json.userProfile) setUserProfile(json.userProfile);
                    if (json.caffeineLogs) setLogs(json.caffeineLogs);
                    if (json.symptomLogs) setSymptomLogs(json.symptomLogs);
                    
                    alert("성공적으로 복구되었습니다! ✨");
                    window.location.reload(); // 상태 반영을 위한 새로고침
                }
            } catch (err) {
                alert("올바르지 않은 백업 파일입니다. ❌");
            }
        };
        reader.readAsText(file);
    };

// 2. [내보내기] PDF 보고서 생성 (브라우저 인쇄 기능 활용)
    const handleExportPDF = () => {
        // 인쇄를 위해 통계 페이지(/stats)로 이동하거나, 
        // 현재 데이터를 기반으로 새 창을 열어 보고서 양식을 만듭니다.
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const totalCaffeine = logs.reduce((acc: number, curr: CaffeineLog) => acc + curr.caffeineAmount, 0);
        
        // handleExportPDF 함수 안에서 analyzeSymptomCorrelation 결과 활용
        const correlationText = analyzeSymptomCorrelation(logs, symptomLogs);


        // 보고서 스타일 정의 (HTML/CSS)
        printWindow.document.write(`
            <html>
                <head>
                    <title>Cof-fee 카페인 분석 리포트 - ${userProfile.nickname}</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                        .header { border-bottom: 2px solid #E57B3E; padding-bottom: 20px; margin-bottom: 30px; }
                        h1 { color: #E57B3E; margin: 0; }
                        .summary-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
                        .card { background: #F9F9F9; padding: 20px; border-radius: 10px; }
                        .label { font-size: 12px; color: #888; font-weight: bold; text-transform: uppercase; }
                        .value { font-size: 24px; font-weight: bold; margin-top: 5px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border-bottom: 1px solid #eee; padding: 12px; text-align: left; }
                        th { background: #fdfaf6; color: #E57B3E; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Cof/fee 분석 리포트 ☕️</h1>
                        <p>${dayjs().format('YYYY년 MM월 DD일 HH:mm')} 기준</p>
                    </div>
                    <div class="summary-grid">
                        <div class="card">
                            <div class="label">전문 분석 의견</div>
                            <div class="value" style="font-size: 14px; color: #5C3D2E; margin-top: 10px;">
                                "${correlationText}"
                            </div>
                            <div class="label">닉네임</div>
                            <div class="value">${userProfile.nickname}님</div>
                        </div>
                        <div class="card">
                            <div class="label">총 섭취량</div>
                            <div class="value">${totalCaffeine} mg</div>
                        </div>
                        <div class="card">
                            <div class="label">현재 트랙</div>
                            <div class="value">${userProfile.isTapering ? '이별 트랙(감량 중)' : '안전 트랙'}</div>
                        </div>
                        <div class="card">
                            <div class="label">증상 기록</div>
                            <div class="value">${symptomLogs.length} 건</div>
                        </div>
                    </div>
                    <h3>최근 카페인 섭취 내역</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>음료명</th>
                                <th>함량</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logs.slice(-10).reverse().map(l => `
                                <tr>
                                    <td>${dayjs(l.intakeTime).format('MM/DD HH:mm')}</td>
                                    <td>${l.beverageName}</td>
                                    <td>${l.caffeineAmount}mg</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <p style="margin-top: 50px; text-align: center; color: #aaa; font-size: 12px;">이 리포트는 Cof/fee 앱에서 생성되었습니다.</p>
                    <script>
                        setTimeout(() => { window.print(); window.close(); }, 500);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };


    return (
        <div className="flex flex-col min-h-full px-6 py-12 pb-32 max-w-2xl mx-auto">
            
            {/* 상단 귀여운 헤더 */}
            <header className="flex flex-col items-center mb-12">
                <div className="text-6xl mb-4 drop-shadow-sm">📋</div>
                <h2 className="text-2xl font-black text-[#5C3D2E] dark:text-[#F5E8D3] mb-8">앱 설정</h2>
                <p className="text-sm text-gray-500 dark:text-[#A3978F] mt-2 font-medium">나만의 커피 습관을 만들어봐요</p>
            </header>

            <div className="w-full space-y-6">
                {/* 다크 모드 설정 박스 추가 */}
                <div className="bg-[#F4F1EA] dark:bg-[#3A312B] p-6 rounded-[30px] flex items-center justify-between transition-colors">
                    <div>
                        <label className="block text-sm font-extrabold text-[#5C3D2E] dark:text-[#F5E8D3]">☕ 모카 다크 모드</label>
                        <p className="text-[13px] text-gray-500 dark:text-[#A3978F] font-medium">눈이 편안한 원두색 테마로 바꿉니다</p>
                    </div>
                    <button 
                        onClick={() => setUserProfile({...userProfile, isDarkMode: !userProfile.isDarkMode})}
                        className={`w-14 h-8 rounded-full transition-all relative ${userProfile.isDarkMode ? 'bg-[#D97706]' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white dark:bg-[#4A423B] border-gray-100 dark:border-white/5  rounded-full transition-all ${userProfile.isDarkMode ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
                {/* 닉네임 설정 박스 */}
                <div className="bg-[#F4F1EA] dark:bg-[#3A312B] p-6 rounded-[30px]">
                    <label className="block text-sm font-extrabold text-[#5C3D2E] dark:text-[#F5E8D3] mb-3 ml-2">
                        내 이름 (또는 애칭)
                    </label>
                    <input 
                        type="text" 
                        value={userProfile.nickname} 
                        onChange={(e) => setNickname(e.target.value)} 
                        placeholder="이름을 입력해주세요"
                        className="w-full p-4 bg-white dark:bg-[#29221e] rounded-2xl text-gray-800 dark:text-[#F5E8D3] font-bold focus:outline-none focus:ring-4 focus:ring-[#F08B46]/30 transition-all border-none shadow-sm"
                    />
                </div>
        
                {/* 하루 목표 설정 박스 */}
                <div className="bg-[#F4F1EA] dark:bg-[#3A312B] p-6 rounded-[30px]">
                    <label className="block text-sm font-extrabold text-[#5C3D2E] dark:text-[#F5E8D3] mb-3 ml-2">
                        하루 카페인 목표량
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={dailyGoal} 
                            onChange={(e) => setDailyGoal(Number(e.target.value))} 
                            className="w-full p-4 bg-white dark:bg-[#29221e] rounded-2xl text-gray-800 dark:text-[#F5E8D3] font-bold focus:outline-none focus:ring-4 focus:ring-[#F08B46]/30 transition-all border-none shadow-sm"                        />
                        <span className="absolute right-5 top-4 text-gray-400 dark:text-[#A3978F] font-bold">mg</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 dark:text-[#A3978F] text-[13px] font-medium flex items-center gap-1 ml-2">
                        💡 성인 일일 카페인 최대 권장량은 400mg 입니다.
                    </p>
                </div>
            </div>


             {/* 1. 개인화 설정 섹션 */}
            <div className="bg-[#F4F1EA] dark:bg-[#3A312B] p-6 rounded-[30px] space-y-6 mt-6">
                <div>
                <label className="text-sm font-black dark:text-[#F5E8D3]">⚡ 카페인 민감도</label>
                <div className="flex gap-2 mt-2">
                    {['FAST', 'NORMAL', 'SLOW'].map(s => (
                    <button 
                        key={s}
                        onClick={() => setUserProfile({...userProfile, sensitivity: s as any})}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold ${userProfile.sensitivity === s ? 'bg-[#E57B3E] text-white' : 'bg-white dark:bg-[#4A423B]'}`}
                    >
                        {s === 'FAST' ? '빠른 대사' : s === 'NORMAL' ? '보통' : '민감함'}
                    </button>
                    ))}
                </div>
                </div>
                
                <div>
                <label className="text-sm font-black dark:text-[#F5E8D3]">🌙 목표 취침 시간</label>
                <input 
                    type="time" 
                    value={userProfile.preferredBedtime}
                    onChange={(e) => setUserProfile({...userProfile, preferredBedtime: e.target.value})}
                    className="w-full mt-2 p-3 rounded-xl bg-white dark:bg-[#29221e] font-bold"
                />
                </div>
            </div>

            {/*생리모드 토글 스위치*/}
            {userProfile.gender === 'F' && (
            <div className="bg-[#F4F1EA] dark:bg-[#3A312B] p-6 mt-6 rounded-[30px] flex items-center justify-between">
                <div>
                <label className="block text-sm font-extrabold text-[#5C3D2E] dark:text-[#F5E8D3]">🩸 생리 모드</label>
                <p className="text-[13px] text-gray-500 dark:text-[#A3978F] font-medium">카페인 분해 능력이 떨어지는 기간이에요</p>
                </div>
                <button 
                onClick={() => setUserProfile({...userProfile, isMenstruating: !userProfile.isMenstruating})}
                className={`w-14 h-8 rounded-full transition-all relative ${userProfile.isMenstruating ? 'bg-[#F87171]' : 'bg-gray-300'}`}
                >
                <div className={`absolute top-1 w-6 h-6 bg-white dark:bg-[#4A423B] border-gray-100 dark:border-white/5  rounded-full transition-all ${userProfile.isMenstruating ? 'left-7' : 'left-1'}`} />
                </button>
            </div>
            )}
                {/* 데이터 관리 섹션 수정 */}
                <div className="pt-6">
                    <p className="text-xs font-black text-gray-400 dark:text-[#A3978F] uppercase tracking-widest ml-4 mt-10 mb-3">데이터 관리</p>
                    <div className="bg-[#F4F1EA] dark:bg-[#3A312B] p-4 rounded-[30px] space-y-2">
                        
                        {/* 1. PDF 리포트 내보내기 */}
                        <button 
                            onClick={handleExportPDF}
                            className="w-full p-5 flex items-center justify-between bg-white dark:bg-[#4A423B]/30 rounded-[25px] active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                                    <Download size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black dark:text-[#ECE0D1]">분석 리포트(PDF)</p>
                                    <p className="text-[11px] text-gray-500 dark:text-[#A3978F]">인쇄용 보고서로 저장합니다</p>
                                </div>
                            </div>
                        </button>

                        {/* 2. JSON 백업 파일 내보내기 */}
                        <button 
                            onClick={handleExportData}
                            className="w-full p-5 flex items-center justify-between bg-white dark:bg-[#4A423B]/30 rounded-[25px] active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                    <Download size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black dark:text-[#ECE0D1]">데이터 백업(JSON)</p>
                                    <p className="text-[11px] text-gray-500 dark:text-[#A3978F]">기기 변경 시 사용 가능한 백업 파일</p>
                                </div>
                            </div>
                        </button>

                        {/* 3. 데이터 가져오기 (백업 복구) */}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full p-5 flex items-center justify-between bg-white dark:bg-[#4A423B]/30 rounded-[25px] active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                    <Upload size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black dark:text-[#ECE0D1]">데이터 가져오기</p>
                                    <p className="text-[11px] text-gray-500 dark:text-[#A3978F]">백업 파일에서 기록을 복원합니다</p>
                                </div>
                            </div>
                        </button>
                        
                        {/* 숨겨진 파일 인풋 */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImportData} 
                            accept=".json" 
                            className="hidden" 
                        />
                        </div>
                </div>

                {/* 4. 여정 관리 섹션 */}
                <div className="pt-2">
                    <p className="text-xs font-black text-gray-400 dark:text-[#A3978F] uppercase tracking-widest ml-4 mb-3 mt-10">여정 관리</p>
                    <button onClick={handleRediagnosis} className="w-full p-5 flex items-center justify-between bg-[#F4F1EA] dark:bg-[#3A312B] rounded-[30px] active:scale-[0.98] transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#4A423B] flex items-center justify-center text-[#E57B3E]">
                                <RotateCcw size={18} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black dark:text-[#ECE0D1]">의존도 재진단하기</p>
                                <p className="text-[11px] text-gray-500 dark:text-[#A3978F]">내 상태를 다시 체크하고 트랙을 변경합니다</p>
                            </div>
                        </div>
                    </button>
                </div>   

             {/* 초기화 섹션 */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 space-y-4">
                <p className="text-xs font-black text-gray-400 dark:text-[#A3978F] uppercase tracking-widest ml-4">데이터 관리</p>
                
                {/* 1. 기록만 삭제 버튼 */}
                <button 
                    onClick={handleClearLogsOnly}
                    className="w-full py-4 rounded-[25px] font-bold text-sm bg-gray-100 dark:bg-[#3A312B] text-gray-600 dark:text-[#A3978F] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    음료 및 증상 기록만 비우기
                </button>

                {/* 2. 공장 초기화 버튼 (위험 표시) */}
                <button 
                    onClick={handleFactoryReset}
                    className="w-full py-4 rounded-[25px] font-black text-sm bg-[#FFEAE8] text-[#E05252] dark:bg-[#4A2723] dark:text-[#F87171] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <AlertTriangle size={16} /> 앱 전체 초기화 (공장 초기화)
                </button>
            </div>

            {/* 2. [개발자 전용] 타임머신 섹션 */}
            <div className="mt-12 border-2 border-dashed border-[#E57B3E]/30 p-6 rounded-[35px]">
                <h4 className="text-[#E57B3E] font-black text-sm mb-4 flex items-center gap-2">
                🧪 시뮬레이션 연구실 (타임머신)
                </h4>
                <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-60">현재 기준일 변동</span>
                <div className="flex items-center gap-4">
                    <button onClick={() => saveOffset(debugOffset - 1)} className="p-2 bg-white rounded-lg dark:bg-[#3A312B]">-1일</button>
                    <span className="font-black text-[#E57B3E]">{debugOffset}일</span>
                    <button onClick={() => saveOffset(debugOffset + 1)} className="p-2 bg-white rounded-lg dark:bg-[#3A312B]">+1일</button>
                </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                * 시간을 미래로 보내 4주 감량 트랙의 변화를 미리 확인할 수 있습니다.
                </p>
            </div>
        </div>
    );
};