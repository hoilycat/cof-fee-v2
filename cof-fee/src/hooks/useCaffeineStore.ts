import { atomWithStorage } from 'jotai/utils';
import { type CoffeeMenu } from '../lib/caffeineData'; 



export const favoriteDrinksAtom = atomWithStorage<string[]>('favorite-drinks', []);



// 1. 사용자 정보 (기획서 반영)
export interface UserProfile {
  nickname: string;
  weight: number;         // 몸무게 (권장량 및 반감기 계산용)
  gender: 'M' | 'F' | ''; // 성별 (여성 건강 케어 연동용)
  isMenstruating: boolean; // 생리 중 여부 추가
  dsm5Score: number;      // 카페인 사용 장애(CUD) 진단 점수 (0~9)
  isTapering: boolean;    // 4주 감량 챌린지(이별 트랙) 진행 여부
  taperingWeek: number;   // 현재 감량 주차 (1~4)
  baseIntake: number;     // 평소 하루 평균 섭취량
  hasCompletedOnboarding: boolean; // 온보딩(진단) 완료 여부
  isDarkMode: boolean; // 다크모드 여부 추가
  challengeStartedAt: string; 
  sensitivity: 'FAST' | 'NORMAL' | 'SLOW'; // 카페인 대사 속도
  preferredBedtime: string;
}

// 2. 카페인 섭취 기록
export interface CaffeineLog {
  id: string;
  caffeineAmount: number;
  intakeTime: string;
  beverageName: string;
  isFasting: boolean;
  price: number;
}

// 3. 신체 증상 기록 (두통, 콧물 등)
export interface SymptomLog {
  id: string;
  type: 'HEADACHE' | 'RUNNY_NOSE' | 'CRAMPS' | 'FATIGUE';
  recordTime: string;
  severity: 1 | 2 | 3 | 4 | 5;
}


// 직접 입력한 음료를 저장할 Atom 추가
export const customMenusAtom = atomWithStorage<CoffeeMenu[]>('custom-menus', []);


// ==========================================
// Jotai Atoms (로컬 스토리지에 자동 저장됨)
// ==========================================

export const userProfileAtom = atomWithStorage<UserProfile>('cof-fee-user', {
  nickname: '',
  weight: 60, 
  gender: '',
  isMenstruating: false, 
  dsm5Score: 0,
  isTapering: false,
  taperingWeek: 0,
  baseIntake: 0,
  hasCompletedOnboarding: false, // 처음 켜면 false
  isDarkMode: false, // 기본값은 라이트모드
  challengeStartedAt: '',
  sensitivity: 'NORMAL',
  preferredBedtime: '23:00',
});

export const caffeineLogsAtom = atomWithStorage<CaffeineLog[]>('caffeine-logs',[]);
export const symptomLogsAtom = atomWithStorage<SymptomLog[]>('symptom-logs',[]);

export const dailyGoalAtom = atomWithStorage<number>('daily-goal', 400);