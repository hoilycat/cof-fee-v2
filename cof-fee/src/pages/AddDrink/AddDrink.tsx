import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { caffeineLogsAtom, userProfileAtom, favoriteDrinksAtom, customMenusAtom  } from '../../hooks/useCaffeineStore';
import { COFFEE_BRANDS, type BrandData, type CoffeeMenu, type SizeOption } from '../../lib/caffeineData';
import { Search, Star, X, ArrowLeft, AlertTriangle, Calendar  } from 'lucide-react';
import { getNow } from '../../lib/utiles'
import { useCaffeine } from '../../hooks/useCaffeine';
import { useDragScroll } from '../../hooks/useDragScroll'; 
import dayjs from 'dayjs';
import { Emoji3D } from '../../components/Emoji3D'



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
  

  //섭취 시간을 관리하는 상태 (기본값: 현재 시간)
  const [intakeTime, setIntakeTime] = useState(getNow().format('YYYY-MM-DDTHH:mm'));


  const [customMenus, setCustomMenus] = useAtom(customMenusAtom);
  const brands = COFFEE_BRANDS.filter(b => b.id !== 'manual');


  // 고카페인 전용 경고 문구 (나이트로 커피 등 대응)
  const highCaffeineMessage = selectedMenuInfo?.menu.name.includes("나이트로") 
    ? "⚠️ 나이트로 경고: 일반 커피보다 체내 흡수가 빠르고 카페인 함량이 매우 높습니다. 밤늦게까지 각성 효과가 지속될 수 있어요!"
    : "⚠️ 고카페인 주의: 이 음료는 한 잔만으로도 일일 권장량의 절반을 넘습니다. 대사가 끝날 때까지 10시간 이상 소요됩니다.";


  // 음료 이름 결정
  const drinkName = isManual 
    ? manualName 
    : selectedMenuInfo ? `${selectedMenuInfo.brand.brand} ${selectedMenuInfo.menu.name} (${selectedSize?.label || ''})` : '';

   // 현재 선택된 음료 이름이 복병인지 체크하는 변수 (버튼 영역에서 사용하기 위함)
  const isCurrentHidden = drinkName.includes('콜라') || drinkName.includes('초콜릿') || drinkName.includes('녹차') || drinkName.includes('홍차');


  const allMenus = useMemo(() => {
    const list: { brandName: string; menu: CoffeeMenu; isFav: boolean; key: string; isCustom?:boolean}[] = [];
    COFFEE_BRANDS.forEach((brand: BrandData) => {
      brand.menus.forEach((menu: CoffeeMenu) => {
        const key = `${brand.id}_${menu.id}`;
        list.push({ brandName: brand.brand, menu, isFav: favorites.includes(key), key });
      });
    });

    // 2. [추가] 내가 직접 저장한 메뉴들 추가 (여기서 customMenus를 읽습니다!)
  customMenus.forEach((menu) => {
    list.push({ 
      brandName: '나의 메뉴 ⭐️', 
      menu, 
      isFav: false, 
      key: menu.id,
      isCustom: true 
    });
  });

  return list;
}, [favorites, customMenus]); // customMenus가 바뀔 때마다 리스트 업데이트


  const filteredMenus = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return allMenus.filter(m => m.isFav); 
    return allMenus.filter(m => 
      m.brandName.toLowerCase().includes(term) || 
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

  const [saveToCustom, setSaveToCustom] = useState(false);


    // 💡 빠른 시간 설정을 위한 함수 정의
  const setQuickTime = (minutesAgo: number) => {
    const newTime = getNow().subtract(minutesAgo, 'minute').format('YYYY-MM-DDTHH:mm');
    setIntakeTime(newTime);
  };

  const handleAddCoffee = () => {


    const newLog = {
      id: crypto.randomUUID(),
      caffeineAmount: currentCaffeine,
      intakeTime: dayjs(intakeTime).toISOString(), 
      beverageName: drinkName,
      isFasting,
      price: 0,
    };


    // 만약 "주로 마시는 음료로 저장" 체크박스가 켜져 있다면?
    if (isManual && saveToCustom) {
      const newCustomMenu: CoffeeMenu = {
        id: `custom_${crypto.randomUUID()}`,
        name: manualName,
        category: 'Espresso', // 기본 카테고리
        sizes: [{ label: '기본', ml: 0, caffeine: manualCaffeine }]
      };
      // 기존 커스텀 메뉴 리스트에 추가
      setCustomMenus(prev => [...prev, newCustomMenu]);
    }


    setLogs((prev) => [...prev, newLog]);
    alert(`${drinkName} 기록 완료! ☕️`);
    navigate('/');
  };
  
  // 1. 함수 추가 (return 문 바로 위에 넣으세요)
const handleWheel = (e: React.WheelEvent) => {
  const container = e.currentTarget;
  // 휠을 아래로 굴리면(deltaY > 0) 오른쪽으로, 위로 굴리면 왼쪽으로 스크롤
  container.scrollLeft += e.deltaY;
};

const { scrollRef, onDragStart, onDragEnd, onDragMove } = useDragScroll();




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

      {/* 1. 브랜드 퀵 필터 버튼 */}
      {!selectedMenuInfo && !isManual && (
      <div className="relative mb-6">
        {/* 왼쪽 그림자 (옵션) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FDFAF6] dark:from-[#483C32] to-transparent z-10 pointer-events-none" />
        <div 
          ref={scrollRef}           // 드래그를 위한 ref 연결
          onWheel={handleWheel}     // 휠 조작 연결
          onMouseDown={onDragStart} // 마우스 누르기
          onMouseMove={onDragMove}  // 마우스 이동(드래그)
          onMouseUp={onDragEnd}     // 마우스 떼기
          onMouseLeave={onDragEnd}  // 마우스가 영역을 벗어날 때
          className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar cursor-grab active:cursor-grabbing select-none"
        >
          {brands.map(b => (
            <button 
              key={b.id}
              onClick={() => setSearchTerm(b.brand)}
              className="px-4 py-2 bg-white dark:bg-[#3A312B] rounded-full whitespace-nowrap text-xs font-black shadow-sm border border-gray-100 dark:border-white/5 active:scale-95 transition-all"
            >
              {b.brand}
            </button>
          ))}
        </div>
        {/* 오른쪽 그림자 */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FDFAF6] dark:from-[#483C32] to-transparent z-10 pointer-events-none" />
      </div>
      )}

      {/* 2. 커스텀 메뉴 섹션 (수동 입력 시 저장 여부 체크) */}
      {isManual && (
        <div className="mt-6 flex items-center gap-3 px-2">
          <input 
            type="checkbox" 
            id="save-custom"
            checked={saveToCustom}
            className="w-5 h-5 accent-[#E57B3E]"
            onChange={(e) => setSaveToCustom(e.target.checked)}
          />
          <label htmlFor="save-custom" className="text-sm font-bold opacity-60">주로 마시는 음료로 저장하기</label>
        </div>
      )}

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
              filteredMenus.map(({ brandName, menu, isFav, key }) => (
                <div 
                  key={key} 
                  onClick={() => setSelectedMenuInfo({ brand: { brand: brandName, id: '', menus: [] }, menu })}
                  className="flex items-center justify-between hover:scale-105 p-5 bg-white dark:bg-[#3A312B] rounded-[25px] shadow-sm border border-gray-50 dark:border-white/5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#E57B3E] opacity-70 uppercase">{brandName}</span>
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

      {/* ⚠️ 공통 푸터 로직 (사이즈 선택 완료 시 또는 직접 입력 시 노출) */}
      {(selectedSize || isManual) && (
        <div className="fixed bottom-24 left-0 w-full px-6 pb-32 max-w-md mx-auto z-40 flex flex-col gap-4">
           
          {/* 고카페인 경고창 (isHighCaffeine, highCaffeineMessage 사용) */} 
           {isHighCaffeine && (
             <div className="p-4 bg-[#4A2D2D] border border-red-500/30 rounded-[20px] shadow-lg animate-bounce-subtle">
                <div className="flex gap-3 items-start">
                  <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-[11px] font-bold text-[#FFD1D1] leading-relaxed">
                    {highCaffeineMessage}
                  </p>
                </div>
             </div>
           )}

           {/* 시간 선택 & 공복 체크 UI 섹션 */}
        <div className="bg-white dark:bg-[#3A312B] p-5 rounded-[25px] shadow-xl border border-gray-100 dark:border-white/5 space-y-4">
          <div>
            <div className="flex justify-between items-end mb-2 ml-1">
              <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Consumption Time</label>
              <span className="text-[10px] font-bold text-[#E57B3E]">날짜를 눌러 변경</span>
            </div>
            
            {/* 💡 시간 입력창: 클릭하면 캘린더/시계가 뜨도록 스타일링 */}
            <div className="relative group">
              <input 
                type="datetime-local" 
                value={intakeTime} 
                onChange={(e) => setIntakeTime(e.target.value)} 
                className="w-full bg-[#F4F1EA] dark:bg-[#29221e] p-4 rounded-2xl text-sm font-black dark:text-[#F5E8D3] outline-none cursor-pointer hover:ring-2 hover:ring-[#E57B3E]/30 transition-all appearance-none"
              />
              {/* 커스텀 캘린더 아이콘 */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                <Calendar size={18} className="text-[#E57B3E]" />
              </div>
            </div>

            {/* 💡 빠른 시간 선택 버튼  */}
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
              {[{l:'방금 전', m:0}, {l:'30분 전', m:30}, {l:'1시간 전', m:60}, {l:'2시간 전', m:120}].map((t) => (
                <button 
                  key={t.l}
                  onClick={() => t.m === 0 ? setIntakeTime(getNow().format('YYYY-MM-DDTHH:mm')) : setQuickTime(t.m)}
                  className="px-4 py-2 bg-gray-50 dark:bg-[#4A423B] border border-gray-100 dark:border-white/5 rounded-xl text-[10px] font-black dark:text-[#ECE0D1] whitespace-nowrap active:scale-95 transition-all"
                >
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* ⚠️ 하단 UI 섹션 안에서 사용 */}
          {isCurrentHidden && ( 
            <span className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg mb-2">
              <Emoji3D type="Pill_3D" isDark={user.isDarkMode} size={14} /> 
              <p className="text-[10px] font-black text-orange-500">숨은 카페인 주의</p>
            </span>
          )}
          
          {/* 공복 체크: 구분선 추가로 더 깔끔하게 */}
          <div className="pt-2 border-t border-gray-50 dark:border-white/5">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={isFasting} onChange={(e) => setIsFasting(e.target.checked)} className="w-5 h-5 accent-[#E57B3E] rounded-lg" />
              <span className="text-sm font-bold dark:text-[#ECE0D1] group-hover:text-[#E57B3E] transition-colors">공복에 마셔요 (위 보호 주의! ⚠️)</span>
            </label>
          </div>
        </div>

        {/* 3. 기록 완료 버튼: 하단에 큼직하게 배치 */}
        <button 
          disabled={!isFormValid}
          onClick={handleAddCoffee}
          className="w-full py-5 bg-[#E57B3E] disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white rounded-[25px] font-black text-xl shadow-xl active:scale-95 transition-all transform"
        >
          기록 완료 ☕️
        </button>
      </div>
      )}
    </div>
  );
};