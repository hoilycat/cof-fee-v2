import dayjs from "dayjs";
import type { CaffeineLog, UserProfile } from '../hooks/useCaffeineStore';
import { type SymptomLog } from '../hooks/useCaffeineStore';



/**
 * 1. 실시간 잔존량 계산 (지수적 감쇠 공식)
 * C_now = C_initial * (0.5)^(t / halfLife)
 */
export const calculateCurrentCaffeine = (mg: number, intakeTime: string, halfLife: number) => {
  const now = dayjs();
  const diffHours = now.diff(dayjs(intakeTime), "hour", true);
  
  if (diffHours < 0) return mg;

  // 45~60분 사이 정점 (단순화를 위해 섭취 후 45분까지는 그대로 유지되다 줄어들도록 보정 가능, 현재는 즉시 감쇠 시작)
  const remaining = mg * Math.pow(0.5, diffHours / halfLife);
  return parseFloat(remaining.toFixed(2));
};


export const getTotalRemainingCaffeine = (logs: CaffeineLog[], halfLife: number) => {
  return logs.reduce((total, log) => 
    total + calculateCurrentCaffeine(log.caffeineAmount, log.intakeTime, halfLife), 0);
};

/* 1. 숙면 가능 시간 예측 (잔존량이 50mg 이하가 되는 시점 계산)*/
export const predictSleepReadyTime = (totalCaffeine: number, halfLife: number) => {
  if (totalCaffeine <= 50) return "지금 바로 가능";

  // 공식: 현재량 * (0.5)^(t/halfLife) = 50 
  // => t = halfLife * log2(현재량 / 50)
  const hoursToWait = halfLife * (Math.log(totalCaffeine / 50) / Math.log(2));
  
  return dayjs().add(hoursToWait, 'hour').format('A h시 m분');
};

/*2. 마지막 섭취로부터 경과 시간 계산 (금단 현상 분석용)*/
export const getHoursSinceLastDrink = (logs: CaffeineLog[]) => {
  if (logs.length === 0) return 0;
  const lastLog = [...logs].sort((a, b) => dayjs(b.intakeTime).valueOf() - dayjs(a.intakeTime).valueOf())[0];
  return dayjs().diff(dayjs(lastLog.intakeTime), 'hour', true);
};


/**
 * 2. 스마트 맞춤형 권장량 계산 (체중 및 감량 챌린지 기반)
 */
export const getPersonalizedGoal = (user: UserProfile) => {
  // 성인 기본 최대 권장량은 체중 1kg당 400mg을 넘지 않게 설정 (통상 400mg 상한)
  let goal = Math.min(user.weight * 6, 400); 

  // [이별 트랙] 4주 점진적 감량 로직 (75-50-25-12.5 법칙)
  if (user.isTapering && user.baseIntake > 0) {
    const week = user.taperingWeek;
    if (week === 1) goal = user.baseIntake * 0.75;
    else if (week === 2) goal = user.baseIntake * 0.50;
    else if (week === 3) goal = user.baseIntake * 0.25;
    else if (week >= 4) goal = user.baseIntake * 0.125;
  }
  return Math.round(goal);
};

export const getDynamicHalfLife = (user: UserProfile) => {
  // 기본 5시간, 생리 중이면 대사가 느려지므로 7.5시간으로 연장
  if ( user.gender === 'F' && user.isMenstruating ){
    return 7.5;
  }
  return 5;
};


/**
 * 3. '3일의 법칙' 감지기 (연속 3일 섭취 여부 파악)
 */
export const checkThreeDayRule = (logs: CaffeineLog[]) => {
  const today = dayjs().startOf('day');
  const daysWithCaffeine = new Set(
    logs.map(log => dayjs(log.intakeTime).startOf('day').format('YYYY-MM-DD'))
  );

  const drankToday = daysWithCaffeine.has(today.format('YYYY-MM-DD'));
  const drankYesterday = daysWithCaffeine.has(today.subtract(1, 'day').format('YYYY-MM-DD'));
  const drankDayBefore = daysWithCaffeine.has(today.subtract(2, 'day').format('YYYY-MM-DD'));

  return {
    isDanger: drankToday && drankYesterday && drankDayBefore,
    message: drankToday && drankYesterday && drankDayBefore 
      ? "3일 연속 섭취했어요! 내일은 뇌를 쉬게 해주는 건 어떨까요?" 
      : "잘 조절하고 있어요!"
  };
};

