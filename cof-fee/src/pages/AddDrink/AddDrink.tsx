import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { caffeineLogsAtom, userProfileAtom, favoriteDrinksAtom } from '../../hooks/useCaffeineStore';
import { COFFEE_BRANDS, type BrandData, type CoffeeMenu, type SizeOption } from '../../lib/caffeineData';
import { Search, Star, X, ArrowLeft } from 'lucide-react';
import { useCaffeine } from '../../hooks/useCaffeine'; 


export const AddDrink = () => {
  const navigate = useNavigate();
  const setLogs = useSetAtom(caffeineLogsAtom);
  const user = useAtomValue(userProfileAtom); // 'user'를 아래 UI에서 팁 노출용으로 사용합니다.
  const [favorites, setFavorites] = useAtom(favoriteDrinksAtom);

  // 현재 잔존량(totalCaffeine)과 목표량(goal)을 가져오기.
  const { totalCaffeine, goal } = useCaffeine();

  const [searchTerm, setSearchTerm] = useState('');
  const [isManual, setIsManual] = useState(false);
  const [manualCaffeine, setManualCaffeine] = useState<number>(0);
  const [manualName, setManualName] = useState('');
  const [isFasting, setIsFasting] = useState(false); 

  const [selectedMenuInfo, setSelectedMenuInfo] = useState<{brand: BrandData, menu: CoffeeMenu} | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);

  // --- 계산 로직 (currentCaffeine을 handleAddCoffee에서 사용함) ---
  const currentCaffeine = isManual ? manualCaffeine : (selectedSize?.caffeine || 0);
  const isHighCaffeine = !isManual && selectedSize ? selectedSize.caffeine > 150 : false;
  
  // 💡 고카페인 전용 경고 문구 (나이트로 커피 등 대응)
  const highCaffeineMessage = selectedMenuInfo?.menu.name.includes("나이트로") 
    ? "⚠️ 나이트로 경고: 일반 커피보다 체내 흡수가 빠르고 카페인 함량이 매우 높습니다. 밤늦게까지 각성 효과가 지속될 수 있어요!"
    : "⚠️ 고카페인 주의: 이 음료는 한 잔만으로도 일일 권장량의 절반을 넘습니다. 대사가 끝날 때까지 10시간 이상 소요됩니다.";


  // 음료 이름 결정
  const drinkName = isManual 
    ? manualName 
    : selectedMenuInfo ? `${selectedMenuInfo.brand.brand} ${selectedMenuInfo.menu.name} (${selectedSize?.label || ''})` : '';

  const allMenus = useMemo(() => {
    const list: { brand: BrandData; menu: CoffeeMenu; isFav: boolean; key: string }[] = [];
    COFFEE_BRANDS.forEach((brand: BrandData) => {
      brand.menus.forEach((menu: CoffeeMenu) => {
        const key = `${brand.id}_${menu.id}`;
        list.push({ brand, menu, isFav: favorites.includes(key), key });
      });
    });
    return list;
  }, [favorites]);

  const filteredMenus = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return allMenus.filter(m => m.isFav); 
    return allMenus.filter(m => 
      m.brand.brand.toLowerCase().includes(term) || 
      m.menu.name.toLowerCase().includes(term)
    );
  }, [searchTerm, allMenus]);

  const toggleFavorite = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setFavorites((prev: string[]) => 
      prev.includes(key) ? prev.filter((f: string) => f !== key) : [...prev, key]
    );
  };

  const isFormValid = isManual 
    ? (manualName.trim() !== '' && manualCaffeine > 0) 
    : (selectedSize !== null);

  const handleAddCoffee = () => {


    const newLog = {
      id: crypto.randomUUID(),
      caffeineAmount: currentCaffeine,
      intakeTime: new Date().toISOString(),
      beverageName: drinkName,
      isFasting,
      price: 0,
    };

    setLogs((prev) => [...prev, newLog]);
    alert(`${drinkName} 기록 완료! ☕️`);
    navigate('/');
  };

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen pb-32">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => selectedMenuInfo || isManual ? (setSelectedMenuInfo(null), setIsManual(false), setSelectedSize(null)) : navigate(-1)} 
          className="p-2 dark:text-[#ECE0D1]"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-black text-gray-800 dark:text-[#ECE0D1]">음료 기록</h2>
      </header>

      {!selectedMenuInfo && !isManual ? (
        <>
          {/* 💡 감량 트랙 진행 중일 때 팁 노출 (user 활용) */}
          {user.isTapering && (
            <div className="mb-6 p-4 bg-[#EFEBE4] dark:bg-[#3A312B] rounded-2xl text-xs font-bold text-[#5C3D2E] dark:text-[#ECE0D1] border border-[#E57B3E]/20">
              👋 감량 트랙 진행 중이시네요! 오늘은 디카페인 메뉴를 찾아보는 건 어떨까요?
            </div>
          )}

          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              className="w-full p-4 pl-12 bg-white dark:bg-[#3A312B] rounded-[20px] shadow-sm border-none outline-none focus:ring-2 focus:ring-[#E57B3E] dark:text-[#ECE0D1]"
              placeholder="브랜드나 메뉴를 검색하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <X className="absolute right-4 top-3.5 text-gray-400 cursor-pointer" size={20} onClick={() => setSearchTerm('')} />}
          </div>

          <button onClick={() => setIsManual(true)} className="mb-6 text-sm text-[#E57B3E] font-bold underline">찾는 메뉴가 없나요? 직접 입력하기</button>

          <div className="space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">
              {searchTerm ? 'Search Results' : 'Your Favorites ⭐'}
            </p>
            {filteredMenus.length > 0 ? (
              filteredMenus.map(({ brand, menu, isFav, key }) => (
                <div 
                  key={key} 
                  onClick={() => setSelectedMenuInfo({ brand, menu })}
                  className="flex items-center justify-between p-5 bg-white dark:bg-[#3A312B] rounded-[25px] shadow-sm border border-gray-50 dark:border-white/5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#E57B3E] opacity-70 uppercase">{brand.brand}</span>
                    <span className="font-bold text-gray-800 dark:text-[#ECE0D1]">{menu.name}</span>
                  </div>
                  <button onClick={(e) => toggleFavorite(e, key)} className="p-2">
                    <Star size={20} fill={isFav ? "#E57B3E" : "none"} color={isFav ? "#E57B3E" : "#94A3B8"} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-400 font-bold">검색 결과가 없어요 ☕️</div>
            )}
          </div>
        </>
      ) : isManual ? (
        <div className="space-y-4 animate-fade-in">
           <input className="w-full p-5 bg-white dark:bg-[#3A312B] rounded-2xl dark:text-[#ECE0D1] outline-none shadow-sm font-bold" placeholder="음료 이름" value={manualName} onChange={(e) => setManualName(e.target.value)} />
           <div className="relative">
             <input type="number" className="w-full p-5 bg-white dark:bg-[#3A312B] rounded-2xl dark:text-[#ECE0D1] outline-none shadow-sm font-bold" placeholder="카페인 함량" onChange={(e) => setManualCaffeine(Number(e.target.value))} />
             <span className="absolute right-5 top-5 font-bold text-gray-400">mg</span>
           </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="p-6 bg-white dark:bg-[#3A312B] rounded-[30px] mb-8 text-center border border-gray-50 dark:border-white/5 shadow-sm">
             <p className="text-sm font-black text-[#E57B3E] uppercase mb-1">{selectedMenuInfo?.brand.brand}</p>
             <h3 className="text-xl font-black dark:text-[#ECE0D1]">{selectedMenuInfo?.menu.name}</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3 mb-8">
            {/*사이즈 버튼 내부에 스마트 배지 로직 추가*/}
            {selectedMenuInfo?.menu.sizes.map((size, idx) => {

              // 현재 몸에 남은 양 + 마시려는 양이 목표치를 넘는지 계산
              const willExceed = totalCaffeine + size.caffeine > goal;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`p-5 rounded-[25px] flex justify-between items-center border transition-all relative ${
                    selectedSize === size ? 'bg-[#E57B3E] border-[#E57B3E] text-white shadow-lg' : 'bg-white dark:bg-[#3A312B] border-gray-100 dark:border-white/5 dark:text-[#ECE0D1]'
                  }`}
                >
                  <span className="font-bold">{size.label}</span>
                  <span className={`font-black ${selectedSize === size ? 'text-white' : 'text-[#E57B3E]'}`}>{size.caffeine}mg</span>
  

                  {/* ⚠️ 스마트 배지: 버튼 귀퉁이에 표시 */}
                  <div className="absolute -top-2 -right-1 flex gap-1 z-10">
                    {willExceed && (
                      <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse shadow-sm">OVER</span>
                    )}
                    {user.isMenstruating && (
                      <span className="bg-rose-400 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black shadow-sm">대사저하🩸</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 공통 경고 및 푸터 */}
      {(selectedSize || isManual) && (
        <div className="fixed bottom-10 left-0 w-full px-6 max-w-md mx-auto z-50">
          {isHighCaffeine && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-center">
                {highCaffeineMessage} 
              </div>
            )}
           <div className="flex items-center gap-3 p-5 bg-white dark:bg-[#3A312B] rounded-[25px] shadow-lg border border-gray-50 dark:border-white/5 mb-4">
              <input 
                  type="checkbox" id="fasting" checked={isFasting} onChange={(e) => setIsFasting(e.target.checked)}
                  className="w-5 h-5 accent-[#E57B3E]"
              />
              <label htmlFor="fasting" className="text-sm font-bold dark:text-[#ECE0D1]">공복에 마셔요 (위 보호 주의! ⚠️)</label>
           </div>
           <button 
             disabled={!isFormValid}
             onClick={handleAddCoffee}
             className="w-full py-5 bg-[#E57B3E] disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-[30px] font-black text-xl shadow-xl active:scale-95 transition-all"
           >
             기록 완료 ☕️
           </button>
        </div>
      )}
    </div>
  );
};