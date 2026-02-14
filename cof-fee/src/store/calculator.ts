import dayjs from "dayjs";

/**
 * @param mg 초기 섭취량 (mg)
 * @param intakeTime 섭취 시간 (ISO string 또는 dayjs 객체)
 * @param halfLife 반감기 (기본값 5시간)
 */
export const calculateCurrentCaffeine = (mg: number, intakeTime: string, halfLife = 5) => {
  const now = dayjs();
  const diffHours = now.diff(dayjs(intakeTime), "hour", true);
  
  if (diffHours < 0) return mg; // 미래 시간 입력 대비

  // 반감기 공식: Remaining = Initial * 0.5 ^ (Elapsed / Half-life)
  const remaining = mg * Math.pow(0.5, diffHours / halfLife);
  return parseFloat(remaining.toFixed(2));
};


// 두통 위험군 판단 로직 
export const getHeadacheWarning = (lastIntakeTime: string) => {
  const hoursSinceLastDrink = dayjs().diff(dayjs(lastIntakeTime), "hour");
  
  return {
    isWarning: hoursSinceLastDrink >= 12 && hoursSinceLastDrink <= 24,
    message: "마지막 커피 후 12시간이 지났어요. 두통이 올 수 있으니 수분을 섭취하세요!"
  };
};

export const getCharacterStatus = (totalCaffeine: number) => {
  if (totalCaffeine === 0) return "IDLE";      // 평온
  if (totalCaffeine < 100) return "ACTIVE";    // 열공
  if (totalCaffeine < 250) return "ANXIOUS";   // 불안
  return "DANGER";                             // 위험
};


// 카페인 섭취 기록 인터페이스
export interface CaffeineLog {
  id: string;               // 고유 ID (예: UUID)
  caffeineAmount: number;   //  섭취량 (mg)
  intakeTime: string;   // 섭취 시간 (ISO string)   
  beverageName: string;   // 음료 이름 (예: "아메리카노")
  notes: string;     // 추가 메모 (예: "아침에 마심")   
}

//모든 기록의 현재 잔존량을 합치는 로직
export const getTotalRemainingCaffeine = (logs: CaffeineLog[]) => {
  return logs.reduce((total, log) => {
    // 각 기록의 현재 잔존량을 계산하여 누적
    return total + calculateCurrentCaffeine(log.caffeineAmount, log.intakeTime);
  }, 0);
};

// 수면 상태 판단 로직
export const getSleepStatus = (totalCaffeine: number) => {
  if (totalCaffeine < 50) return "GOOD";    // 🟢 꿀잠 가능
  if (totalCaffeine < 100) return "FAIR";   // 🟡 조금 위험
  return "BAD";                             // 🔴 말똥말똥 (수면 방해)
};