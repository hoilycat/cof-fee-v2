export interface SizeOption {
  label: string;
  ml: number;
  caffeine: number;
}

export interface CoffeeMenu {
  id: string;
  name: string;
  category: 'Espresso' | 'ColdBrew' | 'Decaf' | 'Tea' | 'Frappuccino' | 'Beverage'; // 카테고리 조금 더 세분화했습니다
  sizes: SizeOption[];
}

export interface BrandData {
  id: string;
  brand: string;
  menus: CoffeeMenu[];
}

export const COFFEE_BRANDS: BrandData[] = [
  // =================================================================
  // 1. 스타벅스 (Starbucks)
  // =================================================================
  {
    id: 'sbux',
    brand: '스타벅스',
    menus: [
      // 1. 콜드 브루
      {
        id: 'sbux_nitro_cold',
        name: '나이트로 콜드 브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 245 }]
      },
      {
        id: 'sbux_reserve_nitro',
        name: '리저브 나이트로',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 190 }]
      },
      {
        id: 'sbux_reserve_cold',
        name: '리저브 콜드 브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 190 }]
      },
      {
        id: 'sbux_nitro_vanilla',
        name: '나이트로 바닐라 크림',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 232 }]
      },
      {
        id: 'sbux_dolce_cold',
        name: '돌체 콜드 브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 155 }]
      },
      {
        id: 'sbux_vanilla_cream_cold',
        name: '바닐라 크림 콜드브루',
        category: 'ColdBrew',
        sizes: [
            { label: 'Tall', ml: 355, caffeine: 155 },
            { label: 'Standard', ml: 0, caffeine: 125 } // 용량 미표기 항목
        ]
      },
      {
        id: 'sbux_makgeolli_cold',
        name: '막걸리향 크림 콜드브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 53 }]
      },
      {
        id: 'sbux_mint_cold',
        name: '민트 콜드브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Grande', ml: 473, caffeine: 415 }]
      },
      {
        id: 'sbux_bergamot_cold',
        name: '베르가못 콜드 브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 90 }]
      },
      {
        id: 'sbux_bw_cold',
        name: '블랙 & 화이트 콜드브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 190 }]
      },
      {
        id: 'sbux_smoked_cold',
        name: '스모크드 콜드 패션드',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 135 }]
      },
      {
        id: 'sbux_sig_black_cold',
        name: '시그니쳐 더 블랙 콜드브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Bottle', ml: 500, caffeine: 680 }]
      },
      {
        id: 'sbux_yeoju_hazel_cold',
        name: '여주 윤슬 헤이즐넛 콜드브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 53 }]
      },
      {
        id: 'sbux_oat_cold',
        name: '오트 콜드 브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 65 }]
      },
      {
        id: 'sbux_jeju_bijarim_cold',
        name: '제주 비자림 리저브 콜드 브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Grande', ml: 473, caffeine: 250 }]
      },
      {
        id: 'sbux_coldbrew_plain',
        name: '콜드브루',
        category: 'ColdBrew',
        sizes: [
          { label: 'Tall', ml: 355, caffeine: 155 },
          { label: 'Trenta', ml: 887, caffeine: 350 }
        ]
      },
      {
        id: 'sbux_malt',
        name: '콜드 브루 몰트',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 190 }]
      },
      {
        id: 'sbux_malt_float',
        name: '콜드 브루 몰트 플로트',
        category: 'ColdBrew',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 190 }]
      },
      // 2. 브루드 커피
      {
        id: 'sbux_brewed',
        name: '브루드 커피',
        category: 'Espresso',
        sizes: [
          { label: 'Hot Tall', ml: 355, caffeine: 260 },
          { label: 'Ice Tall', ml: 355, caffeine: 140 }
        ]
      },
      // 3. 에스프레소 & 라떼
      {
        id: 'sbux_friends_cinnamon',
        name: '프렌즈 시나몬 돌체폼 카푸치노',
        category: 'Espresso',
        sizes: [
          { label: 'Reserve Hot Tall', ml: 355, caffeine: 210 },
          { label: 'Reserve Ice Tall', ml: 355, caffeine: 210 },
          { label: 'Hot Tall', ml: 355, caffeine: 75 },
          { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_double_esp_cream',
        name: '더블 에스프레소 크림 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 90 },
            { label: 'Ice Tall', ml: 355, caffeine: 90 }
        ]
      },
      {
        id: 'sbux_con_panna',
        name: '에스프레소 콘 파나',
        category: 'Espresso',
        sizes: [{ label: 'Solo', ml: 22, caffeine: 75 }]
      },
      {
        id: 'sbux_macchiato',
        name: '에스프레소 마키아또',
        category: 'Espresso',
        sizes: [{ label: 'Solo', ml: 22, caffeine: 75 }]
      },
      {
        id: 'sbux_1st_ame',
        name: '스타벅스 1호점 카페 아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 0, caffeine: 210 },
            { label: 'Ice', ml: 0, caffeine: 210 }
        ]
      },
      {
        id: 'sbux_ame',
        name: '카페 아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 150 },
            { label: 'Ice Tall', ml: 355, caffeine: 150 }
        ]
      },
      {
        id: 'sbux_caramel_macc',
        name: '카라멜 마키아또',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 75 },
            { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_cappuccino',
        name: '카푸치노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 75 },
            { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_lavender_breve',
        name: '라벤더 카페 브레베',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 105 },
            { label: 'Ice Tall', ml: 355, caffeine: 105 }
        ]
      },
      {
        id: 'sbux_milk_caramel',
        name: '밀크카라멜 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 75 },
            { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_vanilla_latte',
        name: '바닐라 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 75 },
            { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_vanilla_bean_latte',
        name: '바닐라 빈 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 210 },
            { label: 'Ice Tall', ml: 355, caffeine: 210 }
        ]
      },
      {
        id: 'sbux_burnt_caramel',
        name: '번트 카라멜 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 210 }]
      },
      {
        id: 'sbux_sakerato_bianco',
        name: '사케라또 비안코 오버 아이스',
        category: 'Espresso',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 315 }]
      },
      {
        id: 'sbux_1st_latte',
        name: '스타벅스 1호점 카페 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 0, caffeine: 210 },
            { label: 'Ice', ml: 0, caffeine: 210 }
        ]
      },
      {
        id: 'sbux_1st_cream',
        name: '스타벅스 1호점 크림 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 0, caffeine: 210 },
            { label: 'Ice', ml: 0, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_honey_hotteok',
        name: '스타벅스 꿀 호떡 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 75 },
            { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_dolce',
        name: '스타벅스 돌체 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 150 },
            { label: 'Ice Tall', ml: 355, caffeine: 105 }
        ]
      },
      {
        id: 'sbux_injeolmi',
        name: '인절미 크림 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 75 },
            { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_jeju_bijarim_latte',
        name: '제주 비자림 리저브 에스프레소 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 210 }]
      },
      {
        id: 'sbux_latte',
        name: '카페 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 75 },
            { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_cortado',
        name: '코르타도',
        category: 'Espresso',
        sizes: [{ label: 'Short', ml: 237, caffeine: 255 }]
      },
      {
        id: 'sbux_mocha',
        name: '카페 모카',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 95 },
            { label: 'Ice Tall', ml: 355, caffeine: 95 }
        ]
      },
      {
        id: 'sbux_white_choco_mocha',
        name: '화이트 초콜릿 모카',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 75 },
            { label: 'Ice Tall', ml: 355, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_classic_mint_mocha',
        name: '클래식 민트 모카',
        category: 'Espresso',
        sizes: [{ label: 'Grande', ml: 473, caffeine: 210 }]
      },
      {
        id: 'sbux_flat_white',
        name: '플랫 화이트',
        category: 'Espresso',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 130 },
            { label: 'Ice Tall', ml: 355, caffeine: 130 }
        ]
      },
      {
        id: 'sbux_double_shot_flavors',
        name: '스타벅스 더블 샷 (바닐라/커피/헤이즐넛)',
        category: 'Espresso',
        sizes: [
            { label: 'Vanilla 207ml', ml: 207, caffeine: 105 },
            { label: 'Coffee 207ml', ml: 207, caffeine: 150 },
            { label: 'Hazelnut 207ml', ml: 207, caffeine: 150 }
        ]
      },
      {
        id: 'sbux_affogato',
        name: '아포가토 (사케라또/클래식)',
        category: 'Espresso',
        sizes: [
            { label: 'Sakerato Tall', ml: 355, caffeine: 210 },
            { label: 'Classic Tall', ml: 355, caffeine: 210 }
        ]
      },
      {
        id: 'sbux_sparkling_citrus',
        name: '스파클링 시트러스 에스프레소',
        category: 'Espresso',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 105 }]
      },
      {
        id: 'sbux_espresso',
        name: '에스프레소',
        category: 'Espresso',
        sizes: [{ label: 'Solo', ml: 22, caffeine: 75 }]
      },
      // 4. 프라푸치노
      {
        id: 'sbux_frap_choco_banana',
        name: '초코 바나나 마카다미아 오트 프라푸치노',
        category: 'Frappuccino',
        sizes: [{ label: 'Grande', ml: 473, caffeine: 5 }]
      },
      {
        id: 'sbux_frap_double_esp',
        name: '더블 에스프레소 칩 프라푸치노',
        category: 'Frappuccino',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 130 }]
      },
      {
        id: 'sbux_frap_esp',
        name: '에스프레소 프라푸치노',
        category: 'Frappuccino',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 120 }]
      },
      {
        id: 'sbux_frap_java',
        name: '자바 칩 프라푸치노',
        category: 'Frappuccino',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 100 }]
      },
      {
        id: 'sbux_frap_caramel',
        name: '카라멜 프라푸치노',
        category: 'Frappuccino',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 85 }]
      },
      {
        id: 'sbux_frap_strawberry',
        name: '딸기 글레이즈드 크림 프라푸치노',
        category: 'Frappuccino',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 5 }]
      },
      {
        id: 'sbux_frap_matcha',
        name: '제주 말차 크림 프라푸치노 (일반/베르가못/인절미)',
        category: 'Frappuccino',
        sizes: [
            { label: 'Normal Tall', ml: 355, caffeine: 60 },
            { label: 'Bergamot Grande', ml: 473, caffeine: 30 },
            { label: 'Injeolmi Grande', ml: 473, caffeine: 37 }
        ]
      },
      {
        id: 'sbux_frap_choco_chip',
        name: '초콜릿 크림 칩 프라푸치노',
        category: 'Frappuccino',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 10 }]
      },
      // 5. 블렌디드 & 리프레셔 & 티
      {
        id: 'sbux_blended_milktea',
        name: '스타벅스 클래식 밀크티 블렌디드',
        category: 'Beverage',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 60 }]
      },
      {
        id: 'sbux_blended_matcha_yuzu',
        name: '말차 폭포 유자 블렌디드',
        category: 'Beverage',
        sizes: [{ label: 'Tall', ml: 355, caffeine: 65 }]
      },
      {
        id: 'sbux_refresher',
        name: '스타벅스 리프레셔',
        category: 'Beverage',
        sizes: [
            { label: 'Tall', ml: 355, caffeine: 30 },
            { label: 'Strawberry Trenta', ml: 887, caffeine: 73 }
        ]
      },
      {
        id: 'sbux_fizzio',
        name: '피지오 (홉/쿨라임/피치)',
        category: 'Beverage',
        sizes: [
            { label: 'Golden Mandarin Hop', ml: 0, caffeine: 16 },
            { label: 'Cool Lime Tall', ml: 355, caffeine: 100 },
            { label: 'Peach Strawberry Tall', ml: 355, caffeine: 37 }
        ]
      },
      {
        id: 'sbux_tea_earlgrey',
        name: '얼 그레이 티 (라떼/티)',
        category: 'Tea',
        sizes: [
            { label: 'Berry Tea Latte Tall', ml: 355, caffeine: 30 },
            { label: 'Tea Tall', ml: 355, caffeine: 70 },
            { label: 'Ice Tea Tall', ml: 355, caffeine: 50 },
            { label: 'Vanilla Tea Latte Tall', ml: 355, caffeine: 55 },
            { label: 'Ice Vanilla Tea Latte Tall', ml: 355, caffeine: 29 }
        ]
      },
      {
        id: 'sbux_tea_black',
        name: '잉글리쉬 브렉퍼스트 티',
        category: 'Tea',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 70 },
            { label: 'Ice Tall', ml: 355, caffeine: 40 }
        ]
      },
      {
        id: 'sbux_tea_grapefruit',
        name: '자몽 허니 블랙 티',
        category: 'Tea',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 70 },
            { label: 'Ice Tall', ml: 355, caffeine: 30 },
            { label: 'Jeju Palsak Tall', ml: 355, caffeine: 70 },
            { label: 'Ice Trenta', ml: 887, caffeine: 75 }
        ]
      },
      {
        id: 'sbux_tea_matcha_latte',
        name: '제주 말차 라떼',
        category: 'Tea',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 60 },
            { label: 'Ice Tall', ml: 355, caffeine: 60 },
            { label: 'Injeolmi Hot', ml: 0, caffeine: 58 },
            { label: 'Injeolmi Ice Tall', ml: 355, caffeine: 52 },
            { label: 'Tiramisu Hot Tall', ml: 355, caffeine: 75 },
            { label: 'French Vanilla Tall', ml: 355, caffeine: 40 }
        ]
      },
      {
        id: 'sbux_tea_milktea',
        name: '클래식 밀크 티',
        category: 'Tea',
        sizes: [
            { label: 'Hot Tall', ml: 355, caffeine: 190 },
            { label: 'Ice Tall', ml: 355, caffeine: 80 },
            { label: 'Bottle 500ml', ml: 500, caffeine: 195 }
        ]
      },
      {
        id: 'sbux_others',
        name: '기타 제조 음료 (초콜릿 등)',
        category: 'Beverage',
        sizes: [
            { label: 'Signature Hot Choco Tall', ml: 355, caffeine: 15 },
            { label: 'Ice Signature Choco Tall', ml: 355, caffeine: 5 },
            { label: 'Strawberry Cold Foam Choco', ml: 0, caffeine: 5 },
            { label: 'Tiramisu Choco Tall', ml: 355, caffeine: 10 }
        ]
      }
    ],
  },

  // =================================================================
  // 2. 투썸플레이스 (Twosome Place)
  // =================================================================
  {
    id: 'twosome',
    brand: '투썸플레이스',
    menus: [
      {
        id: 'twosome_cold_decaf',
        name: '디카페인 콜드브루 (라떼 포함)',
        category: 'Decaf',
        sizes: [
            { label: 'Cold Brew 414ml', ml: 414, caffeine: 8 },
            { label: 'Latte 414ml', ml: 414, caffeine: 13 }
        ]
      },
      {
        id: 'twosome_vanilla_bean',
        name: '바닐라빈 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_ame',
        name: '아메리카노',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_latte',
        name: '카페 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_cap',
        name: '카푸치노',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_vanilla_latte',
        name: '바닐라 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_caramel_macc',
        name: '카라멜 마키아또',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_mocha',
        name: '카페 모카',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 192 }]
      },
      {
        id: 'twosome_cold_vanilla',
        name: '바닐라빈 콜드브루 라떼',
        category: 'ColdBrew',
        sizes: [{ label: 'Regular', ml: 414, caffeine: 132 }]
      },
      {
        id: 'twosome_coldbrew',
        name: '콜드브루',
        category: 'ColdBrew',
        sizes: [{ label: 'Regular', ml: 414, caffeine: 212 }]
      },
      {
        id: 'twosome_cold_latte',
        name: '콜드브루 라떼',
        category: 'ColdBrew',
        sizes: [{ label: 'Regular', ml: 414, caffeine: 212 }]
      },
      {
        id: 'twosome_ashotchu',
        name: '아샷추 (애플/민트/피치)',
        category: 'Tea',
        sizes: [
            { label: 'Apple 591ml', ml: 591, caffeine: 92 },
            { label: 'Mint 591ml', ml: 591, caffeine: 92 },
            { label: 'Peach 591ml', ml: 591, caffeine: 92 }
        ]
      },
      {
        id: 'twosome_banana',
        name: '바나나 샷 (라떼/아메리카노)',
        category: 'Espresso',
        sizes: [
            { label: 'Latte 355ml', ml: 355, caffeine: 92 },
            { label: 'Americano 473ml', ml: 473, caffeine: 184 }
        ]
      },
      {
        id: 'twosome_longblack',
        name: '롱 블랙',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 237, caffeine: 184 }]
      },
      {
        id: 'twosome_short_latte',
        name: '숏 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 296, caffeine: 184 }]
      },
      {
        id: 'twosome_peanut',
        name: '피넛 헤이즐넛 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_einspanner',
        name: '아인슈페너',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_dalgona',
        name: '달고나 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 40 }]
      },
      {
        id: 'twosome_spanish',
        name: '스페니쉬 연유 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 184 }]
      },
      {
        id: 'twosome_espresso',
        name: '에스프레소',
        category: 'Espresso',
        sizes: [{ label: '1 Shot', ml: 23, caffeine: 92 }]
      },
      {
        id: 'twosome_oat_white',
        name: '오트 화이트 라떼',
        category: 'Espresso',
        sizes: [{ label: 'Regular', ml: 355, caffeine: 10 }]
      }
    ],
  },

  // =================================================================
  // 3. 커피빈 (Coffee Bean)
  // =================================================================
  {
    id: 'cbean',
    brand: '커피빈',
    menus: [
      {
        id: 'cbean_mocha',
        name: '카페 모카',
        category: 'Espresso',
        sizes: [
            { label: 'Ice', ml: 0, caffeine: 102 },
            { label: 'Hot', ml: 0, caffeine: 102 }
        ]
      },
      {
        id: 'cbean_brown_macchiatone',
        name: '브라운 마끼아토네',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 0, caffeine: 91 }]
      },
      {
        id: 'cbean_macchiatone',
        name: '마끼아토네',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 0, caffeine: 91 }]
      },
      {
        id: 'cbean_hazelnut_latte',
        name: '헤이즐넛 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Ice', ml: 0, caffeine: 91 },
            { label: 'Hot', ml: 0, caffeine: 91 }
        ]
      },
      {
        id: 'cbean_latte',
        name: '카페 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 0, caffeine: 91 },
            { label: 'Ice', ml: 0, caffeine: 91 }
        ]
      },
      {
        id: 'cbean_ame',
        name: '아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 0, caffeine: 182 },
            { label: 'Ice', ml: 0, caffeine: 91 }, // 텍스트 파일상 아이스 0mg 표기는 디카페인 오기 같으나, 헤이즐넛 아이스가 91이므로 91로 추정/보정하거나 원본 데이터 유지
            { label: 'Hazelnut Hot', ml: 0, caffeine: 182 },
            { label: 'Hazelnut Ice', ml: 0, caffeine: 91 }
        ]
      },
      {
        id: 'cbean_cappuccino',
        name: '카푸치노',
        category: 'Espresso',
        sizes: [{ label: 'Hot', ml: 0, caffeine: 91 }]
      },
      {
        id: 'cbean_vanilla_latte',
        name: '바닐라 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 0, caffeine: 91 },
            { label: 'Ice', ml: 0, caffeine: 91 }
        ]
      },
      {
        id: 'cbean_cafesua',
        name: '카페수아 (연유)',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 0, caffeine: 182 },
            { label: 'Ice', ml: 0, caffeine: 182 }
        ]
      },
      {
        id: 'cbean_caramel_macc',
        name: '캐러멜 마키아또',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 0, caffeine: 91 },
            { label: 'Ice', ml: 0, caffeine: 91 }
        ]
      },
      {
        id: 'cbean_flatwhite',
        name: '플랫 화이트',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 0, caffeine: 198 }]
      },
      {
        id: 'cbean_espresso',
        name: '에스프레소',
        category: 'Espresso',
        sizes: [
            { label: 'Ice', ml: 0, caffeine: 273 }, // 파일 데이터 그대로 반영
            { label: 'Macchiato Double', ml: 0, caffeine: 198 }
        ]
      }
    ],
  },

  // =================================================================
  // 4. 컴포즈 커피 (Compose Coffee)
  // =================================================================
  {
    id: 'compose',
    brand: '컴포즈커피',
    menus: [
      {
        id: 'compose_ame',
        name: '아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 156 },
            { label: 'Ice 20oz', ml: 591, caffeine: 156 },
            { label: 'BigPose 32oz', ml: 946, caffeine: 312 }
        ]
      },
      {
        id: 'compose_latte',
        name: '카페라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 208 },
            { label: 'Ice 20oz', ml: 591, caffeine: 208 }
        ]
      },
      {
        id: 'compose_cap',
        name: '카푸치노',
        category: 'Espresso',
        sizes: [{ label: '20oz', ml: 591, caffeine: 208 }]
      },
      {
        id: 'compose_vanilla',
        name: '바닐라라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 208 },
            { label: 'Ice 20oz', ml: 591, caffeine: 208 }
        ]
      },
      {
        id: 'compose_hazelnut',
        name: '헤이즐넛 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 208 },
            { label: 'Ice 20oz', ml: 591, caffeine: 208 }
        ]
      },
      {
        id: 'compose_caramel',
        name: '카라멜마끼아또',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 208 },
            { label: 'Ice 20oz', ml: 591, caffeine: 208 }
        ]
      },
      {
        id: 'compose_mocha',
        name: '카페모카',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 208 },
            { label: 'Ice 20oz', ml: 591, caffeine: 208 }
        ]
      },
      {
        id: 'compose_dolce',
        name: '돌체라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 208 },
            { label: 'Ice 20oz', ml: 591, caffeine: 208 }
        ]
      },
      {
        id: 'compose_heukdang',
        name: '흑당카페라떼',
        category: 'Espresso',
        sizes: [{ label: '20oz', ml: 591, caffeine: 104 }]
      },
      {
        id: 'compose_dalgona',
        name: '달고나라떼',
        category: 'Espresso',
        sizes: [{ label: '20oz', ml: 591, caffeine: 156 }]
      },
      {
        id: 'compose_einspanner_latte',
        name: '아인슈페너라떼',
        category: 'Espresso',
        sizes: [{ label: '20oz', ml: 591, caffeine: 208 }]
      },
      {
        id: 'compose_einspanner',
        name: '아인슈페너',
        category: 'Espresso',
        sizes: [{ label: '20oz', ml: 591, caffeine: 85 }]
      },
      {
        id: 'compose_coldbrew',
        name: '콜드브루',
        category: 'ColdBrew',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 85 }, // Hot/Ice 카페인 다름 주의
            { label: 'Ice 20oz', ml: 591, caffeine: 181 }
        ]
      },
      {
        id: 'compose_coldbrew_latte',
        name: '콜드브루라떼',
        category: 'ColdBrew',
        sizes: [
            { label: 'Hot 20oz', ml: 591, caffeine: 181 },
            { label: 'Ice 20oz', ml: 591, caffeine: 181 }
        ]
      },
      {
        id: 'compose_decaf_cold',
        name: '디카페인 콜드브루 (라떼 포함)',
        category: 'Decaf',
        sizes: [
            { label: 'ColdBrew Hot/Ice', ml: 591, caffeine: 4.7 },
            { label: 'Latte Hot/Ice', ml: 591, caffeine: 4.7 }
        ]
      },
      {
        id: 'compose_decaf_ame',
        name: '디카페인 아메리카노',
        category: 'Decaf',
        sizes: [
            { label: 'Hot', ml: 591, caffeine: 45 }, // 2shot 기준이나 원본 45ml 표기됨, 메뉴제공 기준 591ml
            { label: 'Ice', ml: 591, caffeine: 9.2 }
        ]
      },
      {
        id: 'compose_espresso',
        name: '에스프레소',
        category: 'Espresso',
        sizes: [{ label: '1 Shot', ml: 30, caffeine: 104 }]
      }
    ],
  },

  // =================================================================
  // 5. 빽다방 (Paik's Coffee)
  // =================================================================
  {
    id: 'paiks',
    brand: '빽다방',
    menus: [
      {
        id: 'paiks_esp',
        name: '더블 에스프레소',
        category: 'Espresso',
        sizes: [
            { label: 'Standard', ml: 60, caffeine: 293 },
            { label: 'Decaf', ml: 60, caffeine: 1.9 }
        ]
      },
      {
        id: 'paiks_ame',
        name: '아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 16oz', ml: 473, caffeine: 293 },
            { label: 'Ice 24oz', ml: 710, caffeine: 293 },
            { label: 'Paik Size 32oz', ml: 946, caffeine: 586 },
            { label: 'Decaf Hot', ml: 473, caffeine: 1.9 },
            { label: 'Decaf Ice', ml: 710, caffeine: 19 },
            { label: 'Decaf Paik Size', ml: 946, caffeine: 3.8 }
        ]
      },
      {
        id: 'paiks_redbull',
        name: '레드불 꿀샷추',
        category: 'Beverage',
        sizes: [{ label: 'Ice 24oz', ml: 710, caffeine: 197 }]
      },
      {
        id: 'paiks_wonjo',
        name: '원조커피',
        category: 'Espresso',
        sizes: [
            { label: 'Hot 16oz', ml: 473, caffeine: 406 },
            { label: 'Ice 24oz', ml: 710, caffeine: 371 },
            { label: 'Paik Size', ml: 946, caffeine: 564 },
            { label: 'Zero Sugar Hot', ml: 473, caffeine: 489 },
            { label: 'Zero Sugar Ice', ml: 710, caffeine: 452 },
            { label: 'Zero Sugar Paik Size', ml: 946, caffeine: 686 }
        ]
      },
      {
        id: 'paiks_ashotchu',
        name: '아이스티 샷추가 (아샷추/아샷망추)',
        category: 'Tea',
        sizes: [
            { label: 'AhShotChu 24oz', ml: 710, caffeine: 100 },
            { label: 'AhShotMangChu 24oz', ml: 710, caffeine: 106 },
            { label: 'Decaf AhShotChu', ml: 710, caffeine: 27.9 },
            { label: 'Decaf AhShotMangChu', ml: 710, caffeine: 26 },
            { label: 'Paik Size AhShotChu', ml: 946, caffeine: 179 },
            { label: 'Paik Size AhShotMangChu', ml: 946, caffeine: 177 }
        ]
      },
      {
        id: 'paiks_coconut',
        name: '코코넛 커피 (라떼/스무디)',
        category: 'Espresso',
        sizes: [
            { label: 'Latte Hot', ml: 473, caffeine: 283 },
            { label: 'Latte Ice', ml: 710, caffeine: 236 },
            { label: 'Smoothie', ml: 710, caffeine: 237 },
            { label: 'Decaf Latte Hot', ml: 473, caffeine: 1.9 },
            { label: 'Decaf Smoothie', ml: 710, caffeine: 374 }
        ]
      },
      {
        id: 'paiks_coconut_cold',
        name: '코코넛 콜드브루 (라떼/스무디)',
        category: 'ColdBrew',
        sizes: [
            { label: 'Latte Hot', ml: 473, caffeine: 272 },
            { label: 'Latte Ice', ml: 710, caffeine: 207 },
            { label: 'Smoothie', ml: 710, caffeine: 183 },
            { label: 'Decaf Latte Hot', ml: 473, caffeine: 446 },
            { label: 'Decaf Latte Ice', ml: 710, caffeine: 344 },
            { label: 'Decaf Smoothie', ml: 710, caffeine: 404 }
        ]
      },
      {
        id: 'paiks_honey_ame',
        name: '꿀 아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot/Ice', ml: 0, caffeine: 293 },
            { label: 'Decaf Hot/Ice', ml: 0, caffeine: 1.9 }
        ]
      },
      {
        id: 'paiks_hazel_ame',
        name: '헤이즐넛 아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot/Ice', ml: 0, caffeine: 293 },
            { label: 'Decaf Hot/Ice', ml: 0, caffeine: 1.9 }
        ]
      },
      {
        id: 'paiks_hazel_latte',
        name: '헤이즐넛 라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot/Ice', ml: 0, caffeine: 293 },
            { label: 'Decaf Hot', ml: 0, caffeine: 1.9 },
            { label: 'Decaf Ice', ml: 0, caffeine: 19 }
        ]
      },
      {
        id: 'paiks_dolce',
        name: '달달연유라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot/Ice', ml: 0, caffeine: 293 },
            { label: 'Decaf Hot/Ice', ml: 0, caffeine: 1.9 }
        ]
      },
      {
        id: 'paiks_latte',
        name: '카페라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot/Ice', ml: 0, caffeine: 293 },
            { label: 'Paik Size', ml: 946, caffeine: 586 },
            { label: 'Decaf Hot/Ice', ml: 0, caffeine: 1.9 },
            { label: 'Decaf Paik Size', ml: 946, caffeine: 3.8 }
        ]
      },
      {
        id: 'paiks_blackpearl',
        name: '흑당버블 카페라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Ice', ml: 710, caffeine: 147 },
            { label: 'Decaf', ml: 710, caffeine: 0.9 }
        ]
      },
      {
        id: 'paiks_vanilla',
        name: '바닐라라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Hot/Ice', ml: 0, caffeine: 293 },
            { label: 'Paik Size', ml: 946, caffeine: 538 },
            { label: 'Decaf Hot/Ice', ml: 0, caffeine: 1.9 },
            { label: 'Decaf Paik Size', ml: 946, caffeine: 564 }
        ]
      },
      {
        id: 'paiks_mocha',
        name: '카페모카',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 473, caffeine: 299 },
            { label: 'Ice', ml: 710, caffeine: 270 },
            { label: 'Decaf Hot', ml: 473, caffeine: 136.7 },
            { label: 'Decaf Ice', ml: 710, caffeine: 117.8 }
        ]
      },
      {
        id: 'paiks_caramel',
        name: '카라멜마키아또',
        category: 'Espresso',
        sizes: [
            { label: 'Hot/Ice', ml: 0, caffeine: 293 },
            { label: 'Decaf Hot/Ice', ml: 0, caffeine: 1.9 }
        ]
      },
      {
        id: 'paiks_banana',
        name: '바나나 카페라떼/쉐이크',
        category: 'Espresso',
        sizes: [
            { label: 'Latte Hot/Ice', ml: 0, caffeine: 147 },
            { label: 'Shake', ml: 710, caffeine: 147 },
            { label: 'Decaf', ml: 0, caffeine: 0.9 }
        ]
      },
      {
        id: 'paiks_icecream_latte',
        name: '아이스크림 라떼 (카페/바닐라/모카)',
        category: 'Espresso',
        sizes: [
            { label: 'Cafe/Vanilla Ice', ml: 710, caffeine: 293 },
            { label: 'Mocha Ice', ml: 710, caffeine: 309 },
            { label: 'Decaf Cafe/Vanilla', ml: 710, caffeine: 1.9 },
            { label: 'Decaf Mocha', ml: 710, caffeine: 113.9 }
        ]
      },
      {
        id: 'paiks_coldbrew_plain',
        name: '콜드브루 (일반/디카페인)',
        category: 'ColdBrew',
        sizes: [
            { label: 'Hot/Ice', ml: 0, caffeine: 184.3 },
            { label: 'Decaf Ice', ml: 710, caffeine: 11.8 },
            { label: 'Decaf Hot', ml: 473, caffeine: 184.3 }
        ]
      },
      {
        id: 'paiks_creamy_cold',
        name: '크리미 콜드브루 (바닐라/카라멜)',
        category: 'ColdBrew',
        sizes: [
            { label: 'Vanilla', ml: 0, caffeine: 129 },
            { label: 'Caramel', ml: 0, caffeine: 170 },
            { label: 'Decaf Vanilla', ml: 0, caffeine: 10 },
            { label: 'Decaf Caramel', ml: 0, caffeine: 9 }
        ]
      },
      {
        id: 'paiks_coldbrew_latte',
        name: '콜드브루 라떼/연유/흑당',
        category: 'ColdBrew',
        sizes: [
            { label: 'Latte Hot/Ice', ml: 0, caffeine: 184.3 },
            { label: 'Yeonyu Hot/Ice', ml: 0, caffeine: 184.3 },
            { label: 'Heukdang Hot/Ice', ml: 0, caffeine: 184.3 },
            { label: 'Decaf Variants', ml: 0, caffeine: 11.8 }
        ]
      }
    ],
  },

  // =================================================================
  // 6. 메가커피 (Mega Coffee)
  // =================================================================
  {
    id: 'mega',
    brand: '메가커피',
    menus: [
      {
        id: 'mega_gelato_frappe',
        name: '젤라또 프라페/라떼 (말차/딸기/초코)',
        category: 'Frappuccino',
        sizes: [
            { label: 'Matcha Gelato Strawberry Frappe', ml: 591, caffeine: 52.4 },
            { label: 'Strawberry Gelato Choco Latte', ml: 591, caffeine: 9.5 },
            { label: 'Choco Gelato Matcha Latte', ml: 591, caffeine: 153.8 }
        ]
      },
      {
        id: 'mega_marshmallow',
        name: '마시멜로 스노우 크림초코',
        category: 'Beverage',
        sizes: [
            { label: 'Ice', ml: 591, caffeine: 25.9 },
            { label: 'Hot', ml: 591, caffeine: 19.8 }
        ]
      },
      {
        id: 'mega_sweet_potato',
        name: '군고구마 크림브륄레 슈페너',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 211 }]
      },
      {
        id: 'mega_cherry_coke',
        name: '제로 체리콜라',
        category: 'Beverage',
        sizes: [{ label: 'Standard', ml: 710, caffeine: 7.6 }]
      },
      {
        id: 'mega_hutgae',
        name: '헛개리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot', ml: 591, caffeine: 181.6 },
            { label: 'Ice', ml: 710, caffeine: 181.2 },
            { label: 'Wang Mega', ml: 946, caffeine: 234.6 },
            { label: 'Decaf Hot', ml: 591, caffeine: 9.1 },
            { label: 'Decaf Ice', ml: 710, caffeine: 5.3 },
            { label: 'Decaf Wang', ml: 946, caffeine: 13.1 }
        ]
      },
      {
        id: 'mega_latte',
        name: '카페라떼',
        category: 'Espresso',
        sizes: [
            { label: '20oz', ml: 591, caffeine: 189.9 },
            { label: 'Wang Mega', ml: 946, caffeine: 347.1 },
            { label: 'Decaf', ml: 591, caffeine: 17 },
            { label: 'Decaf Wang', ml: 946, caffeine: 11.2 }
        ]
      },
      {
        id: 'mega_vanilla_almond',
        name: '라이트 바닐라 아몬드라떼',
        category: 'Espresso',
        sizes: [
            { label: 'Standard', ml: 591, caffeine: 206.2 },
            { label: 'Decaf', ml: 591, caffeine: 9.5 }
        ]
      },
      {
        id: 'mega_halmega',
        name: '할메가커피',
        category: 'Espresso',
        sizes: [
            { label: 'Misu Coffee', ml: 591, caffeine: 180.1 },
            { label: 'Halmega', ml: 591, caffeine: 99.6 },
            { label: 'Wang Halmega', ml: 946, caffeine: 196.4 }
        ]
      },
      {
        id: 'mega_wang_choco',
        name: '왕메가초코',
        category: 'Beverage',
        sizes: [{ label: 'Wang', ml: 946, caffeine: 35.6 }]
      },
      {
        id: 'mega_icetea',
        name: '아이스티 (왕메가/제로)',
        category: 'Tea',
        sizes: [
            { label: 'Wang Mega', ml: 946, caffeine: 41.2 },
            { label: 'Zero Peach', ml: 710, caffeine: 14.5 },
            { label: 'Peach Ice', ml: 710, caffeine: 24 }
        ]
      },
      {
        id: 'mega_coconut',
        name: '코코넛 커피 스무디',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 173.8 }]
      },
      {
        id: 'mega_decaf_ame',
        name: '디카페인 아메리카노 (꿀/헤이즐넛/바닐라)',
        category: 'Decaf',
        sizes: [
            { label: 'Americano 591ml', ml: 591, caffeine: 11.4 },
            { label: 'Americano 710ml', ml: 710, caffeine: 10.8 },
            { label: 'Megaricano', ml: 946, caffeine: 10.9 },
            { label: 'Honey 591ml', ml: 591, caffeine: 11.3 },
            { label: 'Hazelnut 591ml', ml: 591, caffeine: 6.9 },
            { label: 'Vanilla 591ml', ml: 591, caffeine: 9.1 }
        ]
      },
      {
        id: 'mega_decaf_latte_var',
        name: '디카페인 라떼류 (카푸/바닐라/헤이즐넛/카라멜/연유/모카)',
        category: 'Decaf',
        sizes: [
            { label: 'Cappuccino', ml: 591, caffeine: 11.3 },
            { label: 'Vanilla Latte', ml: 591, caffeine: 8.9 },
            { label: 'Hazelnut Latte', ml: 591, caffeine: 9.4 },
            { label: 'Caramel Macchiato', ml: 591, caffeine: 6.5 },
            { label: 'Yeonyu Latte', ml: 591, caffeine: 9.8 },
            { label: 'Mocha', ml: 591, caffeine: 26.8 }
        ]
      },
      {
        id: 'mega_cold_decaf',
        name: '콜드브루 디카페인 (라떼)',
        category: 'Decaf',
        sizes: [
            { label: 'Standard 591ml', ml: 591, caffeine: 13.1 },
            { label: 'Latte', ml: 591, caffeine: 9.9 }
        ]
      },
      {
        id: 'mega_ame',
        name: '아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Hot/Ice 20oz', ml: 591, caffeine: 204.2 },
            { label: 'Ice 24oz', ml: 710, caffeine: 199.7 },
            { label: 'Megaricano', ml: 946, caffeine: 290.8 },
            { label: 'Honey', ml: 591, caffeine: 199.4 }
        ]
      },
      {
        id: 'mega_vanilla_latte',
        name: '바닐라라떼',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 189.9 }]
      },
      {
        id: 'mega_yeonyu',
        name: '연유라떼',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 165.9 }]
      },
      {
        id: 'mega_caramel',
        name: '카라멜마끼아또',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 203.4 }]
      },
      {
        id: 'mega_mocha',
        name: '카페모카',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 233.2 }]
      },
      {
        id: 'mega_cappuccino',
        name: '카푸치노',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 201.4 }]
      },
      {
        id: 'mega_coldbrew_plain',
        name: '콜드브루 오리지널/라떼',
        category: 'ColdBrew',
        sizes: [
            { label: 'Original', ml: 591, caffeine: 217 },
            { label: 'Latte', ml: 591, caffeine: 216.7 }
        ]
      },
      {
        id: 'mega_hazel_latte',
        name: '헤이즐넛 라떼/아메리카노',
        category: 'Espresso',
        sizes: [
            { label: 'Latte', ml: 591, caffeine: 204.6 },
            { label: 'Americano', ml: 591, caffeine: 209.8 }
        ]
      },
      {
        id: 'mega_cube',
        name: '큐브라떼',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 313.4 }]
      },
      {
        id: 'mega_frappe',
        name: '프라페 (녹차/초코/민트/커피/피넛버터)',
        category: 'Frappuccino',
        sizes: [
            { label: 'Green Tea', ml: 591, caffeine: 110.1 },
            { label: 'Real Choco', ml: 591, caffeine: 32.1 },
            { label: 'Mint', ml: 591, caffeine: 5.6 },
            { label: 'Coffee', ml: 591, caffeine: 162.6 },
            { label: 'Peanut Butter Choco', ml: 591, caffeine: 31.3 },
            { label: 'Cookie', ml: 591, caffeine: 6.8 },
            { label: 'Strawberry Cookie', ml: 591, caffeine: 2.6 }
        ]
      },
      {
        id: 'mega_pongcrush',
        name: '초코허니퐁크러쉬',
        category: 'Beverage',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 10 }]
      },
      {
        id: 'mega_tea_etc',
        name: '기타 티 (녹차/얼그레이/자몽허니)',
        category: 'Tea',
        sizes: [
            { label: 'Green Tea 591ml', ml: 591, caffeine: 65.3 },
            { label: 'Earl Grey 591ml', ml: 591, caffeine: 73.4 },
            { label: 'Honey Grapefruit Black', ml: 591, caffeine: 61.5 }
        ]
      },
       {
        id: 'mega_toffee',
        name: '토피넛라떼',
        category: 'Espresso',
        sizes: [{ label: 'Standard', ml: 591, caffeine: 46.4 }]
      },
       {
        id: 'mega_milktea',
        name: '로얄밀크티라떼/흑당',
        category: 'Tea',
        sizes: [
            { label: 'Royal', ml: 591, caffeine: 106.2 },
            { label: 'Heukdang Bubble', ml: 591, caffeine: 14.3 },
            { label: 'Heukdang Milk Tea', ml: 591, caffeine: 30.6 }
        ]
      },
       {
        id: 'mega_choco',
        name: '핫초코/아이스초코',
        category: 'Beverage',
        sizes: [
            { label: 'Hot', ml: 591, caffeine: 21.9 },
            { label: 'Ice', ml: 591, caffeine: 21.3 }
        ]
      },
       {
        id: 'mega_greentea',
        name: '녹차라떼',
        category: 'Tea',
        sizes: [
            { label: 'Hot', ml: 591, caffeine: 57 },
            { label: 'Ice', ml: 591, caffeine: 72.5 }
        ]
      },
       {
        id: 'mega_espresso',
        name: '에스프레소',
        category: 'Espresso',
        sizes: [
            { label: 'Solo', ml: 59, caffeine: 104.8 },
            { label: 'Doppio', ml: 147, caffeine: 184.7 },
            { label: 'Decaf', ml: 59, caffeine: 4.9 }
        ]
      }
    ],
  },
  {
    id: 'manual',
    brand: '직접 입력',
    menus: [
      {
        id: 'manual_shot',
        name: '에스프레소 1샷',
        category: 'Espresso',
        sizes: [{ label: '1잔', ml: 30, caffeine: 75 }]
      },
      {
        id: 'manual_drip',
        name: '드립 커피',
        category: 'Espresso',
        sizes: [{ label: '1잔', ml: 200, caffeine: 100 }]
      }
    ]
  },