/**
 * 4. 두통 소방차 & 리바운드 예측 (10~24시간 경과 확인)
 */
export const getWithdrawalWarning = (logs: CaffeineLog[]) => {
  if (logs.length === 0) return null;
  
  // 가장 마지막에 마신 커피 시간
  const lastLog = [...logs].sort((a, b) => dayjs(b.intakeTime).valueOf() - dayjs(a.intakeTime).valueOf())[0];
  const hoursSinceLastDrink = dayjs().diff(dayjs(lastLog.intakeTime), "hour", true);

  if (hoursSinceLastDrink >= 12 && hoursSinceLastDrink <= 24) {
    return {
      isWarning: true,
      message: "카페인 배출 중이에요! 콧물이나 두통이 올 수 있으니 물을 충분히 드세요 💧"
    };
  }
  return { isWarning: false, message: "" };
};

/**
 * 5. 수면 및 캐릭터 상태
 */
export const getSleepStatus = (totalCaffeine: number) => {
  if (totalCaffeine < 50) return "GOOD";    // 꿀잠
  if (totalCaffeine < 100) return "FAIR";   // 주의
  return "BAD";                             // 수면 방해
};

//카페인 함량에 따른 상태
export const getCharacterStatus = (totalCaffeine: number, goal: number) => {
  const hour = dayjs().hour();
  const percentage = (totalCaffeine / goal) * 100;

  // 밤 10시(22시) 이후인데 잔류량이 50mg(수면 방해 기준) 이상인 경우
  // 무조건 WARNING 이상으로 격상
  if ((hour >= 22 || hour < 4) && totalCaffeine >= 50) {
    return totalCaffeine >= 100 ? "DANGER" : "WARNING";
  }

  if (percentage === 0) return "IDLE";
  if (percentage <= 50) return "GOOD";
  if (percentage <= 80) return "WARNING";
  return "DANGER";
};

/**
 * 수면 세이프티 가이드 (액션 플랜)
 */
export const getSleepActionTip = (totalCaffeine: number) => {
  if (totalCaffeine <= 50) return "지금 바로 꿀잠 잘 수 있는 클린한 상태예요! ✨";
  if (totalCaffeine <= 100) return "물을 2잔 마시면 배출이 더 빨라져요! 💧";
  return "가벼운 스트레칭으로 신진대사를 높여 배출을 도와보세요! 🏃‍♀️";
};


/**
 * 카페인 각성 단계 바 로직
 */
export const getArousalStage = (totalCaffeine: number) => {
  if (totalCaffeine >= 200) return { label: "강한 각성 ⚡️", color: "#E05252", tip: "심박수가 빠를 수 있어요. 물을 드세요!" };
  if (totalCaffeine >= 100) return { label: "집중 모드 🔥", color: "#D97706", tip: "업무와 공부에 최적인 상태입니다." };
  if (totalCaffeine >= 50) return { label: "평온한 상태 ☕️", color: "#E57B3E", tip: "은은한 에너지가 남아있어요." };
  return { label: "카페인 프리 🥔", color: "#A3978F", tip: "뇌가 휴식하고 있는 깨끗한 상태!" };
};

/**
 * 아데노신 수용체 회복률 계산 (가상 시나리오 기반)
 * 마지막으로 많이 마신 날로부터 시간이 지날수록 회복됨
 */
export const getReceptorRecovery = (logs: CaffeineLog[]) => {
  if (logs.length === 0) return 100;
  // 최근 3일간의 평균 섭취량이 적을수록 회복률이 높다고 가정
  const recentIntake = logs
    .filter(l => dayjs(l.intakeTime).isAfter(dayjs().subtract(3, 'day')))
    .reduce((sum, l) => sum + l.caffeineAmount, 0) / 3;
  
  const recovery = Math.max(0, 100 - (recentIntake / 400) * 100);
  return Math.round(recovery);
};

