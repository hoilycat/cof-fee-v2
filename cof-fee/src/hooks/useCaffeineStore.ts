import { atomWithStorage } from 'jotai/utils';

export interface CaffeineLog {
  id: string;             // 각각의 기록을 구별하는 번호
  caffeineAmount: number; // 마신 카페인 양 (mg)
  intakeTime: string;     // 마신 시간 (ISO 8601 형식 문자열)
  beverageName: string;   // 음료 이름
  notes?: string;         // 메모 (선택사항)
}

// atomWithStorage를 사용해서 로컬 스토리지에 저장되는 atom을 만들기 (초기값은 빈 배열)
export const caffeineLogsAtom = atomWithStorage<CaffeineLog[]>('caffeine-logs', []);

// 목표치 바구니: "하루에 이만큼만 마시기로 약속!"
export const dailyGoalAtom = atomWithStorage<number>('daily-goal',200);

// 닉네임 바구니: "내 이름은...?"
export const nicknameAtom = atomWithStorage<string>('user-nickname','');
