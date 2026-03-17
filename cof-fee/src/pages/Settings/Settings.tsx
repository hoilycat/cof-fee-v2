import { useAtom } from 'jotai';
import { dailyGoalAtom, userProfileAtom } from '../../hooks/useCaffeineStore';

export const Settings = () => {
    // userProfileAtom을 사용하여 전체 유저 정보를 가져오기.
    const [userProfile, setUserProfile] = useAtom(userProfileAtom);
    const [dailyGoal, setDailyGoal] = useAtom(dailyGoalAtom);

    // 닉네임만 따로 업데이트하기 위한 함수
    const setNickname = (newName: string) => {
        setUserProfile((prev) => ({ ...prev, nickname: newName }));
    };

    return (
        <div className="flex flex-col min-h-full px-6 py-12 max-w-2xl mx-auto">
            
            {/* 상단 귀여운 헤더 */}
            <header className="flex flex-col items-center mb-12">
                <div className="text-6xl mb-4 drop-shadow-sm">📋</div>
                <h2 className="text-2xl font-black text-gray-800">앱 설정</h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">나만의 커피 습관을 만들어봐요</p>
            </header>

            <div className="w-full space-y-6">
                {/* 닉네임 설정 박스 */}
                <div className="bg-[#F4F1EA] p-6 rounded-[30px]">
                    <label className="block text-sm font-extrabold text-[#5C3D2E] mb-3 ml-2">
                        내 이름 (또는 애칭)
                    </label>
                    <input 
                        type="text" 
                        value={userProfile.nickname} 
                        onChange={(e) => setNickname(e.target.value)} 
                        placeholder="이름을 입력해주세요"
                        className="w-full p-4 bg-white rounded-2xl text-gray-800 font-bold focus:outline-none focus:ring-4 focus:ring-[#F08B46]/30 transition-all border-none shadow-sm"
                    />
                </div>
        
                {/* 하루 목표 설정 박스 */}
                <div className="bg-[#F4F1EA] p-6 rounded-[30px]">
                    <label className="block text-sm font-extrabold text-[#5C3D2E] mb-3 ml-2">
                        하루 카페인 목표량
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={dailyGoal} 
                            onChange={(e) => setDailyGoal(Number(e.target.value))} 
                            className="w-full p-4 bg-white rounded-2xl text-gray-800 font-bold focus:outline-none focus:ring-4 focus:ring-[#F08B46]/30 transition-all border-none shadow-sm"
                        />
                        <span className="absolute right-5 top-4 text-gray-400 font-bold">mg</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 font-medium flex items-center gap-1 ml-2">
                        💡 성인 일일 카페인 최대 권장량은 400mg 입니다.
                    </p>
                </div>
            </div>

            {/* 초기화 버튼 */}
            <div className="mt-12">
                <button 
                    className="w-full py-5 rounded-full font-bold text-lg bg-[#FFEAE8] text-[#E05252] hover:bg-[#FFD8D6] active:scale-[0.98] transition-all shadow-sm"
                    onClick={() => alert("나중에 초기화 기능을 연결할게요!")}
                >
                    모든 기록 초기화하기
                </button>
            </div>
        </div>
    );
};