import { useAtom, useSetAtom } from 'jotai';
import { dailyGoalAtom, userProfileAtom, caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import { RotateCcw }  from 'lucide-react';


export const Settings = () => {
    // userProfileAtom을 사용하여 전체 유저 정보를 가져오기.
    const [userProfile, setUserProfile] = useAtom(userProfileAtom);
    const [dailyGoal, setDailyGoal] = useAtom(dailyGoalAtom);
    const setLogs = useSetAtom(caffeineLogsAtom);


    // 초기화 함수
    const handleResetAll = () => {
        if (confirm("정말로 모든 카페인 기록을 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) {
            setLogs([]); // 기록 배열을 빈 배열로 초기화
            alert("모든 기록이 초기화되었습니다.");
        }
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
                isTapering: false
                // nickname이나 weight는 편의상 유지하거나, 
                // 아예 생짜 초기화를 원하면 초기값 객체를 넣어도 됩니다.
            }));
        }
    };


    // 닉네임만 따로 업데이트하기 위한 함수
    const setNickname = (newName: string) => {
        setUserProfile((prev) => ({ ...prev, nickname: newName }));
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

                <div className="mt-8">
                    <p className="text-xs font-black text-gray-400 dark:text-[#A3978F] uppercase tracking-widest ml-4 mb-3">여정 관리</p>
                    <button 
                        onClick={handleRediagnosis}
                        className="w-full p-5 flex items-center justify-between bg-[#F4F1EA] dark:bg-[#3A312B] rounded-[30px] active:scale-[0.98] transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#4A423B] flex items-center justify-center">
                                <RotateCcw size={18} className="text-[#E57B3E]" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black dark:text-[#ECE0D1]">의존도 재진단하기</p>
                                <p className="text-[11px] text-gray-500 dark:text-[#A3978F]">내 상태를 다시 체크하고 트랙을 변경합니다</p>
                            </div>
                        </div>
                    </button>
                </div>

            {/* 초기화 버튼 */}
            <div className="mt-12">
                <button 
                    className="w-full py-5 rounded-3xl font-black text-lg bg-[#FFEAE8] text-[#E05252] hover:bg-[#FFD8D6] dark:bg-[#4A2723] dark:text-[#F87171] dark:hover:bg-[#5C332D]  active:scale-[0.98] transition-all shadow-sm"
                    onClick={handleResetAll} // 함수 연결
                >
                    모든 기록 초기화하기
                </button>
            </div>
        </div>
    );
};