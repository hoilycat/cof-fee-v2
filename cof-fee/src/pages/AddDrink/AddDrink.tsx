import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom, useAtomValue } from 'jotai';
import { caffeineLogsAtom, userProfileAtom } from '../../hooks/useCaffeineStore';
import { COFFEE_BRANDS, type BrandData, type CoffeeMenu, type SizeOption } from '../../lib/caffeineData';

export const AddDrink = () => {
  const navigate = useNavigate();
  const setLogs = useSetAtom(caffeineLogsAtom);
  const user = useAtomValue(userProfileAtom);

  const [isManual, setIsManual] = useState(false);
  const [manualCaffeine, setManualCaffeine] = useState<number>(0);
  const [manualName, setManualName] = useState('');

  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<CoffeeMenu | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);

  const currentCaffeine = isManual ? manualCaffeine : (selectedSize?.caffeine || 0);
  const isHighCaffeine = !isManual && selectedSize ? selectedSize.caffeine > 150 : false;

  // 저장 버튼 활성화 조건
  const isFormValid = isManual 
    ? (manualName.trim() !== '' && manualCaffeine > 0) 
    : (selectedSize !== null);

  const handleAddCoffee = () => {
    if (isManual) {
      if (!manualName || manualCaffeine <= 0) return;
    } else {
      if (!selectedMenu || !selectedSize) return;
    }

    const newLog = {
      id: Date.now().toString(),
      caffeineAmount: currentCaffeine, 
      intakeTime: new Date().toISOString(),
      beverageName: isManual ? manualName : `${selectedBrand?.brand} ${selectedMenu?.name} (${selectedSize?.label})`,
      isFasting: false,
      price: 0,
    };

    setLogs((prev) => [...prev, newLog]);
    alert(`${newLog.beverageName} 기록 완료! ☕️`);
    navigate('/');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">음료 기록하기</h2>

      {/* 1. 직접 입력 전환 버튼 */}
      <button 
        onClick={() => {
          setIsManual(!isManual);
          setSelectedBrand(null);
          setSelectedMenu(null);
          setSelectedSize(null);
        }}
        className="mb-6 text-sm text-[#E57B3E] font-bold underline"
      >
        {isManual ? '브랜드 메뉴 선택하기' : '직접 입력하기'}
      </button>

      {/* 2. 입력 영역 분기 */}
      {isManual ? (
        <div className="space-y-4 mb-6">
          <input 
            className="w-full p-3 bg-gray-800 rounded text-white outline-none focus:ring-2 focus:ring-[#E57B3E]" 
            placeholder="음료 이름 (예: 편의점 커피)" 
            onChange={(e) => setManualName(e.target.value)} 
          />
          <div className="relative">
            <input 
              type="number" 
              className="w-full p-3 bg-gray-800 rounded text-white outline-none focus:ring-2 focus:ring-[#E57B3E]" 
              placeholder="카페인 함량" 
              onChange={(e) => setManualCaffeine(Number(e.target.value))} 
            />
            <span className="absolute right-3 top-3 text-gray-500 font-bold">mg</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 mb-6">
          {/* 브랜드 선택 UI */}
          {selectedBrand && (
            <div className="p-4 bg-[#EFEBE4] rounded-2xl text-sm font-bold text-[#5C3D2E]">
              {user.isTapering ? "☕️ 감량 중이에요! 디카페인은 어떨까요?" : "오늘 컨디션은 어떠신가요?"}
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-gray-400 text-sm">브랜드</label>
            <select 
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white"
              value={selectedBrand?.id || ''}
              onChange={(e) => {
                const brand = COFFEE_BRANDS.find(b => b.id === e.target.value) || null;
                setSelectedBrand(brand);
                setSelectedMenu(null);
                setSelectedSize(null);
              }}
            >
              <option value="">브랜드를 선택하세요</option>
              {COFFEE_BRANDS.map(brand => <option key={brand.id} value={brand.id}>{brand.brand}</option>)}
            </select>
          </div>

          {selectedBrand && (
            <div>
              <label className="block mb-2 text-gray-400 text-sm">메뉴</label>
              <select 
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white"
                value={selectedMenu?.id || ''}
                onChange={(e) => {
                  const menu = selectedBrand.menus.find(m => m.id === e.target.value) || null;
                  setSelectedMenu(menu);
                  setSelectedSize(null);
                }}
              >
                <option value="">메뉴를 선택하세요</option>
                {selectedBrand.menus.map(menu => <option key={menu.id} value={menu.id}>{menu.name}</option>)}
              </select>
            </div>
          )}

          {selectedMenu && (
            <div>
              <label className="block mb-2 text-gray-400 text-sm">사이즈</label>
              <div className="grid grid-cols-2 gap-2">
                {selectedMenu.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    className={`p-3 rounded border transition-all ${
                      selectedSize === size ? 'bg-green-600 border-green-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <div className="font-bold">{size.label}</div>
                    <div className="text-sm opacity-80">{size.caffeine}mg</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. 공통 경고 및 버튼 영역 */}
      {isHighCaffeine && (
        <div className="mb-4 p-4 bg-[#FFEAE8] rounded-2xl text-sm font-bold text-[#E05252]">
          ⚠️ 주의: 이 음료는 카페인 함량이 높습니다!
        </div>
      )}

      <button 
        disabled={!isFormValid}
        onClick={handleAddCoffee}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          isFormValid ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        기록하기
      </button>
    </div>
  );
};