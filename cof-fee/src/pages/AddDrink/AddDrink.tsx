import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import { COFFEE_BRANDS, type BrandData, type CoffeeMenu, type SizeOption } from '../../lib/caffeineData';
export const AddDrink = () => {
  const navigate = useNavigate();
  const setLogs = useSetAtom(caffeineLogsAtom);

  // 선택 상태 관리
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<CoffeeMenu | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);

  // 저장 핸들러
  const handleAddCoffee = () => {
    if (!selectedMenu || !selectedSize) return;

    const newLog = {
      id: Date.now().toString(),
      caffeineAmount: selectedSize.caffeine, // 데이터에서 가져온 카페인 양
      intakeTime: new Date().toISOString(),
      beverageName: `${selectedBrand?.brand} ${selectedMenu.name} (${selectedSize.label})`,
    };

    setLogs((prev) => [...prev, newLog]);
    alert(`${newLog.beverageName} 기록 완료! ☕️`);
    navigate('/'); // 홈으로 이동
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">음료 기록하기</h2>

      {/* 1. 브랜드 선택 */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-400">브랜드</label>
        <select 
          className="w-full p-3 bg-gray-800 rounded border border-gray-700"
          onChange={(e) => {
            const brand = COFFEE_BRANDS.find(b => b.id === e.target.value) || null;
            setSelectedBrand(brand);
            setSelectedMenu(null); // 브랜드 바뀌면 메뉴 초기화
            setSelectedSize(null);
          }}
        >
          <option value="">브랜드를 선택하세요</option>
          {COFFEE_BRANDS.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.brand}</option>
          ))}
        </select>
      </div>

      {/* 2. 메뉴 선택 (브랜드 선택 시 활성화) */}
      {selectedBrand && (
        <div className="mb-6">
          <label className="block mb-2 text-gray-400">메뉴</label>
          <select 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700"
            onChange={(e) => {
              const menu = selectedBrand.menus.find(m => m.id === e.target.value) || null;
              setSelectedMenu(menu);
              setSelectedSize(null); // 메뉴 바뀌면 사이즈 초기화
            }}
          >
            <option value="">메뉴를 선택하세요</option>
            {selectedBrand.menus.map(menu => (
              <option key={menu.id} value={menu.id}>{menu.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* 3. 사이즈 선택 (메뉴 선택 시 활성화) */}
      {selectedMenu && (
        <div className="mb-8">
          <label className="block mb-2 text-gray-400">사이즈</label>
          <div className="grid grid-cols-2 gap-2">
            {selectedMenu.sizes.map((size, idx) => (
              <button
                key={idx}
                className={`p-3 rounded border ${
                  selectedSize === size 
                    ? 'bg-green-600 border-green-500 text-white' 
                    : 'bg-gray-800 border-gray-700 text-gray-300'
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

      {/* 저장 버튼 */}
      <button 
        disabled={!selectedSize}
        onClick={handleAddCoffee}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
          selectedSize 
            ? 'bg-green-500 hover:bg-green-400 text-black' 
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        기록하기
      </button>
    </div>
  );
};