/**
 * 특정 날짜에 카페인을 섭취했는지 확인
 */
export const checkDrankOnDate = (logs: CaffeineLog[], date: dayjs.Dayjs) => {
  return logs.some(log => dayjs(log.intakeTime).isSame(date, 'day'));
};

/**
 * 연속 무카페인 일수(Clean Streak) 계산
 */
export const getCleanStreak = (logs: CaffeineLog[]) => {
  let streak = 0;
  let current = dayjs().startOf('day');

  // 오늘부터 과거로 거슬러 올라가며 확인
  while (true) {
    const drank = logs.some(log => dayjs(log.intakeTime).isSame(current, 'day'));
    if (drank) break; // 마신 날을 만나면 멈춤
    
    streak++;
    current = current.subtract(1, 'day');
    
    // 무한 루프 방지 (최대 100일까지만 계산)
    if (streak > 100) break;
  }
  return streak;
};



export const getSmartRecommendation = (user: UserProfile, totalCaffeine: number, goal: number) => {
  const hour = dayjs().hour();
  
  // 1순위: 목표 초과 혹은 임박 (80% 이상)
  if (totalCaffeine >= goal * 0.8) {
    return {
      title: "물 한 잔 어때요? 💧",
      desc: "이미 충분한 카페인을 섭취했어요. 지금은 수분 보충이 필요한 때!",
      category: "Water"
    };
  }

  // 2순위: 밤 시간대 (오후 6시 이후)
  if (hour >= 18 || hour < 4) {
    return {
      title: "디카페인이 안전해요 🌙",
      desc: "지금 커피를 마시면 수면 시간이 너무 늦어질 수 있어요.",
      category: "Decaf"
    };
  }

  // 3순위: 생리 모드 활성화 시
  if (user.gender === 'F' && user.isMenstruating) {
    return {
      title: "따뜻한 차를 추천해요 🍵",
      desc: "대사가 느려진 시기예요. 카페인보다는 몸을 따뜻하게 하는 티가 좋아요.",
      category: "Tea"
    };
  }

  // 4순위: 오전 집중 시간 (오전 7시 ~ 11시)
  if (hour >= 7 && hour <= 11) {
    return {
      title: "모닝 아메리카노 ☀️",
      desc: "하루를 활기차게 시작하기 딱 좋은 시간입니다!",
      category: "Espresso"
    };
  }

  return {
    title: "가벼운 라떼 한 잔 ☕️",
    desc: "오후의 활력을 위해 부드러운 음료는 어떨까요?",
    category: "Espresso"
  };
};

/**
 * 2. 증상 상관관계 분석
 * 특정 시간대나 섭취량 이후에 증상이 발생하는지 분석합니다.
 */
{/*여기 로직 좀 더 보강하기*/}
export const analyzeSymptomCorrelation = (logs: CaffeineLog[], symptoms: SymptomLog[]) => {
  if (symptoms.length === 0) return "아직 증상 기록이 없네요! 컨디션이 안 좋을 때 기록해 주시면 카페인과의 상관관계를 분석해 드릴게요.";
  if (logs.length === 0) return "카페인 기록이 없어서 분석이 어려워요. 마신 음료를 먼저 기록해 주세요!";

  // 간단한 분석 예시: 증상이 있는 날의 평균 카페인 섭취량 계산
  const symptomDates = new Set(symptoms.map(s => dayjs(s.recordTime).format('YYYY-MM-DD')));
  const intakeOnSymptomDays = logs.filter(l => symptomDates.has(dayjs(l.intakeTime).format('YYYY-MM-DD')));
  
  if (intakeOnSymptomDays.length > 0) {
    return "데이터 분석 결과, 증상이 나타난 날에는 평소보다 더 많은 양의 카페인을 섭취하는 경향이 확인되었습니다. 섭취량을 조금만 줄여보는 건 어떨까요?";
  }
  
  return "현재 섭취량과 증상 간의 뚜렷한 인과관계는 발견되지 않았습니다. 꾸준한 기록으로 더 정밀한 분석을 받아보세요!";
};