export interface CoffeeItem{
    name: string;
    caffeine: number;
}

export interface BrandData{
    brand: string;
    menu: CoffeeItem[];
}
export const COFFEE_BRANDS: BrandData[] = [
    {
        brand: '스타벅스',
        menu:[
            {name: '아메리카노', caffeine: 150},
            {name: '카페라떼', caffeine: 120},
            {name: '카푸치노', caffeine: 130},

        ],
    },
    {
        brand: '투썸플레이스',
        menu:[
            {name: '아메리카노', caffeine: 140},
            {name: '카페라떼', caffeine: 110},
            {name: '카푸치노', caffeine: 125},
        ],
    }
]