{
    id: 'hidden_danger',
    brand: '기타 음료 및 간식',
    menus: [
      {
        id: 'coke_can',
        name: '콜라 (캔)',
        category: 'Beverage',
        sizes: [{ label: '355ml', ml: 355, caffeine: 35 }]
      },
      {
        id: 'coke_zero',
        name: '제로 콜라 (캔)',
        category: 'Beverage',
        sizes: [{ label: '355ml', ml: 355, caffeine: 35 }]
      },
      {
        id: 'pepsi_zero',
        name: '펩시 제로 (캔)',
        category: 'Beverage',
        sizes: [{ label: '355ml', ml: 355, caffeine: 38 }]
      },
      {
        id: 'green_tea',
        name: '녹차 (티백/음료)',
        category: 'Tea',
        sizes: [{ label: '1잔/1병', ml: 0, caffeine: 25 }]
      },
      {
        id: 'dark_chocolate',
        name: '다크 초콜릿 (1판)',
        category: 'Beverage', // 카테고리는 편의상 Beverage로 유지
        sizes: [{ label: '약 50g', ml: 0, caffeine: 30 }]
      },
      {
        id: 'energy_drink_small',
        name: '박카스 / 영양강장제',
        category: 'Beverage',
        sizes: [{ label: '1병', ml: 100, caffeine: 30 }]
      },
      {
        id: 'headache_pill',
        name: '카페인 포함 진통제 (기타)',
        category: 'Beverage',
        sizes: [{ label: '1알', ml: 0, caffeine: 50 }]
      }
    ]
  }

];
